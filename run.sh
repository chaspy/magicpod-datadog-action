#!/bin/bash
set -eux
BASEURL="https://app.magicpod.com/api"
# ORGANIZATION_NAME=$ORGANIZATION_NAME
# PROJECT_NAME=$PROJECT_NAME
BATCH_RUNS_PATH="/v1.0/${ORGANIZATION_NAME}/${PROJECT_NAME}/batch-runs/"

curl -X 'GET' \
  "${BASEURL}${BATCH_RUNS_PATH}?count=20" \
  -H 'accept: application/json' \
  -H "Authorization: Token $MAGICPOD_API_TOKEN"
