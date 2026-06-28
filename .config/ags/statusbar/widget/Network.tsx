import { Gtk } from "ags/gtk4"
import AstalNetwork from "gi://AstalNetwork"
import { createBinding, createState, For, With, onMount } from "gnim"

const { execAsync } = await import("ags/process")

type NetworkProps = {
  network: AstalNetwork.Network
}

type WifiNetwork = {
  ssid: string
  active: boolean
  known: boolean
  security: string
  signal: number
}

function shquote(text: string) {
  return `'${text.replace(/'/g, `'\\''`)}'`
}

function parseNmcliEscapedLine(line: string): string[] {
  const fields: string[] = []
  let current = ""
  let escaped = false

  for (const char of line) {
    if (escaped) {
      current += char
      escaped = false
      continue
    }

    if (char === "\\") {
      escaped = true
      continue
    }

    if (char === ":") {
      fields.push(current)
      current = ""
      continue
    }

    current += char
  }

  fields.push(current)
  return fields
}

function wifiSignalIcon(signal: number) {
  if (signal >= 80) return "network-wireless-signal-excellent-symbolic"
  if (signal >= 60) return "network-wireless-signal-good-symbolic"
  if (signal >= 40) return "network-wireless-signal-ok-symbolic"
  if (signal >= 20) return "network-wireless-signal-weak-symbolic"
  return "network-wireless-signal-none-symbolic"
}

async function getSavedWifiSsids() {
  const output = await execAsync("nmcli -t -f NAME,TYPE connection show")

  const saved = new Set<string>()

  for (const line of output.split("\n")) {
    if (!line.trim()) continue

    const [name, type] = parseNmcliEscapedLine(line)

    if (type === "802-11-wireless" && name) {
      saved.add(name)
    }
  }

  return saved
}

async function listWifiNetworks(): Promise<WifiNetwork[]> {
  const [wifiOutput, savedSsids] = await Promise.all([
    execAsync(
      "nmcli -t -f ACTIVE,SSID,SECURITY,SIGNAL device wifi list --rescan no",
    ),
    getSavedWifiSsids(),
  ])

  const bySsid = new Map<string, WifiNetwork>()

  for (const line of wifiOutput.split("\n")) {
    if (!line.trim()) continue

    const [activeRaw, ssid, securityRaw, signalRaw] =
      parseNmcliEscapedLine(line)

    if (!ssid) continue

    const signal = Number(signalRaw) || 0

    const item: WifiNetwork = {
      ssid,
      active: activeRaw === "yes",
      known: savedSsids.has(ssid),
      security: securityRaw || "Open",
      signal,
    }

    const existing = bySsid.get(ssid)

    if (
      !existing ||
      (item.signal > existing.signal && !existing.active) ||
      item.active
    ) {
      bySsid.set(ssid, item)
    }
  }

  return [...bySsid.values()].toSorted((a, b) => {
    if (a.active !== b.active) return a.active ? -1 : 1
    if (a.known !== b.known) return a.known ? -1 : 1
    return b.signal - a.signal
  })
}

function WifiRow({
  item,
  refresh,
}: {
  item: WifiNetwork
  refresh: () => void
}) {
  const [password, setPassword] = createState("")
  const [busy, setBusy] = createState(false)
  const [error, setError] = createState("")

  const needsPassword = item.security !== "Open" && !item.known

  async function getWifiDevice() {
    const output = await execAsync(
      "nmcli -t -f DEVICE,TYPE,STATE device status",
    )

    const devices = output
      .split("\n")
      .map(parseNmcliEscapedLine)
      .filter(([, type]) => type === "wifi")

    const connected = devices.find(([, , state]) => state === "connected")
    const available = connected ?? devices[0]

    if (!available?.[0]) {
      throw new Error("No Wi-Fi device found")
    }

    return available[0]
  }

  async function connectWifi(ssid: string, password?: string) {
    const device = await getWifiDevice()

    if (password && password.length > 0) {
      await execAsync(
        `nmcli device wifi connect ${shquote(ssid)} password ${shquote(password)} ifname ${shquote(device)}`,
      )
    } else {
      await execAsync(
        `nmcli device wifi connect ${shquote(ssid)} ifname ${shquote(device)}`,
      )
    }
  }

  async function disconnectWifi() {
    const device = await getWifiDevice()
    await execAsync(`nmcli device disconnect ${shquote(device)}`)
  }

  async function connect() {
    setBusy(true)
    setError("")

    try {
      if (needsPassword) {
        await connectWifi(item.ssid, password())
      } else {
        await connectWifi(item.ssid)
      }

      setPassword("")
      refresh()
    } catch (err) {
      console.error(`Failed to connect to ${item.ssid}`, err)
      setError("Could not connect. Check password or signal.")
    } finally {
      setBusy(false)
    }
  }

  async function disconnect() {
    setBusy(true)
    setError("")

    try {
      await disconnectWifi()
      refresh()
    } catch (err) {
      console.error("Failed to disconnect Wi-Fi", err)
      setError("Could not disconnect.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <menubutton class={item.active ? "WifiRow active" : "WifiRow"}>
      <centerbox>
        <box $type="start" spacing={8}>
          <image iconName={wifiSignalIcon(item.signal)} />

          <box orientation={Gtk.Orientation.VERTICAL}>
            <label label={item.ssid} xalign={0} />
          </box>
        </box>

        <box $type="end" spacing={6}>
          <image visible={item.active} iconName="object-select-symbolic" />
        </box>
      </centerbox>

      <popover>
        <box
          orientation={Gtk.Orientation.VERTICAL}
          spacing={8}
          class="WifiPopover"
        >
          <label label={item.ssid} xalign={0} class="title" />

          <centerbox>
            <label $type="start" label="Signal" xalign={0} />
            <label $type="end" label={`${item.signal}%`} xalign={1} />
          </centerbox>

          <centerbox>
            <label $type="start" label="Security" xalign={0} />
            <label $type="end" label={item.security} xalign={1} />
          </centerbox>

          <entry
            visible={needsPassword}
            placeholderText="Password"
            visibility={false}
            text={password}
            onNotifyText={({ text }) => setPassword(text)}
            onActivate={connect}
          />

          <label
            visible={error((text) => text.length > 0)}
            label={error}
            class="error"
            xalign={0}
          />

          <button
            visible={!item.active}
            sensitive={busy((value) => !value)}
            onClicked={connect}
          >
            <box spacing={6}>
              <Gtk.Spinner visible={busy} spinning={busy} />
              <label label={item.known ? "Connect" : "Join"} />
            </box>
          </button>

          <button
            visible={item.active}
            sensitive={busy((value) => !value)}
            onClicked={disconnect}
          >
            <box spacing={6}>
              <Gtk.Spinner visible={busy} spinning={busy} />
              <label label="Disconnect" />
            </box>
          </button>
        </box>
      </popover>
    </menubutton>
  )
}

function Wifi({ network }: NetworkProps) {
  const wifi = network.get_wifi()

  if (!wifi) {
    return (
      <box orientation={Gtk.Orientation.VERTICAL}>
        <label label="Wi-Fi" class="title" xalign={0} />
        <label label="No Wi-Fi adapter" class="dim" xalign={0} />
      </box>
    )
  }

  const enabled = createBinding(wifi, "enabled")
  const activeSsid = createBinding(wifi, "ssid")
  const [networks, setNetworks] = createState<WifiNetwork[]>([])
  const [loading, setLoading] = createState(false)
  const [error, setError] = createState("")

  async function refresh(rescan = false) {
    setLoading(true)
    setError("")

    try {
      if (rescan) {
        await execAsync("nmcli device wifi rescan")
      }

      setNetworks(await listWifiNetworks())
    } catch (err) {
      console.error("Failed to list Wi-Fi networks", err)
      setError("Could not list Wi-Fi networks.")
    } finally {
      setLoading(false)
    }
  }

  onMount(() => {
    refresh(false)
  })

  const knownNetworks = networks((items) =>
    items.filter((item) => item.known || item.active),
  )
  const unknownNetworks = networks((items) =>
    items.filter((item) => !item.known && !item.active),
  )

  return (
    <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
      <centerbox>
        <box $type="start" spacing={8}>
          <image iconName={createBinding(wifi, "icon-name")} />
          <label label="Wi-Fi" class="title" xalign={0} />
        </box>

        <switch
          $type="end"
          active={enabled}
          onNotifyActive={({ active }) => {
            wifi.set_enabled(active)
            refresh(false)
          }}
        />
      </centerbox>

      <centerbox visible={enabled}>
        <label $type="start" label="Current" xalign={0} />
        <label
          $type="end"
          label={activeSsid((ssid) => ssid || "Disconnected")}
          xalign={1}
        />
      </centerbox>

      <button
        visible={enabled}
        sensitive={loading((value) => !value)}
        onClicked={() => refresh(true)}
      >
        <box spacing={6}>
          <image
            visible={loading((value) => !value)}
            iconName="view-refresh-symbolic"
          />
          <Gtk.Spinner visible={loading} spinning={loading} />
          <label label={loading((value) => (value ? "Scanning…" : "Scan"))} />
        </box>
      </button>

      <label
        visible={error((text) => text.length > 0)}
        label={error}
        class="error"
        xalign={0}
      />

      <box visible={enabled} orientation={Gtk.Orientation.VERTICAL} spacing={6}>
        <label label="Saved networks" class="subtitle" xalign={0} />
        <box orientation={Gtk.Orientation.VERTICAL}>
          <For each={knownNetworks}>
            {(item) => <WifiRow item={item} refresh={() => refresh(false)} />}
          </For>
        </box>

        <label label="Available networks" class="subtitle" xalign={0} />

        <scrolledwindow minContentHeight={160} maxContentHeight={260}>
          <box orientation={Gtk.Orientation.VERTICAL}>
            <For each={unknownNetworks}>
              {(item) => <WifiRow item={item} refresh={() => refresh(false)} />}
            </For>
          </box>
        </scrolledwindow>
      </box>
    </box>
  )
}

function Wired({ network }: NetworkProps) {
  const wired = network.get_wired()

  if (!wired) {
    return (
      <box orientation={Gtk.Orientation.VERTICAL}>
        <label label="Wired" class="title" xalign={0} />
        <label label="No wired adapter" class="dim" xalign={0} />
      </box>
    )
  }

  return (
    <box orientation={Gtk.Orientation.VERTICAL} spacing={6}>
      <box spacing={8}>
        <image iconName={createBinding(wired, "icon-name")} />
        <label label="Wired" class="title" xalign={0} />
      </box>

      <centerbox>
        <label $type="start" label="Speed" xalign={0} />
        <label
          $type="end"
          label={createBinding(
            wired,
            "speed",
          )((speed) => (speed ? `${speed} Mb/s` : "Disconnected"))}
          xalign={1}
        />
      </centerbox>
    </box>
  )
}

export default function Network() {
  const network = AstalNetwork.get_default()

  const primary = createBinding(network, "primary")

  return (
    <menubutton>
      <With value={primary}>
        {(primary) =>
          primary && primary !== 0 ? (
            <image
              iconName={
                primary === 1
                  ? createBinding(network, "wired", "iconName")
                  : createBinding(network, "wifi", "iconName")
              }
            />
          ) : (
            <image iconName="network-offline-symbolic" />
          )
        }
      </With>

      <popover>
        <box
          orientation={Gtk.Orientation.VERTICAL}
          spacing={10}
          class="Network"
        >
          <Wired network={network} />
          <Gtk.Separator />
          <Wifi network={network} />
        </box>
      </popover>
    </menubutton>
  )
}
