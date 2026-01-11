# Docker Setup Fix Guide

## Issue: MySQL Connection Error

If you're getting this error:
```
SQLSTATE[HY000] [2002] php_network_getaddresses: getaddrinfo for mysql failed: Name or service not known
```

## Solution

### Step 1: Update your `.env` file

Your `.env` file must have the correct MySQL configuration to match the `docker-compose.yml` settings.

**For Docker Compose with MySQL service, use these settings:**

```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=true
APP_URL=http://localhost:8000

# MySQL Configuration (matches docker-compose.yml)
DB_CONNECTION=mysql
DB_HOST=mysql          # Use service name from docker-compose.yml
DB_PORT=3306
DB_DATABASE=laravel    # Matches MYSQL_DATABASE in docker-compose.yml
DB_USERNAME=laravel    # Matches MYSQL_USER in docker-compose.yml
DB_PASSWORD=laravel    # Matches MYSQL_PASSWORD in docker-compose.yml

# Or use root user:
# DB_USERNAME=root
# DB_PASSWORD=root      # Matches MYSQL_ROOT_PASSWORD in docker-compose.yml

# Redis Configuration (for Docker Compose)
REDIS_HOST=redis       # Use service name from docker-compose.yml
REDIS_PORT=6379
REDIS_PASSWORD=null

# Session & Cache
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
```

### Step 2: Stop and remove existing containers

```bash
docker-compose down -v
```

The `-v` flag removes volumes, which will reset the MySQL database.

### Step 3: Rebuild and start containers

```bash
docker-compose build --no-cache
docker-compose up -d
```

### Step 4: Wait for MySQL to be ready

Wait about 10-20 seconds for MySQL to fully initialize, then check logs:

```bash
docker-compose logs mysql
```

You should see: `ready for connections`

### Step 5: Initialize Laravel in the container

```bash
# Enter the container
docker-compose exec app bash

# Generate application key (if not already done)
php artisan key:generate

# Run migrations
php artisan migrate

# Exit container
exit
```

### Step 6: Verify the connection

```bash
# Test database connection
docker-compose exec app php artisan tinker
```

Then in tinker, run:
```php
DB::connection()->getPdo();
```

If it returns a PDO object, the connection is working!

## Alternative: Use SQLite (Simpler for Development)

If you prefer SQLite for local development (no MySQL container needed):

### Update `.env`:

```env
DB_CONNECTION=sqlite
DB_DATABASE=/var/www/database/database.sqlite
```

### Update `docker-compose.yml`:

Remove MySQL and Redis dependencies from the app service:

```yaml
services:
  app:
    build: .
    container_name: laravel_react_app
    ports:
      - "8000:80"
    env_file:
      - .env
    # Remove depends_on if using SQLite
    volumes:
      - ./storage:/var/www/storage
      - ./database:/var/www/database
```

Then rebuild:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Troubleshooting

### Check if MySQL container is running:

```bash
docker-compose ps
```

All services should show "Up" status.

### Check MySQL logs:

```bash
docker-compose logs mysql
```

### Check app logs:

```bash
docker-compose logs app
```

### Test MySQL connection from app container:

```bash
docker-compose exec app bash
mysql -h mysql -u laravel -plaravel laravel
```

### Reset everything:

```bash
# Stop and remove everything including volumes
docker-compose down -v

# Remove all containers, networks, and images
docker-compose down --rmi all -v

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d
```

## Important Notes

1. **Service Names**: In Docker Compose, use service names (like `mysql`, `redis`) as hostnames, not `127.0.0.1` or `localhost`
2. **Network**: All services in the same `docker-compose.yml` are on the same network and can communicate using service names
3. **Health Checks**: The app service waits for MySQL to be healthy before starting (configured in docker-compose.yml)
4. **Credentials**: Make sure `.env` credentials match `docker-compose.yml` environment variables
