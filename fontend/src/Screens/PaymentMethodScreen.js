import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../redux/actions/cartActions';


export default function PaymentMethodScreen(props) {
    const firstLogin = localStorage.getItem("firstLogin");
    if(!firstLogin){
        props.history.push('/signin')
    } 
    const cart = useSelector(state=>state.cart);
    const {shippingAddress} = cart;
    if(!shippingAddress.address){
        props.history.push('/shipping')
    }
    const dispatch = useDispatch();
    const [paymentMethod, setPaymentMethod] = useState("PayPal");
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        props.history.push('/placeorder');
    }

    return (
        <div>
            <CheckoutSteps step1 step2 step3></CheckoutSteps>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Payment Method</h1>
                </div>
                <div>
                    <div>
                        <input
                            type="radio"
                            id="paypal"
                            value="PayPal"
                            name="paymentMethod"
                            onChange={e => setPaymentMethod(e.target.value)}
                            required
                            checked
                        />
                        <label htmlFor="paypal">PayPal</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="stripe"
                            value="Stripe"
                            name="paymentMethod"
                            onChange={e => setPaymentMethod(e.target.value)}
                            required
                        />
                        <label htmlFor="stripe">Stripe</label>
                    </div>
                </div>

                <div>
                    <button className="primary" type="submit" >Continue</button>
                </div>
            </form>
        </div>
    )
}
