#!/bin/bash

# Terminate already running bar instances
killall -q polybar
# If all yours bars have ipc enabled, ou can also use 
# polybar-msg cmd quit

# Launch Polybar, using default config location ~/.config/polybar/config.ini
# polybar bar 2>&1 | tee -a /tmp/polybar.log & diown


MONITORS=$(xrandr --query)
BAR_NAME=bar
BAR_CONFIG=/home/$USER/.config/polybar/config.ini

PRIMARY=$($MONITORS | grep " connected" | grep    "primary" | cut -d" " -f1)
OTHERS=$($MONITORS  | grep " connected" | grep -v "primary" | cut -d" " -f1)

if [[ ${#MONITORS[@]} -eq 1 ]]; then
    polybar --reload -c "$BAR_CONFIG" $BAR_NAME &
    exit
fi
# Launch on primary monitor
MONITOR=$PRIMARY polybar --reload -c "$BAR_CONFIG" $BAR_NAME &
sleep 1

# Launch on all other monitors
for m in $OTHERS; do
    MONITOR=$m polybar --reload -c "$BAR_CONFIG" $BAR_NAME &
done

