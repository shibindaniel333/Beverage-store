import SERVER_URL from "./serviceURL";
import commonAPI from  "./commonAPI";

export const registerAPI=async(reqBody)=>{
    return await commonAPI("POST",`${SERVER_URL}/register`,reqBody)
}

export const loginAPI=async(reqBody)=>{
    return await commonAPI("POST",`${SERVER_URL}/login`,reqBody)
}

// Product Management APIs
export const createProductAPI = async (reqBody) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return { status: 401, data: { message: 'No token provided' } };

        const reqHeader = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        };

        // Validate required fields
        const requiredFields = ['name', 'price', 'description', 'category', 'stock'];
        for (const field of requiredFields) {
            if (!reqBody.get(field)) {
                throw new Error(`${field} is required`);
            }
        }

        // Validate nutrition data
        const nutritionFields = ['calories', 'sugar', 'caffeine', 'serving'];
        for (const field of nutritionFields) {
            if (!reqBody.get(`nutrition.${field}`)) {
                throw new Error('All nutrition information is required');
            }
        }

        // Handle image
        if (!reqBody.get('image')) {
            throw new Error('Product image is required');
        }

        const response = await commonAPI("POST", `${SERVER_URL}/add-product`, reqBody, reqHeader);
        
        if (response.response && response.response.status >= 400) {
            throw new Error(response.response.data?.message || 'Server error');
        }
        return response;
    } catch (error) {
        console.error('Error in createProductAPI:', error);
        return { status: 400, data: { message: error.message || 'Failed to create product' } };
    }
};

export const getAllProductsAPI = async () => {
    const token = localStorage.getItem('token');
    if (!token) return { status: 401, data: { message: 'No token provided' } };

    const reqHeader = {
        "Authorization": `Bearer ${token}`
    };
    return await commonAPI("GET", `${SERVER_URL}/products`, "", reqHeader);
};

export const getProductByIdAPI = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return { status: 401, data: { message: 'No token provided' } };

    const reqHeader = {
        "Authorization": `Bearer ${token}`
    };
    return await commonAPI("GET", `${SERVER_URL}/products/${id}`, "", reqHeader);
};

export const updateProductAPI = async (id, reqBody) => {
    const token = localStorage.getItem('token');
    if (!token) return { status: 401, data: { message: 'No token provided' } };

    const reqHeader = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
    };
    return await commonAPI("PUT", `${SERVER_URL}/update-product/${id}`, reqBody, reqHeader);
};

export const deleteProductAPI = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return { status: 401, data: { message: 'No token provided' } };

    const reqHeader = {
        "Authorization": `Bearer ${token}`
    };
    return await commonAPI("DELETE", `${SERVER_URL}/delete-product/${id}`, "", reqHeader);
};



// Cart Management APIs
export const addToCartAPI = async (reqBody) => {
    const token = localStorage.getItem('token');
    if (!token) return { status: 401, data: { message: 'No token provided' } };

    const reqHeader = {
        "Authorization": `Bearer ${token}`
    };
    return await commonAPI("POST", `${SERVER_URL}/cart/add`, reqBody, reqHeader);
};

export const getCartItemsAPI = async () => {
    const token = localStorage.getItem('token');
    if (!token) return { status: 401, data: { message: 'No token provided' } };

    const reqHeader = {
        "Authorization": `Bearer ${token}`
    };
    return await commonAPI("GET", `${SERVER_URL}/cart`, "", reqHeader);
};

export const updateCartItemAPI = async (itemId, reqBody) => {
    const token = localStorage.getItem('token');
    if (!token) return { status: 401, data: { message: 'No token provided' } };

    const reqHeader = {
        "Authorization": `Bearer ${token}`
    };
    return await commonAPI("PUT", `${SERVER_URL}/cart/${itemId}`, reqBody, reqHeader);
};

export const removeFromCartAPI = async (itemId) => {
    const token = localStorage.getItem('token');
    if (!token) return { status: 401, data: { message: 'No token provided' } };

    const reqHeader = {
        "Authorization": `Bearer ${token}`
    };
    return await commonAPI("DELETE", `${SERVER_URL}/cart/${itemId}`, "", reqHeader);
};

export const clearCartAPI = async () => {
    const token = localStorage.getItem('token');
    if (!token) return { status: 401, data: { message: 'No token provided' } };

    const reqHeader = {
        "Authorization": `Bearer ${token}`
    };
    return await commonAPI("DELETE", `${SERVER_URL}/cart`, "", reqHeader);
};


// Wishlist Management APIs
export const addToWishlistAPI = async (reqBody) => {
    const token = localStorage.getItem('token');
    if (!token) return { status: 401, data: { message: 'No token provided' } };

    const reqHeader = {
        "Authorization": `Bearer ${token}`
    };
    return await commonAPI("POST", `${SERVER_URL}/wishlist/add`, reqBody, reqHeader);
};

