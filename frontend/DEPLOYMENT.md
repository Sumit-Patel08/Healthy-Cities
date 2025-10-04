# CityForge - Mumbai Pulse Deployment Guide

This guide covers deployment options for the CityForge frontend application.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git
- Mapbox API token (free tier available)
- Backend API running (or use mock mode)

### Local Development
```bash
# Clone and setup
git clone https://github.com/cityforge/mumbai-pulse.git
cd mumbai-pulse/frontend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start development server
npm run dev
```

## 🌐 Production Deployment

### Option 1: Netlify (Recommended)

**Automatic Deployment from Git:**

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub/GitLab repository

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment Variables**
   ```
   VITE_API_BASE_URL=https://your-api-domain.com
   VITE_USE_MOCK_DATA=false
   VITE_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token
   ```

4. **Deploy**
   - Netlify will automatically build and deploy
   - Custom domain available on paid plans

**Manual Deployment:**
```bash
# Build for production
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Option 2: Vercel

**Automatic Deployment:**

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Import your Git repository

2. **Framework Detection**
   - Vercel auto-detects Vite projects
   - Build settings are configured automatically

3. **Environment Variables**
   ```
   VITE_API_BASE_URL=https://your-api-domain.com
   VITE_USE_MOCK_DATA=false
   VITE_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token
   ```

**Manual Deployment:**
```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
npm run build
vercel --prod
```

### Option 3: AWS S3 + CloudFront

**Setup S3 Bucket:**
```bash
# Create S3 bucket
aws s3 mb s3://cityforge-mumbai-pulse

# Configure for static website hosting
aws s3 website s3://cityforge-mumbai-pulse \
  --index-document index.html \
  --error-document index.html
```

**Build and Upload:**
```bash
# Build application
npm run build

# Upload to S3
aws s3 sync dist/ s3://cityforge-mumbai-pulse --delete

# Set public read permissions
aws s3api put-bucket-policy \
  --bucket cityforge-mumbai-pulse \
  --policy file://bucket-policy.json
```

**CloudFront Distribution:**
```json
{
  "CallerReference": "cityforge-mumbai-pulse",
  "Origins": {
    "Items": [{
      "Id": "S3-cityforge-mumbai-pulse",
      "DomainName": "cityforge-mumbai-pulse.s3.amazonaws.com",
      "S3OriginConfig": {
        "OriginAccessIdentity": ""
      }
    }]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-cityforge-mumbai-pulse",
    "ViewerProtocolPolicy": "redirect-to-https"
  }
}
```

### Option 4: Docker Deployment

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
    }
}
```

**Build and Run:**
```bash
# Build Docker image
docker build -t cityforge-frontend .

# Run container
docker run -p 80:80 cityforge-frontend

# Or with docker-compose
docker-compose up -d
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## 🔧 Environment Configuration

### Production Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=https://api.cityforge.io
VITE_USE_MOCK_DATA=false

# Mapbox Configuration
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGV...

# App Configuration
VITE_APP_TITLE=CityForge - Mumbai Pulse
VITE_APP_DESCRIPTION=Urban Resilience Powered by NASA Data

# Analytics (Optional)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn

# Feature Flags (Optional)
VITE_ENABLE_REAL_TIME=true
VITE_ENABLE_NOTIFICATIONS=true
```

### Build Optimization

**vite.config.js for Production:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable in production
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts', 'd3'],
          maps: ['mapbox-gl'],
          animations: ['framer-motion']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
})
```

## 🔒 Security Considerations

### Content Security Policy

Add to your hosting platform:
```
Content-Security-Policy: default-src 'self'; 
  script-src 'self' 'unsafe-inline' https://api.mapbox.com; 
  style-src 'self' 'unsafe-inline' https://api.mapbox.com; 
  img-src 'self' data: https:; 
  connect-src 'self' https://api.cityforge.io https://api.mapbox.com;
```

### HTTPS Configuration

Always use HTTPS in production:
- Netlify/Vercel: Automatic HTTPS
- AWS CloudFront: Enable SSL certificate
- Custom server: Use Let's Encrypt

### API Security

```javascript
// api.js - Add request interceptors
api.interceptors.request.use((config) => {
  // Add API key if required
  if (import.meta.env.VITE_API_KEY) {
    config.headers['X-API-Key'] = import.meta.env.VITE_API_KEY
  }
  
  // Add CORS headers
  config.headers['Access-Control-Allow-Origin'] = '*'
  
  return config
})
```

## 📊 Performance Monitoring

### Web Vitals Tracking

```javascript
// main.jsx - Add performance monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric)
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

## 🚨 Monitoring & Alerts

### Error Tracking with Sentry

```javascript
// main.jsx
import * as Sentry from "@sentry/react"

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
  })
}
```

### Uptime Monitoring

Set up monitoring with:
- **Pingdom**: Website uptime monitoring
- **StatusCake**: Free uptime monitoring
- **UptimeRobot**: Basic uptime checks

## 🔄 CI/CD Pipeline

### GitHub Actions

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
      env:
        VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
        VITE_MAPBOX_ACCESS_TOKEN: ${{ secrets.MAPBOX_TOKEN }}
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './dist'
        production-branch: main
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🧪 Testing in Production

### Smoke Tests

```bash
# Test critical paths
curl -f https://your-domain.com/
curl -f https://your-domain.com/dashboard
curl -f https://your-domain.com/api/health
```

### Load Testing

```bash
# Install artillery
npm install -g artillery

# Create load test config
cat > load-test.yml << EOF
config:
  target: 'https://your-domain.com'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Browse application"
    flow:
      - get:
          url: "/"
      - get:
          url: "/dashboard"
      - get:
          url: "/air"
EOF

# Run load test
artillery run load-test.yml
```

## 📱 Mobile Optimization

### PWA Configuration

**public/manifest.json:**
```json
{
  "name": "CityForge - Mumbai Pulse",
  "short_name": "CityForge",
  "description": "Urban Resilience Powered by NASA Data",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1e1b4b",
  "theme_color": "#06b6d4",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker

```javascript
// public/sw.js
const CACHE_NAME = 'cityforge-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})
```

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Environment Variables Not Loading**
   - Ensure variables start with `VITE_`
   - Check `.env` file is in project root
   - Restart development server

3. **Map Not Loading**
   - Verify Mapbox token is valid
   - Check browser console for errors
   - Ensure HTTPS in production

4. **API Connection Issues**
   - Check CORS configuration
   - Verify API endpoint URLs
   - Test with mock data mode

### Debug Mode

```javascript
// Enable debug logging
if (import.meta.env.DEV) {
  window.DEBUG = true
  console.log('Debug mode enabled')
}
```

## 📞 Support

- **Documentation**: [docs.cityforge.io](https://docs.cityforge.io)
- **Issues**: [GitHub Issues](https://github.com/cityforge/mumbai-pulse/issues)
- **Email**: team@cityforge.io
- **Discord**: [CityForge Community](https://discord.gg/cityforge)

---

**Ready to deploy? Choose your preferred method above and follow the step-by-step instructions!** 🚀
