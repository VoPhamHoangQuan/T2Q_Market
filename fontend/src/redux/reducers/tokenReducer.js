import { GET_TOKEN } from '../constants/loginConstants'

const token = ''

export const tokenReducer = (state = token, action) => {   
    switch(action.type){
        case GET_TOKEN:
            return action.payload
        default:
            return state
    }
}

// export default tokenReducer