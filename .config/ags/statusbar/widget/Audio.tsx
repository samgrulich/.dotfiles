import Wp from "gi://AstalWp"
import { createBinding } from "ags"
import { Gtk } from "ags/gtk4"

const STATES = ["low", "medium", "high"]

function clampVolume(volume: Number) {
  return (volume * 100).toFixed(0)
}

function volumeToState(volume: Number) {
  return Math.floor(volume * (STATES.length - 1))
}

export default function Audio() {
  const { defaultSpeaker: speaker } = Wp.get_default()
  const volume = createBinding(speaker, "volume")
  const mute = createBinding(speaker, "mute")

  function VolumeIcon({ className }: { className?: string }) {
    return (
      <box class={className} halign={Gtk.Align.CENTER}>
        {STATES.map((state, i) => (
          <image
            iconName={`audio-volume-${state}`}
            visible={volume((v) => i == volumeToState(v) && !mute())}
          />
        ))}
        <image iconName="audio-volume-muted" visible={mute} />
      </box>
    )
  }

  return (
    <menubutton>
      <VolumeIcon />
      <popover>
        <box orientation={Gtk.Orientation.VERTICAL} class="Audio">
          <button
            onClicked={() => {
              speaker.set_mute(!mute())
            }}
          >
            <centerbox>
              <VolumeIcon $type="start" />
              <label label={volume(clampVolume)} $type="end" />
            </centerbox>
          </button>
          <slider
            min={0}
            max={1}
            heightRequest={200}
            value={volume}
            onValueChanged={({ value }) => speaker.set_volume(value)}
            inverted
            orientation={Gtk.Orientation.VERTICAL}
          />
        </box>
      </popover>
    </menubutton>
  )
}
