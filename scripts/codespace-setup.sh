#!/usr/bin/env bash
set -Eeuo pipefail

echo "=== ClusterLaunch Codespace Setup ==="

echo "[1/5] Installing Terraform..."
TF_VERSION="1.9.0"
curl -fsSL "https://releases.hashicorp.com/terraform/${TF_VERSION}/terraform_${TF_VERSION}_linux_amd64.zip" -o /tmp/tf.zip
unzip -o /tmp/tf.zip -d /tmp
sudo mv /tmp/terraform /usr/local/bin/terraform
terraform version

echo "[2/5] Installing AWS CLI..."
pip install --quiet awscli
aws --version

echo "[3/5] Configure your AWS credentials now:"
echo "You need: AWS Access Key ID, Secret Access Key, region (e.g. eu-central-1)"
aws configure

echo "[4/5] Set required Terraform variables"
read -rp "Enter your EC2 key pair name: " KEY_NAME
read -rp "Enter your public IP in CIDR (e.g. 203.0.113.10/32), or 0.0.0.0/0 for demo-only: " ALLOWED_CIDR
read -rp "Enable public demo mode? (true/false): " ENABLE_DEMO

export TF_VAR_key_name="$KEY_NAME"
export TF_VAR_allowed_cidr="$ALLOWED_CIDR"
export TF_VAR_enable_public_demo="$ENABLE_DEMO"

echo "[5/5] Deploying with Terraform..."
cd terraform/aws
terraform init
terraform apply -auto-approve

echo ""
echo "=== DONE ==="
echo "Wait 5-10 minutes for cloud-init to finish, then run:"
echo "  terraform output -raw public_demo_url"
echo "  terraform output -raw grafana_admin_password"
echo ""
echo "To tear down after demo:"
echo "  terraform destroy -auto-approve"