export const getWishlistItemsAPI = async () => {
    const token = localStorage.getItem('token');
    if (!token) return { status: 401, data: { message: 'No token provided' } };

    const reqHeader = {
        "Authorization": `Bearer ${token}`
    };
    return await commonAPI("GET", `${SERVER_URL}/wishlist`, "", reqHeader);
};

export const removeFromWishlistAPI = async (itemId) => {
    const token = localStorage.getItem('token');
    if (!token) return { status: 401, data: { message: 'No token provided' } };

    const reqHeader = {
        "Authorization": `Bearer ${token}`
    };
    return await commonAPI("DELETE", `${SERVER_URL}/wishlist/${itemId}`, "", reqHeader);
};

export const clearWishlistAPI = async () => {
    const token = localStorage.getItem('token');
    if (!token) return { status: 401, data: { message: 'No token provided' } };

    const reqHeader = {
        "Authorization": `Bearer ${token}`
    };
    return await commonAPI("DELETE", `${SERVER_URL}/wishlist`, "", reqHeader);
};


// Order Management APIs
export const createOrderAPI = async (reqBody) => {
    const token = localStorage.getItem('token');
    if (!token) return { status: 401, data: { message: 'No token provided' } };

    const reqHeader = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
    return await commonAPI("POST", `${SERVER_URL}/orders`, reqBody, reqHeader);
};

export const getUserOrderHistoryAPI = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return { status: 401, data: { message: 'No token provided' } };

        const reqHeader = {
            "Authorization": `Bearer ${token}`
        };
        return await commonAPI("GET", `${SERVER_URL}/admin/users/${userId}/orders`, "", reqHeader);
    } catch (error) {
        console.error('Error in getUserOrderHistoryAPI:', error);
        return { status: 400, data: { message: error.message || 'Failed to fetch user order history' } };
    }
};

export const getOrderHistoryAPI = async () => {
    const token = localStorage.getItem('token');
    if (!token) return { status: 401, data: { message: 'No token provided' } };

    const reqHeader = {
        "Authorization": `Bearer ${token}`
    };
    return await commonAPI("GET", `${SERVER_URL}/orders`, "", reqHeader);
};

export const getOrderByIdAPI = async (orderId) => {
    const token = localStorage.getItem('token');
    if (!token) return { status: 401, data: { message: 'No token provided' } };

    const reqHeader = {
        "Authorization": `Bearer ${token}`
    };
    return await commonAPI("GET", `${SERVER_URL}/orders/${orderId}`, "", reqHeader);
};

export const updateOrderStatusAPI = async (orderId, reqBody) => {
    const token = localStorage.getItem('token');
    if (!token) return { status: 401, data: { message: 'No token provided' } };

    const reqHeader = {
        "Authorization": `Bearer ${token}`
    };
    return await commonAPI("PUT", `${SERVER_URL}/orders/${orderId}/status`, reqBody, reqHeader);
};

export const getAllOrdersAPI = async () => {
    const token = localStorage.getItem('token');
    if (!token) return { status: 401, data: { message: 'No token provided' } };

    const reqHeader = {
        "Authorization": `Bearer ${token}`
    };
    return await commonAPI("GET", `${SERVER_URL}/admin/orders`, "", reqHeader);
};


// User Profile API
export const getProfileAPI = async () => {
    const token = localStorage.getItem('token');
    if (!token) return { status: 401, data: { message: 'No token provided' } };

    const reqHeader = {
        "Authorization": `Bearer ${token}`
    };
    return await commonAPI("GET", `${SERVER_URL}/profile`, "", reqHeader);
};

export const updateProfileAPI = async (reqBody) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return { status: 401, data: { message: 'No token provided' } };

        const reqHeader = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        };

        const response = await commonAPI("PUT", `${SERVER_URL}/profile`, reqBody, reqHeader);
        return response;
    } catch (error) {
        console.error('Error in updateProfileAPI:', error);
        return { status: 400, data: { message: error.message || 'Failed to update profile' } };
    }
};

// Admin User Management API
export const getAllUsersAPI = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return { status: 401, data: { message: 'No token provided' } };

        const reqHeader = {
            "Authorization": `Bearer ${token}`
        };
        return await commonAPI("GET", `${SERVER_URL}/admin/users`, "", reqHeader);
    } catch (error) {
        console.error('Error in getAllUsersAPI:', error);
        return { status: 400, data: { message: error.message || 'Failed to fetch users' } };
    }
};

export const deleteUserAPI = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return { status: 401, data: { message: 'No token provided' } };

        const reqHeader = {
            "Authorization": `Bearer ${token}`
        };
        return await commonAPI("DELETE", `${SERVER_URL}/admin/users/${userId}`, "", reqHeader);
    } catch (error) {
        console.error('Error in deleteUserAPI:', error);
        return { status: 400, data: { message: error.message || 'Failed to delete user' } };
    }
};

