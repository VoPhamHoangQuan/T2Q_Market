import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    createProduct,
    deleteProduct,
    listProducts,
} from '../redux/actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {
    PRODUCT_CREATE_RESET,
    PRODUCT_DELETE_RESET,
} from '../redux/constants/productConstants';

export default function ProductListScreen(props) {
    const productList = useSelector((state) => state.productList);//get list product from redux store
    const { loading, error, products, page, pages } = productList;
    const getToken = useSelector((state) => state.token);
    const sellerMode = props.match.path.indexOf('/seller') >= 0;
    const auth = useSelector(state => state.auth)
    const { pageNumber = 1 } = useParams();

    //create
    const productCreate = useSelector((state) => state.productCreate);
    const {
        loading: loadingCreate,//rename properties
        error: errorCreate,
        success: successCreate,
        product: createdProduct,
    } = productCreate; //properties come from productCreate action result
    //delete
    const productDelete = useSelector((state) => state.productDelete);
    const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
    } = productDelete;

    const dispatch = useDispatch();

    useEffect(() => {
        if (successCreate) {// create successfully
            dispatch({ type: PRODUCT_CREATE_RESET });
            props.history.push(`/product/${createdProduct._id}/edit`);//redirect user to edit screen
        }
        if (successDelete) {//delete success
            if (auth.user.isSeller === false) {
                props.history.push('/productlist');//push new info to list product
            } else {
                props.history.push(`/productlist/seller`);//push new info to list product
            }
            dispatch({ type: PRODUCT_DELETE_RESET });
        }
        dispatch(
            listProducts({ seller: sellerMode ? auth.user._id : '', pageNumber })
        );
    }, [createdProduct, dispatch, props.history, successCreate, successDelete, sellerMode, auth.user._id, auth.user.isSeller, pageNumber,]);

    const deleteHandler = (product) => {
        if (window.confirm('Are you sure to delete?')) {
            dispatch(deleteProduct(product._id, getToken));
        }
    };
    const createHandler = () => {
        dispatch(createProduct(getToken));//implement create product action
    };
    return (
        <div>
            <div className="row">
                <h1>Products</h1>
                {auth.user.isSeller && (
                    <button type="button" className="primary" onClick={createHandler}>
                        Create New Product
                    </button>
                )}
            </div>
            {loadingDelete && <LoadingBox></LoadingBox>}
            {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}

            {loadingCreate && <LoadingBox></LoadingBox>}
            {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                                <th>AMOUNT</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.amount}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="small"
                                            onClick={() =>
                                                props.history.push(`/product/${product._id}/edit`)
                                            }
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="small"
                                            onClick={() => deleteHandler(product)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="row center pagination">
                        {auth.user.isAdmin && [...Array(pages).keys()].map((x) => (
                            <Link
                                className={x + 1 === page ? 'active' : ''}
                                key={x + 1}
                                to={`/productlist/pageNumber/${x + 1}`}
                            >
                                {x + 1}
                            </Link>
                        ))}
                        {auth.user.isSeller && [...Array(pages).keys()].map((x) => (
                            <Link
                                className={x + 1 === page ? 'active' : ''}
                                key={x + 1}
                                to={`/productlist/seller/pageNumber/${x + 1}`}
                            >
                                {x + 1}
                            </Link>
                        ))}
                    </div>
                </>
            )}

        </div>
    );
}
