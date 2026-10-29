# Sourced by run-checks.sh from the repository root: bring node_modules up to
# date with pnpm-lock.yaml from the image's pnpm store, offline and frozen, the
# way CI installs. A marker records the lockfile and Node it was installed for;
# it is written only after an install that succeeded, and an install whose
# tools don't resolve is redone.
lock_id="$(cat package.json pnpm-lock.yaml | sha256sum | cut -d' ' -f1) $(node --version)"
marker=node_modules/.aidev-pnpm-lock
tools_present() {
    local t
    for t in tsc; do
        [ -x "node_modules/.bin/$t" ] || { echo "node_modules/.bin/$t missing" >&2; return 1; }
    done
}
if [ "$(cat "$marker" 2>/dev/null)" != "$lock_id" ] || ! tools_present 2>/dev/null; then
    echo "node_modules is not current for pnpm-lock.yaml: pnpm install --offline --frozen-lockfile" >&2
    pnpm install --offline --frozen-lockfile < /dev/null || return 1
    tools_present || return 1
    printf '%s\n' "$lock_id" > "$marker.tmp" && mv "$marker.tmp" "$marker"
fi
