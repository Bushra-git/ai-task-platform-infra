Use this command to create the runtime secret (do not commit real values):
kubectl create secret generic ai-task-platform-secrets \
  --from-literal=MONGO_URI='mongodb+srv://<username>:<password>@<cluster>/<db>?retryWrites=true&w=majority' \
  --from-literal=JWT_SECRET='<long-random-secret>' \
  -n ai-task-platform
