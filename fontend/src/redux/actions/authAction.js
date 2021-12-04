import axios from 'axios'
import { GET_USER, LOGIN } from '../constants/loginConstants'

export const dispatchLogin = () => {
    return {
        type: LOGIN
    }
}

export const fetchUser = async (token) => {
    const res = await axios.get('/api/users/infor', {
        headers: {Authorization: token}
    })
    return res
}

export const dispatchGetUser = (res) => {
    return {
        type: GET_USER,
        payload: {
            user: res.data,
            isAdmin: res.data.isAdmin === true ? true : false
        }       
    }
}