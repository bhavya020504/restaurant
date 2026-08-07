import { 
  FoodItem, 
  Category, 
  Order, 
  Customer, 
  Reservation, 
  CallLog, 
  Recording, 
  Transcript, 
  CallSummary, 
  Complaint, 
  WhatsAppLog, 
  EmailLog, 
  AnalyticsData 
} from '../types';

export const RESTAURANT_INFO = {
  name: 'BR KITCHEN',
  tagline: 'Artisanal Gourmet & Smart Dining Platform',
  phone: '+1 (800) 555-BRKT',
  whatsapp: '+1 (800) 555-9287',
  email: 'concierge@brkitchen.com',
  address: '742 Evergreen Terrace, Culinary District, CA 90210',
  operatingHours: '10:00 AM - 11:00 PM Daily',
  rating: 4.9,
  totalReviews: 2480,
};

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Chef Specials',
    iconName: 'Sparkles',
    itemCount: 8,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: 'Signature dishes crafted by Executive Chef Marcus'
  },
  {
    id: 'cat-2',
    name: 'Artisan Burgers',
    iconName: 'Beef',
    itemCount: 12,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    description: '100% Wagyu & Angus beef burgers with custom sauces'
  },
  {
    id: 'cat-3',
    name: 'Woodfired Pizza',
    iconName: 'Pizza',
    itemCount: 10,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    description: 'Neapolitan sourdough pizzas baked at 900°F'
  },
  {
    id: 'cat-4',
    name: 'Pasta & Risotto',
    iconName: 'UtensilsCrossed',
    itemCount: 9,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
    description: 'Hand-rolled fresh pasta with authentic Italian herbs'
  },
  {
    id: 'cat-5',
    name: 'Sushi & Asian',
    iconName: 'Fish',
    itemCount: 14,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
    description: 'Fresh sashimis, specialty sushi rolls, and dim sum'
  },
  {
    id: 'cat-6',
    name: 'Desserts & Shakes',
    iconName: 'Cake',
    itemCount: 7,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    description: 'Indulgent gourmet pastries, lava cakes & craft shakes'
  }
];

export const MOCK_FOODS: FoodItem[] = [
  {
    id: 'food-1',
    name: 'Truffle Wagyu Reserve Burger',
    category: 'Artisan Burgers',
    price: 24.99,
    rating: 4.9,
    reviewCount: 312,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    description: 'Aged A5 Wagyu patty layered with black truffle aioli, aged Gruyère cheese, caramelized shallots, and organic arugula served on a toasted brioche bun.',
    ingredients: ['Wagyu Beef Patty', 'Black Truffle Aioli', 'Aged Gruyère', 'Caramelized Shallots', 'Wild Arugula', 'Brioche Bun'],
    prepTimeMinutes: 18,
    calories: 840,
    isPopular: true,
    isFeatured: true,
    isVeg: false,
    isSpicy: false,
    inStock: true
  },
  {
    id: 'food-2',
    name: 'Smoked Burrata Margherita Pizza',
    category: 'Woodfired Pizza',
    price: 19.50,
    rating: 4.8,
    reviewCount: 240,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    description: 'Hand-stretched sourdough, San Marzano tomato reduction, fresh smoked burrata heart, Genovese basil oil, and toasted pine nuts.',
    ingredients: ['Sourdough Crust', 'San Marzano Tomatoes', 'Fresh Burrata', 'Genovese Basil', 'Extra Virgin Olive Oil'],
    prepTimeMinutes: 15,
    calories: 680,
    isPopular: true,
    isFeatured: true,
    isVeg: true,
    isSpicy: false,
    inStock: true
  },
  {
    id: 'food-3',
    name: 'Pan-Seared Chilean Sea Bass',
    category: 'Chef Specials',
    price: 34.00,
    rating: 5.0,
    reviewCount: 185,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    description: 'Sustainably caught Chilean sea bass pan-seared with saffron beurre blanc, saffron lemon butter, roasted asparagus, and potato puree.',
    ingredients: ['Chilean Sea Bass', 'Saffron Butter', 'Young Asparagus', 'Yukon Gold Mash', 'Microgreens'],
    prepTimeMinutes: 22,
    calories: 590,
    isPopular: false,
    isFeatured: true,
    isVeg: false,
    isSpicy: false,
    inStock: true
  },
  {
    id: 'food-4',
    name: 'Wild Mushroom Truffle Tagliatelle',
    category: 'Pasta & Risotto',
    price: 22.00,
    rating: 4.7,
    reviewCount: 198,
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6288337?auto=format&fit=crop&w=800&q=80',
    description: 'Fresh egg tagliatelle tossed in parmigiano reggiano cream, porcini mushroom reduction, white truffle essence, and fresh thyme.',
    ingredients: ['Handmade Tagliatelle', 'Porcini Mushrooms', 'Parmigiano Reggiano', 'White Truffle Oil', 'Fresh Thyme'],
    prepTimeMinutes: 16,
    calories: 720,
    isPopular: true,
    isFeatured: false,
    isVeg: true,
    isSpicy: false,
    inStock: true
  },
  {
    id: 'food-5',
    name: 'Dragon Flame Roll (8pcs)',
    category: 'Sushi & Asian',
    price: 21.50,
    rating: 4.9,
    reviewCount: 275,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    description: 'Tempura prawn and cucumber roll topped with flame-torched spicy salmon, unagi glaze, spicy mayo, and tobiko caviar.',
    ingredients: ['Tiger Prawn Tempura', 'Spicy Salmon', 'Sushi Rice', 'Unagi Sauce', 'Tobiko Caviar'],
    prepTimeMinutes: 14,
    calories: 510,
    isPopular: true,
    isFeatured: true,
    isVeg: false,
    isSpicy: true,
    inStock: true
  },
  {
    id: 'food-6',
    name: 'Valrhona Chocolate Lava Cake',
    category: 'Desserts & Shakes',
    price: 13.50,
    rating: 4.9,
    reviewCount: 410,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    description: 'Warm French Valrhona dark chocolate cake with a molten chocolate center, served with Tahitian vanilla bean gelato and berry coulis.',
    ingredients: ['Valrhona Dark Chocolate', 'Tahitian Vanilla Gelato', 'Organic Berries', 'Mint Leaves'],
    prepTimeMinutes: 12,
    calories: 540,
    isPopular: true,
    isFeatured: false,
    isVeg: true,
    isSpicy: false,
    inStock: true
  },
  {
    id: 'food-7',
    name: 'Fiery Peri-Peri Roasted Chicken',
    category: 'Chef Specials',
    price: 26.00,
    rating: 4.6,
    reviewCount: 160,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
    description: 'Half farm-raised organic chicken marinated in 24-hour peri-peri pepper rub, flame-roasted and served with Cajun wedges and citrus dip.',
    ingredients: ['Organic Chicken', 'Birdseye Chili Marinade', 'Cajun Potato Wedges', 'Citrus Garlic Aioli'],
    prepTimeMinutes: 25,
    calories: 790,
    isPopular: false,
    isFeatured: false,
    isVeg: false,
    isSpicy: true,
    inStock: true
  },
  {
    id: 'food-8',
    name: 'Matcha Pistachio Thick Shake',
    category: 'Desserts & Shakes',
    price: 9.50,
    rating: 4.8,
    reviewCount: 125,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    description: 'Ceremonial Japanese Uji matcha blended with crushed Sicilian pistachios, artisan vanilla cream, and honey swirl.',
    ingredients: ['Uji Matcha', 'Sicilian Pistachios', 'Whole Milk', 'Vanilla Ice Cream'],
    prepTimeMinutes: 5,
    calories: 410,
    isPopular: false,
    isFeatured: false,
    isVeg: true,
    isSpicy: false,
    inStock: true
  }
];

