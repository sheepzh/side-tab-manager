#!/bin/bash

FOLDER=$(
    cd "$(dirname "$0")/.."
    pwd
)
TARGET_PATH="${FOLDER}/sss"

tar -zcvf ${TARGET_PATH} \
    --exclude=dist*/ \
    --exclude=.git/ \
    --exclude=package-lock.json \
    --exclude=node_modules \
    --exclude=market_packages \
    --exclude=sss \
    ./
