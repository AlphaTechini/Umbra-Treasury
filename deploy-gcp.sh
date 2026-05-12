#!/bin/bash

# GCP Deployment Script for Umbra Treasury
# Usage: ./deploy-gcp.sh [api|web|all]

set -e

PROJECT_ID="${GCP_PROJECT_ID}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME_API="umbra-treasury-api"
SERVICE_NAME_WEB="umbra-treasury-web"

if [ -z "$PROJECT_ID" ]; then
  echo "Error: GCP_PROJECT_ID environment variable is not set"
  exit 1
fi

deploy_api() {
  echo "🚀 Deploying API to Cloud Run..."
  
  gcloud builds submit \
    --config=apps/api/cloudbuild.yaml \
    --project=$PROJECT_ID \
    --substitutions=_SERVICE_NAME=$SERVICE_NAME_API,_REGION=$REGION
  
  echo "✅ API deployed successfully!"
}

deploy_web() {
  echo "🚀 Deploying Web App to Cloud Run..."
  
  gcloud builds submit \
    --config=apps/web/cloudbuild.yaml \
    --project=$PROJECT_ID \
    --substitutions=_SERVICE_NAME=$SERVICE_NAME_WEB,_REGION=$REGION,_PUBLIC_API_URL=$PUBLIC_API_URL
  
  echo "✅ Web App deployed successfully!"
}

case "$1" in
  api)
    deploy_api
    ;;
  web)
    deploy_web
    ;;
  all)
    deploy_api
    deploy_web
    ;;
  *)
    echo "Usage: $0 [api|web|all]"
    exit 1
    ;;
esac

echo "🎉 Deployment complete!"
