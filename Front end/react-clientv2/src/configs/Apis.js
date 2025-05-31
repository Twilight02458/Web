import axios from "axios"
import cookie from 'react-cookies'

const BASE_URL = 'http://localhost:8080/SpringMVC3/api'

export const endpoints = {
    'login': '/login',
    'current-user': '/secure/profile',
    'change-password': '/secure/change-password',
    'upload-avatar': '/secure/upload-avatar',
    'locker': '/user/locker',
    'save-fcm-token': '/secure/notifications/fcm-token',
    'notification-preferences': '/secure/notifications/preferences',
    'update-notification-preferences': '/secure/notifications/preferences',
    'family-members': '/secure/family-members',
    'family-members-by-resident': '/secure/family-members/resident',
    'user-survey': '/user/survey',
    'user-survey-submit': '/user/survey/submit',
    'payment-create': '/payment/create',
    'payment-result': '/payment/vnpay-return',
    'user-payment': '/user/my-payment',
    'user-paymentdetail': '/user/paymentdetail',
    'user-payment-proof': '/user/payment-proof',
    'user-feedback': '/user/feedback'
}

export const authApis = () => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            "Authorization": `Bearer ${cookie.load('token')}`,
            "Content-Type": "application/json"
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
})