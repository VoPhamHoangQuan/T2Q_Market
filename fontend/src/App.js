import React, { useEffect } from 'react';
import axios from 'axios';
import { dispatchLogin, fetchUser, dispatchGetUser } from './redux/actions/authAction'
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import CartScreen from './Screens/CartScreen';
import HomeScreen from './Screens/HomeScreen'
import ProductScreen from './Screens/ProductScreen'
import RegisterScreen from './Screens/Register';
import SigninScreen from './Screens/Login';
import ActivationEmail from './Screens/ActivationEmail'
import ForgotPass from './Screens/ForgotPassword'
import ResetPass from './Screens/ResetPassword'
import Header from './components/header/Header'
import ShippingAddressScreen from './Screens/ShippingAddressScreen'
import NotFound from './components/utils/NotFound/NotFound'

// Admin
import ProductEditScreen from './Screens/ProductEditScreen';
import ProductListScreen from './Screens/ProductListScreen';
import UserListScreen from './Screens/UserListScreen';
import UserEditScreen from './Screens/UserEditScreen'

// Profile
import ProfileScreen from './Screens/ProfileScreen';

// Chat box
import ChatBox from './components/ChatBox';
import SupportScreen from './Screens/SupportScreen'

// Order 
import OrderListScreen from './Screens/OrderListScreen'


function App() {

  const dispatch = useDispatch()
  const token = useSelector(state => state.token)
  const auth = useSelector(state => state.auth)

  useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin')
    if (firstLogin) {
      const getToken = async () => {
        const res = await axios.post('/refresh_token', null)
        dispatch({ type: 'GET_TOKEN', payload: res.data.access_token })
      }
      getToken()
    }
  }, [auth.isLogged, dispatch])

  useEffect(() => {
    if (token) {
      const getUser = () => {
        dispatch(dispatchLogin())

        return fetchUser(token).then(res => {
          dispatch(dispatchGetUser(res))
        })
      }
      getUser()
    }
  }, [token, dispatch])
  const {isLogged, isAdmin} = auth
  return (
    <BrowserRouter>
      <div className="grid-container">
        <Header />
        <main>
          
          <Route path="/" component={HomeScreen} exact></Route>
          {/* user and profile */}
          <Route path="/profile" component={isLogged?ProfileScreen : NotFound} exact></Route>
          <Route path="/userlist" component={isAdmin?UserListScreen : NotFound} exact></Route>
          <Route path="/user/:id/edit" component={isAdmin?UserEditScreen : NotFound} exact></Route>

          {/* Product */}
          <Route path="/product/:id" component={ProductScreen} exact></Route>
          <Route path="/product/:id/edit" component={isAdmin? ProductEditScreen: NotFound} exact></Route>
          <Route path="/cart/:id?" component={CartScreen}></Route>
          <Route path="/shipping" component={ShippingAddressScreen}></Route>

          {/* Login */}
          <Route path="/signin" component={SigninScreen}></Route>
          <Route path="/register" component={RegisterScreen}></Route>
          <Route path="/forgot_password" component={ForgotPass} exact />
          <Route path="/reset/:token" component={ResetPass} exact />
          <Route path="/activation/:activation_token" component={ActivationEmail} exact />
          <Route path="/productlist" component={isAdmin? ProductListScreen : NotFound} />

          {/* Chat Box */}
          <Route path="/support" component={isAdmin?SupportScreen : NotFound} exact></Route>

          {/* Order */}
          <Route path="/orderlist" component={OrderListScreen}></Route>



        </main>
        <footer className="row center">
          All right reverse
        </footer>
        <footer className="row center">
          {auth.user && !isAdmin && <ChatBox userInfo={auth.user} />}
          <div>All right reserved</div>{' '}
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
