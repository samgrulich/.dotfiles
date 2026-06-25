import { execAsync } from "ags/process"
import Hyprland from "gi://AstalHyprland"
import { createComputed, createState, onCleanup } from "gnim"

async function getCurrentLayout() {
  const json = await execAsync(["hyprctl", "-j", "devices"])
  const devices = JSON.parse(json)

  const keyboard = devices.keyboards.find((k) => k.main) ?? devices.keyboards[0]

  return keyboard?.active_keymap ?? "--"
}

function parseLayout(layout: string) {
  return layout.substring(0, 2)
}

async function swapLayout(layout: string) {
  const layoutRaw = await execAsync(["hyprctl", "getoption", "input:kb_layout"])
  // const variantRaw = await execAsync([ "hyprctl", "getoption", "input:kb_variant", ])
  const layouts =
    layoutRaw
      .match(/str:\s*(.*)/)?.[1]
      ?.trim()
      .split(",") ?? []

  const currIndex = Math.max(
    layouts.findIndex((l) => l == layout.toLowerCase()),
    0,
  )
  const nextIndex = Math.floor((currIndex + 1) % layouts.length)
  await execAsync(["hyprctl", "switchxkblayout", "current", String(nextIndex)])
}

export default function Keyboard() {
  const [layout, setLayout] = createState("")
  const hyprland = Hyprland.get_default()
  const layout_short = createComputed(() => parseLayout(layout()))

  getCurrentLayout().then((activeLayout) => setLayout(activeLayout))

  const id = hyprland.connect("keyboard-layout", (_, _keyboard, layout) => {
    setLayout(layout)
  })

  onCleanup(() => hyprland.disconnect(id))

  return (
    <button
      onClicked={() => {
        swapLayout(layout_short()).catch((e) => console.log(e))
      }}
    >
      <label label={layout_short} />
    </button>
  )
}
