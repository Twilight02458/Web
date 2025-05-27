import axios from "axios"
import cookie from 'react-cookies'

const BASE_URL = 'http://localhost:8080/SpringMVC3/api/'

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
    'family-members-by-resident': '/secure/family-members/resident'
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