import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { deliverOrder, detailsOrder, payOrder } from '../redux/actions/orderActions';
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import Axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET, } from '../redux/constants/orderConstants.js'
import NumberWithCommas from '../components/utils/NumberWithCommas/NumberWithCommas.js'


export default function OrderScreen(props) {

    const firstLogin = localStorage.getItem("firstLogin");
    if (!firstLogin) {
        props.history.push('/signin');
    }
    const toPrice = (num) => Number(num.toFixed(3));
    const [sdkReady, setSdkReady] = useState(false);
    const orderId = props.match.params.id;
    const orderDetails = useSelector(state => state.orderDetails);
    const { order, loading, error } = orderDetails;
    const orderPay = useSelector(state => state.orderPay);
    const { loading: loadingPay, error: errorPay, success: successPay } = orderPay;
    const token = useSelector(state => state.token);
    const auth = useSelector(state => state.auth);
    const orderDeliver = useSelector((state) => state.orderDeliver);
    if (order !== undefined) {
        order.priceUSD = Number((order.totalPrice / 22950).toFixed(2))
    }
    const {
        loading: loadingDeliver,
        error: errorDeliver,
        success: successDeliver,
    } = orderDeliver;
    const dispatch = useDispatch();
    useEffect(() => {
        const addPayPalScript = async () => {
            const { data } = await Axios.get('/api/config/paypal');
            const script = document.createElement('script');
            script.type = "text/javascript";
            script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
            script.async = true;
            script.onload = () => {
                setSdkReady(true);
            };
            document.body.appendChild(script);
        }
        if (
            !order ||
            successPay ||
            successDeliver ||
            (order && order._id !== orderId)
        ) {
            dispatch({ type: ORDER_PAY_RESET });
            dispatch({ type: ORDER_DELIVER_RESET });
            dispatch(detailsOrder(orderId, token, ''));
        }
        else {
            if (!order.isPaid) {
                if (!window.paypal) {
                    addPayPalScript();
                } else {
                    setSdkReady(true);
                }
            }
        }
    }, [dispatch, order, orderId, sdkReady, successPay, successDeliver, token]);

    const deliverHandler = () => {
        dispatch(deliverOrder(order._id, token));
    };

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(order, paymentResult, token))
    }
    return loading ? (<LoadingBox></LoadingBox>) :
        error ? (<MessageBox variant="danger">{error}</MessageBox>) :
            (
                <div>
                    <div className="row top">
                        <div className="col-2">
                            <ul>
                                <li>
                                    <div className="card card-body">
                                        <h2>Th??ng Tin V???n Chuy???n</h2>
                                        <p>
                                            <strong>H??? V?? T??n: </strong>{order.shippingAddress.fullName}<br />
                                            <strong>?????a Ch???: </strong>
                                            {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                                            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                        </p>
                                        {
                                            order.isDelivered ?
                                                <MessageBox variant="success">Giao v??o L??c {order.deliveredAt}</MessageBox> :
                                                <MessageBox variant="danger">Ch??a V???n Chuy???n</MessageBox>
                                        }
                                    </div>
                                </li>
                                <li>
                                    <div className="card card-body">
                                        <h2>Ph????ng Th???c Thanh To??n</h2>
                                        <p>
                                            <strong>Ph????ng Th???c: </strong>{order.paymentMethod}
                                        </p>
                                        {
                                            order.isPaid ?
                                                <MessageBox variant="success">Thanh To??n L??c {order.paidAt}</MessageBox> :
                                                <MessageBox variant="danger">Ch??a Thanh To??n</MessageBox>
                                        }
                                    </div>
                                </li>
                                <li>
                                    <div className="card card-body">
                                        <h2>Gi??? H??ng</h2>
                                        <ul>
                                            {
                                                order.orderItems.map(item => (
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
                                                            <div>{item.quantity} x {NumberWithCommas(item.price)} = {NumberWithCommas(item.quantity * item.price)} VN??</div>
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
                                        <h2>Chi Ti???t Chi Ph??</h2>
                                    </li>
                                    <li>
                                        <div className="row">
                                            <div>S???n Ph???m</div>
                                            <div>{NumberWithCommas(order.itemsPrice)} VN??</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="row">
                                            <div>V???n Chuy???n</div>
                                            <div>{NumberWithCommas(toPrice(order.shippingPrice))} VN??</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="row">
                                            <div>Thu???</div>
                                            <div>{NumberWithCommas(order.taxPrice)} VN??</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="row">
                                            <div><strong>T???ng Chi Ph??</strong></div>
                                            <div><strong>{NumberWithCommas(toPrice(order.totalPrice))} VN??</strong></div>
                                        </div>
                                    </li>
                                    {
                                        !order.isPaid && (
                                            <li>
                                                {
                                                    !sdkReady ?
                                                        (<LoadingBox></LoadingBox>) :
                                                        (
                                                            <>
                                                                {
                                                                    errorPay && <MessageBox variant="danger">{errorPay}</MessageBox>
                                                                }
                                                                {
                                                                    loadingPay && <LoadingBox></LoadingBox>
                                                                }
                                                                <PayPalButton
                                                                    amount={order.priceUSD}
                                                                    onSuccess={successPaymentHandler}
                                                                ></PayPalButton>
                                                            </>
                                                        )
                                                }
                                            </li>
                                        )
                                    }
                                    {auth.user.isAdmin && order.isPaid && !order.isDelivered && (
                                        <li>
                                            {loadingDeliver && <LoadingBox></LoadingBox>}
                                            {errorDeliver && (
                                                <MessageBox variant="danger">{errorDeliver}</MessageBox>
                                            )}
                                            <button
                                                type="button"
                                                className="primary block"
                                                onClick={deliverHandler}
                                            >
                                                V???n Chuy???n
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )
}
