# GCP Cloud Run Deployment Guide

## Prerequisites

1. **Install Google Cloud SDK**
   ```bash
   # Install gcloud CLI
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   gcloud init
   ```

2. **Set up GCP Project**
   ```bash
   # Set your project ID
   export GCP_PROJECT_ID="your-project-id"
   gcloud config set project $GCP_PROJECT_ID
   
   # Enable required APIs
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   gcloud services enable secretmanager.googleapis.com
   ```

3. **Create Secrets in Secret Manager**
   ```bash
   # Database URL
   echo -n "postgresql://user:pass@host:5432/dbname" | \
     gcloud secrets create DATABASE_URL --data-file=-
   
   # Solana RPC URL
   echo -n "https://api.devnet.solana.com" | \
     gcloud secrets create SOLANA_RPC_URL --data-file=-
   ```

4. **Grant Secret Access to Cloud Run**
   ```bash
   PROJECT_NUMBER=$(gcloud projects describe $GCP_PROJECT_ID --format="value(projectNumber)")
   
   gcloud secrets add-iam-policy-binding DATABASE_URL \
     --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
     --role="roles/secretmanager.secretAccessor"
   
   gcloud secrets add-iam-policy-binding SOLANA_RPC_URL \
     --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
     --role="roles/secretmanager.secretAccessor"
   ```

## Quick Deploy

### Deploy API Only
```bash
export GCP_PROJECT_ID="your-project-id"
export GCP_REGION="us-central1"

gcloud builds submit \
  --config=apps/api/cloudbuild.yaml \
  --project=$GCP_PROJECT_ID
```

### Deploy Web App Only
```bash
# First, get the API URL from Cloud Run
export PUBLIC_API_URL=$(gcloud run services describe umbra-treasury-api \
  --region=us-central1 \
  --format="value(status.url)")

gcloud builds submit \
  --config=apps/web/cloudbuild.yaml \
  --project=$GCP_PROJECT_ID \
  --substitutions=_PUBLIC_API_URL=$PUBLIC_API_URL
```

### Deploy Both (Recommended)
```bash
# Deploy API first
gcloud builds submit --config=apps/api/cloudbuild.yaml

# Get API URL
export PUBLIC_API_URL=$(gcloud run services describe umbra-treasury-api \
  --region=us-central1 \
  --format="value(status.url)")

# Deploy Web with API URL
gcloud builds submit \
  --config=apps/web/cloudbuild.yaml \
  --substitutions=_PUBLIC_API_URL=$PUBLIC_API_URL
```

## Using the Deploy Script

```bash
# Make script executable
chmod +x deploy-gcp.sh

# Set environment variables
export GCP_PROJECT_ID="your-project-id"
export GCP_REGION="us-central1"
export PUBLIC_API_URL="https://your-api-url.run.app"

# Deploy everything
./deploy-gcp.sh all

# Or deploy individually
./deploy-gcp.sh api
./deploy-gcp.sh web
```

## Manual Docker Build (Local Testing)

### Build API
```bash
docker build -f apps/api/Dockerfile -t umbra-treasury-api .
docker run -p 8080:8080 \
  -e DATABASE_URL="your-db-url" \
  umbra-treasury-api
```

### Build Web
```bash
docker build -f apps/web/Dockerfile \
  --build-arg PUBLIC_API_URL=http://localhost:8080 \
  -t umbra-treasury-web .
docker run -p 3000:3000 umbra-treasury-web
```

### Using Docker Compose
```bash
# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
PUBLIC_API_URL=http://localhost:8080
PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
PUBLIC_SOLANA_NETWORK=devnet
EOF

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Environment Variables

### API Service
- `NODE_ENV` - Set to `production`
- `PORT` - Port to listen on (default: 8080)
- `DATABASE_URL` - PostgreSQL connection string (from Secret Manager)
- `SOLANA_RPC_URL` - Solana RPC endpoint (from Secret Manager)
- `SOLANA_NETWORK` - Solana network (devnet/mainnet)
- `UMBRA_PROVIDER` - Provider type (mock/real)

### Web Service
- `NODE_ENV` - Set to `production`
- `PORT` - Port to listen on (default: 3000)
- `PUBLIC_API_URL` - API endpoint URL (build-time)
- `PUBLIC_SOLANA_RPC_URL` - Solana RPC endpoint (build-time)
- `PUBLIC_SOLANA_NETWORK` - Solana network (build-time)

## Monitoring

### View Logs
```bash
# API logs
gcloud run services logs read umbra-treasury-api --region=us-central1

# Web logs
gcloud run services logs read umbra-treasury-web --region=us-central1
```

### Check Service Status
```bash
gcloud run services describe umbra-treasury-api --region=us-central1
gcloud run services describe umbra-treasury-web --region=us-central1
```

## Troubleshooting

### Build Fails
- Check Cloud Build logs: `gcloud builds list --limit=5`
- View specific build: `gcloud builds log <BUILD_ID>`

### Service Won't Start
- Check service logs: `gcloud run services logs read <SERVICE_NAME>`
- Verify secrets are accessible
- Check environment variables

### Database Connection Issues
- Verify DATABASE_URL secret is correct
- Check Cloud SQL connection settings
- Ensure service account has proper permissions

## Cost Optimization

- **Min instances**: Set to 0 for auto-scaling to zero
- **Max instances**: Limit concurrent instances
- **Memory**: Start with 512Mi, adjust based on usage
- **CPU**: Start with 1, increase if needed

## Security Best Practices

1. ✅ Use Secret Manager for sensitive data
2. ✅ Run as non-root user in containers
3. ✅ Use minimal Alpine base images
4. ✅ Enable Cloud Armor for DDoS protection
5. ✅ Set up Cloud CDN for static assets
6. ✅ Enable audit logging
7. ✅ Use VPC connector for private resources

## Next Steps

1. Set up custom domain
2. Configure Cloud CDN
3. Enable Cloud Armor
4. Set up monitoring alerts
5. Configure backup strategy
6. Implement CI/CD pipeline
