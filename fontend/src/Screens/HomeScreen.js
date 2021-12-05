import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product"
import LoadingBox from "../components/LoadingBox"
import MessageBox from "../components/MessageBox"
import { listProducts } from "../redux/actions/productActions";

export default function HomeScreen() {
    const dispatch = useDispatch();
    const productList = useSelector(state => state.productList);
    const { loading, error, products } = productList;
    const [page, setPage] = useState(1)
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
    useEffect(() => {
        dispatch(listProducts(page))
    }, [dispatch, page])
    return (
        <div className="row center">
            {
                loading ?
                    <LoadingBox></LoadingBox> :
                    error ?
                        <MessageBox variant='danger'>{error}</MessageBox> :
                        (products.map(product => (
                            <Product key={product._id} product={product}></Product>
                        )))


            }
            <div>
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
            </div>
        </div>
    )
}