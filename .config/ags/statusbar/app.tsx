import app from "ags/gtk4/app"
import style from "./style.scss"
import Clock from "./widget/Clock"
import Workspaces from "./widget/Workspaces"
import Archicon from "./widget/Archicon"
import Audio from "./widget/Audio"
import Battery from "./widget/Battery"
import Keyboard from "./widget/Keyboard"
import Network from "./widget/Network"
import { Astal, Gtk, Gdk } from "ags/gtk4"

function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  return (
    <window
      visible
      name={`bar${gdkmonitor.connector}`}
      class="Bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <centerbox orientation={Gtk.Orientation.HORIZONTAL}>
        <box $type="start">
          <Archicon />
          <Workspaces />
        </box>
        <box $type="end">
          {/* TODO:  Media Player */}
          {/* TODO: App Tray */}
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

app.start({
  css: style,
  gtkTheme: "Adwaita-dark",
  main() {
    app.get_monitors().map(Bar)
  },
})
