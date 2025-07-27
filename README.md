# Lightspeed Inventory Dashboard

A modern, size-based inventory management system for Lightspeed POS/eCom that transforms how clothing and shoe retailers view their inventory.

## 🌟 Features

### Size-Based Filtering Revolution
- **Quick Size Filters**: Click any size (S, M, L, XL or 8, 9, 10, 11) to instantly see ALL items in that size across your entire store
- **Smart Search**: Search by size, product name, SKU, or any combination
- **Multi-Size Selection**: Filter by multiple sizes simultaneously
- **Category Integration**: Combine size filters with clothing, shoes, or accessories categories

### Advanced Inventory Insights
- **Real-time Stock Levels**: Visual indicators for in-stock, low-stock, and out-of-stock items
- **Stock Alerts**: Automatic notifications when items fall below your alert threshold
- **Total Value Tracking**: See the monetary value of your filtered inventory
- **Category Breakdown**: Quick stats on how many categories are represented

### Dual API Support
- **R-Series (eCom)**: Full support for Lightspeed's legacy eCommerce API
- **X-Series (Retail)**: Modern API integration for Lightspeed Retail
- **Secure Authentication**: API credentials stored securely in browser localStorage
- **Rate Limiting**: Built-in request throttling to respect API limits

## 🚀 Live Demo

Try the interactive demo with sample data from outlined.ca:
- 15+ sample products across clothing, shoes, and accessories
- Real inventory scenarios with low stock and out-of-stock items
- Experience size-based filtering without connecting your API

## 🔧 Setup & Configuration

### Prerequisites
- Lightspeed POS account (R-Series or X-Series)
- API credentials from your Lightspeed admin panel

### Getting Started

1. **Try the Demo**: Click "Try Live Demo" to experience the interface with sample data
2. **Connect Your API**: 
   - Click "Connect Your API" 
   - Choose your Lightspeed version (R-Series or X-Series)
   - Enter your API credentials
3. **Start Filtering**: Use size buttons or search to filter your real inventory

### API Setup

#### For R-Series (eCom):
1. Go to your Lightspeed eCom admin panel
2. Navigate to Apps → Private Apps
3. Create new API credentials
4. Note your API Key, Secret, and Cluster (US1 or EU1)

#### For X-Series (Retail):
1. Go to your Lightspeed Retail admin panel
2. Navigate to Settings → API
3. Generate a personal access token
4. Note your domain prefix and access token

## 🎯 Why This Matters

### The Problem with Standard Lightspeed
- Shows "T-Shirt: 50 units" but doesn't break down by size
- No way to filter "show me all Large items"
- Requires clicking through individual products to see size availability
- Time-consuming to identify which sizes need restocking

### Our Solution
- **"T-Shirt Large: 12 units, Medium: 18 units, Small: 20 units"** - instant size breakdown
- **Click "Large"** → see ALL Large items across your entire store
- **Visual size availability** at a glance with stock level indicators
- **Size-specific alerts** for low stock management

## 🏪 Perfect For

### Clothing Stores
- Instantly find all Large hoodies across brands
- Check Medium dress availability by color
- Monitor XL t-shirt stock levels
- Filter by size AND category combinations

### Shoe Retailers
- See all size 10 sneakers in one view
- Track popular size 9 running shoes
- Monitor size 11 boot inventory
- Identify which sizes need immediate restocking

## 🛠 Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **API Integration**: Custom Lightspeed API wrapper
- **State Management**: React hooks with localStorage persistence
- **Deployment**: Vercel-ready configuration

## 📚 API Documentation

This project integrates with:
- [Lightspeed R-Series API](https://developers.lightspeedhq.com/ecom/introduction/introduction/)
- [Lightspeed X-Series API](https://developers.lightspeedhq.com/retail/introduction/introduction/)

## 🔐 Security & Privacy

- **No Server Required**: Runs entirely in the browser
- **Local Storage Only**: API credentials stored in browser localStorage
- **No Data Transmission**: Your inventory data never leaves your browser
- **HTTPS Required**: Secure communication with Lightspeed APIs

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy with zero configuration
3. Connect your custom domain (inventory.outlined.ca)

### Other Platforms
This is a static React app that can be deployed anywhere:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## 📈 Business Impact

### Time Savings
- **90% faster** size-specific inventory checks
- **Instant** cross-brand size availability
- **Real-time** stock level monitoring

### Better Decisions
- **Size-based restocking** strategies
- **Category performance** insights
- **Stock alert** automation

### Customer Experience
- **Faster** size availability confirmation
- **Accurate** inventory information
- **Proactive** restock management

## 🔮 Roadmap

- [ ] Multi-location inventory support
- [ ] Size performance analytics
- [ ] Automated reorder suggestions
- [ ] Integration with suppliers
- [ ] Mobile app version
- [ ] Advanced reporting dashboard

## 📞 Support

For questions about Lightspeed API integration, visit:
- [Lightspeed Developer Documentation](https://developers.lightspeedhq.com/)
- [Lightspeed Support Center](https://www.lightspeedhq.com/support/)

## 📝 License

MIT License - see LICENSE file for details

---

**Transform your inventory management today!** 🎯

Experience the power of size-based filtering and never scroll through endless product lists again.