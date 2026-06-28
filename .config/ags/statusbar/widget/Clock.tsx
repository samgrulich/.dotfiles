import { createPoll } from "ags/time"
import { Gtk } from "ags/gtk4"
import GLib from "gi://GLib?version=2.0"

export default function Clock() {
  const time_detailed = createPoll("", 1000, () => {
    const date = GLib.DateTime.new_now_local()
    return date.format("%H:%M.%S")?.toString() || " - "
  })
  const date = createPoll("", 60000, () => {
    const date = GLib.DateTime.new_now_local()
    return (
      // `(${date.get_week_of_year() % 2 == 0 ? "Even" : "Odd"}) ` +
      date.format("%a %d.%m")?.toString() || " - "
    )
  })

  const time = time_detailed((s) => s.split(".")[0])

  return (
    <menubutton class="Clock">
      <label label={time} />
      <popover>
        <box orientation={Gtk.Orientation.VERTICAL}>
          <label class="CalendarDateLabel" label={date} />
          <label class="CalendarTimeLabel" label={time_detailed} />
          <Gtk.Calendar />
        </box>
      </popover>
    </menubutton>
  )
}
