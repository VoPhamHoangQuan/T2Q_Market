import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk"
import { cartReducer } from "./redux/reducers/cartReducers";
import { productCreateReducer, 
        productDeleteReducer, 
        productDetailReducer, 
        productReducer, 
        productUpdateReducer, 
        productReviewCreateReducer,
        productCategoryListReducer, } from "./redux/reducers/productReducers";
import { authReducer } from './redux/reducers/authReducer';
import { tokenReducer } from './redux/reducers/tokenReducer';
import { Provider } from 'react-redux'
import { userDeleteReducer, 
    userDetailsReducer, 
    userListReducer, 
    userUpdateProfileReducer, 
    userUpdateReducer, 
    userTopSellerListReducer, 
    userAddressMapReducer,} from "./redux/reducers/userReducers";
import {
    orderSummaryReducer,
    orderCreateReducer,
    orderDeleteReducer,
    orderDeliverReducer,
    orderDetailsReducer,
    orderListReducer,
    orderMineListReducer,
    orderPayReducer, 
    orderRestoreReducer
} from "./redux/reducers/orderReducers";

const reducer = combineReducers({
    // Start Product
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    productDelete: productDeleteReducer,
    // End Product
    productList: productReducer,
    productDetail: productDetailReducer,
    cart: cartReducer,
    auth: authReducer,
    token: tokenReducer,
    // User
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,
    userTopSellersList: userTopSellerListReducer,
    userAddressMap: userAddressMapReducer,
    // reviews
    productReviewCreate: productReviewCreateReducer,
    // order
    orderList: orderListReducer,
    orderDelete: orderDeleteReducer,
    orderDeliver: orderDeliverReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderMineList: orderMineListReducer,
    productCategoryList: productCategoryListReducer,
    orderSummary: orderSummaryReducer,
    orderRestore: orderRestoreReducer,
})
const initialState = {
    cart: {
        cartItems: JSON.parse(localStorage.getItem('cartItems'))
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
        shippingAddress: localStorage.getItem('shippingAddress')
            ? JSON.parse(localStorage.getItem('shippingAddress'))
            : {},
        paymentMethod: 'PayPal',
    },
};
const composeEnhanser = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducer,
    initialState,
    composeEnhanser(applyMiddleware(thunk)));

function DataProvider({ children }) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default DataProvider;