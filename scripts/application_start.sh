#!/usr/bin/env sh

pm2 delete data-trading 2> /dev/null || : && pm2 start --name "data-trading" ./src/server.js