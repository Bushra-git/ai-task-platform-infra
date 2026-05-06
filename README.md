# AI Task Platform

A full-stack distributed task processing system with a React frontend, Node.js/Express backend, and Python worker processes running on Kubernetes.

## Features

User Authentication (JWT-based)

- Task Management Dashboard
- Distributed Task Processing (Bull MQ + Redis)
- Docker Containerization
- Kubernetes Deployment (with Argo CD GitOps)
- CI/CD with GitHub Actions
- Scalable Worker Processes

## Tech Stack

| Component     | Technology       |
| ------------- | ---------------- |
| Frontend      | React.js + Vite  |
| Backend       | Node.js/Express  |
| Worker        | Python (asyncio) |
| Database      | MongoDB Atlas    |
| Cache/Queue   | Redis + Bull MQ  |
| Orchestration | Kubernetes       |
| GitOps        | Argo CD          |
| CI/CD         | GitHub Actions   |

## Prerequisites

- **Docker** (20.10+)
- **Kubernetes** (1.24+) or Docker Desktop with K8s enabled
- **kubectl** CLI
- **Git**
- **Node.js** 20+ (for local development)
- **Python** 3.9+ (for worker development)
- **MongoDB Atlas** account (or local MongoDB)
- **Docker Hub** account (for image registry)

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/bushrakhan/ai-task-platform.git
cd ai-task-platform
```

### 2. Set Up Environment Variables

Create `.env` files in respective folders:

**backend/.env**

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
PORT=5000
```

**worker/.env**

```
REDIS_URL=redis://redis-service:6379
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

### 3. Create Kubernetes Namespace

```bash
kubectl create namespace ai-task-platform
```

### 4. Deploy to Kubernetes

**Option A: Direct Deployment**

```bash
# Deploy all services
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/worker-deployment.yaml
kubectl apply -f k8s/ingress.yaml

# Check status
kubectl get pods -n ai-task-platform
kubectl get svc -n ai-task-platform
```

**Option B: Argo CD GitOps (Recommended)**

```bash
# Install Argo CD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Apply Argo CD Application manifest
kubectl apply -f k8s/argocd-app.yaml

# Monitor sync
kubectl get application -n argocd
argocd app get ai-task-platform
```

### 5. Access Application

#### Local Development

```bash
# Frontend (http://localhost:5173)
cd frontend && npm install && npm run dev

# Backend (http://localhost:5000)
cd backend && npm install && npm start

# Worker
cd worker && python -m pip install -r requirements.txt && python worker.py
```

#### Kubernetes (via Ingress)

```
http://localhost/         # Frontend
http://localhost/api/...  # Backend API
```

## Local Development

### Frontend

```bash
cd frontend
npm install
npm run dev           # Start dev server on http://localhost:5173
npm run build         # Build for production
npm run preview       # Preview production build
```

### Backend

```bash
cd backend
npm install
npm start             # Start server on http://localhost:5000
# With nodemon for development:
npm install -D nodemon
npx nodemon server.js
```

### Worker

```bash
cd worker
pip install -r requirements.txt
python worker.py      # Start worker process
```

### Redis (Local)

```bash
# Using Docker
docker run -p 6379:6379 redis:latest

# Or Docker Compose
docker-compose up redis
```

## Docker Build & Push

Build images locally:

```bash
docker build -t your-registry/ai-task-backend:v1 ./backend
docker build -t your-registry/ai-task-frontend:v1 ./frontend
docker build -t your-registry/ai-task-worker:v1 ./worker

# Push to registry
docker push your-registry/ai-task-backend:v1
docker push your-registry/ai-task-frontend:v1
docker push your-registry/ai-task-worker:v1
```

Update image tags in k8s manifests:

```bash
# Update k8s/*.yaml with your registry credentials
sed -i 's/bushrakhan9321/your-registry/g' k8s/*.yaml
```

## CI/CD Setup

### GitHub Actions Secrets

Add these secrets to GitHub repository settings:

```
DOCKER_USERNAME   → Your Docker Hub username
DOCKER_PASSWORD   → Your Docker Hub access token
ARGOCD_SERVER     → https://your-argocd-server.com
ARGOCD_AUTH_TOKEN → Your Argo CD auth token
```

### Workflows

Two workflows are configured:

1. **docker-build.yml**: Builds and pushes Docker images on push to `main`
2. **argocd-sync.yml**: Updates k8s manifests and triggers Argo CD sync

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Tasks

- `GET /api/tasks` - List user's tasks (requires auth)
- `POST /api/tasks` - Create new task (requires auth)
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task status

## Kubernetes Commands

```bash
# View pods
kubectl get pods -n ai-task-platform
kubectl describe pod <pod-name> -n ai-task-platform
kubectl logs <pod-name> -n ai-task-platform

# Scale worker replicas
kubectl scale deployment worker --replicas=5 -n ai-task-platform

# Port forward (testing)
kubectl port-forward svc/backend-service 5000:5000 -n ai-task-platform
kubectl port-forward svc/frontend-service 5173:80 -n ai-task-platform

# Update deployment image
kubectl set image deployment/backend backend=your-registry/ai-task-backend:v2 -n ai-task-platform

# View Argo CD applications
kubectl get applications -n argocd
argocd app get ai-task-platform -n argocd
```

## Troubleshooting

### Pod CrashLoopBackOff

Check logs:

```bash
kubectl logs <pod-name> -n ai-task-platform
kubectl describe pod <pod-name> -n ai-task-platform
```

Common issues:

- Missing environment variables in deployment
- Database connection string invalid
- Image pull issues (check imagePullPolicy)
- Missing dependencies (npm install, pip install)

### Ingress Not Working

```bash
# Check Ingress status
kubectl get ingress -n ai-task-platform
kubectl describe ingress ai-task-platform-ingress -n ai-task-platform

# Check Nginx controller
kubectl get pods -n ingress-nginx
```

### Redis Connection Issues

```bash
# Test Redis connectivity
kubectl run -it redis-cli --image=redis:latest --restart=Never -- redis-cli -h redis-service -p 6379 ping
```

## Monitoring

### View Metrics

```bash
# Resource usage
kubectl top pods -n ai-task-platform
kubectl top nodes

# Pod events
kubectl get events -n ai-task-platform
```

### Logs

```bash
# Stream logs
kubectl logs -f <pod-name> -n ai-task-platform

# Multiple pods
kubectl logs -f -l app=backend -n ai-task-platform
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design and data flow.

## Project Structure

```
.
├── frontend/              # React app with Vite
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── backend/               # Express.js API server
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── Dockerfile
│   └── package.json
├── worker/                # Python task worker
│   ├── Dockerfile
│   └── worker.py
├── k8s/                   # Kubernetes manifests
│   ├── namespace.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── redis-deployment.yaml
│   ├── worker-deployment.yaml
│   ├── ingress.yaml
│   └── argocd-app.yaml
├── .github/workflows/     # CI/CD pipelines
│   ├── docker-build.yml
│   └── argocd-sync.yml
├── docker-compose.yml     # Local development
├── ARCHITECTURE.md        # System design
└── README.md              # This file
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:

- GitHub Issues: https://github.com/bushrakhan/ai-task-platform/issues
- Email: support@example.com

---

**Last Updated**: May 2026 | **Version**: 1.0.0
