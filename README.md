# Containerized Web Application

A production-ready containerized web infrastructure with Docker Swarm orchestration, Nginx load balancing, and caching.

## What This Is

This project deploys a Node.js application across multiple containers with:
- Docker Swarm for orchestration and high availability
- Nginx as a load balancer and cache layer
- 3 application replicas for redundancy

## Requirements

- Docker Desktop (Windows) or Docker Engine (Linux)
- At least 2GB RAM available

## Quick Start

### 1. Clone this repository
```bash
git clone <your-repo-url>
cd infrastructure-assessment
```

### 2. Initialize Docker Swarm
```bash
docker swarm init
```

### 3. Build the images
```bash
cd app
docker build -t nodeapp:latest .
cd ..
```

### 4. Deploy the stack
```bash
docker stack deploy -c docker-compose.yml webapp
```

### 5. Wait about 30 seconds, then check status
```bash
docker service ls
```

You should see:
- `webapp_app` with 3/3 replicas
- `webapp_nginx` with 1/1 replicas

### 6. Access the application

Open your browser to `http://localhost:8080`

**Note:** The application runs on port 8080 to avoid conflicts with other services that commonly use port 80 (such as IIS on Windows).

## Verifying It Works

### Load Balancing
Refresh the page multiple times. You'll see different container hostnames, proving requests are distributed across the 3 replicas.

### Caching
Reload the page within 60 seconds. The timestamp stays the same, showing Nginx is caching the response.

After 60 seconds, the timestamp updates with a fresh request to the backend.

### Health Status
```bash
# Check all services
docker service ls

# View application logs
docker service logs webapp_app

# View load balancer logs  
docker service logs webapp_nginx
```

## Architecture
```
[Client] 
   ↓
[Nginx Load Balancer + Cache] (Port 8080)
   ↓
[Docker Swarm Overlay Network]
   ↓
[Node.js App] × 3 replicas (Port 8080 internal)
```

## Scaling

To scale the application:
```bash
docker service scale webapp_app=5
```

This adds more replicas for increased capacity.

## Security Features

- Rate limiting: 10 requests/second per IP
- Security headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
- Non-root user for application containers
- Resource limits on CPU and memory

## Configuration

### Nginx Configuration
See `nginx/nginx.conf` for:
- Upstream backend definition
- Cache settings (60 second TTL)
- Security headers
- Rate limiting rules

### Docker Compose
See `docker-compose.yml` for:
- Service definitions
- Resource limits
- Network configuration
- Health checks

## Cleanup

To remove everything:
```bash
docker stack rm webapp
docker swarm leave --force
```

## Troubleshooting

**Services not starting?**
```bash
docker service ps webapp_app --no-trunc
docker service logs webapp_app
```

**Port 8080 already in use?**

Edit `docker-compose.yml` and change the nginx ports to `"8081:80"`, then redeploy.

**Can't access the app?**

Check services are running: `docker service ls`
Both should show full replicas (3/3 and 1/1).

## Notes

- First deployment takes 1-2 minutes while images build and containers start
- The application is stateless and can be safely restarted
- Cache directory is created automatically on first run
- Logs are retained until containers are removed
- Port 8080 is used instead of port 80 to ensure compatibility across different environments

## Production Considerations

For production deployment:
- Use proper SSL certificates (Let's Encrypt)
- Deploy across multiple nodes for true high availability  
- Add monitoring (Prometheus/Grafana)
- Implement centralized logging
- Use secrets management for sensitive data
- Set up automated backups
