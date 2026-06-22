const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function normalizeToken(token: string): string {
  return token.replace(/^Bearer\s+/i, "").trim();
}

function getAuthJsonHeaders(
  token: string,
  includeContentType: boolean = false,
): HeadersInit {
  const normalizedToken = normalizeToken(token);

  const headers: Record<string, string> = {
    Authorization: `Bearer ${normalizedToken}`,
    Accept: "application/json",
  };

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

// ============ AUTHENTICATION ============
export async function registerUser(data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
}) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    mode: "cors",
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Register response error:", response.status, text);
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  try {
    return await response.json();
  } catch (e) {
    const text = await response.text();
    console.error("Failed to parse JSON:", text);
    throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
  }
}

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    mode: "cors",
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Login response error:", response.status, text);
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  try {
    return await response.json();
  } catch (e) {
    const text = await response.text();
    console.error("Failed to parse JSON:", text);
    throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
  }
}

export async function logoutUser(token: string) {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function getCurrentUser(token: string) {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}

// ============ PRODUCTS ============
export async function getProducts(params?: {
  page?: number;
  per_page?: number;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  search?: string;
  sort?: string;
  order?: string;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", params.page.toString());
  if (params?.per_page) query.append("per_page", params.per_page.toString());
  if (params?.category_id)
    query.append("category_id", params.category_id.toString());
  if (params?.min_price) query.append("min_price", params.min_price.toString());
  if (params?.max_price) query.append("max_price", params.max_price.toString());
  if (params?.search) query.append("search", params.search);
  if (params?.sort) query.append("sort", params.sort);
  if (params?.order) query.append("order", params.order);

  const response = await fetch(`${API_URL}/products?${query.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    mode: "cors",
  });

  console.log("Products fetch status:", response.status);

  if (!response.ok) {
    const text = await response.text();
    console.error("Products fetch error:", response.status, text);
    return { success: false, data: [], error: `HTTP ${response.status}` };
  }

  try {
    const data = await response.json();
    console.log("Products fetched successfully, count:", data.data?.length || 0);
    return data;
  } catch (e) {
    console.error("Failed to parse products JSON:", e);
    return { success: false, data: [], error: "JSON parse error" };
  }
}

export async function getProduct(id: string | number) {
  const response = await fetch(`${API_URL}/products/${id}`);
  return response.json();
}

export async function getFeaturedProducts() {
  const response = await fetch(`${API_URL}/products/featured`);
  return response.json();
}

export async function getRelatedProducts(productId: string | number) {
  const response = await fetch(`${API_URL}/products/${productId}/related`);
  return response.json();
}

// ============ CATEGORIES ============
export async function getCategories() {
  const response = await fetch(`${API_URL}/categories`);
  return response.json();
}

export async function getCategory(id: string | number) {
  const response = await fetch(`${API_URL}/categories/${id}`);
  return response.json();
}

// ============ REVIEWS ============
export async function getProductReviews(productId: string | number) {
  const response = await fetch(`${API_URL}/products/${productId}/reviews`);
  return response.json();
}

export async function createReview(
  token: string,
  productId: string | number,
  data: {
    rating: number;
    title: string;
    comment: string;
  },
) {
  const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

// ============ WISHLIST ============
export async function getWishlist(token: string) {
  const response = await fetch(`${API_URL}/wishlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}

export async function addToWishlist(token: string, productId: string | number) {
  const response = await fetch(`${API_URL}/wishlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product_id: productId }),
  });
  return response.json();
}

export async function removeFromWishlist(
  token: string,
  wishlistId: string | number,
) {
  const response = await fetch(`${API_URL}/wishlist/${wishlistId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}

// ============ ORDERS ============
export async function getUserOrders(token: string) {
  const response = await fetch(`${API_URL}/user/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}

export async function getOrderDetails(token: string, orderId: string | number) {
  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}

export async function createOrder(
  token: string,
  data: {
    items: Array<{ product_id: number; quantity: number }>;
    shipping_address_id?: number;
    billing_address_id?: number;
    payment_method: string;
    notes?: string;
  },
) {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

// ============ USER ============
export async function getUserProfile(token: string) {
  const response = await fetch(`${API_URL}/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}

export async function updateUserProfile(
  token: string,
  data: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    email?: string;
  },
) {
  const response = await fetch(`${API_URL}/user/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

// ============ BLOG ============
export async function getBlogPosts(page?: number) {
  const query = page ? `?page=${page}` : "";
  const response = await fetch(`${API_URL}/blog${query}`);
  return response.json();
}

export async function getBlogPost(id: string | number) {
  const response = await fetch(`${API_URL}/blog/${id}`);
  return response.json();
}

// ============ ADMIN ============
export async function getAdminStats(token: string) {
  const response = await fetch(`${API_URL}/admin/dashboard/stats`, {
    headers: getAuthJsonHeaders(token),
  });
  return response.json();
}

// ============ ADMIN PRODUCTS ============
export async function getAdminProducts(token: string, page?: number) {
  const query = page ? `?page=${page}` : "";
  const response = await fetch(`${API_URL}/admin/products${query}`, {
    headers: getAuthJsonHeaders(token),
    mode: "cors",
  });
  return response.json();
}

export async function createProduct(
  token: string,
  data: {
    name: string;
    slug: string;
    price: number;
    category_id: number;
    material?: string;
    color?: string;
    description?: string;
    short_description?: string;
    quantity?: number;
    featured_image?: string;
    rating?: number;
    sku?: string;
    original_price?: number;
    cost_price?: number;
    dimensions?: string;
    weight?: number;
    is_active?: boolean;
    is_featured?: boolean;
    is_new?: boolean;
  },
) {
  try {
    if (!token?.trim()) {
      throw new Error("Missing auth token. Please log in again.");
    }

    const response = await fetch(`${API_URL}/admin/products`, {
      method: "POST",
      headers: getAuthJsonHeaders(token, true),
      body: JSON.stringify(data),
      mode: "cors",
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`Create product error - Status ${response.status}:`, text);
      throw new Error(`HTTP ${response.status}: ${text.substring(0, 100)}`);
    }

    try {
      return await response.json();
    } catch (e) {
      const text = await response.text();
      console.error("Failed to parse JSON:", text);
      throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
    }
  } catch (error: any) {
    console.error("Create product error:", error);
    return {
      success: false,
      message: error.message || "Failed to create product",
    };
  }
}

export async function updateProduct(
  token: string,
  productId: string | number,
  data: Partial<{
    name: string;
    slug: string;
    price: number;
    category_id: number;
    material?: string;
    color?: string;
    description?: string;
    short_description?: string;
    quantity?: number;
    rating?: number;
    sku?: string;
    original_price?: number;
    cost_price?: number;
    dimensions?: string;
    weight?: number;
    is_active?: boolean;
    is_featured?: boolean;
    is_new?: boolean;
  }>,
) {
  const response = await fetch(`${API_URL}/admin/products/${productId}`, {
    method: "PUT",
    headers: getAuthJsonHeaders(token, true),
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteProduct(token: string, productId: string | number) {
  try {
    const response = await fetch(`${API_URL}/admin/products/${productId}`, {
      method: "DELETE",
      headers: getAuthJsonHeaders(token),
      mode: "cors",
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`Delete error - Status ${response.status}:`, text);
      throw new Error(`HTTP ${response.status}: ${text.substring(0, 100)}`);
    }

    try {
      return await response.json();
    } catch (e) {
      const text = await response.text();
      console.error("Failed to parse JSON:", text);
      throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
    }
  } catch (error: any) {
    console.error("Delete product error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete product",
    };
  }
}

// ============ ADMIN ORDERS ============
export async function getAdminOrders(token: string, page?: number) {
  const query = page ? `?page=${page}` : "";
  const response = await fetch(`${API_URL}/admin/orders${query}`, {
    headers: getAuthJsonHeaders(token),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}
