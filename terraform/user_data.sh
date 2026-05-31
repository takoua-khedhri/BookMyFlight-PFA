#!/bin/bash

# Mise à jour du système
yum update -y

# Installation de Docker
yum install -y docker
service docker start
usermod -a -G docker ec2-user
systemctl enable docker

# Installation de Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Installation de Git
yum install -y git

# Cloner le projet depuis GitHub
git clone https://github.com/takoua-khedhri/BookMyFlight-PFA.git /app

# Aller dans le dossier du projet
cd /app

# Lancer l'application
docker-compose up -d

echo "BookMyFlight déployé avec succès !"