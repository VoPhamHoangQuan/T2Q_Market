import { GET_USER, LOGIN } from '../constants/loginConstants'

const initialState = {
    user: [],
    isLogged: false,
    isAdmin: false
}

export const authReducer = (state = initialState, action) => {
    switch(action.type){
        case LOGIN:
            return {
                ...state,
                isLogged: true
            }
        case GET_USER:
            return {
                ...state,
                user: action.payload.user,
                isAdmin: action.payload.user.isAdmin,
            }
        default:
            return state
    }
}

