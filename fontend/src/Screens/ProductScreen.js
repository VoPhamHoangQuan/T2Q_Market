import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Rating from "../components/Rating";
import { Link } from 'react-router-dom';
import { createReview, detailProduct } from "../redux/actions/productActions";
import { PRODUCT_REVIEW_CREATE_RESET } from '../redux/constants/productConstants';
import NumberWithCommas from '../components/utils/NumberWithCommas/NumberWithCommas.js'


export default function ProductScreen(props) {
    const dispatch = useDispatch();
    const productId = props.match.params.id;
    const productDetail = useSelector(state => state.productDetail);
    const { loading, error, product } = productDetail;
    const [quantity, setQuantity] = useState(1);

    const addToCartHandler = () => {
        props.history.push(`/cart/${productId}?qty=${quantity}`);
    }

    const token = useSelector(state => state.token)
    const auth = useSelector((state) => state.auth);
    const { isLogged } = auth

    const productReviewCreate = useSelector((state) => state.productReviewCreate);
    const {
        loading: loadingReviewCreate,
        error: errorReviewCreate,
        success: successReviewCreate,
    } = productReviewCreate;

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (successReviewCreate) {
            window.alert('Review Submitted Successfully');
            setRating('');
            setComment('');
            dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
        }
        dispatch(detailProduct(productId))
    }, [dispatch, productId, successReviewCreate]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (comment && rating) {
            dispatch(
                createReview(productId, { rating, comment, name: auth.user.name }, token)
            );
        } else {
            alert('Xin m???i nh???p nh???n x??t');
        }
    };

    return (
        <div>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <div>
                    <div className="card">
                        <div className="row top card-body">
                            <div className="col-1">
                                <img
                                    className="large"
                                    src={product.image}
                                    alt={product.name}
                                ></img>
                            </div>
                            <div className="col-1 card">
                                <ul className="card-body">
                                    <li>
                                        <h1>{product.name}</h1>
                                    </li>
                                    <li>
                                        <Rating
                                            rating={product.rating}
                                            numReviews={product.numReviews}
                                        ></Rating>
                                    </li>
                                    <li className="price"><strong>{NumberWithCommas( product.price)} VN??</strong></li>
                                    <li>
                                        <strong>M?? T??? S???N PH???M:</strong>
                                        <p>{product.description}</p>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-1">
                                <div className="card card-body">
                                    <ul>
                                        <li>
                                            <strong>NH?? CUNG C???P{' '}</strong>
                                            <h2>
                                                <Link to={`/seller/${product.seller._id}`}>
                                                    {product.seller.seller.name}
                                                </Link>
                                            </h2>
                                            <Rating
                                                rating={product.seller.seller.rating}
                                                numReviews={product.seller.seller.numReviews}
                                            ></Rating>
                                        </li>
                                        <li>
                                            <div className="row">
                                                <div><strong>Gi??</strong></div>
                                                <div className="price">{NumberWithCommas(product.price)} VN??</div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="row">
                                                <div><strong>Tr???ng Th??i</strong></div>
                                                <div>
                                                    {product.amount > 0 ? (
                                                        <span className="success">C??n H??ng</span>
                                                    ) : (
                                                        <span className="danger">H???t H??ng</span>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                        {product.amount > 0 && (
                                            <>
                                                <li>
                                                    <div className="row">
                                                        <div><strong>S??? L?????ng</strong></div>
                                                        <div>
                                                            <select
                                                                value={quantity}
                                                                onChange={(e) => setQuantity(e.target.value)}
                                                            >
                                                                {[...Array(product.amount).keys()].map(
                                                                    (x) => (
                                                                        <option key={x + 1} value={x + 1}>
                                                                            {x + 1}
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <button
                                                        onClick={addToCartHandler}
                                                        className="primary block"
                                                    >
                                                        Th??m V??o Gi??? H??ng
                                                    </button>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <h2 className="card-body" id="reviews">????NH GI?? S???N PH???M</h2>
                        {product.reviews.length === 0 && (
                            <MessageBox>Hi???n ch??a c?? nh???n x??t n??o.</MessageBox>
                        )}
                        <ul>
                            {product.reviews.map((review) => (
                                <li className="card-body" key={review._id}>
                                    <strong>{review.name}</strong>
                                    <Rating rating={review.rating} caption=" "></Rating>
                                    <p>{review.createdAt.substring(0, 10)}</p>
                                    <p>{review.comment}</p>
                                </li>
                            ))}
                            <li>
                                {isLogged ? (
                                    <form className="form" onSubmit={submitHandler}>
                                        <div>
                                            <h2>????? l???i nh???n x??t c???a b???n gi??p ch??ng t??i ph???c v??? b???n t???t h??n. Tr??n tr???ng.</h2>
                                        </div>
                                        <div>
                                            <label htmlFor="rating">????nh gi??</label>
                                            <select
                                                id="rating"
                                                value={rating}
                                                onChange={(e) => setRating(e.target.value)}
                                            >
                                                <option value="">Select...</option>
                                                <option value="1">1- Qu?? T???</option>
                                                <option value="2">2- T???</option>
                                                <option value="3">3- Trung B??nh</option>
                                                <option value="4">4- T???t</option>
                                                <option value="5">5- Tuy???t V???i</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="comment">Nh???n x??t</label>
                                            <textarea
                                                id="comment"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            ></textarea>
                                        </div>
                                        <div>
                                            <label />
                                            <button className="primary" type="submit">
                                                G???i
                                            </button>
                                        </div>
                                        <div>
                                            {loadingReviewCreate && <LoadingBox></LoadingBox>}
                                            {errorReviewCreate && (
                                                <MessageBox variant="danger">
                                                    {errorReviewCreate}
                                                </MessageBox>
                                            )}
                                        </div>
                                    </form>
                                ) : (
                                    <MessageBox>
                                        Vui l??ng <Link to="/signin">????ng nh???p</Link> ????? nh???n x??t s???n ph???m
                                    </MessageBox>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}