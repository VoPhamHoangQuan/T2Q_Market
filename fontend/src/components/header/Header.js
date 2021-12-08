import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios'
import SearchBox from '../SearchBox';
import { Route } from 'react-router-dom';
import { listProductCategories } from '../../redux/actions/productActions';
import LoadingBox from '../LoadingBox';
import MessageBox from '../MessageBox';



function Header() {
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)
    const productCategoryList = useSelector((state) => state.productCategoryList);
    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
    const { user, isLogged, isAdmin } = auth
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
                <div>
                    <img className="superSmall" src={user.avatar} alt={user.name} />
                </div>
                <div className="dropdown">
                    <Link to="#">
                        {user.name}
                        <i className="fas fa-angle-down"></i>
                    </Link>
                    <ul className="dropdown-content">
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
                    </ul>
                </div>
            </React.Fragment>
        )
    }

    return (
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
                    <Link to="/cart">
                        <i class="fas fa-shopping-cart fa-2x"></i>
                        {
                            cartItems.length > 0 && (
                                <span className="badge">{cartItems.length}</span>
                            )
                        }
                    </Link>
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
                            <ul className="dropdown-content">
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
                                Admin <i className="fa fa-caret-down"></i>
                            </Link>
                            <ul className="dropdown-content">
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
        </div>
    )
}



export default Header