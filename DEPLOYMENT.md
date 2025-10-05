# 🚀 Mumbai Pulse - Complete Deployment Guide

## NASA Space Apps Challenge 2025 - Production Deployment

This guide will help you deploy the complete Mumbai Pulse Healthy Cities project with your free NASA domain.

---

## 📋 **Project Architecture**

- **Frontend**: Next.js React application
- **Backend API**: Flask server with NASA satellite data
- **ML API**: Python ML models for urban planning recommendations
- **Database**: NASA MODIS, POWER, VIIRS, SMAP, OMI satellite data
- **Weather API**: Meteomatics real-time weather integration

---

## 🎯 **Deployment Stack**

| Component | Service | Cost | URL Pattern |
|-----------|---------|------|-------------|
| Frontend | Vercel | Free | `https://yourdomain.com` |
| Backend API | Railway | Free Tier | `https://backend-xxx.railway.app` |
| ML API | Railway | Free Tier | `https://ml-api-xxx.railway.app` |
| Domain | Porkbun/GoDaddy | Free (NASA) | `yourdomain.com` |

---

## 📁 **Pre-Deployment Checklist**

### ✅ **Files Created (Already Done)**
- [x] `backend/requirements.txt` - Python dependencies
- [x] `backend/Procfile` - Railway deployment config
- [x] `backend/runtime.txt` - Python version
- [x] `vercel.json` - Frontend deployment config
- [x] `frontend/env.example` - Environment variables template

### ✅ **GitHub Repository**
- [x] Push all code to GitHub
- [x] Ensure both `frontend/` and `backend/` directories are included
- [x] Repository is public or accessible to deployment services

---

## 🚀 **Step 1: Deploy Backend APIs**

### **1.1 Deploy Main Backend (NASA Data API)**

#### **Using Railway (Recommended)**

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up** with your GitHub account
3. **Click "New Project"** → **"Deploy from GitHub repo"**
4. **Select** your Mumbai Pulse repository
5. **Configure the service:**

```bash
Service Name: mumbai-pulse-backend
Root Directory: backend
Start Command: gunicorn app:app --bind 0.0.0.0:$PORT
```

6. **Add Environment Variables:**
```env
PORT=5000
FLASK_ENV=production
METEOMATICS_USERNAME=your_username_here
METEOMATICS_PASSWORD=your_password_here
```

7. **Deploy** and note the URL: `https://mumbai-pulse-backend-xxx.railway.app`

### **1.2 Deploy ML API (AI Recommendations)**

1. **In Railway, create another service** from the same repo
2. **Configure:**

```bash
Service Name: mumbai-pulse-ml-api
Root Directory: backend
Start Command: gunicorn ml_server:app --bind 0.0.0.0:$PORT
```

3. **Add Environment Variables:**
```env
PORT=5001
FLASK_ENV=production
```

4. **Deploy** and note the URL: `https://mumbai-pulse-ml-api-xxx.railway.app`

#### **Alternative: Using Render**

