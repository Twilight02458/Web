import axios from "axios"
import cookie from 'react-cookies'

const BASE_URL = 'http://localhost:8080/SpringMVC3/api/'

export const endpoints = {
    'login': '/login',
    'current-user': '/secure/profile',
    'change-password': '/secure/change-password',
    'upload-avatar': '/secure/upload-avatar',
    'users-list': '/admin/users', // Lấy danh sách cư dân
    'deactivate-user': '/admin/users/deactivate-user', // Khoá khoá tài khoản
    'activate-user': '/admin/users/activate-user', // mở khoá tài khoản
    'delete-user': '/admin/users/delete-user',         // Xoá tài khoản
    'update-user': '/admin/users/update-user',         // Cập nhật thông tin cư dân
    'register-account': '/admin/register-account',
    'user-lockers': '/admin/users/locker',
    'locker': '/user/locker',
    'update-locker-status': '/admin/users/locker/update-status',
    'add-locker-item': '/admin/users/locker/add-locker-item',
    'save-fcm-token': '/secure/notifications/fcm-token',
    'notification-preferences': '/secure/notifications/preferences',
    'update-notification-preferences': '/secure/notifications/preferences'
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