// All Customer Data Arrays are set to Empty [] for backend integration readiness
export const MOCK_ORDERS: Order[] = [];
export const MOCK_CUSTOMERS: Customer[] = [];
export const MOCK_RESERVATIONS: Reservation[] = [];
export const MOCK_CALL_LOGS: CallLog[] = [];
export const MOCK_RECORDINGS: Recording[] = [];
export const MOCK_TRANSCRIPTS: Transcript[] = [];
export const MOCK_SUMMARIES: CallSummary[] = [];
export const MOCK_COMPLAINTS: Complaint[] = [];
export const MOCK_WHATSAPP_LOGS: WhatsAppLog[] = [];
export const MOCK_EMAIL_LOGS: EmailLog[] = [];

export const MOCK_ANALYTICS: AnalyticsData = {
  revenueTrend: [
    { month: 'Jan', revenue: 0, orders: 0 },
    { month: 'Feb', revenue: 0, orders: 0 },
    { month: 'Mar', revenue: 0, orders: 0 },
    { month: 'Apr', revenue: 0, orders: 0 },
    { month: 'May', revenue: 0, orders: 0 },
    { month: 'Jun', revenue: 0, orders: 0 },
    { month: 'Jul', revenue: 0, orders: 0 }
  ],
  categoryDistribution: [
    { name: 'Artisan Burgers', value: 35 },
    { name: 'Woodfired Pizza', value: 25 },
    { name: 'Chef Specials', value: 20 },
    { name: 'Sushi & Asian', value: 12 },
    { name: 'Desserts & Shakes', value: 8 }
  ],
  hourlyPeak: [
    { hour: '11 AM', orders: 0 },
    { hour: '12 PM', orders: 0 },
    { hour: '1 PM', orders: 0 },
    { hour: '2 PM', orders: 0 },
    { hour: '6 PM', orders: 0 },
    { hour: '7 PM', orders: 0 },
    { hour: '8 PM', orders: 0 },
    { hour: '9 PM', orders: 0 },
    { hour: '10 PM', orders: 0 }
  ],
  customerGrowth: [
    { month: 'Mar', newCustomers: 0, returning: 0 },
    { month: 'Apr', newCustomers: 0, returning: 0 },
    { month: 'May', newCustomers: 0, returning: 0 },
    { month: 'Jun', newCustomers: 0, returning: 0 },
    { month: 'Jul', newCustomers: 0, returning: 0 }
  ]
};
