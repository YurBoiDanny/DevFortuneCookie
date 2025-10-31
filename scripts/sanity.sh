#!/usr/bin/env bash
set -euo pipefail

echo "===> App health"
curl -fsS http://localhost:8080/health | jq . || true
sleep 1

echo "
===> Sidecar: first call (MISS)"
curl -i -sS http://localhost:3000/api/fortune | sed -n '1,20p' | grep -i 'HTTP\|X-Cache' || true
sleep 1

echo "
===> Sidecar: second call (HIT)"
curl -i -sS http://localhost:3000/api/fortune | sed -n '1,20p' | grep -i 'HTTP\|X-Cache' || true
sleep 1

echo "
===> Direct: always N/A"
curl -i -sS http://localhost:3000/direct/fortune | sed -n '1,20p' | grep -i 'HTTP\|X-Cache' || true
