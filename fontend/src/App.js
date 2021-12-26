import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import SearchBox from './components/SearchBox';
import { listProductCategories } from './redux/actions/productActions';
import LoadingBox from './components/LoadingBox';
import MessageBox from './components/MessageBox';

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
import Loading from './components/LoadingBox'
import ShippingAddressScreen from './Screens/ShippingAddressScreen'

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
import OrderListDeletedScreen from './Screens/OrderListDeletedScreen'
import PaymentMethodScreen from './Screens/PaymentMethodScreen';
import PlaceOrderScreen from './Screens/PlaceOrderScreen';
import DashboardScreen from './Screens/DashboardScreen';
import OrderHistoryScreen from './Screens/OrderHistoryScreen';
// Seller
import SellerScreen from './Screens/SellerScreen';
import SearchScreen from './Screens/SearchScreen';
import MapScreen from './Screens/MapScreen';
// Seller
import OrderScreen from './Screens/OrderScreen';


function App() {

  const dispatch = useDispatch()
  const token = useSelector(state => state.token)
  const auth = useSelector(state => state.auth)

  const productCategoryList = useSelector((state) => state.productCategoryList);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const { user } = auth
  const cart = useSelector(state => state.cart);
  const { cartItems } = cart

  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = productCategoryList;

  useEffect(() => {
    dispatch(listProductCategories());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await axios.get('/logout')
      localStorage.removeItem('firstLogin')
      localStorage.removeItem('cartItems')
      window.location.href = "/";
    } catch (err) {
      window.location.href = "/";
    }
  }

  const userLink = () => {
    return (
      <React.Fragment>
        <div className="dropdown">
          {
            user.avatar &&
            (<img className="superSmall image-profile" src={user.avatar} alt={''} />)
          }
          <Link to="#">
            {user.name} <i className="fas fa-angle-down"></i>
          </Link>
          <ul className="dropdown-content user">
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/orderhistory">Order History</Link></li>
            <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
          </ul>
        </div>
      </React.Fragment>
    )
  }

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
  const { isLogged, isAdmin } = auth
  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="row">
          <div>
            <button
              type="button"
              className="open-sidebar"
              onClick={() => setSidebarIsOpen(true)}
            >
              <i className="fa fa-bars"></i>
            </button>
            <Link className="brand" to="/"> T2Q Market </Link>
          </div>
          <div>
            <Route
              render={({ history }) => (
                <SearchBox history={history}></SearchBox>
              )}
            ></Route>
          </div>
          <div className="header-nav">

            {
              isLogged
                ? userLink()
                : <Link to="/signin"><i className="fas fa-user"></i> Sign in</Link>
            }
            {isLogged && auth.user.isSeller && (
              <div className="dropdown">
                <Link to="#admin">
                  Seller <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content seller">
                  <li>
                    <Link to="/productlist/seller">Products</Link>
                  </li>
                  <li>
                    <Link to="/orderlist/seller">Orders</Link>
                  </li>
                </ul>
              </div>
            )}
            {isLogged && isAdmin && (
              <div className="dropdown">
                <Link to="#admin">
                  Admin {' '} <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content admin">
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/productlist">Products</Link>
                  </li>
                  <li>
                    <Link to="/orderlist">Orders</Link>
                  </li>
                  <li>
                    <Link to="/userlist">Users</Link>
                  </li>
                  <li>
                    <Link to="/support">Support</Link>
                  </li>
                </ul>
              </div>
            )}

            <Link to="/cart">
              <i className="fas fa-shopping-cart fa-2x"></i>
              {
                cartItems.length > 0 && (
                  <span className="badge">{cartItems.length}</span>
                )
              }
            </Link>
          </div>
        </header>
        <aside className={sidebarIsOpen ? 'open' : ''}>
          <ul className="categories">
            <li>
              <strong>Categories</strong>
              <button
                onClick={() => setSidebarIsOpen(false)}
                className="close-sidebar"
                type="button"
              >
                <i className="fa fa-close"></i>
              </button>
            </li>
            {loadingCategories ? (
              <LoadingBox></LoadingBox>
            ) : errorCategories ? (
              <MessageBox variant="danger">{errorCategories}</MessageBox>
            ) : (
              categories.map((c) => (
                <li key={c}>
                  <Link
                    to={`/search/category/${c}`}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    {c}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </aside>
        <main>
          <Route path="/" component={HomeScreen} exact></Route>
          <Route path="/pageNumber/:pageNumber" component={HomeScreen} exact></Route>
          {/* user and profile */}
          <Route path="/profile" component={isLogged ? ProfileScreen : Loading} exact></Route>
          <Route path="/userlist" component={isAdmin ? UserListScreen : Loading} exact></Route>
          <Route path="/user/:id/edit" component={isAdmin ? UserEditScreen : Loading} exact></Route>

          {/* Product */}
          <Route path="/product/:id" component={ProductScreen} exact></Route>
          <Route path="/product/:id/edit" component={ProductEditScreen} exact></Route>
          <Route path="/cart/:id?" component={CartScreen}></Route>
          <Route path="/shipping" component={ShippingAddressScreen}></Route>

          {/* Login */}
          <Route path="/signin" component={SigninScreen}></Route>
          <Route path="/register" component={RegisterScreen}></Route>
          <Route path="/forgot_password" component={ForgotPass} exact />
          <Route path="/reset/:token" component={ResetPass} exact />
          <Route path="/activation/:activation_token" component={ActivationEmail} exact />
          <Route path="/productlist" component={isAdmin ? ProductListScreen : Loading} exact />

          {/* Chat Box */}
          <Route path="/support" component={isAdmin ? SupportScreen : Loading} exact></Route>

          {/* Order */}
          <Route path="/orderlist" component={isAdmin ? OrderListScreen : Loading} exact></Route>
          <Route path="/orderlist/order/:order" component={isAdmin ? OrderListScreen : Loading} exact></Route>
          <Route path="/orderlist/deleted" component={isAdmin ? OrderListDeletedScreen : Loading} exact></Route>
          <Route path="/orderlist/deleted/order/:order" component={isAdmin ? OrderListDeletedScreen : Loading} exact></Route>
          <Route path="/order/:id" component={OrderScreen} ></Route>
          <Route path="/payment" component={PaymentMethodScreen}></Route>
          <Route path="/placeorder" component={PlaceOrderScreen}></Route>
          <Route path="/orderhistory" component={OrderHistoryScreen}></Route>

          {/* Seller */}
          <Route path="/seller/:id" component={SellerScreen} exact></Route>
          <Route path="/productlist/seller" component={ProductListScreen} exact></Route>
          <Route path="/orderlist/seller" component={OrderListScreen} exact></Route>
          <Route path="/orderlist/deleted/seller" component={OrderListDeletedScreen} exact></Route>

          {/* Search */}
          {/* <Route path="/search/name" component={SearchScreen} exact></Route> */}
          <Route
            path="/search/name/:name?"
            component={SearchScreen}
            exact
          ></Route>
          <Route
            path="/search/category/:category"
            component={SearchScreen}
            exact
          ></Route>
          <Route
            path="/search/category/:category/name/:name"
            component={SearchScreen}
            exact
          ></Route>
          <Route
            path="/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order/pageNumber/:pageNumber"
            component={SearchScreen}
            exact
          ></Route>
          <Route path="/map" component={isLogged ? MapScreen : Loading} exact></Route>
          <Route path="/dashboard" component={isAdmin ? DashboardScreen : Loading} exact></Route>
          <Route
            path="/productlist/pageNumber/:pageNumber"
            component={isAdmin ? ProductListScreen : Loading}
            exact></Route>
          <Route
            path="/productlist/seller/pageNumber/:pageNumber"
            component={ProductListScreen}
            exact></Route>
        </main>
        <footer className="footer-distributed row">
          {auth.user && !isAdmin && <ChatBox userInfo={auth.user} />}

          <div class="footer-left white">
            <h3>T2Q Market - Gì cũng có, mua hết với T2Q Market</h3>
            <div className='margin-top'>
              <a class="footer-company-name " href="#" >Mua sắm - Buôn bán đơn giản an toàn</a>
            </div>
            <div className='margin-top white'>
              <a class="footer-company-name" href="#" >Hàng hiệu giá tốt tại T2Q Market</a>
            </div>
          </div>
          <div class="footer-center">
            <div>
              <img src="https://i.imgur.com/uTM7Zp1.png" className='margin-right' alt="Mail icon" width="30" height="30"></img>
              <p>1 Võ Văn Ngân, TpHCM, Việt Nam</p>
            </div>
            <div>
              <img src="https://i.imgur.com/t4A1GTj.png" className='margin-right' alt="Mail icon" width="30" height="30"></img>
              <p>+84 935 824 964</p>
            </div>
            <div>
              <img src="https://i.imgur.com/B0FKkga.png" className='margin-right white' alt="Mail icon" width="30" height="30"></img>
              <a class="mail_to white" href={`mailto:toanpham0224@gmail.com`}>Liên hệ với chúng tôi</a>
            </div>
          </div>
          <div class="footer-right">
            <p>
              <a class="mail_to">Giới thiệu về T2Q Market</a>
            </p>
            <div class="footer-icons">
              <img src="https://i.imgur.com/PX7Mwff.png" className='margin-right' alt="Facebook icon" width="30" height="30"></img>
              <img src="https://i.imgur.com/DdEfzRX.png" className='margin-right' alt="Instagram icon" width="30" height="30"></img>
              <img src="https://i.imgur.com/SaFAs5i.png" className='margin-right' alt="Git icon" width="30" height="30"></img>
              <img src="https://i.imgur.com/B0FKkga.png" className='margin-right' alt="Mail icon" width="30" height="30"></img>
            </div>
            <div class="footer-icons">
              <img src="https://i.imgur.com/jVQVcLd.png" className='margin-right' alt="JCB icon" width="30" height="30"></img>
              <img src="https://i.imgur.com/MMADVAw.png" className='margin-right' alt="Paypal icon" width="30" height="30"></img>
              <img src="https://i.imgur.com/XmZ9NVk.png" className='margin-right' alt="Cash icon" width="30" height="30"></img>
              <img src="https://i.imgur.com/5U7yg2e.png" className='margin-right' alt="Visa icon" width="30" height="30"></img>
            </div>
          </div>

        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
