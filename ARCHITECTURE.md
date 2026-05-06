# AI Task Platform - Architecture

## Overview

The AI Task Platform is a full-stack application with a distributed task processing system. It uses Kubernetes for orchestration, MongoDB for persistence, Redis for caching/queuing, and a worker-based job processing system.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         End Users                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
        ┌─────────────────────────────────────┐
        │    Nginx Ingress Controller          │
        │  (Routing & Load Balancing)          │
        └────────┬─────────────────┬──────────┘
                 │                 │
        ┌────────▼────┐    ┌──────▼────────┐
        │  Frontend    │    │   Backend API │
        │ (React App)  │    │   (Express.js)│
        │  Port: 5173  │    │  Port: 5000   │
        └────────┬─────┘    └──────┬────────┘
                 │                 │
                 │        ┌────────▼─────────┐
                 │        │  MongoDB Atlas   │
                 │        │  (Data Storage)  │
                 │        └──────────────────┘
                 │
        ┌────────▼─────────────────┐
        │   Redis Cache & Queue    │
        │     Port: 6379           │
        └────────┬─────────────────┘
                 │
        ┌────────▼──────────────────┐
        │  Worker Processes (x2)    │
        │  (Python Job Processors)  │
        └───────────────────────────┘
```

## Components

### Frontend

- **Technology**: React.js with Vite
- **Port**: 5173 (internal), exposed via Ingress
- **Responsibilities**:
  - User interface for task management
  - Authentication forms (Login/Register)
  - Task creation and monitoring dashboard

### Backend API

- **Technology**: Node.js/Express
- **Port**: 5000
- **Responsibilities**:
  - User authentication (JWT-based)
  - Task CRUD operations
  - Queue job submission
  - API endpoints: `/api/auth/*`, `/api/tasks/*`

### Database

- **Technology**: MongoDB Atlas (Cloud)
- **Responsibilities**:
  - User document storage
  - Task metadata and status tracking

### Cache & Message Queue

- **Technology**: Redis
- **Port**: 6379
- **Responsibilities**:
  - Bull MQ job queue for task processing
  - Session caching (optional)

### Worker Processes

- **Technology**: Python (asyncio-based)
- **Replicas**: 2 (configurable)
- **Responsibilities**:
  - Dequeuing and processing tasks from Redis queue
  - Long-running computations
  - Status updates back to MongoDB

### API Gateway & Routing

- **Technology**: Kubernetes Nginx Ingress
- **Routes**:
  - `/` → Frontend Service (port 80 → 5173)
  - `/api/*` → Backend Service (port 5000)

## Deployment Architecture

### Kubernetes Namespace

- **Namespace**: `ai-task-platform`
- **Replicas**:
  - Frontend: 1
  - Backend: 1
  - Redis: 1
  - Worker: 2 (scalable)

### Service Types

- **ClusterIP**: Frontend, Backend, Redis, Worker (internal communication)
- **LoadBalancer/Ingress**: Nginx Ingress (external access)

## Data Flow

1. **User submits a task** via Frontend UI
2. **Frontend calls** Backend `/api/tasks` endpoint
3. **Backend validates** request and creates task record in MongoDB
4. **Backend enqueues** task in Redis Queue (Bull MQ)
5. **Worker** picks up job from queue
6. **Worker processes** task (AI computation, data transformation, etc.)
7. **Worker updates** task status in MongoDB
8. **Frontend polls** or uses WebSockets to fetch updated status
9. **User views** completed task results

## GitOps & CI/CD

### Argo CD

- **Purpose**: Continuous deployment from Git
- **Source**: Git repository (`k8s/` folder)
- **Sync Policy**: Auto-sync with auto-heal enabled
- **Namespace**: `argocd`

### GitHub Actions

- **Build Pipeline**: Triggers on push to main
  - Builds Docker images for frontend, backend, worker
  - Pushes to Docker Hub
- **Deploy Pipeline**: Triggers on k8s manifest changes
  - Updates image tags in manifests
  - Triggers Argo CD to sync

## Security Considerations

- **Secrets Management**: Environment variables for sensitive data (MongoDB URI, JWT secret)
- **Authentication**: JWT tokens for API endpoints
- **Ingress**: Can be enhanced with TLS/SSL certificates
- **Network Policies**: Can restrict pod-to-pod communication

## Scaling Strategy

- **Horizontal Scaling**: Add more Worker replicas (`kubectl scale deployment worker --replicas=N`)
- **Vertical Scaling**: Increase memory/CPU limits in manifests
- **Load Balancing**: Ingress distributes traffic across replicas
- **Queue-based Processing**: Bull MQ handles burst task submissions

## Monitoring & Logging

- **Recommended Tools**:
  - Prometheus + Grafana for metrics
  - ELK Stack or Loki for logs
  - Jaeger for distributed tracing

## Deployment Instructions

See [README.md](../README.md) for setup and deployment guide.
