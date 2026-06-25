import { Gtk } from "ags/gtk4"
import AstalNetwork from "gi://AstalNetwork"
import { createBinding, For } from "gnim"

type WiredProps = {
  network: AstalNetwork.Network
}

function Wired({ network }: WiredProps) {
  return (
    <box orientation={Gtk.Orientation.VERTICAL}>
      <label label="Wired" />
      <label label="Active" xalign={0} />
      <label label="On/Off" xalign={0} />
    </box>
  )
}

type WifiProps = {
  network: AstalNetwork.Network
}

type ApProps = {
  ap?: AstalNetwork.AccessPoint
  active?: boolean
  known?: boolean
}

function Ap({ ap, active, known }: ApProps) {
  active = active ?? false

  function connect(password?: string) {
    password = password || ""
    ap.activate("", (_, res) => {
      try {
        ap.activate_finish(res)
      } catch (error) {
        // TODO: replace with notification
        console.error(`Failed to connect to ${ap.ssid}`, error)
      }
    })
  }

  let popover_content

  if (known) {
    popover_content = (
      <box>
        <button visible={!active}>
          <label label={"Connect"} />
        </button>
      </box>
    )
  } else {
    popover_content = (
      <box>
        <button>
          <label label={"Connect"} />
        </button>
      </box>
    )
  }

  return (
    <menubutton>
      <centerbox>
        <box $type="start">
          {ap && <image iconName={createBinding(ap, "icon-name")} />}
          <label label={ap?.ssid} xalign={0} />
        </box>
        <image iconName="emblem-default" visible={active} $type="end" />
      </centerbox>
      <popover>
        <box>
          <button visible={true}>
            <label label={"Connect"} />
          </button>
        </box>
      </popover>
    </menubutton>
  )
}

function Wifi({ network }: WifiProps) {
  const wifi = createBinding(network, "wifi")
  const aps = wifi((w) => w.accessPoints)
  const active_ap = wifi((w) => w.activeAccessPoint)
  const sorted_aps = aps((apps) =>
    apps.filter((ap) => ap?.ssid).toSorted((a, b) => b.strength - a.strength),
  )
  const filtered_aps = sorted_aps((apps) => [
    ...new Map(apps.map((item) => [item.ssid, item])).values(),
  ])

  const known_aps = filtered_aps((apps) =>
    apps.filter((ap) => (ap ? ap.get_connections().length != 0 : false)),
  )

  const unknown_aps = filtered_aps((apps) =>
    apps.filter((ap) => (ap ? ap.get_connections().length == 0 : false)),
  )

  const scanning = createBinding(network.wifi, "scanning")

  return (
    <box orientation={Gtk.Orientation.VERTICAL}>
      <centerbox>
        <label label="WiFi" $type="start" />
        <switch
          active={wifi((w) => w.enabled)}
          halign={Gtk.Align.START}
          onNotifyActive={({ active }) => wifi((w) => w.set_enabled(active))}
          $type="end"
        />
      </centerbox>
      <button onClicked={() => network.wifi.scan()}>
        <box>
          <image
            iconName="view-refresh"
            class="rotating"
            visible={scanning((s) => !s)}
          />
          <Gtk.Spinner spinning={scanning} />
        </box>
      </button>
      <box orientation={Gtk.Orientation.VERTICAL}>
        <For each={known_aps}>
          {(ap) => (
            <Ap
              ap={ap}
              active={active_ap((aap) => aap?.ssid === ap?.ssid)}
              known={true}
            />
          )}
        </For>
      </box>
      <box orientation={Gtk.Orientation.VERTICAL}>
        <label label="Networks" xalign={0} />
        <scrolledwindow minContentHeight={120}>
          <box orientation={Gtk.Orientation.VERTICAL}>
            <For each={unknown_aps}>{(ap) => <Ap ap={ap} />}</For>
          </box>
        </scrolledwindow>
      </box>
    </box>
  )
}

export default function Network() {
  const network = AstalNetwork.get_default()
  let icon

  switch (createBinding(network, "primary")()) {
    case 1: // wired
      icon = (
        <image iconName={createBinding(network.get_wired(), "icon-name")} />
      )
      break
    case 2: // wifi
      icon = <image iconName={createBinding(network.get_wifi(), "icon-name")} />
      break
    default:
      icon = <label label="No connection" />
      break
  }

  // Wired

  // Wifi
  const wifi = network.get_wifi()

  return (
    <menubutton>
      {icon}
      <popover>
        <box orientation={Gtk.Orientation.VERTICAL} class="NetworkPopup">
          <Wired network={network} />
          <Gtk.Separator />
          <Wifi network={network} />
        </box>
      </popover>
    </menubutton>
  )
}
