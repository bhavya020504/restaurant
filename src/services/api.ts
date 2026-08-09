const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim() !== '' && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    let url = envUrl.trim().replace(/\/+$/, '');
    if (!url.endsWith('/api/v1')) {
      url = url.endsWith('/api') ? `${url}/v1` : `${url}/api/v1`;
    }
    return url;
  }
  // Use relative '/api/v1' path in production so Vercel same-origin reverse proxy routes server-to-server with zero CORS & zero extension blocks!
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api/v1';
  }
  return 'https://restaurant-3d54.onrender.com/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

async function request<T>(endpoint: string, options: RequestInit = {}, retries = 2): Promise<T> {
  const rawToken = localStorage.getItem('br_kitchen_access_token');
  const token = (rawToken && rawToken !== 'null' && rawToken !== 'undefined' && rawToken.trim() !== '') ? rawToken.trim() : null;

  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  let lastError: any = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const currentHeaders = { ...baseHeaders };
      if (token && attempt === 0) {
        currentHeaders['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        mode: 'cors',
        credentials: 'omit',
        ...options,
        headers: currentHeaders
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, 1000));
      }
    }
  }

  throw lastError || new Error('Network error: Unable to connect to backend server.');
}

export const ApiService = {
  // Foods / Menu Catalog
  getFoods: async (category?: string) => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return request<any[]>(`/foods/${query}`);
  },

  getFoodById: async (id: string) => {
    return request<any>(`/foods/${id}`);
  },

  // Customers
  getCustomers: async () => {
    return request<any[]>('/customers/');
  },

  // Orders
  getOrders: async (status?: string) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return request<any[]>(`/orders/${query}`);
  },

  createOrder: async (orderData: any) => {
    return request<any>('/orders/', {
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
    return request<any[]>(`/reservations/${query}`);
  },

  createReservation: async (resData: any) => {
    return request<any>('/reservations/', {
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
    return request<any[]>(`/complaints/${query}`);
  },

  createComplaint: async (complaintData: any) => {
    return request<any>('/complaints/', {
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
