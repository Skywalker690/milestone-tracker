# Deployment Guide

This guide provides instructions for deploying Milestone Tracker to various platforms and environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Production Considerations](#production-considerations)
- [Docker Deployment](#docker-deployment)
- [Heroku Deployment](#heroku-deployment)
- [AWS Deployment](#aws-deployment)
- [DigitalOcean Deployment](#digitalocean-deployment)
- [Traditional VPS Deployment](#traditional-vps-deployment)
- [Environment Variables](#environment-variables)
- [Database Migration](#database-migration)
- [Monitoring and Maintenance](#monitoring-and-maintenance)

## Prerequisites

Before deploying, ensure you have:

- [ ] Production-ready PostgreSQL database
- [ ] Domain name (optional but recommended)
- [ ] SSL certificate (Let's Encrypt recommended)
- [ ] Production environment variables configured
- [ ] Tested the application locally

## Production Considerations

### Security Checklist

- [ ] Use strong, unique JWT secret (minimum 256 bits)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for specific domains only
- [ ] Use environment variables for all secrets
- [ ] Enable database SSL connections
- [ ] Set up firewall rules
- [ ] Implement rate limiting
- [ ] Regular security updates

### Performance Checklist

- [ ] Enable production build optimizations
- [ ] Configure database connection pooling
- [ ] Set up CDN for static assets (optional)
- [ ] Enable Gzip compression
- [ ] Configure caching headers
- [ ] Monitor application performance

## Docker Deployment

### Backend Dockerfile

The server already includes a Dockerfile. Build and run:

```bash
cd server

# Build the image
docker build -t milestone-tracker-backend .

# Run the container
docker run -d \
  -p 8080:8080 \
  --env-file .env \
  --name milestone-backend \
  milestone-tracker-backend
```

### Frontend Dockerfile

Create `client/Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Create `client/nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Docker Compose

Create `docker-compose.yml` in the project root:

```yaml
version: '3.8'

services:
  database:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: milestone_tracker
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./server
    ports:
      - "8080:8080"
    environment:
      DB_URL: jdbc:postgresql://database:5432/milestone_tracker
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRATION: ${JWT_EXPIRATION}
    depends_on:
      database:
        condition: service_healthy

  frontend:
    build: ./client
    ports:
      - "80:80"
    environment:
      REACT_APP_API_BASE_URL: http://backend:8080
    depends_on:
      - backend

volumes:
  postgres_data:
```

Deploy with Docker Compose:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Heroku Deployment

### Backend Deployment

1. **Install Heroku CLI**:
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Or download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**:
   ```bash
   heroku login
   ```

3. **Create Heroku App**:
   ```bash
   cd server
   heroku create milestone-tracker-backend
   ```

4. **Add PostgreSQL**:
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

5. **Set Environment Variables**:
   ```bash
   heroku config:set JWT_SECRET=your_secret_here
   heroku config:set JWT_EXPIRATION=86400000
   ```

6. **Create Procfile** in server directory:
   ```
   web: java -jar target/backend-0.0.1-SNAPSHOT.jar
   ```

7. **Deploy**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

### Frontend Deployment

1. **Create Heroku App**:
   ```bash
   cd client
   heroku create milestone-tracker-frontend
   ```

2. **Set Backend URL**:
   ```bash
   heroku config:set REACT_APP_API_BASE_URL=https://milestone-tracker-backend.herokuapp.com
   ```

3. **Add Buildpack**:
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

4. **Create static.json** for routing in client directory:
   ```json
   {
     "root": "build/",
     "routes": {
       "/**": "index.html"
     }
   }
   ```

5. **Deploy**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

## AWS Deployment

### Using AWS Elastic Beanstalk

1. **Install AWS CLI and EB CLI**:
   ```bash
   pip install awscli awsebcli
   aws configure
   ```

2. **Backend Deployment**:
   ```bash
   cd server
   eb init milestone-tracker-backend
   eb create production
   eb setenv JWT_SECRET=your_secret DB_URL=your_db_url
   eb deploy
   ```

3. **Frontend Deployment** (S3 + CloudFront):
   ```bash
   cd client
   npm run build
   
   # Upload to S3
   aws s3 sync build/ s3://your-bucket-name
   
   # Create CloudFront distribution
   aws cloudfront create-distribution --origin-domain-name your-bucket-name.s3.amazonaws.com
   ```

### Using AWS ECS (Docker)

1. Push Docker images to ECR
2. Create ECS cluster
3. Define task definitions
4. Create services
5. Configure Application Load Balancer

## DigitalOcean Deployment

### Using App Platform

1. **Connect GitHub Repository**:
   - Go to DigitalOcean App Platform
   - Connect your GitHub account
   - Select the repository

2. **Configure Backend**:
   - Detect as Java application
   - Set build command: `mvn clean package`
   - Set run command: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
   - Add environment variables

3. **Configure Frontend**:
   - Detect as Node.js application
   - Set build command: `npm run build`
   - Set output directory: `build`

4. **Add Database**:
   - Add PostgreSQL Dev Database
   - Connect to backend service

5. **Deploy**:
   - Click "Create Resources"

## Traditional VPS Deployment

### Using Ubuntu Server

1. **Server Setup**:
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Java
   sudo apt install openjdk-21-jdk -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install nodejs -y
   
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib -y
   
   # Install Nginx
   sudo apt install nginx -y
   ```

2. **Database Setup**:
   ```bash
   sudo -u postgres psql
   CREATE DATABASE milestone_tracker;
   CREATE USER milestone_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE milestone_tracker TO milestone_user;
   \q
   ```

3. **Backend Deployment**:
   ```bash
   # Clone repository
   git clone https://github.com/Skywalker690/milestone-tracker1.git
   cd milestone-tracker1/server
   
   # Build application
   ./mvnw clean package -DskipTests
   
   # Create systemd service
   sudo nano /etc/systemd/system/milestone-backend.service
   ```

   Add to service file:
   ```ini
   [Unit]
   Description=Milestone Tracker Backend
   After=network.target
   
   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/path/to/server
   ExecStart=/usr/bin/java -jar target/backend-0.0.1-SNAPSHOT.jar
   Restart=always
   Environment="DB_URL=jdbc:postgresql://localhost:5432/milestone_tracker"
   Environment="DB_USERNAME=milestone_user"
   Environment="DB_PASSWORD=secure_password"
   Environment="JWT_SECRET=your_jwt_secret"
   
   [Install]
   WantedBy=multi-user.target
   ```

   ```bash
   # Start service
   sudo systemctl daemon-reload
   sudo systemctl enable milestone-backend
   sudo systemctl start milestone-backend
   ```

4. **Frontend Deployment**:
   ```bash
   cd ../client
   npm install
   npm run build
   
   # Copy build to web directory
   sudo cp -r build /var/www/milestone-tracker
   ```

5. **Nginx Configuration**:
   ```bash
   sudo nano /etc/nginx/sites-available/milestone-tracker
   ```

   Add:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       root /var/www/milestone-tracker;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:8080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   # Enable site
   sudo ln -s /etc/nginx/sites-available/milestone-tracker /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **SSL Setup with Let's Encrypt**:
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d yourdomain.com
   ```

## Environment Variables

### Production Environment Variables

**Backend (.env)**:
```env
# Database
DB_URL=jdbc:postgresql://production-db-host:5432/milestone_tracker
DB_USERNAME=production_user
DB_PASSWORD=secure_production_password

# JWT
JWT_SECRET=very_long_and_secure_random_string_at_least_256_bits
JWT_EXPIRATION=86400000

# Spring Profile
SPRING_PROFILES_ACTIVE=prod
```

**Frontend (.env.production)**:
```env
REACT_APP_API_BASE_URL=https://api.yourdomain.com
```

## Database Migration

For existing data migration:

```bash
# Export from development
pg_dump -U dev_user dev_database > backup.sql

# Import to production
psql -U prod_user prod_database < backup.sql
```

## Monitoring and Maintenance

### Health Checks

Backend health endpoint:
```
GET /actuator/health
```

### Logging

- Configure centralized logging (ELK stack, CloudWatch, etc.)
- Set log retention policies
- Monitor error rates

### Backups

Schedule regular database backups:
```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U milestone_user milestone_tracker > backup_$DATE.sql
```

### Updates

```bash
# Update backend
cd server
git pull
./mvnw clean package
sudo systemctl restart milestone-backend

# Update frontend
cd client
git pull
npm install
npm run build
sudo cp -r build/* /var/www/milestone-tracker/
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 8080 (backend) and 80/443 (frontend) are available
2. **Database connection**: Check firewall rules and credentials
3. **CORS errors**: Update CORS configuration in SecurityConfig.java
4. **Build failures**: Check Java and Node.js versions

### Useful Commands

```bash
# Check backend logs
sudo journalctl -u milestone-backend -f

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Test database connection
psql -h hostname -U username -d database_name
```

## Cost Estimation

### Heroku (Simplest)
- Backend: $7/month (Eco dyno)
- Frontend: $7/month (Eco dyno)
- Database: $9/month (Mini PostgreSQL)
- **Total**: ~$23/month

### DigitalOcean (Best Value)
- App Platform: $5/month (Basic plan)
- Managed Database: $15/month
- **Total**: ~$20/month

### AWS (Most Scalable)
- EC2: $10-50/month
- RDS: $15-100/month
- S3 + CloudFront: $5-20/month
- **Total**: ~$30-170/month

### VPS (Most Control)
- VPS (2GB RAM): $10-20/month
- Domain: $10-15/year
- SSL: Free (Let's Encrypt)
- **Total**: ~$10-20/month

---

Need help with deployment? Open an issue on [GitHub](https://github.com/Skywalker690/milestone-tracker1/issues)!
