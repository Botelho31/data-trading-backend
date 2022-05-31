#!/usr/bin/env sh

aws ssm get-parameter --name "tcc-backend-master" | printf "$(grep -P -o '(?<="Value": ")(?:[^"\\]|\\.)*(?=")')" >> /home/ubuntu/data-trading-backend/.env