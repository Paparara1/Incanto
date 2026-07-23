# Security defaults

- Terraform requires `TF_VAR_allowed_cidr`; SSH and the Kubernetes API are never open to the world by default.
- Grafana is `ClusterIP` only. Access it through an SSH tunnel, not a public NodePort.
- Grafana admin password is supplied as a Terraform sensitive variable; do not commit tfvars or state files.
- This kit is a single-node deployment. It is not a multi-AZ or multi-master HA platform.
- Review cloud costs, IAM permissions, backups, TLS, identity provider integration and network policies before production use.

## Access without an SSH key

The instance has an IAM instance profile with `AmazonSSMManagedInstanceCore`, so it can also be reached through
AWS Systems Manager Session Manager, entirely from a browser (including on mobile):

1. Open the AWS Console → EC2 → select the `clusterlaunch-*` instance → **Connect** → **Session Manager** → **Connect**.
2. This opens a shell on the instance without needing the `.pem` key or opening port 22.

SSM connects outbound over HTTPS, so it works even if `allowed_cidr` no longer matches your current network. Keep the
SSH key as a backup access method, but Session Manager is the recommended fallback if the key is lost or unavailable.
