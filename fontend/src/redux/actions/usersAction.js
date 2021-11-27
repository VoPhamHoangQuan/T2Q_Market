import axios from 'axios'
import { GET_ALL_USERS } from '../constants/loginConstants'

export const fetchAllUsers = async (token) => {
    const res = await axios.get('/user/all_infor', {
        headers: {Authorization: token}
    })
    return res
}

export const dispatchGetAllUsers = (res) => {
    return {
        type: GET_ALL_USERS,
        payload: res.data
    }
}