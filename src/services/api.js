import axios from "axios";
import {API_BASE_URL} from "../routes/BaseRoutes";
import {getToken, isUser} from "./auth";
import {API_LOGIN, API_REGISTRATION, API_STATISTICS, API_USER, API_USER_PROFILE, API_USERS} from "../routes/UserRoutes";
import {API_CATEGORIES} from "../routes/CategoryRoutes";
import {API_PRODUCT, API_PRODUCT_STATUSES, API_PRODUCTS} from "../routes/ProductRoutes";
import {API_ORDER, API_ORDER_STATUSES, API_ORDERS} from "../routes/OrderRoutes";

export const userApi = {
    login,
    registration,
    getCurrentUser,
    getAllUsers,
    updateUser,
    createUser,
    changePassword,
    deleteUser,

    createProduct,
    deleteProduct,
    updateProduct,
    getProductById,
    getAllProducts,
    getAllInStockProducts,

    getAllCategories,

    getAllStatuses: getAllProductStatuses,
    createOrder,
    getAllOrders,
    getOrderById,
    getAllOrderStatuses,
    updateStatusOrder,
    deleteOrder,
    updateOrder,

    getStatistics
}

function login(email, password) {

    // request body
    const loginRequest = {
        "email": email,
        "password": password
    };

    // send request
    return instance.post(
        API_LOGIN,
        loginRequest,
        {
            headers: {'Content-type': 'application/json'}
        }).catch(handleError);
}

function handleError(error) {
    let errorMessage;
    if (error.response) {
        errorMessage = {error: {message: error.response.data.message, code: error.response.data.errorCode}};
    } else if (error.request) {
        errorMessage = {error: {message: 'No response from server', code: null}};
    } else {
        errorMessage = {error: {message: 'Request failed', code: null}};
    }
    return errorMessage;
}


function registration(user) {

    const registrationRequest = {
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email,
        "password": user.password,
    };

    return instance.post(
        API_REGISTRATION,
        registrationRequest,
        {
            headers: {'Content-type': 'application/json'}
        }
    ).catch(handleError);

}

function getCurrentUser() {
    try {
        const token = getToken().data.token;

        return instance.get(
            API_USER_PROFILE,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    } catch (error) {
        handleError(error)
    }
}

function getAllUsers(currentPage, countElements, sort, order) {
    try {
        const token = getToken().data.token;

        const page = {
            page: currentPage - 1,
            size: countElements,
        };

        const sorting = {};
        if (sort) {
            sorting.sort = sort + ',' + order;
        }

        return instance.get(
            API_USERS, {
                params: {...page, ...sorting},
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    } catch (error) {
        handleError(error)
    }
}

function updateUser(userId, updatedUserData) {
    try {
        const token = getToken().data.token;
        return instance.put(
            API_USER + `/${userId}`,
            updatedUserData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    } catch (error) {
        handleError(error);
    }
}

function createUser(user) {
    const token = getToken().data.token;
    return instance.post(
        API_USERS,
        user,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    ).catch(handleError);
}

function changePassword(userId, changePassword) {
    try {
        const token = getToken().data.token;
        return instance.put(
            API_USER + `/${userId}/change-password`,
            changePassword,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    } catch (error) {
        handleError(error);
    }
}

function deleteUser(userId) {
    try {
        const token = getToken().data.token;
        return instance.delete(
            API_USER + `/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    } catch (error) {
        handleError(error);
    }
}

function getAllCategories() {
    try {
        const token = getToken().data.token;
        return instance.get(
            API_CATEGORIES, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    } catch (error) {
        handleError(error)
    }
}

function createProduct(product, photo) {
    const token = getToken().data.token;
    const formData = new FormData();
    const json = JSON.stringify(product);
    const blob = new Blob([json], {
        type: 'application/json'
    });
    formData.append('NewProduct', blob);
    formData.append('image', photo);

    return instance.post(
        API_PRODUCTS,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        }
    ).catch(handleError);
}

function deleteProduct(productId) {
    try {
        const token = getToken().data.token;
        return instance.delete(
            API_PRODUCT + `/${productId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    } catch (error) {
        handleError(error);
    }
}

function updateProduct(productId, product) {
    try {
        const token = getToken().data.token;
        return instance.put(
            API_PRODUCT + `/${productId}`,
            product,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    } catch (error) {
        handleError(error);
    }
}

function getProductById(productId) {
    try {
        const token = getToken().data.token;

        return instance.get(
            API_PRODUCT + `/${productId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

    } catch (error) {
        handleError(error)
    }
}


function getAllProducts(selectedCategories, currentPage, countElements, sort, order) {
    try {
        const token = getToken().data.token;

        const categories = [];
        for (let i = 0; i < selectedCategories.length; i++) {
            const category = {name: selectedCategories[i].name}
            categories.push(category);
        }

        return instance.patch(
            API_PRODUCTS + '?page=' + (currentPage - 1) + '&size=' + countElements + '&sort=' + sort + ',' + order,
            categories,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

    } catch (error) {
        handleError(error)
    }
}

function getAllInStockProducts() {
    try {
        const token = getToken().data.token;
        return instance.get(
            API_PRODUCTS + '/IN_STOCK',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

    } catch (error) {
        handleError(error)
    }
}


function getAllProductStatuses() {
    try {
        const token = getToken().data.token;
        return instance.get(
            API_PRODUCT_STATUSES, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    } catch (error) {
        handleError(error)
    }
}

function createOrder(order) {
    const token = getToken().data.token;

    console.log('order ' + JSON.stringify(order))

    return instance.post(
        API_ORDER,
        order,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    ).catch(handleError);
}

function getAllOrderStatuses() {
    try {
        const token = getToken().data.token;
        return instance.get(
            API_ORDER_STATUSES, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    } catch (error) {
        handleError(error)
    }
}

function updateStatusOrder(orderId, status) {
    try {
        const token = getToken().data.token;
        return instance.put(
            API_ORDER + `/${orderId}/status`,
            status,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    } catch (error) {
        handleError(error);
    }
}

function getAllOrders(ordersStatuses, currentPage, countElements, sort, order) {
    try {
        const token = getToken().data.token;

        let statuses = [];
        for (let i = 0; i < ordersStatuses.length; i++) {
            const status = {name: ordersStatuses[i].name}
            statuses.push(status);
        }

        return instance.patch(
            API_ORDERS + '?page=' + (currentPage - 1) + '&size=' + countElements + '&sort=' + sort + ',' + order,
            statuses,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

    } catch (error) {
        handleError(error)
    }
}

function getOrderById(orderId) {
    try {
        const token = getToken().data.token;

        return instance.get(
            API_ORDER + `/${orderId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

    } catch (error) {
        handleError(error)
    }
}

function deleteOrder(orderId) {
    try {
        const token = getToken().data.token;
        return instance.delete(
            API_ORDER + `/${orderId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    } catch (error) {
        handleError(error);
    }
}

function updateOrder(orderId, product) {
    try {
        const token = getToken().data.token;
        return instance.put(
            API_ORDER + `/${orderId}`,
            product,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    } catch (error) {
        handleError(error);
    }
}

function getStatistics() {
    try {
        const token = getToken().data.token;

        return instance.get(
            API_STATISTICS,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

    } catch (error) {
        handleError(error)
    }
}

const instance = axios.create({
    baseURL: API_BASE_URL
})