1. **Go to [Render.com](https://render.com)**
2. **Create Web Service** → **Connect GitHub**
3. **Configure:**
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Python 3.11

---

## 🌐 **Step 2: Deploy Frontend**

### **2.1 Deploy to Vercel**

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up** with GitHub
3. **Click "New Project"** → **Import Git Repository**
4. **Select** your Mumbai Pulse repo
5. **Configure:**

```bash
Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

6. **Add Environment Variables:**
```env
NEXT_PUBLIC_API_URL=https://mumbai-pulse-backend-xxx.railway.app/api
NEXT_PUBLIC_ML_API_URL=https://mumbai-pulse-ml-api-xxx.railway.app
```

7. **Deploy** and note the URL: `https://mumbai-pulse-xxx.vercel.app`

### **2.2 Alternative: Netlify**

1. **Go to [Netlify.com](https://netlify.com)**
2. **New site from Git** → **GitHub**
3. **Configure:**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/.next`

---

## 🌍 **Step 3: Configure Your NASA Domain**

### **3.1 Domain Setup (Porkbun/GoDaddy)**

1. **Complete your NASA domain registration** following the T-3 to T-0 steps
2. **Access your domain control panel**
3. **Add DNS Records:**

```dns
Type: CNAME
Name: @
Value: mumbai-pulse-xxx.vercel.app
TTL: 300

Type: CNAME
Name: www
Value: mumbai-pulse-xxx.vercel.app
TTL: 300
```

### **3.2 Configure Custom Domain in Vercel**

1. **In Vercel Dashboard** → **Your Project** → **Settings** → **Domains**
2. **Add Domain**: `yourdomain.com`
3. **Add WWW Subdomain**: `www.yourdomain.com`
4. **Wait for DNS propagation** (5-30 minutes)

---

## ⚙️ **Step 4: Environment Configuration**

### **4.1 Update Frontend Environment Variables**

In **Vercel** → **Settings** → **Environment Variables**:

```env
# Production API URLs (replace with your actual URLs)
NEXT_PUBLIC_API_URL=https://mumbai-pulse-backend-xxx.railway.app/api
NEXT_PUBLIC_ML_API_URL=https://mumbai-pulse-ml-api-xxx.railway.app

# Optional: Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS=your_ga_id
```

### **4.2 Update Backend Environment Variables**

In **Railway** → **Your Backend Service** → **Variables**:

```env
# Flask Configuration
FLASK_ENV=production
PORT=5000

# Meteomatics API (if you have credentials)
METEOMATICS_USERNAME=your_username
METEOMATICS_PASSWORD=your_password

# CORS Origins (add your domain)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## 🧪 **Step 5: Testing Deployment**

### **5.1 Test Backend APIs**

```bash
# Test main backend
curl https://mumbai-pulse-backend-xxx.railway.app/api/health

# Test ML API
curl -X POST https://mumbai-pulse-ml-api-xxx.railway.app/api/ml/generate-recommendations \
  -H "Content-Type: application/json" \
  -d '{"aqi": 185, "pm25": 78, "no2": 45}'
```

### **5.2 Test Frontend**

1. **Visit your domain**: `https://yourdomain.com`
2. **Check all pages work:**
   - Dashboard: `https://yourdomain.com/dashboard`
   - Air Quality: `https://yourdomain.com/air-quality`
   - Real ML Air Quality: `https://yourdomain.com/air-quality-real`
   - Heat Island: `https://yourdomain.com/heat-island`
   - Water Resources: `https://yourdomain.com/water-resources`

### **5.3 Test ML Integration**

1. **Go to**: `https://yourdomain.com/air-quality-real`
2. **Click**: "Call Real ML API" button
3. **Verify**: Non-hardcoded recommendations appear
4. **Check**: Different results with different data inputs

---

## 🔧 **Step 6: Performance Optimization**

### **6.1 Enable Caching**

In **Vercel**:
- Static files automatically cached
- API responses cached for 60 seconds

In **Railway**:
```python
# Add to your Flask app
from flask import Flask
from datetime import timedelta

app.permanent_session_lifetime = timedelta(minutes=30)
```

### **6.2 Enable Compression**

```python
# In backend/app.py
from flask_compress import Compress

app = Flask(__name__)
Compress(app)
```

---

## 📊 **Step 7: Monitoring & Analytics**

### **7.1 Add Google Analytics (Optional)**

1. **Create GA4 property** for your domain
2. **Add tracking ID** to Vercel environment variables
3. **Update** `frontend/app/layout.tsx` with GA script

### **7.2 Monitor API Usage**

- **Railway**: Built-in metrics dashboard
- **Vercel**: Analytics tab shows performance
- **Custom**: Add logging to track ML API usage

---

## 🚨 **Troubleshooting**

### **Common Issues & Solutions**

#### **1. CORS Errors**
```python
# In backend/app.py, update CORS configuration
from flask_cors import CORS

CORS(app, origins=[
    "https://yourdomain.com",
    "https://www.yourdomain.com",
    "http://localhost:3000"  # Keep for development
])
```

#### **2. Environment Variables Not Loading**
- Check variable names match exactly
- Redeploy after adding variables
- Use `NEXT_PUBLIC_` prefix for client-side variables

#### **3. ML API Connection Errors**
- Verify ML service is running on Railway
- Check ML API URL in frontend environment variables
- Test ML API endpoint directly with curl

#### **4. Domain Not Resolving**
- Wait 24-48 hours for full DNS propagation
- Use `nslookup yourdomain.com` to check DNS
- Verify CNAME records point to correct Vercel URL

#### **5. Build Failures**
```bash
# Common fixes:
npm install --legacy-peer-deps
npm run build --verbose
```

---

## 🎯 **NASA Demo Checklist**

### **Before Your Presentation:**

- [ ] **Domain works**: `https://yourdomain.com` loads correctly
- [ ] **All pages functional**: Dashboard, Air Quality, Heat Island, Water Resources
- [ ] **Real ML API working**: Air Quality Real page generates non-hardcoded recommendations
- [ ] **NASA data loading**: Dashboard shows real satellite data
- [ ] **Mobile responsive**: Test on phone/tablet
- [ ] **Performance good**: Pages load under 3 seconds
- [ ] **No console errors**: Check browser developer tools

### **Demo Script:**

1. **"This is our live Mumbai Pulse application running on our NASA domain"**
2. **Show Dashboard**: "Real NASA satellite data from MODIS, POWER, VIIRS"
3. **Show Air Quality Real**: "Click this button to call our trained ML models"
4. **Show Results**: "These recommendations are generated by RandomForest and GradientBoosting algorithms, not hardcoded"
5. **Show Different Pages**: "Heat Island analysis, Water Resources monitoring"

---

## 📞 **Support & Resources**

### **Deployment Services Support:**
- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Porkbun**: support@porkbun.com

### **NASA Space Apps:**
- **Domain Issues**: Contact NASA Space Apps support
- **Technical Questions**: Use NASA Space Apps Discord/Slack

### **Project Repository:**
- **GitHub Issues**: Create issues for bugs
- **Documentation**: Update README.md with deployment URLs

---

## 🏆 **Final Production URLs**

After deployment, update this section with your actual URLs:

```
🌐 Production Website: https://yourdomain.com
📊 Dashboard: https://yourdomain.com/dashboard
🤖 ML Air Quality: https://yourdomain.com/air-quality-real
🔥 Heat Island: https://yourdomain.com/heat-island
💧 Water Resources: https://yourdomain.com/water-resources

🔧 Backend API: https://mumbai-pulse-backend-xxx.railway.app
🧠 ML API: https://mumbai-pulse-ml-api-xxx.railway.app
```

---

## 🎉 **Congratulations!**

Your Mumbai Pulse Healthy Cities project is now live on your NASA domain! 

**Key Features Deployed:**
- ✅ Real NASA satellite data integration
- ✅ Live weather data from Meteomatics API
- ✅ AI-powered urban planning recommendations
- ✅ Interactive maps and visualizations
- ✅ Mobile-responsive design
- ✅ Production-ready performance

**Perfect for NASA Space Apps Challenge judging!** 🚀

---

*Last updated: October 2025 | NASA Space Apps Challenge 2025*
