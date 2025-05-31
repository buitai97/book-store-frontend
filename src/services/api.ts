import axios from 'services/axios.customize'
export const loginAPI = (username: string, password: string) => {
    const urlBackend = '/api/v1/auth/login'

    return axios.post<IBackendRes<ILogin>>(urlBackend, { username, password }, {
        headers: {
            delay: 2000
        }
    })
}

export const registerAPI = (fullName: string, password: string, email: string, phone: string) => {
    const urlBackend = '/api/v1/user/register'
    return axios.post<IBackendRes<IRegister>>(urlBackend, { fullName, password, email, phone }, {
        headers: {
            delay: 2000
        }
    })
}

export const logoutAPI = () => {
    const urlBackend = '/api/v1/auth/logout'
    return axios.post(urlBackend, {
        Headers: {
            delay: 2000
        }
    })
}
export const fetchAccountAPI = () => {
    const urlBackend = '/api/v1/auth/account'
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
        headers: {
            delay: 1000
        }
    })
}

export const getUsersAPI = (query: string) => {
    const urlBackend = `/api/v1/user?${query}`
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend)
}

export const getAllUsersAPI = () => {
    const urlBackend = `/api/v1/user`
    return axios.get<IBackendRes<IUserTable[]>>(urlBackend)
}

export const addUserAPI = (fullName: string, email: string, password: string, phone: string) => {
    const urlBackend = "/api/v1/user?"
    return axios.post<IBackendRes<IRegister>>(urlBackend, { fullName, email, password, phone })
}

export const createUsersBulkAPI = (users: ICreateUser[]) => {
    const urlBackend = "/api/v1/user/bulk-create"
    return axios.post<IBackendRes<IResponseImport>>(urlBackend, users, {
        headers: {
            delay: 1000
        }
    })
}

export const updateUserAPI = (id: string, fullName: string, phone: string) => {
    const urlBackend = "/api/v1/user"
    return axios.put<IBackendRes<IRegister>>(urlBackend, {
        _id: id,
        fullName: fullName,
        phone: phone
    })
}

export const deleteUserAPI = (id: string) => {
    const urlBackend = `/api/v1/user/${id}`

    return axios.delete<IBackendRes<IRegister>>(urlBackend)
}


// Book api

export const getBooksAPI = (query: string) => {
    const urlBackend = `/api/v1/book?${query}`
    return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend)
}