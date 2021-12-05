import React, { useEffect, useState } from 'react';
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
    const { loading, error, products } = productList;//get info list of product
    const getToken = useSelector((state) => state.token);
    const [page, setPage] = useState(1)

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
            dispatch({ type: PRODUCT_DELETE_RESET });
        }
        dispatch(listProducts(page));
    }, [createdProduct, dispatch, props.history, successCreate, successDelete, page]);

    const deleteHandler = (product) => {
        if (window.confirm('Are you sure to delete?')) {
            dispatch(deleteProduct(product._id, getToken));
        }
    };
    const createHandler = () => {
        dispatch(createProduct(getToken));//implement create product action
    };

    const prevPage = () => {
        const pg = page - 1;
        dispatch(listProducts(pg))
        setPage(pg)
    }
    const nextPage = () => {
        const pg = page + 1;
        dispatch(listProducts(pg))
        setPage(pg)
    }
    return (
        <div>
            <div className="row">
                <h1>Products</h1>
                <button type="button" className="primary" onClick={createHandler}>
                    Create New Product
                </button>
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
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
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
                                <td>
                                    <button type="button" className="small" onClick={() => props.history.push(`/product/${product._id}/edit`)}>
                                        Edit
                                    </button>
                                    <button type="button" className="small" onClick={() => deleteHandler(product)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <button
                        className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l"
                        onClick={prevPage}
                    >
                        Prev
                    </button>
                    <button
                        className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r"
                        onClick={nextPage}
                    >
                        Next
                    </button>
                </table>
            )}

        </div>
    );
}
