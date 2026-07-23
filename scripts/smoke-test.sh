#!/usr/bin/env bash
set -Eeuo pipefail

HOST="${1:?Usage: $0 <public-ip-or-dns>}"
KEY="${2:-}"

SSH=(ssh -o StrictHostKeyChecking=accept-new -o ConnectTimeout=10)
[ -n "$KEY" ] && SSH+=(-i "$KEY")

"${SSH[@]}" ubuntu@"$HOST" 'sudo k3s kubectl get nodes; sudo k3s kubectl -n monitoring get pods; sudo k3s kubectl -n monitoring get svc grafana'
