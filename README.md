# Node.js Kubernetes Microservice

## Overview

This project is a Node.js-based microservice architecture deployed on Kubernetes using helm, nodejs and docker. It consists of multiple services, each handling different aspects of the application.

## Architecture

The project includes the following services:

- **Report Service**: Handles report generation and management.
- **User Service**: Manages user-related operations.
- **Postgres Service**: Manages database operations.

Each service is containerized using Docker and orchestrated using Kubernetes.

## Installation

To set up the project locally:

1. Clone the repository.
2. Navigate to each service directory and install dependencies using `npm install`.
3. Install kubectl and helm.
4. Install redis using helm: `helm install redis bitnami/redis --set auth.enabled=false --set replica.replicaCount=1`.
5. Install postgres-service first using: `helm install <release name> ./helm/postgres-service --values ./helm/postgres-service/values.yaml.example`.
6. Install ngnix-ingress controller.
7. Apply ingress file in helm folder: `kubectl apply -f ./helm/ingress.yaml`.
8. Install other charts like user-service and report-service using: `helm install <release name> ./helm/<service-name> --values ./helm/<service-name>/values.yaml.example`.

## Usage

To run the services:

- Navigate to the service directory and use `npm start` to launch the service.

## Checking resources

After installation, you can check the resources using the following commands:

- `kubectl get deployments`
- `kubectl get pods`
- `kubectl get svc`
- `kubectl get ingress`

## Docker and Kubernetes

- **Docker**: Each service has a `Dockerfile` for containerization.
- **Kubernetes**: Deployment configurations are available in the `helm` directory.

## Contributing

Contributions are welcome! Please follow the standard GitHub workflow for submitting pull requests.

## License

This project is licensed under the ISC License.