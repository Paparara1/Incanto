variable "region" {
  type    = string
  default = "eu-central-1"
}

variable "instance_type" {
  type    = string
  default = "t3.medium"
}

variable "key_name" {
  type        = string
  description = "Existing EC2 key pair name"
}

variable "allowed_cidr" {
  type        = string
  description = "Your public IP in CIDR notation, e.g. 203.0.113.10/32"
}

variable "cluster_mode" {
  type    = string
  default = "fast"

  validation {
    condition     = contains(["fast", "prod"], var.cluster_mode)
    error_message = "Use fast or prod."
  }
}

variable "grafana_admin_password" {
  type      = string
  sensitive = true
}

variable "volume_size" {
  type    = number
  default = 50
}
