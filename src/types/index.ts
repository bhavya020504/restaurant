export type OrderStatus = 
  | 'Pending' 
  | 'Preparing' 
  | 'Cooking' 
  | 'Out For Delivery' 
  | 'Delivered' 
  | 'Cancelled';

export type ReservationStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Seated' 
  | 'Completed' 
  | 'Cancelled';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export type DeliveryMethod = 'Delivery' | 'Takeaway' | 'Dine-In';

export type PaymentMethod = 'Credit Card' | 'UPI / QR' | 'Cash on Delivery' | 'Apple Pay';

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  ingredients: string[];
  prepTimeMinutes: number;
  calories: number;
  isPopular?: boolean;
  isFeatured?: boolean;
  isVeg?: boolean;
  isSpicy?: boolean;
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  itemCount: number;
  image: string;
  description?: string;
}

export interface CartItem {
  food: FoodItem;
  quantity: number;
  selectedOptions?: string[];
  specialInstructions?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  savedAddresses: Address[];
  isVip?: boolean;
}

export interface Address {
  id: string;
  title: string;
  street: string;
  city: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  orderTime: string;
  estimatedDeliveryTime: string;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending';
  rating?: number;
  review?: string;
  reviewedAt?: string;
  deliveryBoy?: {
    name: string;
    phone: string;
    vehicleNumber: string;
    avatar: string;
  };
}

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  guestsCount: number;
  date: string;
  time: string;
  seatingPreference: 'Indoor' | 'Outdoor' | 'Private Room' | 'Window View';
  status: ReservationStatus;
  specialRequest?: string;
  createdAt: string;
  tableNumber?: string;
}

export interface CallLog {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  durationSeconds: number;
  status: 'Answered' | 'Missed' | 'Voicemail';
  recordingUrl?: string;
  transcriptSummary?: string;
}

export interface Recording {
  id: string;
  callId: string;
  customerName: string;
  date: string;
  duration: string;
  fileSize: string;
  audioUrl: string;
}

export interface Transcript {
  id: string;
  callId: string;
  customerName: string;
  date: string;
  dialogue: {
    speaker: 'Customer' | 'BR Kitchen Assistant' | 'Agent';
    timestamp: string;
    text: string;
  }[];
}

export interface CallSummary {
  id: string;
  callId: string;
  customerName: string;
  date: string;
  keyPoints: string[];
  sentiment: 'Positive' | 'Neutral' | 'Urgent' | 'Dissatisfied';
  actionRequired: string;
}

export interface Complaint {
  id: string;
  customerName: string;
  customerPhone: string;
  orderId?: string;
  issue: string;
  category: 'Late Delivery' | 'Food Quality' | 'Missing Item' | 'Wrong Order' | 'Billing';
  status: ComplaintStatus;
  priority: PriorityLevel;
  date: string;
  adminNotes?: string;
}

export interface WhatsAppLog {
  id: string;
  customerName: string;
  phone: string;
  message: string;
  direction: 'Outbound' | 'Inbound';
  status: 'Sent' | 'Delivered' | 'Read' | 'Failed';
  timestamp: string;
}

export interface EmailLog {
  id: string;
  customerName: string;
  email: string;
  emailType: 'Order Confirmation' | 'Reservation Alert' | 'Promotional' | 'Receipt';
  status: 'Sent' | 'Delivered' | 'Opened' | 'Bounced';
  sentTime: string;
}

export interface AnalyticsData {
  revenueTrend: { month: string; revenue: number; orders: number }[];
  categoryDistribution: { name: string; value: number }[];
  hourlyPeak: { hour: string; orders: number }[];
  customerGrowth: { month: string; newCustomers: number; returning: number }[];
}
