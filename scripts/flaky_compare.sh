#!/usr/bin/env bash
set -euo pipefail

count=10

echo "===> Direct flaky (no retries)"
ok=$(for i in $(seq 1 $count); do curl -s -o /dev/null -w "%{http_code}
" http://localhost:3000/direct/flaky; done | grep -c '^200$' || true)
echo "Direct success: $ok/$count"

sleep 1

echo "
===> Sidecar flaky (with retries)"
ok=$(for i in $(seq 1 $count); do curl -s -o /dev/null -w "%{http_code}
" http://localhost:3000/api/flaky; done | grep -c '^200$' || true)
echo "Sidecar success: $ok/$count"
