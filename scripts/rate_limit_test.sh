#!/usr/bin/env bash
set -euo pipefail

echo "===> Bursting 20 requests against sidecar /api/fortune to trigger rate limiting..."
seq 20 | xargs -n1 -P20 -I{} curl -s -o /dev/null -w "%{http_code}
" http://localhost:3000/api/fortune | sort | uniq -c
