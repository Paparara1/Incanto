# Security defaults

- Terraform requires `TF_VAR_allowed_cidr`; SSH and the Kubernetes API are never open to the world by default.
- Grafana is `ClusterIP` only. Access it through an SSH tunnel, not a public NodePort.
- Grafana admin password is supplied as a Terraform sensitive variable; do not commit tfvars or state files.
- This kit is a single-node deployment. It is not a multi-AZ or multi-master HA platform.
- Review cloud costs, IAM permissions, backups, TLS, identity provider integration and network policies before production use.

## Access via AWS Systems Manager (no SSH key required)
The instance is launched with an IAM instance profile scoped to the AWS-managed `AmazonSSMManagedInstanceCore`
policy, and `amazon-ssm-agent` is kept running via `user_data.sh.tftpl`. This lets operators reach the instance
through Session Manager instead of opening or distributing an SSH key:
```bash
aws ssm start-session --target "$(terraform -chdir=terraform/aws output -raw instance_id)"
```
Session Manager sessions are logged and access is controlled entirely through IAM (`ssm:StartSession` on the
instance), so prefer it over SSH for operators who don't need key-based access. The SSH ingress rule in
`aws_security_group.clusterlaunch` remains restricted to `var.allowed_cidr` and can be removed if SSM access is
sufficient for your workflow.
