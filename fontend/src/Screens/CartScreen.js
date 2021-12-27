import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { addToCart, removeFromCart } from "../redux/actions/cartActions";
import MessageBox from "../components/MessageBox";
import NumberWithCommas from '../components/utils/NumberWithCommas/NumberWithCommas.js'

export default function CartScreen(props) {
    const dispatch = useDispatch();
    const productId = props.match.params.id;
    const quantity = props.location.search ?
        Number(props.location.search.split("=")[1]) :
        1;
    const cart = useSelector(state => state.cart);
    const { cartItems, error } = cart;

    useEffect(() => {
        dispatch(addToCart(productId, quantity))
    }, [dispatch, productId, quantity]);

    const removeFromCartHandler = (idProduct) => {
        dispatch(removeFromCart(idProduct));
    }

    const checkoutHandler = () => {
        props.history.push('/shipping')
    }


    return (
        <div className="row top">
            <div className="col-2">
                <div className="card">
                    <h1 className="card-body"> GIỎ HÀNG </h1>
                    {error && <MessageBox variant="danger">{error}</MessageBox>}
                    {
                        cartItems.length === 0
                            ? (<MessageBox>Cart is empty.
                                <Link to="/">Go to shopping</Link>
                            </MessageBox>)
                            :
                            (
                                <ul className="card-body">
                                    {
                                        cartItems.map(item => (
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

                                                    <div className="min-5">
                                                        <select
                                                            value={item.quantity}
                                                            onChange={(e) =>
                                                                dispatch(
                                                                    addToCart(item.product, Number(e.target.value))
                                                                )
                                                            }
                                                        >
                                                            {
                                                                [...Array(item.amount).keys()].map(el =>
                                                                (
                                                                    <option key={el + 1}
                                                                        value={el + 1}>
                                                                        {el + 1}
                                                                    </option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>

                                                    <div className="min-10">{NumberWithCommas(item.price * 23000)} VNĐ</div>

                                                    <div>
                                                        <button
                                                            className="Delbtn"
                                                            type="button"
                                                            onClick={() => removeFromCartHandler(item.product)}>
                                                            <i class="far fa-trash-alt margin-right"> Xóa</i>
                                                        </button>
                                                    </div>

                                                </div>
                                            </li>
                                        ))
                                    }
                                </ul>
                            )
                    }
                </div>

            </div>
            <div className="col-1">
                <div className="card card-body">
                    <ul>
                        <li>
                            <h2>
                                Total ({cartItems.reduce((a, c) => (a + c.quantity), 0)} items) : 
                                 {cartItems.reduce((a, c) => ( NumberWithCommas(a + c.quantity * c.price *23000)), 0)} VNĐ
                            </h2>
                        </li>

                        <li>
                            <button
                                type="button"
                                onClick={checkoutHandler}
                                className="primary block"
                                disabled={cartItems.length === 0}>
                                Proceed to checkout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}