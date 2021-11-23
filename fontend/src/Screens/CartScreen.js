import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { addToCart, removeFromCart } from "../redux/actions/cartActions";
import MessageBox from "../components/MessageBox";

export default function CartScreen(props) {
    const dispatch = useDispatch();
    const productId = props.match.params.id;
    const quantity = props.location.search ?
        Number(props.location.search.split("=")[1]) :
        1;
    const cart = useSelector(state => state.cart);
    const { cartItems } = cart;

    useEffect(() => {
        dispatch(addToCart(productId, quantity))
    }, [dispatch, productId, quantity]);

    const removeFromCartHandler = (idProduct) => {
        dispatch(removeFromCart(idProduct));
    }

    const checkoutHandler = ()=>{
        props.history.push('/signin?redirec=shipping')
    }


    return (
        <div className="row top">
            <div className="col-2">
                <h1> Shopping Cart </h1>
                {
                    cartItems.length === 0
                        ? (<MessageBox>Cart is empty.
                            <Link to="/">Go to shopping</Link>
                        </MessageBox>)
                        :
                        (
                            <ul>
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
                                                    <Link to={`/api/product/${item.product}`}>{item.name}</Link>
                                                </div>

                                                <div>
                                                    <select
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            dispatch(
                                                                addToCart(item.product,Number(e.target.value))
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

                                                <div>${item.price}</div>

                                                <div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCartHandler(item.product)}>
                                                        Delete
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
            <div className="col-1">
                <div className="card card-body">
                    <ul>
                        <li>
                            <h2>
                                Total ({cartItems.reduce((a, c) => (a + c.quantity), 0)} items) :
                                $ {cartItems.reduce((a, c) => (a + c.quantity * c.price), 0)}
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