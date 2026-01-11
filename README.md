# Laravel React Kubernetes Setup

A complete Kubernetes setup for running Laravel + React application with MySQL and Redis using Minikube.

## Architecture

- **Laravel Application**: PHP 8.2 with Nginx
- **MySQL 8.0**: Database server
- **Redis Alpine**: Cache and session store
- **Kubernetes**: Orchestration via Minikube

## Prerequisites

- [Minikube](https://minikube.sigs.k8s.io/docs/start/) installed and running
- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed
- Docker Hub account (for pulling private images)
- Docker installed (for building images)

## Quick Start

### 1. Start Minikube

```bash
minikube start
```

Verify Minikube is running:
```bash
kubectl get nodes
```

### 2. Create Docker Hub Secret

Create a secret to pull images from Docker Hub:

```bash
kubectl create secret docker-registry dockerhub-secret \
  --docker-username=YOUR_DOCKER_USERNAME \
  --docker-password=YOUR_DOCKER_PASSWORD \
  --docker-email=YOUR_EMAIL
```

### 3. Deploy All Services

Deploy all Kubernetes resources:

```bash
# Deploy all resources at once
kubectl apply -f k8s/

# Or deploy individually
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/mysql.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/mysql-service.yaml
kubectl apply -f k8s/redis-service.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

### 4. Verify Deployment

Check all pods are running:
```bash
kubectl get pods
```

Expected output:
```
NAME                             READY   STATUS    RESTARTS   AGE
laravel-react-xxxxx-xxxxx        1/1     Running   0          Xm
mysql-xxxxx-xxxxx                1/1     Running   0          Xm
redis-xxxxx-xxxxx                1/1     Running   0          Xm
```

Check all services:
```bash
kubectl get services
```

Expected output:
```
NAME                    TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
kubernetes              ClusterIP   10.96.0.1       <none>        443/TCP         Xm
laravel-react-service   NodePort    10.97.81.45     <none>        80:30779/TCP    Xm
mysql                   ClusterIP   10.101.144.120  <none>        3306/TCP        Xm
redis                   ClusterIP   10.99.205.102   <none>        6379/TCP        Xm
```

### 5. Run Database Migrations

Execute migrations inside the Laravel pod:

```bash
# Get the pod name first
POD_NAME=$(kubectl get pods -l app=laravel-react -o jsonpath='{.items[0].metadata.name}')

# Run migrations
kubectl exec $POD_NAME -- php artisan migrate --force
```

Or use the deployment directly:
```bash
kubectl exec deployment/laravel-react -- php artisan migrate --force
```

### 6. Access the Application

Open the application in your browser:

```bash
minikube service laravel-react-service
```

Or get the URL manually:
```bash
minikube service laravel-react-service --url
```

The service is also accessible via NodePort. Get the port:
```bash
kubectl get service laravel-react-service
```

Then access: `http://<minikube-ip>:<NodePort>` (e.g., `http://192.168.49.2:30779`)

## Debugging Commands

### Check Pod Status

```bash
# List all pods with details
kubectl get pods -o wide

# Describe a specific pod
kubectl describe pod <pod-name>

# Watch pods in real-time
kubectl get pods -w
```

### View Logs

```bash
# Laravel application logs
kubectl logs deployment/laravel-react
kubectl logs <pod-name>

# Follow logs in real-time
kubectl logs -f deployment/laravel-react

# Last 50 lines
kubectl logs deployment/laravel-react --tail=50

# Logs from a specific container (if multiple containers)
kubectl logs <pod-name> -c app
```

### Check Environment Variables

```bash
# List all environment variables in the pod
kubectl exec <pod-name> -- env

# Check specific Laravel variables
kubectl exec <pod-name> -- env | grep -E 'APP_|DB_|REDIS_'

# Verify APP_KEY is set
kubectl exec <pod-name> -- sh -c "printenv APP_KEY"
```

### Execute Commands in Pods

```bash
# Open bash shell in Laravel pod
kubectl exec -it deployment/laravel-react -- bash

# Or use pod name
kubectl exec -it <pod-name> -- bash

# Run Laravel artisan commands
kubectl exec deployment/laravel-react -- php artisan <command>

# Check Laravel configuration
kubectl exec deployment/laravel-react -- php artisan config:show

# Clear Laravel cache
kubectl exec deployment/laravel-react -- php artisan config:clear
kubectl exec deployment/laravel-react -- php artisan cache:clear
kubectl exec deployment/laravel-react -- php artisan route:clear
kubectl exec deployment/laravel-react -- php artisan view:clear
```

### Database Debugging

```bash
# Connect to MySQL pod
kubectl exec -it deployment/mysql -- mysql -u root -proot

# Or use pod name
kubectl exec -it <mysql-pod-name> -- mysql -u root -proot

# Check database from Laravel pod
kubectl exec deployment/laravel-react -- php artisan db:show

# Test database connection
kubectl exec deployment/laravel-react -- php artisan tinker
# Then in tinker: DB::connection()->getPdo();
```

### Redis Debugging

```bash
# Connect to Redis pod
kubectl exec -it deployment/redis -- redis-cli

# Test Redis connection
kubectl exec deployment/redis -- redis-cli ping

# Check Redis info
kubectl exec deployment/redis -- redis-cli info
```

### Service Discovery

```bash
# Check if services are discoverable
kubectl get services

# Test MySQL service connectivity from Laravel pod
kubectl exec deployment/laravel-react -- sh -c "nc -zv mysql 3306"

# Test Redis service connectivity
kubectl exec deployment/laravel-react -- sh -c "nc -zv redis 6379"
```

### Check Secrets

```bash
# List all secrets
kubectl get secrets

# Describe secret
kubectl describe secret laravel-env

# View secret data (base64 encoded)
kubectl get secret laravel-env -o yaml

# Decode a specific secret value
kubectl get secret laravel-env -o jsonpath='{.data.APP_KEY}' | base64 -d
```

## Common Operations

### Restart Services

```bash
# Restart Laravel deployment
kubectl rollout restart deployment laravel-react

# Restart MySQL
kubectl rollout restart deployment mysql

# Restart Redis
kubectl rollout restart deployment redis

# Check rollout status
kubectl rollout status deployment laravel-react
```

### Update Configuration

```bash
# Update secrets
kubectl apply -f k8s/secrets.yaml

# Update deployment
kubectl apply -f k8s/deployment.yaml

# Force pod recreation after config changes
kubectl rollout restart deployment laravel-react
```

### Scale Services

```bash
# Scale Laravel app to 3 replicas
kubectl scale deployment laravel-react --replicas=3

# Scale back to 1
kubectl scale deployment laravel-react --replicas=1
```

### Port Forwarding (Alternative Access)

```bash
# Forward Laravel service to localhost
kubectl port-forward service/laravel-react-service 8080:80

# Forward MySQL to localhost
kubectl port-forward service/mysql 3306:3306

# Forward Redis to localhost
kubectl port-forward service/redis 6379:6379
```

Then access:
- Laravel: `http://localhost:8080`
- MySQL: `localhost:3306`
- Redis: `localhost:6379`

## Troubleshooting

### Pod Not Starting

```bash
# Check pod events
kubectl describe pod <pod-name>

# Check pod logs
kubectl logs <pod-name>

# Check if image pull is successful
kubectl describe pod <pod-name> | grep -i image
```

### 500 Server Error

1. **Check Laravel logs:**
   ```bash
   kubectl logs deployment/laravel-react --tail=100
   ```

2. **Verify environment variables are loaded:**
   ```bash
   kubectl exec deployment/laravel-react -- env | grep APP_KEY
   ```

3. **Check database connection:**
   ```bash
   kubectl exec deployment/laravel-react -- php artisan tinker
   # Then: DB::connection()->getPdo();
   ```

4. **Verify services are running:**
   ```bash
   kubectl get pods
   kubectl get services
   ```

5. **Check if migrations are run:**
   ```bash
   kubectl exec deployment/laravel-react -- php artisan migrate:status
   ```

### Database Connection Issues

```bash
# Verify MySQL service exists
kubectl get service mysql

# Test connection from Laravel pod
kubectl exec deployment/laravel-react -- sh -c "nc -zv mysql 3306"

# Check MySQL logs
kubectl logs deployment/mysql

# Verify database credentials in secret
kubectl get secret laravel-env -o jsonpath='{.data.DB_HOST}' | base64 -d
```

### Redis Connection Issues

```bash
# Verify Redis service exists
kubectl get service redis

# Test connection from Laravel pod
kubectl exec deployment/laravel-react -- sh -c "nc -zv redis 6379"

# Check Redis logs
kubectl logs deployment/redis
```

### Environment Variables Not Loading

```bash
# Verify secret exists
kubectl get secret laravel-env

# Check deployment configuration
kubectl get deployment laravel-react -o yaml | grep -A 5 envFrom

# Reapply deployment
kubectl apply -f k8s/deployment.yaml
kubectl rollout restart deployment laravel-react
```

## Cleanup

### Delete All Resources

```bash
# Delete all resources
kubectl delete -f k8s/

# Or delete individually
kubectl delete deployment laravel-react
kubectl delete deployment mysql
kubectl delete deployment redis
kubectl delete service laravel-react-service
kubectl delete service mysql
kubectl delete service redis
kubectl delete secret laravel-env
```

### Stop Minikube

```bash
minikube stop
```

### Delete Minikube Cluster

```bash
minikube delete
```

## Useful Aliases (Optional)

Add these to your `~/.bashrc` or `~/.zshrc`:

```bash
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgs='kubectl get services'
alias kdp='kubectl describe pod'
alias kl='kubectl logs'
alias ke='kubectl exec -it'
alias kaf='kubectl apply -f'
alias kdf='kubectl delete -f'
```

## Project Structure

```
k8s/
├── deployment.yaml          # Laravel app deployment
├── service.yaml             # Laravel NodePort service
├── mysql.yaml               # MySQL deployment
├── mysql-service.yaml       # MySQL ClusterIP service
├── redis.yaml               # Redis deployment
├── redis-service.yaml       # Redis ClusterIP service
└── secrets.yaml             # Environment variables secret
```

## Configuration Files

### Environment Variables (secrets.yaml)

Key variables configured:
- `APP_KEY`: Laravel encryption key
- `DB_CONNECTION`: mysql
- `DB_HOST`: mysql (service name)
- `DB_DATABASE`: laravel
- `DB_USERNAME`: root
- `DB_PASSWORD`: root
- `REDIS_HOST`: redis (service name)
- `REDIS_PORT`: 6379

**Note:** Update `secrets.yaml` with your production values before deploying to production.

## Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)
- [Laravel Documentation](https://laravel.com/docs)
- [Docker Documentation](https://docs.docker.com/)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review pod logs: `kubectl logs deployment/laravel-react`
3. Check pod events: `kubectl describe pod <pod-name>`
4. Verify all services are running: `kubectl get pods && kubectl get services`

---

**Built with ❤️ using Laravel, React, Vite, Tailwind CSS, Docker, MySQL, and Redis**

**Current Version**: 1.0.8