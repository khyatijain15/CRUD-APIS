# Scalability Notes

For taking this application to million+ users, the following architectural approaches should be taken:

## Horizontal Scaling
- Deploy the application across multiple Node.js instances behind a Load Balancer (like NGINX or AWS ALB).
- Use stateless sessions (which we are already doing via JWTs) to ensure any server can handle any request.

## Caching Layer
- Introduce Redis to cache frequent but less frequently changing data (e.g., the tasks list).
- Cache invalidation will be key when mutations (POST, PUT, DELETE) occur.

## Database Optimization
- Create Read Replicas (master-slave architecture) where heavy GET queries are routed to replicas.
- Indexing: Ensure proper indexes are added to fields heavily queried, like `userId` on tasks or `email` on users.

## Microservices
- Separate concerns by pulling Auth (User management, login) and Tasks into separate services communicating via gRPC or message brokers like RabbitMQ or Kafka.

## Docker & Containerization
- Containerize the frontend, backend, and database using Docker.
- Orchestrate with Kubernetes (K8s) for automatic scaling, self-healing, and rollout management.

## Security & API Limits
- Implement `express-rate-limit` to prevent DDoS attacks on sensitive endpoints like `/auth/login`.