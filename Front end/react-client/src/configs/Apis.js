import axios from "axios"
import cookie from 'react-cookies'

const BASE_URL = 'http://localhost:8080/SpringMVC3/api/'

export const endpoints = {
    'login': '/login',
    'current-user': '/secure/profile',
    'change-password': '/secure/change-password',
    'upload-avatar': '/secure/upload-avatar',
    'locker': '/user/locker',
    'payment-create': '/payment/create',
    'payment-result': '/payment/vnpay-return',
    'user-payment':  `/user/my-payment`,
}
export const authApis = () => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            "Authorization": `Bearer ${cookie.load('token')}`
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
})