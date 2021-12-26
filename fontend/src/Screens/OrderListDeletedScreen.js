import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { restoreOrder, listOrders } from '../redux/actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_RESTORE_RESET } from '../redux/constants/orderConstants'

export default function OrderListScreen(props) {
    const sellerMode = props.match.path.indexOf('/seller') >= 0;
    const orderList = useSelector((state) => state.orderList);
    const { loading, error, orders } = orderList;
    const orderRestore = useSelector(state => state.orderRestore)
    const token = useSelector(state => state.token)
    const auth = useSelector(state => state.auth)
    const {
        loading: loadingRestore,
        error: errorRestore,
        success: successRestore,
    } = orderRestore;
    const { order = 'new' } = useParams()
    const { status = 'deleted' } = useParams()

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: ORDER_RESTORE_RESET });
        dispatch(listOrders({ seller: sellerMode ? auth.user._id : '', order }, token, status));
    }, [dispatch, successRestore, token, sellerMode, auth.user._id, order, status]);

    const restoreHandle = (order) => {
        if (window.confirm('Are you sure to restore?')) {
            dispatch(restoreOrder(order._id, token));//del by id
        }
    };

    const getFilterUrl = (filter) => {
        const sortOrder = filter.order || order;
        return `/orderlist/deleted/order/${sortOrder}`;
    };

    return (
        <div>
            <h1>Orders</h1>
            {loadingRestore && <LoadingBox></LoadingBox>}
            {errorRestore && <MessageBox variant="danger">{errorRestore}</MessageBox>}
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

                <Link to="/orderlist">
                    <button type="button" className="primary del_btn">
                        <i class="fas fa-list margin-right"></i>
                        Danh sách đơn hàng
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
                            <th>SẢN PHẨM</th>
                            <th>TỔNG TIỀN</th>
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
                                <td>{[order.orderItems[0].name]}</td>
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
                                        className="small editbtn"
                                        onClick={() => restoreHandle(order)}
                                    >
                                        <i class="fas fa-undo margin-right"></i>
                                        Restore
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
