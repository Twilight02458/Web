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
    'complaints': '/complaints',
    'complaints-by-user': '/complaints/user',
    'complaint-detail': '/complaints'
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