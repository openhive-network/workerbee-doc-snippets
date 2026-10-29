# The image AIDEV runs this project's suites in (`environment.image` in
# .aidev/project.yaml). Suites run with `--network none` and the caller's uid, so
# everything they need is in the image.
#
# Node and pnpm come from common-ci-configuration's node-test-tools image, the one
# hive's CI templates use; this file pins no Node version of its own. It adds a
# pnpm store filled from pnpm-lock.yaml (`pnpm fetch`), so
# `pnpm install --offline --frozen-lockfile` links node_modules in the sandbox.
#
# .aidev/runtime/build.sh builds it on the digest node-test-tools:develop names at
# the time; the result is pinned as `environment.image`. Rebuild it whenever
# pnpm-lock.yaml changes.
ARG BASE_IMAGE=registry.gitlab.syncad.com/hive/common-ci-configuration/node-test-tools:develop
FROM ${BASE_IMAGE}
USER root
# The suite runs as an arbitrary uid with no passwd entry, so HOME must be a
# directory anyone can write. pnpm must not switch to `packageManager`'s version:
# that would download at run time, offline. The environment variable covers the
# outer pnpm only: a pnpm started from a package script reads the setting from
# its global rc ($XDG_CONFIG_HOME/pnpm/rc).
ENV HOME=/tmp \
    XDG_CONFIG_HOME=/opt/xdg-config \
    npm_config_store_dir=/opt/pnpm-store \
    npm_config_manage_package_manager_versions=false \
    CI=1 \
    DO_NOT_TRACK=1
RUN mkdir -p /opt/xdg-config/pnpm \
    && printf 'manage-package-manager-versions=false\n' > /opt/xdg-config/pnpm/rc \
    && chmod -R a+rX /opt/xdg-config
COPY package.json pnpm-lock.yaml /tmp/pnpm-fetch/
RUN cd /tmp/pnpm-fetch \
    && pnpm fetch \
    && cd / && rm -rf /tmp/pnpm-fetch /tmp/.npm /tmp/.cache /tmp/.local \
    && chmod -R a+rwX /opt/pnpm-store
