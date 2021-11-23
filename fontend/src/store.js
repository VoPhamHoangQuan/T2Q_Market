import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk"
import { cartReducer } from "./redux/reducers/cartReducers";
import { productDetailReducer, productReducer } from "./redux/reducers/productReducers";
import { userRegisterReducer, userSigninReducer } from "./redux/reducers/userReducers";

const reducer = combineReducers({
    productList: productReducer,
    productDetail: productDetailReducer,
    cart: cartReducer,
    userSignin: userSigninReducer,
    userRegister: userRegisterReducer,
})
const initialState = {
    userSignin: {
        userInfo: JSON.parse(localStorage.getItem('userInfo'))
            ? JSON.parse(localStorage.getItem('userInfo'))
            : null
    },
    
    cart: {
        cartItems: JSON.parse(localStorage.getItem('cartItems'))
            ? JSON.parse(localStorage.getItem('cartItems'))
            : []
    },
};
const composeEnhanser = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducer,
    initialState,
    composeEnhanser(applyMiddleware(thunk)));

export default store;