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
    }, [dispatch, successDelete, token, sellerMode, auth.user._id, order, status]);

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
            <h1>DANH SÁCH ĐƠN HÀNG</h1>
            {loadingDelete && <LoadingBox></LoadingBox>}
            {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
            <div className='title_label'>
                Sắp xếp theo{' '}
                <select
                    value={order}
                    onChange={(e) => {
                        props.history.push(getFilterUrl({ order: e.target.value }));
                    }}
                >
                    <option value="new">Đơn hàng mới nhất</option>
                    <option value="old">Đơn hàng cũ nhất</option>
                </select>


                <Link to="/orderlist/deleted" >
                    <button type="button" className="primary del_btn bold_white">
                        <i class="far fa-trash-alt margin-right"></i>
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
                            <th>NGƯỜI MUA</th>
                            <th>NGÀY TẠO</th>
                            <th>TỔNG</th>
                            <th>NGÀY THANH TOÁN</th>
                            <th>CHUYỂN HÀNG</th>
                            <th>TUỲ CHỌN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user.name}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>{order.totalPrice.toFixed(3)}</td>
                                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                                <td>
                                    {order.isDelivered
                                        ? order.deliveredAt.substring(0, 10)
                                        : 'No'}
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="small editbtn"
                                        onClick={() => {
                                            props.history.push(`/order/${order._id}`);
                                        }}
                                    >
                                        <i class="fas fa-info margin-right"></i>
                                        Chi tiết
                                    </button>
                                    <button
                                        type="button"
                                        className="small Delbtn"
                                        onClick={() => deleteHandler(order)}
                                    >
                                        <i class="far fa-trash-alt margin-right"></i>
                                        Xoá đơn hàng
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
