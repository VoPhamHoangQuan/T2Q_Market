import React, { useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../redux/actions/cartActions';

export default function ShippingAddressScreen(props) {

    const cart = useSelector(state => state.cart);
    const {shippingAddress}  = cart;
    const [fullName, setFullName] = useState(shippingAddress.fullName);
    const [address, setAddress] = useState(shippingAddress.address);
    const [city, setCity] = useState(shippingAddress.city);
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
    const [country, setCountry] = useState(shippingAddress.country);
    const dispatch = useDispatch();
    const submitHandler = (e)=>{
        e.preventDefault();
        dispatch(saveShippingAddress({fullName, address, city, postalCode, country}));
        //TODO: Dispatch save shipping address action
        props.history.push('/payment');
    }

    return (
        <div>
            <CheckoutSteps step1></CheckoutSteps>
            <form className='form' onSubmit={submitHandler}>
                <div>
                    <h1>Shipping Adress</h1>
                </div>
                <div>
                    <label htmlFor="fullName">Full Name</label>
                    <input type="text"
                        id="fullName"
                        value={fullName}
                        placeholder="Enter full name"
                        onChange={e => setFullName(e.target.value)}
                        required
                    ></input>
                </div>
                <div>
                    <label htmlFor="address">Address</label>
                    <input type="text"
                        id="address"
                        value={address}
                        placeholder="Enter address"
                        onChange={e => setAddress(e.target.value)}
                        required
                    ></input>
                </div>
                <div>
                    <label htmlFor="city">City</label>
                    <input type="text"
                        id="city"
                        value={city}
                        placeholder="Enter city"
                        onChange={e => setCity(e.target.value)}
                        required
                    ></input>
                </div>
                <div>
                    <label htmlFor="postalCode">Postal Code</label>
                    <input type="text"
                        id="postalCode"
                        value={postalCode}
                        placeholder="Enter postal code"
                        onChange={e => setPostalCode(e.target.value)}
                        required
                    ></input>
                </div>
                <div>
                    <label htmlFor="country">Country</label>
                    <input type="text"
                        id="country"
                        value={country}
                        placeholder="Enter country"
                        onChange={e => setCountry(e.target.value)}
                        required
                    ></input>
                </div>

                <div>
                    <label/>
                    <button className = "primary" type = "submit">
                        Continue
                    </button>
                </div>
            </form>
        </div>
    )
}
