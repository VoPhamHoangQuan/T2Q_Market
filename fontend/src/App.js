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
import ShippingAddressScreen from './Screens/ShippingAddressScreen';


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

  return (
    <BrowserRouter>
      <div className="grid-container">
        <Header/>
        <main>
          <Route path="/" component={HomeScreen} exact></Route>
          <Route path="/product/:id" component={ProductScreen}></Route>
          <Route path="/cart/:id?" component={CartScreen}></Route>
          <Route path="/shipping" component={ShippingAddressScreen}></Route>
          <Route path="/signin" component={SigninScreen}></Route>
          <Route path="/register" component={RegisterScreen}></Route>
          <Route path="/forgot_password" component={ForgotPass} exact />
          <Route path="/reset/:token" component={ResetPass} exact />
          <Route path="/activation/:activation_token" component={ActivationEmail} exact />
        </main>
        <footer className="row center">
          All right reverse
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
