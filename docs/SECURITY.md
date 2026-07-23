# Security defaults

- Terraform requires `TF_VAR_allowed_cidr`; SSH and the Kubernetes API are never open to the world by default.
- Grafana is `ClusterIP` only. Access it through an SSH tunnel, not a public NodePort.
- Grafana admin password is supplied as a Terraform sensitive variable; do not commit tfvars or state files.
- This kit is a single-node deployment. It is not a multi-AZ or multi-master HA platform.
- Review cloud costs, IAM permissions, backups, TLS, identity provider integration and network policies before production use.
