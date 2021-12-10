import Axios from "axios";
import {
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_REVIEW_CREATE_REQUEST,
  PRODUCT_REVIEW_CREATE_SUCCESS,
  PRODUCT_REVIEW_CREATE_FAIL,
  PRODUCT_CATEGORY_LIST_SUCCESS,
  PRODUCT_CATEGORY_LIST_REQUEST,
  PRODUCT_CATEGORY_LIST_FAIL,
} from "../constants/productConstants";

export const listProducts = ({ seller = '', 
                                pageNumber = '',
                                name = '', 
                                category = '', 
                                order = '',
                                min = 0,
                                max = 0,
                                rating = 0, }) => async (dispatch) => {
    // return function
    dispatch({
      type: PRODUCT_LIST_REQUEST,
    });
    try {
      //fetch data from backend
      const { data } = await Axios.get(
        `/api/products?pageNumber=${pageNumber}&seller=${seller}&name=${name}&category=${category}&min=${min}&max=${max}&rating=${rating}&order=${order}`
      );
      dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data }); //success, return data, change state of redux, update screen
    } catch (error) {
      dispatch({ type: PRODUCT_LIST_FAIL, payload: error.message }); //false, return message.
    }
  };
//get detail product by ID, same get list products
export const detailProduct = (productId) => async (dispatch) => {
  dispatch({ type: PRODUCT_DETAILS_REQUEST, payload: productId });
  try {
    const { data } = await Axios.get(`/api/products/${productId}`); //axios return a promise, so must to use await
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message //have error, render message
          ? error.response.data.message
          : error.message,
    });
  }
};

//create new product
export const createProduct = (token) => async (dispatch, getState) => {
  dispatch({ type: PRODUCT_CREATE_REQUEST });
  try {
    const { data } = await Axios.post('/api/products', {}, {
      headers: { Authorization: token },
    }
    );
    dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data, });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: PRODUCT_CREATE_FAIL, payload: message });
  }
};

//admin update product
export const updateProduct = (product, token) => async (dispatch, getState) => {
  dispatch({ type: PRODUCT_UPDATE_REQUEST, payload: product });
  try {
    //data delete by id
    const { data } = await Axios.put(`/api/products/${product._id}`, product, {
      //get author from token
      headers: { Authorization: token },//get user info response
    });
    dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: PRODUCT_UPDATE_FAIL, error: message });
  }
};
//admin delete product
export const deleteProduct = (productId, token) => async (dispatch, getState) => {
  dispatch({ type: PRODUCT_DELETE_REQUEST, payload: productId });
  try {
    const { data } = Axios.delete(`/api/products/${productId}`, {
      headers: { Authorization: token },
    });
    dispatch({ type: PRODUCT_DELETE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: PRODUCT_DELETE_FAIL, payload: message });
  }
};

// Reviews
export const createReview = (productId, review, token) => async (
  dispatch,
  getState
) => {
  dispatch({ type: PRODUCT_REVIEW_CREATE_REQUEST });
  try {
    const { data } = await Axios.post(
      `/api/products/${productId}/reviews`,
      review,
      {
        headers: { Authorization: token },
      }
    );
    dispatch({
      type: PRODUCT_REVIEW_CREATE_SUCCESS,
      payload: data.review,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: PRODUCT_REVIEW_CREATE_FAIL, payload: message });
  }
};

export const listProductCategories = () => async (dispatch) => {
  dispatch({
    type: PRODUCT_CATEGORY_LIST_REQUEST,
  });
  try {
    const { data } = await Axios.get(`/api/products/categories`);
    dispatch({ type: PRODUCT_CATEGORY_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PRODUCT_CATEGORY_LIST_FAIL, payload: error.message });
  }
};
