#!/bin/bash

if [ $# -eq 0 ]; then
    BAR_NAME="statusbar"
    echo "No bar name provided, using default: $BAR_NAME"
else
    BAR_NAME="$1"
fi

BAR_PATH="$HOME/.config/ags/$BAR_NAME"

echo "Watching $BAR_PATH for changes..."

watchexec \
    --watch "$BAR_PATH" \
    --exts ts,tsx,js,jsx,css,scss \
    --restart \
    --debounce 100ms \
    --ignore "$BAR_PATH"/node_modules \
    "ags run $BAR_PATH"
