#!/bin/sh
clear
echo "kozeni Bot"

while true
do
    node src/index
    echo "Bot crashed with exit code $? - restarting in 3s..."
    sleep 3
done