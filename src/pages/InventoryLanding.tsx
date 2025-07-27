import { useState, useEffect } from 'react';
import { Package, Zap, Filter, BarChart3, Shield, ArrowRight, Play, CheckCircle, Star, TrendingUp, Users, Clock } from 'lucide-react';
import { DemoInventoryDashboard } from '@/components/inventory/demo-data';
import { ApiSetup } from '@/components/inventory/api-setup';
import { InventoryDashboard } from '@/components/inventory/inventory-dashboard';
import { LightspeedCredentials } from '@/types/lightspeed';
import { CredentialManager } from '@/lib/credential-manager';

type PageState = 'landing' | 'demo' | 'setup' | 'dashboard';

export default function InventoryLanding() {
  const [pageState, setPageState] = useState<PageState>('landing');
  const [credentials, setCredentials] = useState<LightspeedCredentials | null>(null);

  // Load saved credentials on mount
  useEffect(() => {
    const savedCredentials = CredentialManager.loadCredentials();
    if (savedCredentials) {
      setCredentials(savedCredentials);
      setPageState('dashboard');
    }
  }, []);

  const handleCredentialsSubmit = (newCredentials: LightspeedCredentials) => {
    setCredentials(newCredentials);
    setPageState('dashboard');
  };

  const handleDisconnect = () => {
    CredentialManager.clearCredentials();
    setCredentials(null);
    setPageState('landing');
  };

  const onStartDemo = () => {
    setPageState('setup');
  };

  const startGuide = () => {
    // Placeholder for guided tour logic
    alert('Guided tour not yet implemented!');
  };

  if (pageState === 'demo') {
    return <DemoInventoryDashboard onStartDemo={() => setPageState('setup')} />;
  }

  if (pageState === 'setup') {
    return <ApiSetup onCredentialsSubmit={handleCredentialsSubmit} />;
  }

  if (pageState === 'dashboard' && credentials) {
    return (
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleDisconnect}
            className="bg-card/80 backdrop-blur-sm shadow-lg border border-border rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-card hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
          >
            Disconnect API
          </button>
        </div>
        <InventoryDashboard credentials={credentials} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 shadow-2xl hover-glow">
              <Package className="h-16 w-16 text-primary-foreground" />
            </div>
          </div>
          
          {/* Enhanced heading with better typography */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Lightspeed Inventory
            <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            Unlock the power of <span className="font-semibold text-primary">size-based inventory filtering</span> for your clothing and shoe business. 
            Finally see your inventory the way you need it - by sizes, not just products.
          </p>
          
          {/* Enhanced CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button
              onClick={() => setPageState('demo')}
              className="group bg-gradient-to-r from-primary to-secondary text-primary-foreground px-10 py-5 rounded-2xl font-semibold hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 flex items-center justify-center space-x-3 text-lg shadow-xl hover:shadow-2xl hover:scale-105 btn-ripple"
            >
              <Zap className="h-6 w-6 group-hover:animate-bounce" />
              <span>Try Live Demo</span>
            </button>
            <button
              onClick={() => setPageState('setup')}
              className="group bg-card text-primary border-2 border-primary px-10 py-5 rounded-2xl font-semibold hover:bg-primary/10 transition-all duration-300 flex items-center justify-center space-x-3 text-lg shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>Connect Your API</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground mb-16">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Secure API Integration</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Real-time Updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Zero Setup Required</span>
            </div>
          </div>
        </div>

        {/* Enhanced Demo Banner */}
        <div className="glass-card rounded-2xl p-8 mb-16 border-2 border-primary/20 hover-lift">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-green-500 rounded-full p-2">
                  <Play className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">🎯 Live Demo Experience</h2>
              </div>
              <p className="text-muted-foreground mb-6 text-lg">
                Experience the power of size-based inventory filtering with our sample data. 
                Connect your real Lightspeed API to get started with your actual inventory.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { number: "15+", label: "Sample Items", icon: Package },
                  { number: "3", label: "Categories", icon: Filter },
                  { number: "8", label: "Different Sizes", icon: BarChart3 },
                  { number: "$1.2K", label: "Demo Value", icon: TrendingUp }
                ].map((stat, index) => (
                  <div key={index} className="bg-card/80 backdrop-blur-sm rounded-xl p-4 text-center border border-border hover:border-primary/30 transition-all duration-200">
                    <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="font-bold text-xl text-foreground">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <button
                onClick={onStartDemo}
                className="bg-gradient-to-r from-green-500 to-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-primary/90 transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl"
              >
                <Play className="h-5 w-5" />
                <span>Connect Real API</span>
              </button>
              <button
                onClick={startGuide}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-foreground px-8 py-4 rounded-xl font-semibold hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 text-sm shadow-lg hover:shadow-xl"
              >
                🎯 Start Guided Tour
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Built for <span className="text-gradient">Retail Excellence</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform your inventory management with features designed specifically for modern retail businesses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Filter,
                title: "Size-Based Filtering",
                description: "Instantly filter your entire inventory by clothing sizes (S, M, L, XL) or shoe sizes (6, 7, 8, 9, 10, 11, 12+). No more scrolling through endless product lists.",
                color: "from-primary to-primary/70"
              },
              {
                icon: BarChart3,
                title: "Smart Inventory Insights",
                description: "Track low stock alerts, out-of-stock items, and total inventory value. Get visual indicators for items that need restocking.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Shield,
                title: "Secure API Integration",
                description: "Works with both Lightspeed R-Series (eCom) and X-Series (Retail) APIs. Your credentials are stored securely in your browser only.",
                color: "from-secondary to-secondary/70"
              }
            ].map((feature, index) => (
              <div key={index} className="card-elevated rounded-2xl p-8 text-center group hover-lift">
                <div className={`bg-gradient-to-br ${feature.color} rounded-2xl p-4 w-20 h-20 mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <feature.icon className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Use Cases */}
        <div className="mt-32">
          <h2 className="text-4xl font-bold text-center text-foreground mb-16">
            Perfect For Your Business
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl text-primary-foreground p-10 shadow-2xl hover-lift">
              <div className="flex items-center space-x-3 mb-6">
                <div className="text-4xl">👕</div>
                <h3 className="text-3xl font-bold">Clothing Stores</h3>
              </div>
              <ul className="space-y-3 text-primary-foreground/90">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 mt-0.5 text-primary-foreground/70" />
                  <span>Quickly find all Large t-shirts across brands</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 mt-0.5 text-primary-foreground/70" />
                  <span>Check Medium dress availability instantly</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 mt-0.5 text-primary-foreground/70" />
                  <span>Monitor XL hoodie stock levels</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 mt-0.5 text-primary-foreground/70" />
                  <span>Filter by size AND color combinations</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl text-secondary-foreground p-10 shadow-2xl hover-lift">
              <div className="flex items-center space-x-3 mb-6">
                <div className="text-4xl">👟</div>
                <h3 className="text-3xl font-bold">Shoe Retailers</h3>
              </div>
              <ul className="space-y-3 text-secondary-foreground/90">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 mt-0.5 text-secondary-foreground/70" />
                  <span>See all size 10 sneakers in one view</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 mt-0.5 text-secondary-foreground/70" />
                  <span>Track popular size 9 running shoes</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 mt-0.5 text-secondary-foreground/70" />
                  <span>Monitor size 11 boot inventory</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 mt-0.5 text-secondary-foreground/70" />
                  <span>Identify which sizes need restocking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Enhanced Problem/Solution */}
        <div className="mt-32 glass-card rounded-3xl p-12 border-2 border-border/50">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Why Standard Lightspeed Falls Short
            </h2>
            <p className="text-xl text-muted-foreground">
              Lightspeed shows you products, but not the size breakdown you actually need for retail decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-destructive/10 rounded-full p-2">
                  <Clock className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="text-2xl font-semibold text-destructive">Before: Time-Consuming Process</h3>
              </div>
              <ul className="space-y-4">
                {[
                  '"T-Shirt" shows as 1 product with 50 units',
                  'Can\'t see size breakdown without clicking each item',
                  'No way to filter "show me all Large items"',
                  'Difficult to identify which sizes are running low',
                  'Time-consuming to check size-specific availability'
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="bg-destructive/10 rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-green-500/10 rounded-full p-2">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold text-green-600">After: Instant Intelligence</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'See "T-Shirt Large: 12 units, Medium: 18 units" instantly',
                  'Click "Large" to see ALL Large items across your store',
                  'Size-specific low stock alerts',
                  'Visual size availability at a glance',
                  'Make informed restocking decisions quickly'
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="bg-green-500/10 rounded-full p-1 mt-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Enhanced CTA */}
        <div className="mt-32 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            Ready to Transform Your <span className="text-gradient">Inventory Management</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Try the demo with sample data or connect your Lightspeed API to get started immediately.
            No setup required, just instant insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => setPageState('demo')}
              className="group bg-gradient-to-r from-primary to-secondary text-primary-foreground px-12 py-6 rounded-2xl font-semibold hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 flex items-center justify-center space-x-3 text-xl shadow-2xl hover:shadow-3xl hover:scale-105 btn-ripple"
            >
              <Zap className="h-6 w-6 group-hover:animate-bounce" />
              <span>Try Live Demo</span>
            </button>
            <button
              onClick={() => setPageState('setup')}
              className="group bg-card text-primary border-2 border-primary px-12 py-6 rounded-2xl font-semibold hover:bg-primary/10 transition-all duration-300 flex items-center justify-center space-x-3 text-xl shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <span>Connect Your API</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}