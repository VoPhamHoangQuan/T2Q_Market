import Axios from 'axios';
import { CART_EMPTY } from '../constants/cartConstants';
import {
    ORDER_CREATE_FAIL,
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_DELETE_FAIL,
    ORDER_DELETE_REQUEST,
    ORDER_DELETE_SUCCESS,
    ORDER_DELIVER_FAIL,
    ORDER_DELIVER_REQUEST,
    ORDER_DELIVER_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_LIST_FAIL,
    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_MINE_LIST_FAIL,
    ORDER_MINE_LIST_REQUEST,
    ORDER_MINE_LIST_SUCCESS,
    ORDER_PAY_FAIL,
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
} from '../constants/orderConstants';

//action to create new order in backend
export const createOrder = (order, token) => async (dispatch, getState) => {
    dispatch({ type: ORDER_CREATE_REQUEST, payload: order });
    try {
        const { data } = await Axios.post('/api/orders', order, {
            headers: {
                Authorization: token,//fetch token
            },
        });
        dispatch({ type: ORDER_CREATE_SUCCESS, payload: data.order });
        dispatch({ type: CART_EMPTY });
        localStorage.removeItem('cartItems');//empty carts after create new orders
    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};
//get order detail from backend
//get id from parameter url, and dispatch data
export const detailsOrder = (orderId, token) => async (dispatch, getState) => {
    dispatch({ type: ORDER_DETAILS_REQUEST, payload: orderId });
    try {//send ajax request
        const { data } = await Axios.get(`/api/orders/${orderId}`, {//
            headers: { Authorization: token },
        });
        dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });//data is order
    } catch (error) {//catch error and show
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: ORDER_DETAILS_FAIL, payload: message });
    }
};
//pay order and send an request to api
export const payOrder = (order, paymentResult, token) => async (dispatch, getState) => {
    dispatch({ type: ORDER_PAY_REQUEST, payload: { order, paymentResult } });;
    try {//send ajax request
        const { data } = Axios.put(`/api/orders/${order._id}/pay`, paymentResult, {
            headers: { Authorization: token},
        });
        dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
    } catch (error) {//catch error and show
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: ORDER_PAY_FAIL, payload: message });
    }
};

//return list order of current user
export const listOrderMine = (token) => async (dispatch, getState) => {
    dispatch({ type: ORDER_MINE_LIST_REQUEST });
    try {
        const { data } = await Axios.get('/api/orders/mine', {
            headers: {
                Authorization: token,
            },
        });
        dispatch({ type: ORDER_MINE_LIST_SUCCESS, payload: data });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: ORDER_MINE_LIST_FAIL, payload: message });
    }
};
//admin get all order
export const listOrders = (token) => async (dispatch, getState) => {
    dispatch({ type: ORDER_LIST_REQUEST });
    try {
        const { data } = await Axios.get('/api/orders', {
            headers: { Authorization: token },
        });
        console.log(data);
        dispatch({ type: ORDER_LIST_SUCCESS, payload: data });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: ORDER_LIST_FAIL, payload: message });
    }
};
//admin del order by id
export const deleteOrder = (orderId, token) => async (dispatch, getState) => {
    dispatch({ type: ORDER_DELETE_REQUEST, payload: orderId });
    try {
        const { data } = Axios.delete(`/api/orders/${orderId}`, {
            headers: { Authorization: token },
        });
        dispatch({ type: ORDER_DELETE_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        dispatch({ type: ORDER_DELETE_FAIL, payload: message });
    }
};
//admin change deliver status
export const deliverOrder = (orderId, token) => async (dispatch, getState) => {
    dispatch({ type: ORDER_DELIVER_REQUEST, payload: orderId });
    try {
        const { data } = Axios.put(
            `/api/orders/${orderId}/deliver`,
            {},
            {
                headers: { Authorization: token },
            }
        );
        dispatch({ type: ORDER_DELIVER_SUCCESS, payload: data });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: ORDER_DELIVER_FAIL, payload: message });
    }
};