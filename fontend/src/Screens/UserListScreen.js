import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, listUsers } from '../redux/actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_DETAILS_RESET } from '../redux/constants/userConstants';

export default function UserListScreen(props) {
    const userList = useSelector((state) => state.userList);//use react-redux
    const token = useSelector((state) => state.token);//use react-redux
    const { loading, error, users } = userList;

    const userDelete = useSelector((state) => state.userDelete);
    const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
    } = userDelete;

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(listUsers(token));
        dispatch({
            type: USER_DETAILS_RESET,
        });
    }, [dispatch, successDelete, token]);
    const deleteHandler = (user) => {
        if (window.confirm('Are you sure?')) {
            dispatch(deleteUser(user._id, token));
        }
    };
    return (
        <div>
            <h1>DANH SÁCH TÀI KHOẢN</h1>
            {loadingDelete && <LoadingBox></LoadingBox>}
            {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
            {successDelete && (
                <MessageBox variant="success">User Deleted Successfully</MessageBox>
            )}
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>TÊN</th>
                            <th>EMAIL</th>
                            <th>QUYỀN BÁN HÀNG</th>
                            <th>QUYỀN QUẢN TRỊ</th>
                            <th>TUỲ CHỌN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isSeller ? 'YES' : ' NO'}</td>
                                <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="small editbtn"
                                        onClick={() => props.history.push(`/user/${user._id}/edit`)}
                                    >
                                        <i class="far fa-edit margin-right"></i>
                                        Chỉnh sửa
                                    </button>
                                    <button
                                        type="button"
                                        className="small Delbtn"
                                        onClick={() => deleteHandler(user)}
                                    >
                                        <i class="far fa-trash-alt margin-right"></i>
                                        Xoá tài khoản
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
