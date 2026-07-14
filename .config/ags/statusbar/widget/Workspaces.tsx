import Hyprland from "gi://AstalHyprland"
import { createBinding, createComputed, For } from "ags"

export default function Workspaces() {
  const hyprland = Hyprland.get_default()
  const workspaces = createBinding(hyprland, "workspaces")
  const focused = createBinding(hyprland, "focused-workspace")

  const sortedWorkspaces = createComputed(() =>
    [...(workspaces() ?? [])]
      .filter((ws) => ws.id > 0)
      .sort((a, b) => a.id - b.id),
  )

  return (
    <box class="Workspaces">
      <For each={sortedWorkspaces}>
        {(ws) => (
          <button
            class={focused((fw) => (fw?.id === ws.id ? "focused" : ""))}
            onClicked={() =>
              hyprland.dispatch(`hl.dsp.focus`, `{workspace=${ws.id}}`)
            }
          >
            <label label={`${ws.name}`} />
          </button>
        )}
      </For>
    </box>
  )
}
