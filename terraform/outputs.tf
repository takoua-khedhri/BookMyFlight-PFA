output "public_ip" {
  value       = aws_instance.bookmyflight_server.public_ip
  description = "IP publique du serveur BookMyFlight"
}

output "public_dns" {
  value       = aws_instance.bookmyflight_server.public_dns
  description = "DNS public du serveur"
}

output "frontend_url" {
  value       = "http://${aws_instance.bookmyflight_server.public_ip}:80"
  description = "URL du Frontend"
}

output "backend_url" {
  value       = "http://${aws_instance.bookmyflight_server.public_ip}:8980"
  description = "URL du Backend"
}

output "grafana_url" {
  value       = "http://${aws_instance.bookmyflight_server.public_ip}:3001"
  description = "URL de Grafana"
}