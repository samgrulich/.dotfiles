import AstalMpris from "gi://AstalMpris"
import AstalApps from "gi://AstalApps"
import { Gtk } from "ags/gtk4"
import { createBinding, For } from "ags"

export default function Mpris() {
  const mpris = AstalMpris.get_default()
  const apps = new AstalApps.Apps()
  const players = createBinding(mpris, "players")

  return (
    <menubutton sensitive={players((ps) => ps.length > 0)}>
      <box>
        <Gtk.Image iconName={"music-player-symbolic"} pixelSize={20} />
        {/* <For each={players}> */}
        {/*   {(player) => { */}
        {/*     const [app] = apps.exact_query(player.entry) */}
        {/*     return <image visible={!!app.iconName} iconName={app?.iconName} /> */}
        {/*   }} */}
        {/* </For> */}
      </box>
      <popover>
        <box
          spacing={4}
          orientation={Gtk.Orientation.VERTICAL}
          widthRequest={380}
        >
          <For each={players}>
            {(player) => (
              <box spacing={4} widthRequest={200}>
                <box overflow={Gtk.Overflow.HIDDEN} css="border-radius: 8px;">
                  <image
                    pixelSize={48}
                    file={createBinding(player, "coverArt")}
                  />
                </box>
                <box
                  valign={Gtk.Align.CENTER}
                  orientation={Gtk.Orientation.VERTICAL}
                >
                  <label
                    maxWidthChars={20}
                    ellipsize={3}
                    xalign={0}
                    label={createBinding(player, "title")}
                  />
                  <label xalign={0} label={createBinding(player, "artist")} />
                </box>
                <box hexpand halign={Gtk.Align.END}>
                  <button
                    onClicked={() => player.previous()}
                    visible={createBinding(player, "canGoPrevious")}
                  >
                    <image iconName="media-seek-backward-symbolic" />
                  </button>
                  <button
                    onClicked={() => player.play_pause()}
                    visible={createBinding(player, "canControl")}
                  >
                    <box>
                      <image
                        iconName="media-playback-start-symbolic"
                        visible={createBinding(
                          player,
                          "playbackStatus",
                        )((s) => s !== AstalMpris.PlaybackStatus.PLAYING)}
                      />
                      <image
                        iconName="media-playback-pause-symbolic"
                        visible={createBinding(
                          player,
                          "playbackStatus",
                        )((s) => s === AstalMpris.PlaybackStatus.PLAYING)}
                      />
                    </box>
                  </button>
                  <button
                    onClicked={() => player.next()}
                    visible={createBinding(player, "canGoNext")}
                  >
                    <image iconName="media-seek-forward-symbolic" />
                  </button>
                </box>
              </box>
            )}
          </For>
        </box>
      </popover>
    </menubutton>
  )
}
