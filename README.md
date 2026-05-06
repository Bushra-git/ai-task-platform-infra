# AI Task Platform - Infrastructure Repository

This repository contains **Kubernetes manifests and infrastructure-as-code (IaC)** for the AI Task Platform. It is designed to work alongside the application repositories.

## Repository Structure

```
k8s/                      # Kubernetes manifests
+-- namespace.yaml        # Namespace definition
+-- backend-deployment.yaml      # Backend service deployment
+-- frontend-deployment.yaml     # Frontend service deployment
+-- redis-deployment.yaml        # Redis cache deployment
+-- worker-deployment.yaml       # Task worker deployment
+-- ingress.yaml                 # Nginx Ingress configuration
+-- argocd-app.yaml              # Argo CD Application manifest

ARCHITECTURE.md                   # System design and architecture documentation
```

## What This Repository Contains

- **Kubernetes Deployment Manifests**: All `.yaml` files for deploying services to a K8s cluster
- **Argo CD GitOps Setup**: Application manifests for automated deployments
- **Infrastructure Documentation**: Architecture overview and deployment guides

## What This Repository Does NOT Contain

- Application source code (backend, frontend, worker)
- Docker build configurations
- CI/CD pipelines for building images

These are maintained in separate application repositories:
- **Application Repository** (source code + Docker builds): `ai-task-platform-app`

## Quick Start

### Prerequisites

- Kubernetes cluster (1.24+)
- `kubectl` CLI configured
- Argo CD installed in the cluster (optional, for GitOps)

### Deploy Using kubectl

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy all services
kubectl apply -f k8s/ -n ai-task-platform

# Check status
kubectl get pods -n ai-task-platform
kubectl get svc -n ai-task-platform
```

### Deploy Using Argo CD (GitOps)

```bash
# Install Argo CD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Register this repository with Argo CD
kubectl apply -f k8s/argocd-app.yaml

# Monitor sync
argocd app get ai-task-platform -n argocd
```

## Configuration

All services are configured via environment variables in their respective deployment manifests. Update these files before deploying:

### Backend Deployment
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret

### Worker Deployment
- `MONGO_URI`: MongoDB connection string
- `REDIS_URL`: Redis connection URL

### Frontend Deployment
- `VITE_API_URL`: Backend API URL (optional, defaults to `/api`)

## Services Deployed

| Service | Type | Port | Purpose |
|---------|------|------|---------|
| Frontend | ClusterIP | 80 ? 5173 | React UI |
| Backend | ClusterIP | 5000 | Express API |
| Redis | ClusterIP | 6379 | Cache & Job Queue |
| Worker | Deployment | - | Task processor |

## Ingress Configuration

The `ingress.yaml` file configures routing:

- `/` ? Frontend (port 80)
- `/api/*` ? Backend API (port 5000)

Requires Nginx Ingress Controller to be installed:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
```

## Scaling

Scale individual services:

```bash
# Scale backend to 3 replicas
kubectl scale deployment backend --replicas=3 -n ai-task-platform

# Scale workers to 5 replicas
kubectl scale deployment worker --replicas=5 -n ai-task-platform
```

## Monitoring & Troubleshooting

### View Logs
```bash
kubectl logs <pod-name> -n ai-task-platform
kubectl logs -f deployment/backend -n ai-task-platform
```

### Check Pod Status
```bash
kubectl describe pod <pod-name> -n ai-task-platform
kubectl get events -n ai-task-platform --sort-by='.lastTimestamp'
```

### Port Forward for Testing
```bash
kubectl port-forward svc/backend-service 5000:5000 -n ai-task-platform
kubectl port-forward svc/frontend-service 5173:80 -n ai-task-platform
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design, data flow diagrams, and component descriptions.

## Related Repositories

- **Application Code**: https://github.com/Bushra-git/ai-task-platform-app

## Contributing

1. Create a feature branch for infrastructure changes
2. Update the relevant `.yaml` manifests
3. Test in a local Kubernetes cluster
4. Submit a pull request with description of changes
5. After merge, Argo CD will automatically sync the changes if configured

## License

MIT License

---

**Last Updated**: May 2026 | **Version**: 1.0.0
