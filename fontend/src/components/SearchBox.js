import React, { useState } from 'react';
import {  useSelector } from 'react-redux';

//search box redirect user to search pages
export default function SearchBox(props) {
    const auth = useSelector(state => state.auth)
    const orders = useSelector(state => state.orderList.orders)
    const products = useSelector(state => state.productList.products)
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const submitHandlerSearchIdOrder = (e) => {
        document.querySelector('#q').value = ''
        e.preventDefault();
        for (const order of orders) {
            if (order._id === id) {
                props.history.push(`/order/${id}`)
            }
        }
    } 
    const submitHandlerSearchProducts = (e) => {
        document.querySelector('#id').value = ''
        e.preventDefault();
        for (const product of products) {
            if (product._id === id) {
                props.history.push(`/productlist/id/${id}`)
            }
        }
    } 
    const submitHandler = (e) => {
        e.preventDefault();
        props.history.push(`/search/name/${name}`);
    };
    return (
        <>
            {auth.user.isAdmin &&
                <form className="search" onSubmit={submitHandlerSearchIdOrder}>
                    <div className="row">
                        <input
                            type="text"
                            name="q"
                            id="q"
                            onChange={(e) => setId(e.target.value)}
                        ></input>
                        <button className="primary" type="submit">
                            <i className="fa fa-search"></i>
                        </button>
                    </div>
                </form>
            }
{/*             {auth.user.isAdmin && window.location.pathname === '/productlist' && 
                <form className="search" onSubmit={ (window.location.pathname === '/productlist' || window.location.pathname === 'productlist/seller') && submitHandlerSearchProducts}>
                    <div className="row">
                        <input
                            type="text"
                            name="id"
                            id="q"
                            onChange={(e) => setId(e.target.value)}
                        ></input>
                        <button className="primary" type="submit">
                            <i className="fa fa-search"></i>
                        </button>
                    </div>
                </form>
            }
             */}
            {!auth.user.isAdmin &&
                <form className="search" onSubmit={submitHandler}>
                    <div className="row">
                        <input
                            type="text"
                            name="q"
                            id="q"
                            onChange={(e) => setName(e.target.value)}
                        ></input>
                        <button className="primary" type="submit">
                            <i className="fa fa-search"></i>
                        </button>
                    </div>
                </form>
            }
        </>
    );
}
