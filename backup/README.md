# 🎯 Lightspeed Inventory Dashboard

A powerful, custom-built inventory management dashboard that enhances Lightspeed POS/eCom with advanced size-based filtering capabilities. Perfect for clothing stores, shoe retailers, and any business that needs to manage inventory by sizes rather than just products.

![Lightspeed Dashboard Preview](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop)

## 🚀 Key Features

### 📏 **Size-Based Filtering**
- **Clothing Sizes**: Filter by XS, S, M, L, XL, XXL, XXXL instantly
- **Shoe Sizes**: Quick access to sizes 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13, 14+
- **Custom Sizes**: Support for any size format your business uses
- **Quick Select**: One-click filtering for common sizes

### 📊 **Smart Inventory Insights**
- **Real-time Stock Levels**: Live inventory counts with visual indicators
- **Low Stock Alerts**: Automatic warnings when items fall below threshold
- **Out of Stock Tracking**: Clear identification of items needing restocking
- **Value Calculations**: Total inventory value and category breakdowns
- **Visual Stock Bars**: Instant visual representation of stock levels

### 🔍 **Advanced Search & Filtering**
- **Multi-criteria Search**: Search by product name, SKU, EAN, size, or color
- **Category Filtering**: Filter by clothing, shoes, accessories
- **Brand Filtering**: Filter by specific brands
- **Stock Status Filters**: Show only in-stock or low-stock items
- **Combination Filters**: Mix and match multiple filter types

### 🔗 **Dual API Support**
- **R-Series (eCom)**: Full support for Lightspeed eCom API
- **X-Series (Retail)**: Native integration with modern Lightspeed Retail API
- **Auto-detection**: Automatically determines which API version to use
- **Secure Authentication**: OAuth 2.0 and Personal Token support

## 🎯 Perfect For

### 👕 **Clothing Retailers**
- T-shirt and apparel stores
- Fashion boutiques
- Streetwear shops
- Department stores

### 👟 **Shoe Stores**
- Sneaker retailers
- Athletic footwear stores
- Boot and shoe shops
- Multi-brand footwear retailers

### 🏬 **Mixed Retail**
- Stores selling both clothing and shoes
- Sports equipment retailers
- Fashion accessories shops

## 💡 Why This Dashboard?

### The Problem with Standard Lightspeed
Standard Lightspeed inventory management shows products as single items, making it difficult to:
- See size-specific availability at a glance
- Filter inventory by specific sizes
- Quickly identify which sizes need restocking
- Make size-based purchasing decisions

