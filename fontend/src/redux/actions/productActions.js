import {
    PRODUCT_DETAIL_FAIL,
    PRODUCT_DETAIL_REQUEST,
    PRODUCT_DETAIL_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS
} from "../constants/productConstants";
import Axios from "axios";


export const listProducts = () => async (dispatch) => {
    dispatch({
        type: PRODUCT_LIST_REQUEST,
    });
    try {
        const { data } = await Axios.get("/api/products");
        dispatch({
            type: PRODUCT_LIST_SUCCESS,
            payload: data,
        });
    } catch (err) {
        dispatch({
            type: PRODUCT_LIST_FAIL,
            payload: err.message,
        });
    }
}

export const detailProduct = (productId) => async (dispatch) => {
    dispatch({
        type: PRODUCT_DETAIL_REQUEST
    })
    try {
        const { data } = await Axios.get(`/api/products/${productId}`);
        dispatch({
            type: PRODUCT_DETAIL_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: PRODUCT_DETAIL_FAIL,
            payload:
                err.response && err.response.data.message
                    ? err.response.data.message
                    : err.message
        })
    }
}