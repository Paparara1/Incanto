output "public_ip" {
  value = aws_instance.cluster.public_ip
}

output "instance_id" {
  value = aws_instance.cluster.id
}

output "ssh_command" {
  value = "ssh ubuntu@${aws_instance.cluster.public_ip}"
}

output "grafana_tunnel" {
  value = "ssh -L 3000:127.0.0.1:3000 ubuntu@${aws_instance.cluster.public_ip}"
}

output "grafana_public_url" {
  description = "Public URL for Grafana (only accessible if enable_public_demo is true)"
  value       = var.enable_public_demo ? "http://${aws_instance.cluster.public_ip}" : "N/A (public demo disabled)"
}

output "grafana_admin_password" {
  value     = var.grafana_admin_password
  sensitive = true
}

output "next_steps" {
  value = var.enable_public_demo ? (
    <<-EOT
    Cluster provisioned with PUBLIC DEMO active! Wait 5-15 minutes for cloud-init.
    1) Direct link: http://${aws_instance.cluster.public_ip}
    2) Username: admin
    3) Password: Run 'terraform -chdir=terraform/aws output -raw grafana_admin_password' to see.
    4) Smoke test: ./scripts/smoke-test.sh ${aws_instance.cluster.public_ip}
    EOT
    ) : (
    <<-EOT
    Cluster provisioned in SECURE mode (tunneling required). Wait 5-15 minutes for cloud-init.
    1) SSH tunnel: ssh -L 3000:127.0.0.1:3000 ubuntu@${aws_instance.cluster.public_ip}
    2) On the server: sudo k3s kubectl -n monitoring port-forward svc/grafana 3000:80 --address 127.0.0.1
    3) Open http://localhost:3000 (admin; password: terraform -chdir=terraform/aws output -raw grafana_admin_password)
    4) Smoke test: ./scripts/smoke-test.sh ${aws_instance.cluster.public_ip}
    EOT
  )
}
