import AstalBattery from "gi://AstalBattery"
// import AstalPowerProfiles from "gi://AstalPowerProfiles"
import { createBinding } from "ags"

export default function Battery() {
  const battery = AstalBattery.get_default()
  // const powerProfiles = AstalPowerProfiles.get_default()

  const percentage = createBinding(
    battery,
    "percentage",
  )((p) => `${Math.min(p * 100).toFixed(0)}%`)

  return battery == null || !battery.isBattery ? (
    <> </>
  ) : (
    <box>
      <image iconName={createBinding(battery, "icon-name")} />
      <label label={percentage} />
    </box>
  )
}
