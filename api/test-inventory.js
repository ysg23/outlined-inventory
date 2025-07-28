export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Mock inventory data for testing
  const mockInventory = {
    items: [
      {
        id: "1",
        title: "Classic Cotton T-Shirt",
        description: "100% cotton comfortable t-shirt",
        price: 19.99,
        quantity: 45,
        size: "Medium",
        category: "Shirts & Tops",
        brand: "Classic",
        sku: "CT-M-001",
        imageUrl: null,
        inStock: true
      },
      {
        id: "2", 
        title: "Denim Jeans",
        description: "Premium quality denim jeans",
        price: 59.99,
        quantity: 23,
        size: "32x32",
        category: "Pants & Bottoms", 
        brand: "Denim Co",
        sku: "DJ-32-001",
        imageUrl: null,
        inStock: true
      },
      {
        id: "3",
        title: "Running Shoes",
        description: "Comfortable athletic running shoes",
        price: 89.99,
        quantity: 0,
        size: "Size 10",
        category: "Footwear",
        brand: "Athletic",
        sku: "RS-10-001", 
        imageUrl: null,
        inStock: false
      },
      {
        id: "4",
        title: "Winter Jacket",
        description: "Warm winter jacket with hood",
        price: 129.99,
        quantity: 8,
        size: "Large",
        category: "Outerwear",
        brand: "WinterWear",
        sku: "WJ-L-001",
        imageUrl: null,
        inStock: true
      }
    ]
  };

  const mockStats = {
    totalItems: 76,
    totalValue: 8543.21,
    lowStockCount: 3,
    outOfStockCount: 1,
    categories: ["Shirts & Tops", "Pants & Bottoms", "Footwear", "Outerwear"]
  };

  if (req.url.includes('/stats')) {
    res.status(200).json(mockStats);
  } else {
    res.status(200).json(mockInventory);
  }
}