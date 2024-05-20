export const getToken = () => {
    return JSON.parse(localStorage.getItem('token'))
}

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
}

export const saveToken = token => {
    localStorage.setItem('token', JSON.stringify(token))
}

export const removeToken = () => {
    localStorage.removeItem('token')
}


export const getUserRole = () => {
    const token = getToken();
    return token?.data?.userRole;
}

export const isUser = () => {
    return getUserRole() === 'ROLE_USER';
}

export const isAdmin = () => {
    return getUserRole() === 'ROLE_ADMIN';
}

export const userRole = () => {
    return isUser() ? "USER" : (isAdmin() ? "ADMIN" : "UNKNOWN");
}

export const updateToken = (user) => {
    const newEmail = user.email;
    const newUserRole = user.userRole;

    const token = getToken();
    token.email = newEmail;
    token.userRole = newUserRole;

    localStorage.setItem('token', JSON.stringify(token))
}
