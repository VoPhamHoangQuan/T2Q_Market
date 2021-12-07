import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product"
import LoadingBox from "../components/LoadingBox"
import MessageBox from "../components/MessageBox"
import { listProducts } from "../redux/actions/productActions";
import { listTopSellers } from '../redux/actions/userActions';
import { Link } from 'react-router-dom';

export default function HomeScreen() {
    const dispatch = useDispatch();
    const productList = useSelector(state => state.productList);
    const { loading, error, products } = productList;
    // const [page, setPage] = useState(1)
    // const prevPage = () => {
    //     const pg = page - 1;
    //     dispatch(listProducts({}))
    //     setPage(pg)
    // }
    // const nextPage = () => {
    //     const pg = page + 1;
    //     dispatch(listProducts(pg))
    //     setPage(pg)
    // }

    const userTopSellersList = useSelector((state) => state.userTopSellersList);
    const {
        loading: loadingSellers,
        error: errorSellers,
        users: sellers,
    } = userTopSellersList;

    useEffect(() => {
        dispatch(listProducts({}))
        dispatch(listTopSellers())
    }, [dispatch])
    return (
        <div className="row center">
            <h2>Top Sellers</h2>
            {loadingSellers ? (
                <LoadingBox></LoadingBox>
            ) : errorSellers ? (
                <MessageBox variant="danger">{errorSellers}</MessageBox>
            ) : (
                <>
                    {sellers.length === 0 && <MessageBox>No Seller Found</MessageBox>}
                    <Carousel showArrows autoPlay showThumbs={false}>
                        {sellers.map((seller) => (
                            <div key={seller._id}>
                                <Link to={`/seller/${seller._id}`}>
                                    <img src={seller.seller.logo} alt={seller.seller.name} />
                                    <p className="legend">{seller.seller.name}</p>
                                </Link>
                            </div>
                        ))}
                    </Carousel>
                </>
            )}
            <h2>Featured Products</h2>
            {
                loading ?
                    <LoadingBox></LoadingBox> :
                    error ?
                        <MessageBox variant='danger'>{error}</MessageBox> :
                        (
                            <>
                                {products.length === 0 && <MessageBox>No Product Found</MessageBox>}
                                <div className="row center">
                                    {products.map((product) => (
                                        <Product key={product._id} product={product}></Product>
                                    ))}
                                </div>
                            </>


                        )}
            {/* <div>
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
            </div> */}
        </div>
    )
}