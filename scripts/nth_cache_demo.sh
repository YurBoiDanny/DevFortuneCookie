#!/usr/bin/env bash
set -euo pipefail
n=${1:-3}

echo "===> Sidecar: n=$n first (MISS)"
curl -i -sS http://localhost:3000/api/fortune/$n | sed -n '1,20p' | grep -i 'HTTP\|X-Cache' || true
sleep 1

echo "
===> Sidecar: n=$n second (HIT)"
curl -i -sS http://localhost:3000/api/fortune/$n | sed -n '1,20p' | grep -i 'HTTP\|X-Cache' || true
sleep 1

echo "
===> Direct: n=$n (N/A)"
curl -i -sS http://localhost:3000/direct/fortune/$n | sed -n '1,20p' | grep -i 'HTTP\|X-Cache' || true
