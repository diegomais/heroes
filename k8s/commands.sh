### Commands to run in root directory

# Log in to Docker registry
docker login 

# Build image from Dockerfile
docker build -t diegomais/heroes:latest -t diegomais/heroes:v1.0.0 .

# List images containing heroes
docker image ls | grep heroes

# Push image to Docker Bub
docker push diegomais/heroes

# Create a local Kubernetes cluster
minikube start 

# Access Kubernetes Dashboard UI
minikube dashboard

# List nodes 
kubectl get nodes 

# Show nodes details
kubectl describe nodes 

# Create PostgreSQL StatefulSet resource
kubectl create -f k8s/postgres-sts.yaml

# List StatefulSet resources 
kubectl get sts
#or
kubectl get statefulset 

# List pods
kubectl get pod 

# Show dump pod logs (stdout)
kubectl logs postgres-0

# Create PostgreSQL Service resource
kubectl create -f k8s/postgres-sts.yaml

# List Service resources 
kubectl get svc
#or
kubectl get service 

# Create API Deployment resource
kubectl create -f k8s/api-deployment.yaml

# List Deployment resources 
kubectl get deploy
#or
kubectl get deployment 

# Dump pod logs (stdout)
kubectl logs api-heroes-68f78696b7-nlc92

# Stream pod logs (stdout)
kubectl logs -f api-heroes-68f78696b7-nlc92

# Create API Service resource
kubectl create -f k8s/api-svc.yaml

# Update API Deployment resource
kubectl apply -f api-deployment.json

# Display the Kubernetes service URL in the CLI
minikube service api-heroes-svc --url 

# Delete all resources
kubectl delete -f k8s/.

# Create all resources
kubectl create -f k8s/.

# Delete local Kubernetes cluster
minikube delete