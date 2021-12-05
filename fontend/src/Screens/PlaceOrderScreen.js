import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import CheckoutStep from '../components/CheckoutSteps.js'

export default function PlaceOrderScreen(props) {

    const firstLogin = localStorage.getItem("firstLogin");
    if (!firstLogin) {
        props.history.push('/signin');
    }
    const cart = useSelector(state => state.cart);
    if (!cart.paymentMethod) {
        props.history.push('/payment');
    }

    const toPrice = (num) => Number(num.toFixed(2));
    cart.itemsPrice = toPrice(cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0));
    cart.shippingPrice = cart.itemsPrice > 100 ? toPrice(0) : toPrice(10);
    cart.taxPrice = toPrice(0.15 * cart.itemsPrice);
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

    const placeOrderHandler = () => {
        //TODO Place order 

    }

    return (
        <div>
            <CheckoutStep step1 step2 step3 step4></CheckoutStep>
            <div className="row top">
                <div className="col-2">
                    <ul>
                        <li>
                            <div className="card card-body">
                                <h2>Shipping</h2>
                                <p>
                                    <strong>Name: </strong>{cart.shippingAddress.fullName}<br />
                                    <strong>Address: </strong>
                                    {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                                    {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                                </p>
                            </div>
                        </li>
                        <li>
                            <div className="card card-body">
                                <h2>Payment</h2>
                                <p>
                                    <strong>Method: </strong>{cart.paymentMethod}
                                </p>
                            </div>
                        </li>
                        <li>
                            <div className="card card-body">
                                <h2>Order Items</h2>
                                <ul>
                                    {
                                        cart.cartItems.map(item => (
                                            <li key={item.product}>
                                                <div className="row">
                                                    <div>
                                                        <img
                                                            className="small"
                                                            src={item.image}
                                                            alt={item.name}
                                                        />
                                                    </div>
                                                    <div className="min-30">
                                                        <Link to={`/api/product/${item.product}`}>{item.name}</Link>
                                                    </div>
                                                    <div>{item.quantity} x ${item.price} = ${item.quantity * item.price}</div>
                                                </div>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="col-1">
                    <div className="card card-body">
                        <ul>
                            <li>
                                <h2>Order Summary</h2>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Items</div>
                                    <div>${cart.itemsPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Shipping</div>
                                    <div>${cart.shippingPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Tax</div>
                                    <div>${cart.taxPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div><strong>Total Price</strong></div>
                                    <div><strong>${cart.totalPrice.toFixed(2)}</strong></div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <button
                                        type="button"
                                        className="primary block"
                                        onClick={placeOrderHandler}
                                        disabled={cart.cartItems.length === 0 ? true : false}>
                                        Place Order
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
