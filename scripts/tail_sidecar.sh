#!/usr/bin/env bash
set -euo pipefail

echo "===> Tailing sidecar access log (press Ctrl+C to stop)"
docker compose exec sidecar sh -c 'tail -f /var/log/nginx/access.log'