// Admin Analytics APIs
export const getDashboardStatsAPI = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return { status: 401, data: { message: 'No token provided' } };

        const reqHeader = {
            "Authorization": `Bearer ${token}`
        };
        return await commonAPI("GET", `${SERVER_URL}/admin/analytics/dashboard`, "", reqHeader);
    } catch (error) {
        console.error('Error in getDashboardStatsAPI:', error);
        return { status: 400, data: { message: error.message || 'Failed to fetch dashboard statistics' } };
    }
};

export const getMonthlyRevenueAPI = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return { status: 401, data: { message: 'No token provided' } };

        const reqHeader = {
            "Authorization": `Bearer ${token}`
        };
        return await commonAPI("GET", `${SERVER_URL}/admin/analytics/monthly-revenue`, "", reqHeader);
    } catch (error) {
        console.error('Error in getMonthlyRevenueAPI:', error);
        return { status: 400, data: { message: error.message || 'Failed to fetch monthly revenue data' } };
    }
};

export const getCategorySalesAPI = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return { status: 401, data: { message: 'No token provided' } };

        const reqHeader = {
            "Authorization": `Bearer ${token}`
        };
        return await commonAPI("GET", `${SERVER_URL}/admin/analytics/products-by-category`, "", reqHeader);
    } catch (error) {
        console.error('Error in getCategorySalesAPI:', error);
        return { status: 400, data: { message: error.message || 'Failed to fetch category sales data' } };
    }
};

export const getRecentOrdersAPI = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return { status: 401, data: { message: 'No token provided' } };

        const reqHeader = {
            "Authorization": `Bearer ${token}`
        };
        return await commonAPI("GET", `${SERVER_URL}/admin/analytics/recent-orders`, "", reqHeader);
    } catch (error) {
        console.error('Error in getRecentOrdersAPI:', error);
        return { status: 400, data: { message: error.message || 'Failed to fetch recent orders' } };
    }
};


// Preview Products API (No authentication required)
export const getPreviewProductsAPI = async () => {
    return await commonAPI("GET", `${SERVER_URL}/preview-products`, "");
};



//review routes

// Review Management APIs
export const createReviewAPI = async (reqBody) => {
    const token = localStorage.getItem('token');
    if (!token) return { status: 401, data: { message: 'No token provided' } };

    const reqHeader = {
        "Authorization": `Bearer ${token}`
    };
    return await commonAPI("POST", `${SERVER_URL}/reviews`, reqBody, reqHeader);
};

export const getUserReviewsAPI = async () => {
    try {
        const response = await commonAPI("GET", `${SERVER_URL}/reviews/user`, "");
        return response;
    } catch (error) {
        console.error('Error in getUserReviewsAPI:', error);
        return { status: 400, data: { message: error.message || 'Failed to fetch user reviews' } };
    }
};


export const getAllReviewsAPI = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return { status: 401, data: { message: 'No token provided' } };

        const reqHeader = {
            "Authorization": `Bearer ${token}`
        };
        return await commonAPI("GET", `${SERVER_URL}/admin/reviews`, "", reqHeader);
    } catch (error) {
        console.error('Error in getAllReviewsAPI:', error);
        return { status: 400, data: { message: error.message || 'Failed to fetch all reviews' } };
    }
};

export const updateReviewStatusAPI = async (reviewId, reqBody) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return { status: 401, data: { message: 'No token provided' } };

        const reqHeader = {
            "Authorization": `Bearer ${token}`
        };
        return await commonAPI("PUT", `${SERVER_URL}/admin/reviews/${reviewId}`, reqBody, reqHeader);
    } catch (error) {
        console.error('Error in updateReviewStatusAPI:', error);
        return { status: 400, data: { message: error.message || 'Failed to update review status' } };
    }
};

export const deleteReviewAPI = async (reviewId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return { status: 401, data: { message: 'No token provided' } };

        const reqHeader = {
            "Authorization": `Bearer ${token}`
        };
        return await commonAPI("DELETE", `${SERVER_URL}/reviews/${reviewId}`, "", reqHeader);
    } catch (error) {
        console.error('Error in deleteReviewAPI:', error);
        return { status: 400, data: { message: error.message || 'Failed to delete review' } };
    }
};



// Get all users' reviews (No authentication required)
export const getAllUsersReviewsAPI = async () => {
    try {
        return await commonAPI("GET", `${SERVER_URL}/reviews/all`, "");
    } catch (error) {
        console.error('Error in getAllUsersReviewsAPI:', error);
        return { status: 400, data: { message: error.message || 'Failed to fetch all user reviews' } };
    }
};

export const getReviewStatsAPI = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return { status: 401, data: { message: 'No token provided' } };

        const reqHeader = {
            "Authorization": `Bearer ${token}`
        };
        return await commonAPI("GET", `${SERVER_URL}/admin/reviews/stats`, "", reqHeader);
    } catch (error) {
        console.error('Error in getReviewStatsAPI:', error);
        return { status: 400, data: { message: error.message || 'Failed to fetch review statistics' } };
    }
};


