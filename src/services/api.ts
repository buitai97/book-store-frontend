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
            delay: 2000
        }
    })
}

export const getUsersAPI = (current: number, pageSize: number) => {
    const urlBackend = `/api/v1/user?current=${current}&pageSize=${pageSize}`
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend)
}