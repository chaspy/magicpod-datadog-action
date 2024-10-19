#!/bin/bash
set -eux
BASEURL="https://app.magicpod.com/api"
# ORGANIZATION_NAME=$ORGANIZATION_NAME
# PROJECT_NAME=$PROJECT_NAME
BATCH_RUN_NUMBER="1047"
BATCH_RUNS_PATH="/v1.0/${ORGANIZATION_NAME}/${PROJECT_NAME}/batch-run/${BATCH_RUN_NUMBER}/"

curl -s -X 'GET' \
  "${BASEURL}${BATCH_RUNS_PATH}" \
  -H 'accept: application/json' \
  -H "Authorization: Token $MAGICPOD_API_TOKEN"
