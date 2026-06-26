import { Gtk } from "ags/gtk4"
import AstalTray from "gi://AstalTray"
import { createBinding, For } from "ags"

const tray = AstalTray.get_default()
const items = createBinding(tray, "items")

type TrayItemProps = {
  trayItem: AstalTray.TrayItem
}

function TrayItem({ trayItem }: TrayItemProps) {
  const init = (btn: Gtk.MenuButton, item: AstalTray.TrayItem) => {
    btn.menuModel = item.menuModel
    btn.insert_action_group("dbusmenu", item.actionGroup)
    item.connect("notify::action-group", () => {
      btn.insert_action_group("dbusmenu", item.actionGroup)
    })
  }

  return (
    <menubutton $={(self) => init(self, trayItem)}>
      <image gicon={createBinding(trayItem, "gicon")} />
    </menubutton>
  )
}

export default function Tray() {
  return (
    <menubutton visible={items((i) => i.length > 0)}>
      <popover>
        <Gtk.FlowBox
          widthRequest={160}
          maxChildrenPerLine={4}
          selectionMode={0}
          homogeneous={true}
        >
          <For each={items}>{(item) => <TrayItem trayItem={item} />}</For>
        </Gtk.FlowBox>
      </popover>
    </menubutton>
  )
}
