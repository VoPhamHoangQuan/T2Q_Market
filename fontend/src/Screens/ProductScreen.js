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
            alert('Xin mời nhập nhận xét');
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
                                    <li className="price"><strong>{NumberWithCommas( product.price * 23000)} VNĐ</strong></li>
                                    <li>
                                        <strong>MÔ TẢ SẢN PHẨM:</strong>
                                        <p>{product.description}</p>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-1">
                                <div className="card card-body">
                                    <ul>
                                        <li>
                                            <strong>NHÀ CUNG CẤP{' '}</strong>
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
                                                <div><strong>Giá</strong></div>
                                                <div className="price">{NumberWithCommas(product.price * 23000)} VNĐ</div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="row">
                                                <div><strong>Trạng Thái</strong></div>
                                                <div>
                                                    {product.amount > 0 ? (
                                                        <span className="success">Còn Hàng</span>
                                                    ) : (
                                                        <span className="danger">Hết Hàng</span>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                        {product.amount > 0 && (
                                            <>
                                                <li>
                                                    <div className="row">
                                                        <div><strong>Số Lượng</strong></div>
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
                                                        Thêm Vào Giỏ Hàng
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
                        <h2 className="card-body" id="reviews">ĐÁNH GIÁ SẢN PHẨM</h2>
                        {product.reviews.length === 0 && (
                            <MessageBox>Hiện chưa có nhận xét nào.</MessageBox>
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
                                            <h2>Để lại nhận xét của bạn giúp chúng tôi phục vụ bạn tốt hơn. Trân trọng.</h2>
                                        </div>
                                        <div>
                                            <label htmlFor="rating">Đánh giá</label>
                                            <select
                                                id="rating"
                                                value={rating}
                                                onChange={(e) => setRating(e.target.value)}
                                            >
                                                <option value="">Select...</option>
                                                <option value="1">1- Quá Tệ</option>
                                                <option value="2">2- Tệ</option>
                                                <option value="3">3- Trung Bình</option>
                                                <option value="4">4- Tốt</option>
                                                <option value="5">5- Tuyệt Vời</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="comment">Nhận xét</label>
                                            <textarea
                                                id="comment"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            ></textarea>
                                        </div>
                                        <div>
                                            <label />
                                            <button className="primary" type="submit">
                                                Gửi
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
                                        Vui lòng <Link to="/signin">đăng nhập</Link> để nhận xét sản phẩm
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