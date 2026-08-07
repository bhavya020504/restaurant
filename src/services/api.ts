const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('br_kitchen_access_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error ${response.status}`);
  }

  return response.json();
}

export const ApiService = {
  // Foods / Menu Catalog
  getFoods: async (category?: string) => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return request<any[]>(`/foods${query}`);
  },

  getFoodById: async (id: string) => {
    return request<any>(`/foods/${id}`);
  },

  // Customers
  getCustomers: async () => {
    return request<any[]>('/customers');
  },

  // Orders
  getOrders: async (status?: string) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return request<any[]>(`/orders${query}`);
  },

  createOrder: async (orderData: any) => {
    return request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    return request<any>(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  addOrderReview: async (orderId: string, rating: number, review: string) => {
    return request<any>(`/orders/${orderId}/review`, {
      method: 'POST',
      body: JSON.stringify({ rating, review })
    });
  },

  // Reservations
  getReservations: async (status?: string) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return request<any[]>(`/reservations${query}`);
  },

  createReservation: async (resData: any) => {
    return request<any>('/reservations', {
      method: 'POST',
      body: JSON.stringify(resData)
    });
  },

  updateReservationStatus: async (resId: string, status: string) => {
    return request<any>(`/reservations/${resId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  // Complaints
  getComplaints: async (status?: string) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return request<any[]>(`/complaints${query}`);
  },

  createComplaint: async (complaintData: any) => {
    return request<any>('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData)
    });
  },

  updateComplaintStatus: async (complaintId: string, status: string) => {
    return request<any>(`/complaints/${complaintId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  // Admin & Analytics
  getAdminDashboard: async () => {
    return request<any>('/admin/dashboard');
  },

  getAnalytics: async () => {
    return request<any>('/admin/analytics');
  },

  // Authentication
  register: async (userData: { name: string; email: string; phone: string; password?: string }) => {
    const data = await request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        ...userData,
        password: userData.password || 'defaultPassword123'
      })
    });
    if (data.access_token) {
      localStorage.setItem('br_kitchen_access_token', data.access_token);
    }
    return data;
  },

  login: async (email: string, password?: string) => {
    const data = await request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password: password || 'defaultPassword123'
      })
    });
    if (data.access_token) {
      localStorage.setItem('br_kitchen_access_token', data.access_token);
    }
    return data;
  },

  getMe: async () => {
    return request<any>('/auth/me');
  }
};
