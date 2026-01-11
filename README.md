# Laravel + React Docker Application

A modern full-stack web application built with Laravel 12 (PHP 8.2) backend and React frontend (Vite), containerized with Docker using MySQL and Redis.

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12.x-FF2D20?style=flat&logo=laravel&logoColor=white" alt="Laravel Version">
  <img src="https://img.shields.io/badge/PHP-8.2-777BB4?style=flat&logo=php&logoColor=white" alt="PHP Version">
  <img src="https://img.shields.io/badge/React-Vite-61DAFB?style=flat&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white" alt="Redis">
</p>

## 🚀 Features

- **Laravel 12** - Modern PHP framework with expressive syntax
- **React + Vite 7** - Fast frontend build tool and React framework
- **Tailwind CSS v4** - Utility-first CSS framework
- **Docker & Docker Compose** - Containerized application with MySQL and Redis
- **Nginx + PHP-FPM 8.2** - Production-ready web server configuration
- **MySQL 8.0** - Relational database for data storage
- **Redis** - In-memory data store for caching and sessions
- **CI/CD Pipeline** - Automated testing and deployment with GitHub Actions

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** (version 20.10 or higher) - [Download Docker](https://www.docker.com/get-started)
- **Docker Compose** (version 2.0 or higher) - Included with Docker Desktop
- **Git** - [Download Git](https://git-scm.com/downloads)

Verify your installation:

```bash
docker --version
docker-compose --version
git --version
```

## 🏗️ Project Architecture

This project uses Docker Compose to orchestrate three services:

```
┌─────────────────────────────────────────────────┐
│           Docker Compose Network                 │
│                                                 │
│  ┌──────────────┐    ┌──────────┐  ┌─────────┐ │
│  │   Laravel    │───▶│  MySQL   │  │  Redis  │ │
│  │   App        │    │  8.0     │  │ Alpine  │ │
│  │  (Nginx +    │    │          │  │         │ │
│  │   PHP-FPM)   │    │          │  │         │ │
│  └──────────────┘    └──────────┘  └─────────┘ │
│         │                                         │
│         └──▶ Port 8000 (Host)                    │
└─────────────────────────────────────────────────┘
```

### Services

- **app** - Laravel application with Nginx and PHP-FPM
- **mysql** - MySQL 8.0 database server
- **redis** - Redis cache and session store

## 🚀 Quick Start Guide

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd laravel-react-docker-2025
```

### Step 2: Create Environment File

Create a `.env` file in the root directory:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

### Step 3: Configure Environment Variables

Edit the `.env` file and set the following **required** configuration:

```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

# MySQL Configuration (MUST match docker-compose.yml)
DB_CONNECTION=mysql
DB_HOST=mysql              # ⚠️ Use service name, NOT 127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel        # Matches MYSQL_DATABASE in docker-compose.yml
DB_USERNAME=laravel        # Matches MYSQL_USER in docker-compose.yml
DB_PASSWORD=laravel        # Matches MYSQL_PASSWORD in docker-compose.yml

# Redis Configuration (MUST use service name)
REDIS_CLIENT=phpredis
REDIS_HOST=redis           # ⚠️ Use service name, NOT 127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=null

# Session & Cache Configuration
SESSION_DRIVER=database
CACHE_STORE=redis          # Using Redis for caching
QUEUE_CONNECTION=redis     # Using Redis for queues
```

> **⚠️ CRITICAL**: In Docker Compose, always use service names (`mysql`, `redis`) as hostnames, **NOT** `127.0.0.1` or `localhost`. Services communicate through the Docker network using service names.

### Step 4: Build Docker Images

Build all Docker images (this may take 5-10 minutes on first run):

```bash
docker-compose build --no-cache
```

**What this does:**
- Builds the Laravel app image with PHP 8.2-FPM, Nginx, and all dependencies
- Installs Composer packages
- Installs and builds React/Vite assets
- Pulls MySQL 8.0 and Redis Alpine images

### Step 5: Start All Services

Start all containers in detached mode:

```bash
docker-compose up -d
```

**What this does:**
- Starts MySQL container and waits for it to be healthy
- Starts Redis container
- Starts Laravel app container (after MySQL is ready)

### Step 6: Check Service Status

Verify all services are running:

```bash
docker-compose ps
```

You should see all three services with status "Up":

```
NAME                STATUS          PORTS
laravel_react_app   Up              0.0.0.0:8000->80/tcp
laravel_mysql       Up (healthy)    0.0.0.0:3306->3306/tcp
laravel_redis       Up              0.0.0.0:6379->6379/tcp
```

### Step 7: Wait for MySQL to Initialize

MySQL needs a few seconds to fully initialize. Check the logs:

```bash
docker-compose logs mysql
```

Wait until you see: `ready for connections`

### Step 8: Initialize Laravel Application

Enter the app container and set up Laravel:

```bash
# Enter the container
docker-compose exec app bash

# Generate application key
php artisan key:generate

# Run database migrations
php artisan migrate

# (Optional) Seed the database
php artisan db:seed

# Exit the container
exit
```

### Step 9: Access the Application

Open your browser and navigate to:

**🌐 http://localhost:8000**

You should see the Laravel welcome page!

## 📝 Complete Setup Commands (Copy & Paste)

Here's the complete setup in one go:

```bash
# 1. Clone repository (if not already done)
git clone <repository-url>
cd laravel-react-docker-2025

# 2. Create .env file
cp .env.example .env

# 3. Edit .env file (use your editor)
# Set: DB_HOST=mysql, DB_DATABASE=laravel, DB_USERNAME=laravel, DB_PASSWORD=laravel
# Set: REDIS_HOST=redis

# 4. Build Docker images
docker-compose build --no-cache

# 5. Start all services
docker-compose up -d

# 6. Wait for MySQL (check logs)
docker-compose logs mysql

# 7. Initialize Laravel
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate

# 8. Access application
# Open: http://localhost:8000
```

## 🔧 Common Development Commands

### Container Management

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v

# View logs
docker-compose logs -f              # All services
docker-compose logs -f app          # App only
docker-compose logs -f mysql        # MySQL only
docker-compose logs -f redis        # Redis only

# Restart a specific service
docker-compose restart app
docker-compose restart mysql
docker-compose restart redis

# Rebuild and restart
docker-compose up -d --build --force-recreate
```

### Laravel Commands (Inside Container)

```bash
# Enter the container
docker-compose exec app bash

# Artisan commands
php artisan migrate
php artisan migrate:fresh --seed
php artisan tinker
php artisan route:list
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan optimize

# Run tests
php artisan test

# Exit container
exit
```

### Laravel Commands (From Host)

You can run Laravel commands without entering the container:

```bash
docker-compose exec app php artisan migrate
docker-compose exec app php artisan tinker
docker-compose exec app php artisan route:list
docker-compose exec app php artisan test
```

### Database Commands

```bash
# Access MySQL directly
docker-compose exec mysql mysql -u laravel -plaravel laravel

# Or as root
docker-compose exec mysql mysql -u root -proot

# Backup database
docker-compose exec mysql mysqldump -u laravel -plaravel laravel > backup.sql

# Restore database
docker-compose exec -T mysql mysql -u laravel -plaravel laravel < backup.sql
```

### Redis Commands

```bash
# Access Redis CLI
docker-compose exec redis redis-cli

# Test Redis connection
docker-compose exec redis redis-cli ping
# Should return: PONG

# View all keys
docker-compose exec redis redis-cli KEYS "*"

# Clear Redis cache
docker-compose exec redis redis-cli FLUSHALL
```

### Frontend Development

```bash
# Install npm dependencies (if needed)
docker-compose exec app npm install

# Build assets for production
docker-compose exec app npm run build

# Watch for changes (development mode)
docker-compose exec app npm run dev
```

## 🛠️ Troubleshooting

### Issue: "getaddrinfo for mysql failed"

**Error:**
```
SQLSTATE[HY000] [2002] php_network_getaddresses: getaddrinfo for mysql failed
```

**Solution:**
1. Check your `.env` file - `DB_HOST` must be `mysql` (service name), not `127.0.0.1`
2. Verify MySQL container is running: `docker-compose ps`
3. Wait for MySQL to be healthy: `docker-compose logs mysql`
4. Restart services: `docker-compose restart`

### Issue: MySQL Connection Refused

**Solution:**
```bash
# Check MySQL is healthy
docker-compose ps mysql

# Check MySQL logs
docker-compose logs mysql

# Verify credentials match docker-compose.yml
# DB_USERNAME=laravel, DB_PASSWORD=laravel
```

### Issue: Redis Connection Failed

**Solution:**
```bash
# Check Redis is running
docker-compose ps redis

# Test Redis connection
docker-compose exec redis redis-cli ping

# Verify .env has: REDIS_HOST=redis (not 127.0.0.1)
```

### Issue: Permission Denied Errors

**Solution:**
```bash
# Fix storage permissions
docker-compose exec app chown -R www-data:www-data /var/www/storage
docker-compose exec app chmod -R 775 /var/www/storage
docker-compose exec app chmod -R 775 /var/www/bootstrap/cache
```

### Issue: Port Already in Use

**Error:**
```
Bind for 0.0.0.0:8000 failed: port is already allocated
```

**Solution:**
```bash
# Find what's using the port
# Windows
netstat -ano | findstr :8000

# Linux/Mac
lsof -i :8000

# Change port in docker-compose.yml
ports:
  - "8001:80"  # Use 8001 instead of 8000
```

### Issue: Container Won't Start

**Solution:**
```bash
# Check logs for errors
docker-compose logs app

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Issue: Changes Not Reflecting

**Solution:**
```bash
# Clear Laravel caches
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan view:clear
docker-compose exec app php artisan route:clear

# Rebuild frontend assets
docker-compose exec app npm run build
```

## 📊 Service Details

### MySQL Service

- **Image**: `mysql:8.0`
- **Container Name**: `laravel_mysql`
- **Port**: `3306:3306` (host:container)
- **Database**: `laravel`
- **Root Password**: `root`
- **User**: `laravel`
- **Password**: `laravel`
- **Volume**: `mysql_data` (persistent storage)

### Redis Service

- **Image**: `redis:alpine`
- **Container Name**: `laravel_redis`
- **Port**: `6379:6379` (host:container)
- **No Password**: Default (null)

### Laravel App Service

- **Image**: Built from `Dockerfile`
- **Container Name**: `laravel_react_app`
- **Port**: `8000:80` (host:container)
- **PHP Version**: 8.2-FPM
- **Web Server**: Nginx
- **Node.js**: Included for Vite builds

## 🔐 Environment Variables Reference

### Required Variables

```env
# Application
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:...          # Generate with: php artisan key:generate
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database (MySQL)
DB_CONNECTION=mysql
DB_HOST=mysql               # Service name in docker-compose.yml
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=laravel

# Redis
REDIS_CLIENT=phpredis
REDIS_HOST=redis            # Service name in docker-compose.yml
REDIS_PORT=6379
REDIS_PASSWORD=null

# Session & Cache
SESSION_DRIVER=database
CACHE_STORE=redis
QUEUE_CONNECTION=redis
```

## 🏗️ Project Structure

```
laravel-react-docker-2025/
├── app/                    # Laravel application code
│   ├── Http/Controllers/   # Application controllers
│   ├── Models/             # Eloquent models
│   └── Providers/          # Service providers
├── bootstrap/              # Laravel bootstrap files
├── config/                 # Laravel configuration files
├── database/               # Migrations, seeders, factories
│   ├── migrations/         # Database migrations
│   ├── seeders/            # Database seeders
│   └── factories/          # Model factories
├── public/                 # Public web root
├── resources/
│   ├── css/               # CSS files
│   ├── js/                # React components (Vite)
│   │   ├── app.js         # Main React entry point
│   │   └── bootstrap.js   # Bootstrap file
│   └── views/             # Blade templates
├── routes/                 # Application routes
│   └── web.php            # Web routes
├── storage/                # Storage directory
├── tests/                  # PHPUnit tests
│   ├── Feature/           # Feature tests
│   └── Unit/              # Unit tests
├── nginx/
│   └── default.conf       # Nginx configuration
├── .github/
│   └── workflows/
│       └── ci-cd.yml      # GitHub Actions CI/CD workflow
├── Dockerfile              # Docker image definition
├── docker-compose.yml      # Docker Compose configuration
├── vite.config.js         # Vite configuration
├── VERSION                 # Application version
└── README.md
```

## 🚢 CI/CD Pipeline

This project includes automated CI/CD with GitHub Actions:

- **Tests**: Runs PHPUnit tests with SQLite
- **Build**: Builds Docker image
- **Push**: Publishes to Docker Hub

See `.github/workflows/ci-cd.yml` for details.

## ☸️ Kubernetes Deployment

Kubernetes manifests are available in the `k8s/` directory for production deployment.

## 📚 Technology Stack

- **Backend**: Laravel 12, PHP 8.2-FPM
- **Frontend**: React, Vite 7, Tailwind CSS v4
- **Web Server**: Nginx
- **Database**: MySQL 8.0
- **Cache**: Redis (Alpine)
- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 🔗 Useful Links

- [Laravel Documentation](https://laravel.com/docs/12.x)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Docker Documentation](https://docs.docker.com)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Redis Documentation](https://redis.io/docs/)

---

**Built with ❤️ using Laravel 12, React, Vite, Tailwind CSS, Docker, MySQL, and Redis**

**Current Version**: 1.0.6
