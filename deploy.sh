#!/usr/bin/env bash
set -Eeuo pipefail

MODE="${1:-fast}"

case "$MODE" in
  fast|prod) ;;
  *)
    echo "Usage: $0 [fast|prod]"
    exit 1
    ;;
esac

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TF="$ROOT/terraform/aws"

: "${TF_VAR_allowed_cidr:?Set TF_VAR_allowed_cidr to your public IP CIDR, e.g. 203.0.113.10/32}"

export TF_VAR_cluster_mode="$MODE"
export TF_VAR_grafana_admin_password="${TF_VAR_grafana_admin_password:-$(openssl rand -base64 24 | tr -d '\r\n')}"

echo "Deploying ClusterLaunch AWS single-node ($MODE)."
echo "Grafana password is generated for this run; save the Terraform output securely."

terraform -chdir="$TF" init
terraform -chdir="$TF" apply
terraform -chdir="$TF" output -raw next_steps
