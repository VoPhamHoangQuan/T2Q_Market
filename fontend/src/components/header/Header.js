import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'


function Header() {
    const auth = useSelector(state => state.auth)

    const { user, isLogged } = auth
    const cart = useSelector(state => state.cart);
    const { cartItems } = cart

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
                    <img className="superSmall image-profile" src={user.avatar} alt={user.name} />
                </div>
                <div className="dropdown">
                    <Link to="#">
                        {user.name}
                        <i className="fas fa-angle-down"></i>
                    </Link>
                    <ul className="dropdown-contents">
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
                    </ul>
                </div>
            </React.Fragment>
        )
    }

    // const transForm = {
    //     transform: isLogged ? "translateY(-5px)" : 0
    // }

    return (
        <div className="grid-container">
            <header className="row">
                <div>
                    <Link className="brand" to="/"> T2Q Market </Link>
                </div>
                <div className="header-nav">
                    <Link to="/cart">
                        Cart
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
                </div>
            </header>
        </div>
    )
}



export default Header