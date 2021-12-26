import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOrder, listOrders } from '../redux/actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_DELETE_RESET } from '../redux/constants/orderConstants';

export default function OrderListScreen(props) {
    const sellerMode = props.match.path.indexOf('/seller') >= 0;
    const orderList = useSelector((state) => state.orderList);
    const { loading, error, orders } = orderList;
    const orderDelete = useSelector((state) => state.orderDelete);
    const token = useSelector(state => state.token)
    const auth = useSelector(state => state.auth)
    const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
    } = orderDelete;
    const { order = 'new' } = useParams()
    const { status = '' } = useParams()

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: ORDER_DELETE_RESET });
        dispatch(listOrders({ seller: sellerMode ? auth.user._id : '', order }, token, status));
    }, [dispatch, successDelete, token, sellerMode, auth.user._id, order]);

    const deleteHandler = (order) => {
        if (window.confirm('Are you sure to delete?')) {
            dispatch(deleteOrder(order._id, token));//del by id
        }
    };

    const getFilterUrl = (filter) => {
        const sortOrder = filter.order || order;
        return `/orderlist/order/${sortOrder}`;
    };

    return (
        <div>
            <h1>Orders</h1>
            {loadingDelete && <LoadingBox></LoadingBox>}
            {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
            <div className='title_label'>
                Sort by{' '}
                <select
                    value={order}
                    onChange={(e) => {
                        props.history.push(getFilterUrl({ order: e.target.value }));
                    }}
                >
                    <option value="new">Newest Orders</option>
                    <option value="old">Oldest Orders</option>
                </select>

                
                <Link to ="/orderlist/deleted" >
                <button type="button" className="primary del_btn">
                        Đơn hàng đã xoá
                </button>
                </Link>
            </div>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user.name}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>{order.totalPrice.toFixed(2)}</td>
                                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                                <td>
                                    {order.isDelivered
                                        ? order.deliveredAt.substring(0, 10)
                                        : 'No'}
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="small"
                                        onClick={() => {
                                            props.history.push(`/order/${order._id}`);
                                        }}
                                    >
                                        Details
                                    </button>
                                    <button
                                        type="button"
                                        className="small"
                                        onClick={() => deleteHandler(order)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
