import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk"
import { cartReducer } from "./redux/reducers/cartReducers";
import { productDetailReducer, productReducer } from "./redux/reducers/productReducers";
import { authReducer } from './redux/reducers/authReducer';
import { tokenReducer } from './redux/reducers/tokenReducer';
import { Provider } from 'react-redux'

const reducer = combineReducers({
    productList: productReducer,
    productDetail: productDetailReducer,
    cart: cartReducer,
    auth: authReducer,
    token: tokenReducer,
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