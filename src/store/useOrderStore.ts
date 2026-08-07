import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, OrderStatus, CartItem, PaymentMethod } from '../types';

interface OrderState {
  orders: Order[];
  activeOrder: Order | null;
  createOrder: (data: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryAddress: string;
    paymentMethod: PaymentMethod;
    items: CartItem[];
    subtotal: number;
    tax: number;
    deliveryFee: number;
    totalAmount: number;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  setActiveOrder: (order: Order | null) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      activeOrder: null,

      createOrder: (data) => {
        const orderId = `BR-${Math.floor(1000 + Math.random() * 9000)}`;
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateString = now.toISOString().split('T')[0];

        const estDelivery = new Date(now.getTime() + 35 * 60000).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });

        const newOrder: Order = {
          id: orderId,
          customerName: data.customerName || 'Customer',
          customerPhone: data.customerPhone || '—',
          customerEmail: data.customerEmail || '—',
          items: data.items,
          subtotal: data.subtotal,
          tax: data.tax,
          deliveryFee: data.deliveryFee,
          discount: 0,
          totalAmount: data.totalAmount,
          status: 'Preparing',
          orderDate: dateString,
          orderTime: timeString,
          estimatedDeliveryTime: estDelivery,
          deliveryAddress: data.deliveryAddress || 'No address available',
          paymentMethod: data.paymentMethod,
          paymentStatus: 'Pending'
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
          activeOrder: newOrder
        }));

        return newOrder;
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => {
          const updatedOrders = state.orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          );
          const updatedActive =
            state.activeOrder && state.activeOrder.id === orderId
              ? { ...state.activeOrder, status }
              : state.activeOrder;
          return { orders: updatedOrders, activeOrder: updatedActive };
        });
      },

      getOrderById: (orderId) => {
        return get().orders.find((o) => o.id === orderId || o.id.toLowerCase() === orderId.toLowerCase());
      },

      setActiveOrder: (order) => set({ activeOrder: order })
    }),
    {
      name: 'br-kitchen-orders-storage'
    }
  )
);
