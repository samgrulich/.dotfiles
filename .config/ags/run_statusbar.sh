#!/usr/bin/env bash

LOG_FILEPATH="$HOME/.statusbar.log"

while true; do
    ags run ~/.config/ags/statusbar >>"$LOG_FILEPATH" 2>&1
    echo "Statusbar crashed at $(date), restarting in 1 seconds..." >>"$LOG_FILEPATH"
    sleep 1
done
