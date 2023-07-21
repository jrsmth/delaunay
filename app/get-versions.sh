#!/usr/bin/env bash

# Grab delaunator library version from package.json
LIB_VERSION=$(cat < package.json | jq -r '.dependencies."@jrsmiffy/delaunator"' | sed 's/\^//g')
# Grab project version from package.json
DEMO_VERSION=$(cat package.json | jq -r '.version' | sed 's/\^//g')
# Insert versions as const strings into versions.ts
node -p "'export const LIB_VERSION = \'${LIB_VERSION}\';\nexport const DEMO_VERSION = \'${DEMO_VERSION}\';'" > versions.ts
