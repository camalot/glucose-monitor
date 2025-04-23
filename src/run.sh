#! /usr/bin/env bash

docker build -t node-url-shortener:local .

docker run --rm -it -p 3000:3000 --env-file ./app/.env --name nus node-url-shortener:local