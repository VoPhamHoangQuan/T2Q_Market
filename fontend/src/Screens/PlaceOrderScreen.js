import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import CheckoutStep from '../components/CheckoutSteps.js'
import { createOrder } from '../redux/actions/orderActions.js'
import { ORDER_CREATE_RESET } from '../redux/constants/orderConstants.js'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import NumberWithCommas from '../components/utils/NumberWithCommas/NumberWithCommas.js'

export default function PlaceOrderScreen(props) {

    const firstLogin = localStorage.getItem("firstLogin");
    if (!firstLogin) {
        props.history.push('/signin');
    }
    const cart = useSelector(state => state.cart);
    if (!cart.paymentMethod) {
        props.history.push('/payment');
    }
    const orderCreate = useSelector(state => state.orderCreate);
    const { loading, success, error, order } = orderCreate;
    const toPrice = (num) => Number(num.toFixed(3));
    cart.itemsPrice = toPrice(cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0));
    cart.shippingPrice = cart.itemsPrice > 100 ? toPrice(0) : toPrice(10);
    cart.taxPrice = toPrice(0.15 * cart.itemsPrice);
    cart.totalPrice = (cart.itemsPrice + cart.shippingPrice + cart.taxPrice);

    const dispatch = useDispatch();
    const token = useSelector(state => state.token);
    const placeOrderHandler = () => {
        //TODO Place order 
        dispatch(createOrder({ ...cart, orderItems: cart.cartItems }, token))
    }

    useEffect(() => {
        if (success) {
            props.history.push(`/order/${order._id}`);
            dispatch({ type: ORDER_CREATE_RESET });
        }
    }, [dispatch, order, props.history, success])

    return (
        <div>
            <CheckoutStep step1 step2 step3 step4></CheckoutStep>
            <div className="row top">
                <div className="col-2">
                    <ul>
                        <li>
                            <div className="card card-body">
                                <h2>Thông Tin Vận Chuyển</h2>
                                <p>
                                    <strong>Họ Và Tên: </strong>{cart.shippingAddress.fullName}<br />
                                    <strong>Địa Chỉ: </strong>
                                    {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                                    {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                                </p>
                            </div>
                        </li>
                        <li>
                            <div className="card card-body">
                                <h2>Phương Thức Thanh Toán</h2>
                                <p>
                                    <strong>Phương Thức: </strong>{cart.paymentMethod}
                                </p>
                            </div>
                        </li>
                        <li>
                            <div className="card card-body">
                                <h2>Giỏ Hàng</h2>
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
                                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                    </div>
                                                    <div>{item.quantity} x {NumberWithCommas(item.price*23000)} = {NumberWithCommas(item.quantity * item.price*23000)} VNĐ</div>
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
                                <h2>Chi Tiết Chi Phí</h2>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Sản Phẩm</div>
                                    <div>{NumberWithCommas(cart.itemsPrice*23000)} VNĐ</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Vận Chuyển</div>
                                    <div>{NumberWithCommas(toPrice(cart.shippingPrice*23000))} VNĐ</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div>Thuế</div>
                                    <div>{NumberWithCommas(cart.taxPrice*23000)} VNĐ</div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <div><strong>Tổng Chi Phí</strong></div>
                                    <div><strong>{NumberWithCommas(toPrice(cart.totalPrice*23000))} VNĐ</strong></div>
                                </div>
                            </li>
                            <li>
                                <div className="row">
                                    <button
                                        type="button"
                                        className="primary block"
                                        onClick={placeOrderHandler}
                                        disabled={cart.cartItems.length === 0 ? true : false}>
                                        Đặt Hàng
                                    </button>
                                </div>
                            </li>
                            {
                                loading && <LoadingBox></LoadingBox>
                            }
                            {
                                error && <MessageBox variant="danger">{error}</MessageBox>
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
