import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Rating from "../components/Rating";
import { detailProduct } from "../redux/actions/productActions";

export default function ProductScreen(props) {
    const dispatch = useDispatch();
    const productId = props.match.params.id;
    const productDetail = useSelector(state => state.productDetail);
    const { loading, error, product } = productDetail;
    const [quantity, setQuantity] = useState(1);

    const addToCartHandler = () => {
        props.history.push(`/cart/${productId}?qty=${quantity}`);
    }

    useEffect(() => {
        dispatch(detailProduct(productId))
    }, [dispatch, productId]);


    return (

        <div className="row center">
            {
                loading ?
                    <LoadingBox></LoadingBox> :
                    error ?
                        <MessageBox variant='danger'>{error}</MessageBox> :
                        (
                            <React.Fragment>
                                {/* <Link to="/">Home Page</Link> */}
                                <div className="row top">
                                    <div className="col-2">
                                        <img className="large" src={product.image} alt={product.name} />
                                    </div>
                                    <div className="col-1 product-info">
                                        <ul>
                                            <li><h1>{product.name}</h1></li>
                                            <li><Rating rating={product.rating} numReview={product.numReview}></Rating></li>
                                            <li>Price: ${product.price}</li>
                                            <li><p className="long-paragraph">Description: {product.description}</p></li>
                                        </ul>
                                    </div>
                                    <div className="col-1">
                                        <div className="card card-body">
                                            <ul>
                                                <li>
                                                    <div className="row">
                                                        <div>Price</div>
                                                        <div>{product.price}</div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="row">
                                                        <div>Status</div>
                                                        <div>{product.amount > 0 ?
                                                            <span className="success">In stock</span>
                                                            : <span className="danger">Out Of stock</span>}
                                                        </div>
                                                    </div>
                                                </li>

                                                {
                                                    product.amount > 0 && (
                                                        <React.Fragment>
                                                            <li>
                                                                <div className="row">
                                                                    <div>Quantity</div>
                                                                    <div>
                                                                        <select value={quantity}
                                                                            onChange={e => setQuantity(e.target.value)}
                                                                        >
                                                                            {
                                                                                [...Array(product.amount).keys()].map(
                                                                                    el =>
                                                                                    (
                                                                                        <option key={el + 1}
                                                                                            value={el + 1}>
                                                                                            {el + 1}
                                                                                        </option>
                                                                                    ))
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li><button onClick={addToCartHandler}
                                                                className="primary block">Add To Cart</button></li>
                                                        </React.Fragment>
                                                    )
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        )
            }
        </div>



    )
}