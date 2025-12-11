#!/bin/bash

# Setup script for containerized web application
# Automates Docker Swarm initialization and deployment

set -e

echo "Starting deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running"
    exit 1
fi

# Initialize Swarm if not already done
if ! docker info | grep -q "Swarm: active"; then
    echo "Initializing Docker Swarm..."
    docker swarm init
fi

# Build application image
echo "Building application image..."
cd app
docker build -t nodeapp:latest .
cd ..

# Deploy stack
echo "Deploying stack..."
docker stack deploy -c docker-compose.yml webapp

# Wait for services to start
echo "Waiting for services to initialize..."
sleep 30

# Check status
echo ""
echo "Deployment complete!"
echo ""
docker service ls
echo ""
echo "Access the application at: http://localhost:8080"
