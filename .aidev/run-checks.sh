#!/usr/bin/env bash
# Run the checks named after the suite and write test-results/<suite>/junit.xml.
#
#   .aidev/run-checks.sh <suite> <step>...
#
# This repository holds the code snippets hive/workerbee-doc includes; it has
# no CI and no tests of its own (see .aidev/README.md). Every run first
# installs node_modules offline and frozen (.aidev/pnpm-deps.sh), one junit
# case `install`. Steps, each one junit case (its log the failure body):
#
#   typecheck  `tsc --noEmit` over every snippet (tsconfig.json: src/)
#   build      `pnpm run build` (`tsc`, emitting into dist/, all *.js and
#              gitignored)
#
# Runs offline in the image of .aidev/runtime/Dockerfile.
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
root="$PWD"
suite="${1:?usage: $0 <suite> <step>...}"; shift
out="$root/test-results/$suite"
rm -rf "$out"; mkdir -p "$out"
cases="$out/cases.tsv"; : > "$cases"
source .aidev/junit-helpers.sh

status=0
record() { # name rc seconds log
    if [ "$2" -eq 0 ]; then
        printf 'case\t%s\tpass\t%s\t\n' "$1" "$3" >> "$cases"
    else
        status=1
        printf 'case\t%s\tfail\t%s\texit %s\t%s\n' "$1" "$3" "$2" "$4" >> "$cases"
    fi
}
step() {
    local name="$1"; shift
    local log="$out/$name.log" t0=$SECONDS rc=0
    echo "== $name" >&2
    ( cd "$root" && "$@" ) > "$log" 2>&1 < /dev/null || rc=$?
    [ "$rc" -eq 0 ] || tail -40 "$log" >&2
    record "$name" "$rc" "$((SECONDS - t0))" "$log"
    return "$rc"
}

# The install is a case of its own: a lockfile the image's store cannot serve
# fails here, not as a missing tool in a later step.
t0=$SECONDS
if ! ( source "$root/.aidev/pnpm-deps.sh" ) > "$out/install.log" 2>&1; then
    tail -40 "$out/install.log" >&2
    record install 1 "$((SECONDS - t0))" "$out/install.log"
    junit_write_cases "$out/junit.xml" "$suite" "$cases"
    exit 1
fi
record install 0 "$((SECONDS - t0))" "$out/install.log"

for s in "$@"; do
    case "$s" in
        typecheck) step typecheck pnpm exec tsc --noEmit ;;
        build) step build pnpm run build ;;
        *) printf 'case\t%s\tfail\t0\tunknown step\n' "$s" >> "$cases"; status=1 ;;
    esac
done
junit_write_cases "$out/junit.xml" "$suite" "$cases"
exit "$status"
