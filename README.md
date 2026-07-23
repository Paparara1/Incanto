# ClusterLaunch — K3s + Grafana AWS Kit

A compact Infrastructure-as-Code kit for deploying a **single-node** K3s cluster on AWS with Grafana observability.

## What it deploys
- Ubuntu 22.04 EC2, encrypted gp3 root volume and IMDSv2
- K3s Kubernetes
- Grafana in both modes, exposed only through an SSH tunnel
- `fast`: K3s + lightweight Grafana
- `prod`: K3s + Prometheus stack + Grafana + Loki, with persistent Grafana storage

## Important scope
This is **not** multi-master HA, multi-AZ, managed Kubernetes, a public Grafana endpoint, or a 24/7 managed service.

## Prerequisites
- Terraform >= 1.6
- AWS credentials with permission to create EC2 and security groups
- Existing EC2 SSH key pair
- Your current public IP in `/32` CIDR format

## Deploy
```bash
cp terraform/aws/terraform.tfvars.example terraform/aws/terraform.tfvars
export TF_VAR_allowed_cidr="YOUR.PUBLIC.IP/32"
export TF_VAR_key_name="YOUR_EXISTING_EC2_KEYPAIR"
./deploy.sh fast
./deploy.sh prod
```

### Connect without an SSH key (SSM)
The instance has an IAM instance profile with `AmazonSSMManagedInstanceCore`, so you can reach it through
[AWS Systems Manager Session Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html)
even if you don't have (or don't want to use) the SSH key pair:
```bash
INSTANCE_ID=$(terraform -chdir=terraform/aws output -raw instance_id)
aws ssm start-session --target "$INSTANCE_ID"
```
This requires the AWS CLI, the Session Manager plugin, and IAM permissions to call `ssm:StartSession`.

### Open Grafana safely
```bash
ssh -L 3000:127.0.0.1:3000 ubuntu@$(terraform -chdir=terraform/aws output -raw public_ip)
sudo k3s kubectl -n monitoring port-forward svc/grafana 3000:80 --address 127.0.0.1
```
Grafana can also be tunneled through SSM instead of SSH:
```bash
aws ssm start-session --target "$INSTANCE_ID" \
  --document-name AWS-StartPortForwardingSession \
  --parameters '{"portNumber":["3000"],"localPortNumber":["3000"]}'
```
Open http://localhost:3000. User: admin. Password:
```bash
terraform -chdir=terraform/aws output -raw grafana_admin_password
```

### Validation and cleanup
```bash
./scripts/smoke-test.sh "$(terraform -chdir=terraform/aws output -raw public_ip)"
terraform -chdir=terraform/aws destroy
```

## Security
See docs/SECURITY.md.

## License
MIT License. See LICENSE.