### Our Solution
This dashboard transforms your inventory view to show:
- **Size-specific stock levels** for each product variant
- **One-click size filtering** across your entire inventory
- **Visual indicators** for low stock by size
- **Quick decision-making tools** for restocking

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+ and npm 8+
- Lightspeed POS account (R-Series or X-Series)
- API credentials from your Lightspeed admin panel

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/your-username/lightspeed-inventory-dashboard.git
cd lightspeed-inventory-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:3000`

## 🔑 API Setup

### For Lightspeed R-Series (eCom)

1. **Get API Credentials**
   - Log into your Lightspeed eCom admin panel
   - Go to **Apps** → **Private Apps**
   - Create a new private app
   - Copy your **API Key** and **API Secret**
   - Note your **Cluster** (US1 or EU1)

2. **Configure in Dashboard**
   - Select "R-Series (eCom)" 
   - Enter your API Key and Secret
   - Choose your cluster
   - Click "Connect to Lightspeed"

### For Lightspeed X-Series (Retail)

1. **Generate Access Token**
   - Log into your Lightspeed Retail admin panel
   - Go to **Settings** → **API**
   - Generate a **Personal Token** or set up **OAuth**
   - Copy your **Access Token**
   - Note your **Domain Prefix** (from your store URL)

2. **Configure in Dashboard**
   - Select "X-Series (Retail)"
   - Enter your Domain Prefix
   - Enter your Access Token
   - Click "Connect to Lightspeed"

## 🎮 Try the Demo

Experience the dashboard with sample data:

1. Visit the homepage
2. Click **"Try Live Demo"**
3. Explore size filtering with clothing and shoe samples
4. Test search and filtering capabilities
5. View inventory stats and insights

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy with Vercel**
```bash
npm install -g vercel
vercel
```

3. **Set Environment Variables** (if needed)
- No server-side environment variables required
- All API credentials are stored client-side for security

### Deploy to Other Platforms

The dashboard is a static Next.js app and can be deployed to:
- **Netlify**: `npm run build && npm run export`
- **GitHub Pages**: Use Next.js static export
- **Your own server**: Build and serve the static files

## 🔒 Security & Privacy

### Data Security
- **Client-side Storage**: API credentials stored only in your browser
- **No Server Storage**: Credentials never touch our servers
- **Secure Transmission**: All API calls use HTTPS encryption
- **Local Processing**: All filtering and calculations happen in your browser

### Privacy
- **No Data Collection**: We don't collect or store your inventory data
- **No Analytics**: No tracking or usage analytics
- **Open Source**: Full transparency with open source code

## 🛠 Technical Details

### Built With
- **Next.js 15**: React framework with App Router
- **TypeScript**: Full type safety and developer experience
- **Tailwind CSS**: Utility-first styling for responsive design
- **Lucide React**: Beautiful, customizable icons
- **Framer Motion**: Smooth animations and transitions

### API Integration
- **RESTful Integration**: Standard HTTP requests to Lightspeed APIs
- **Rate Limiting**: Built-in rate limiting to respect API limits
- **Error Handling**: Comprehensive error handling and user feedback
- **Data Transformation**: Unified data model for both API versions

### Performance
- **Client-side Filtering**: Instant filtering without API calls
- **Lazy Loading**: Efficient loading of large inventories
- **Caching**: Smart caching of API responses
- **Responsive Design**: Optimized for mobile and desktop

## 📊 Features Deep Dive

### Size Selector Component
- **Category Tabs**: Separate views for all sizes, clothing, and shoes
- **Grid Layout**: Visual size selection grid
- **Quick Select**: Common sizes (S, M, L, XL) and (8, 9, 10, 11)
- **Search Integration**: Search within size results

### Inventory Cards
- **Visual Stock Indicators**: Color-coded stock status
- **Product Images**: Display product thumbnails when available
- **Stock Level Bars**: Visual representation of current stock
- **SKU/EAN Display**: Quick reference codes
- **Last Updated**: Track when inventory was last modified

### Advanced Filtering
- **Multi-select Filters**: Choose multiple sizes, categories, brands
- **Active Filter Display**: See all active filters with one-click removal
- **Filter Combinations**: Stack multiple filter types
- **Persistent State**: Filters remain active during session

### Inventory Statistics
- **Total Items**: Count of all inventory items
- **Total Value**: Combined value of all inventory
- **Low Stock Alerts**: Count of items below alert threshold
- **Out of Stock**: Count of items with zero inventory
- **Category Breakdown**: Distribution across categories

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m "Add amazing feature"`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [Lightspeed R-Series API Docs](https://developers.lightspeedhq.com/ecom/)
- [Lightspeed X-Series API Docs](https://x-series-api.lightspeedhq.com/)

### Issues & Questions
- Create an issue on GitHub for bugs or feature requests
- Check existing issues before creating new ones
- Provide detailed information about your setup and the issue

### Contact
- **Email**: [your-email@example.com](mailto:your-email@example.com)
- **GitHub**: [Your GitHub Profile](https://github.com/your-username)

## 🔄 Changelog

### v1.0.0 (Current)
- ✅ Initial release
- ✅ R-Series and X-Series API support
- ✅ Size-based filtering
- ✅ Advanced search and filtering
- ✅ Inventory statistics and insights
- ✅ Responsive design
- ✅ Demo mode with sample data

### Roadmap
- 🔄 Export functionality (CSV, Excel)
- 🔄 Email alerts for low stock
- 🔄 Inventory forecasting
- 🔄 Multi-store support
- 🔄 Mobile app version

## 📈 Usage Analytics

### Supported Business Types
- Small to medium retail stores
- Multi-location retailers
- Online + physical stores
- Fashion and footwear focused businesses

### Typical Use Cases
- Daily inventory checks
- Restocking decisions
- Size availability verification
- Stock level monitoring
- Purchase planning

---

**Made with ❤️ for retail businesses who need better inventory management**

Transform your Lightspeed experience today! 🚀
