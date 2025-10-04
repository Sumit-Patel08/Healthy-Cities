# CityForge - Mumbai Pulse Frontend

A world-class React frontend for urban resilience monitoring using NASA satellite data and AI-powered insights.

![CityForge Banner](./public/banner.png)

## 🚀 Features

- **Cinematic Landing Page** - Stunning hero section with animated elements
- **Real-time Dashboard** - Live monitoring of air quality, heat, water, and urban metrics
- **Interactive Maps** - Mapbox GL JS integration with satellite data overlays
- **Advanced Charts** - Recharts and D3.js visualizations with animations
- **Responsive Design** - Mobile-first approach with dark/light mode
- **NASA Data Integration** - MODIS, VIIRS, SMAP, Landsat data visualization
- **AI-Powered Insights** - Machine learning predictions and recommendations

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Maps**: Mapbox GL JS
- **Charts**: Recharts, D3.js
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cityforge/mumbai-pulse.git
   cd mumbai-pulse/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_USE_MOCK_DATA=true
   VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Sidebar.jsx     # Navigation sidebar
│   ├── Navbar.jsx      # Top navigation bar
│   ├── HeroCinematic.jsx # Landing page hero
│   ├── MapView.jsx     # Interactive map component
│   ├── ChartView.jsx   # Chart visualization
│   ├── StatCard.jsx    # Metric display cards
│   ├── AlertBanner.jsx # Alert notifications
│   ├── DataTable.jsx   # Data table with sorting/filtering
│   └── LoaderSkeleton.jsx # Loading states
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Air.jsx         # Air quality monitoring
│   ├── Heat.jsx        # Heat index analysis
│   ├── Water.jsx       # Water & flood management
│   ├── Urban.jsx       # Urban development tracking
│   ├── Indices.jsx     # Resilience index
│   └── About.jsx       # About page
├── services/           # API integration
│   └── api.js          # Axios instance + endpoints
├── hooks/              # Custom React hooks
│   └── useFetch.js     # Data fetching with caching
├── mocks/              # Mock data for development
│   ├── airData.json
│   ├── heatData.json
│   ├── waterData.json
│   ├── urbanData.json
│   └── indicesData.json
├── styles/             # Global styles
│   └── tailwind.css    # TailwindCSS imports
├── App.jsx             # Main app component
└── main.jsx            # React entry point
```

## 🔌 API Integration

The frontend connects to 5 main API endpoints:

- `GET /api/air` - Air quality data (AQI, PM2.5, MODIS AOD)
- `GET /api/heat` - Heat index data (LST, temperature, heat waves)
- `GET /api/water` - Water management (NDWI, flood risk, SMAP)
- `GET /api/urban` - Urban activity (VIIRS nighttime lights, development)
- `GET /api/indices` - Combined resilience scores and benchmarking

### Mock Data Mode

For development without a backend, set `VITE_USE_MOCK_DATA=true` in your `.env` file. The app will use realistic mock data from the `/src/mocks/` directory.

## 🎨 Styling & Theming

### Color Palette
- **Primary**: Deep indigo/navy (`#1e1b4b`)
- **Accent**: Electric cyan (`#06b6d4`)
- **Warning**: Sunset orange (`#f97316`)
- **Success**: Emerald green (`#10b981`)

### Design System
- **Typography**: Inter font family
- **Spacing**: 8px base unit
- **Borders**: 2xl rounded corners (16px)
- **Shadows**: Subtle elevation with glassmorphism
- **Animations**: Spring-based easing with Framer Motion

## 🗺️ Map Integration

### Mapbox Setup
1. Get a free API key from [Mapbox](https://mapbox.com)
2. Add to `.env` as `VITE_MAPBOX_ACCESS_TOKEN`
3. Maps support:
   - Satellite imagery overlays
   - GeoTIFF raster data
   - Interactive hotspot markers
   - Layer switching and opacity controls
   - Time-based animation

## 📊 Data Visualization

### Chart Types
- **Line Charts**: Time series trends
- **Area Charts**: Filled trend visualization  
- **Bar Charts**: Categorical comparisons
- **Radar Charts**: Multi-dimensional analysis
- **Gauge Charts**: Score visualization

### Interactive Features
- Hover tooltips with detailed data
- Zoom and pan capabilities
- Export to PNG/SVG
- Real-time data updates
- Responsive design for mobile

## 🚨 Alert System

The app includes a sophisticated alerting system:

- **Threshold Monitoring**: Automatic alerts when metrics exceed safe levels
- **Visual Notifications**: Slide-down banners with action buttons
- **Priority Levels**: Info, Warning, Danger, Critical
- **Auto-dismiss**: Configurable timeout for non-critical alerts
- **Action Integration**: Direct links to relevant dashboard sections

## 🌙 Dark Mode

Full dark mode support with:
- System preference detection
- Manual toggle in navbar
- Persistent user preference
- Smooth transitions between themes
- Optimized contrast ratios for accessibility

## 📱 Responsive Design

Mobile-first approach with breakpoints:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+
- **Large**: 1440px+

## ⚡ Performance

### Optimization Features
- **Code Splitting**: Dynamic imports for heavy components
- **Lazy Loading**: Images and maps load on demand
- **Caching**: API responses cached with React Query patterns
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Image Optimization**: WebP format with fallbacks

### Loading States
- Skeleton loaders for all major components
- Progressive loading for maps and charts
- Graceful error handling with retry mechanisms
- Offline support with service worker (optional)

## 🧪 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type checking (if using TypeScript)
npm run type-check
```

### Code Quality
- ESLint configuration for React best practices
- Prettier for consistent code formatting
- Husky pre-commit hooks
- Conventional commit messages

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
```env
VITE_API_BASE_URL=https://api.cityforge.io
VITE_USE_MOCK_DATA=false
VITE_MAPBOX_ACCESS_TOKEN=pk.your_production_token
```

### Deployment Platforms
- **Netlify**: Automatic deployments from Git
- **Vercel**: Zero-config React deployments  
- **AWS S3 + CloudFront**: Enterprise-grade hosting
- **Docker**: Containerized deployment

## 🔧 Configuration

### Vite Configuration
The `vite.config.js` includes:
- Path aliases (`@/` for `src/`)
- Development server settings
- Build optimizations
- Plugin configurations

### TailwindCSS Configuration
Custom theme extensions in `tailwind.config.js`:
- Brand color palette
- Custom animations
- Component utilities
- Responsive breakpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices and hooks patterns
- Use TypeScript for new components (optional)
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Test on multiple screen sizes and browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA Earth Science Division** for satellite data access
- **Mapbox** for mapping platform
- **React Team** for the amazing framework
- **TailwindCSS** for utility-first styling
- **Framer Motion** for smooth animations

## 📞 Support

- **Email**: team@cityforge.io
- **GitHub Issues**: [Report bugs or request features](https://github.com/cityforge/mumbai-pulse/issues)
- **Documentation**: [Full API docs](https://docs.cityforge.io)

---

**Built with ❤️ for sustainable urban futures**
