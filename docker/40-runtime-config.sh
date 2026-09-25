#!/bin/sh

# Körs av nginx-imagen när containern startar.
# Skriver config.js från miljövariabler så att samma image
# kan användas i lokal, staging och prod utan ny build.
#
# config.js innehåller endast publika värden.
# Aldrig API-nycklar eller andra secrets.

set -eu

cat > /usr/share/nginx/html/config.js <<CONF
window.__KRAFTLY__ = { env: '${APP_ENV:-lokal}' }
CONF

echo "runtime-config: APP_ENV=${APP_ENV:-lokal} FEATURE_NORWAY=${NORWAY}"