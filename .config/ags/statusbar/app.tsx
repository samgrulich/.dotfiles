import app from "ags/gtk4/app"
import style from "./style.scss"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import Clock from "./widget/Clock"
import Archicon from "./widget/Archicon"
import Workspaces from "./widget/Workspaces"
import Audio from "./widget/Audio"
import Battery from "./widget/Battery"
import Keyboard from "./widget/Keyboard"
import Network from "./widget/Network"
import Tray from "./widget/Tray"
import Mpris from "./widget/Mpris"

const { timeout } = await import("ags/time")

function monitorKey(monitor: Gdk.Monitor) {
  return (
    monitor.connector ||
    monitor.description ||
    `${monitor.manufacturer}-${monitor.model}`
  )
}

function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor
  const key = monitorKey(gdkmonitor)

  return (
    <window
      visible
      name={`bar-${key}`}
      class="Bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
      namespace={`statusbar-${key}`}
    >
      <centerbox orientation={Gtk.Orientation.HORIZONTAL}>
        <box $type="start">
          <Archicon />
          <Workspaces />
        </box>

        <box $type="center">
          <Mpris />
        </box>

        <box $type="end">
          <Tray />
          <Network />
          <Keyboard />
          <Audio />
          <Clock />
          <Battery />
        </box>
      </centerbox>
    </window>
  )
}

let restartTimer: ReturnType<typeof timeout> | null = null

function scheduleExitForExternalRestart() {
  if (restartTimer) return

  restartTimer = timeout(3000, () => {
    restartTimer = null
    app.quit()
  })
}

app.start({
  css: style,
  gtkTheme: "Adwaita-dark",
  main() {
    for (const monitor of app.get_monitors()) {
      Bar(monitor)
    }

    app.connect("notify::monitors", () => {
      scheduleExitForExternalRestart()
    })
  },
})
