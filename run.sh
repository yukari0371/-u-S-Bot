#!/bin/sh
clear
echo "kozeni Bot"

while true
do
    node src/index
    EXITCODE=$?

    if [ $EXITCODE -eq 0 ]; then
        echo "Bot exited with code 0 - restarting in 3s..."
        sleep 3
    else
        echo "Bot exited with code $EXITCODE  - stopping."
        break;
    fi
done