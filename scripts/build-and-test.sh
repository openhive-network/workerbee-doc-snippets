#!/bin/sh

# We operate in the stackblitz environment, which is a bit different from the standard shell environment
TEST_FILE=${2:-$1}

echo $TEST_FILE

rm ./*.js

tsc --experimentalDecorators --outDir . --skipLibCheck -m node16 "$TEST_FILE"

cp scripts/runner.js runner.js

node runner.js
