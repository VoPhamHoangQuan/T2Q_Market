import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../redux/actions/cartActions';

export default function ShippingAddressScreen(props) {

    const firstLogin = localStorage.getItem("firstLogin");
    if (!firstLogin) {
        props.history.push('/signin')
    }
    const cart = useSelector(state => state.cart);
    const { shippingAddress } = cart;
    const [lat, setLat] = useState(shippingAddress.lat);
    const [lng, setLng] = useState(shippingAddress.lng);
    const userAddressMap = useSelector((state) => state.userAddressMap);
    const { address: addressMap } = userAddressMap;
    const [fullName, setFullName] = useState(shippingAddress.fullName);
    const [address, setAddress] = useState(shippingAddress.address);
    const [city, setCity] = useState(shippingAddress.city);
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
    const [country, setCountry] = useState(shippingAddress.country);
    const dispatch = useDispatch();
    const submitHandler = (e) => {
        e.preventDefault();
        const newLat = addressMap ? addressMap.lat : lat;
        const newLng = addressMap ? addressMap.lng : lng;
        if (addressMap) {
            setLat(addressMap.lat);
            setLng(addressMap.lng);
        }
        let moveOn = true;
        if (!newLat || !newLng) {
            moveOn = window.confirm(
                'You did not set your location on map. Continue?'
            );
        }
        if (moveOn) {
            dispatch(
                saveShippingAddress({
                    fullName,
                    address,
                    city,
                    postalCode,
                    country,
                    lat: newLat,
                    lng: newLng,
                })
            );
            props.history.push('/payment');
        }
    };
    const chooseOnMap = () => {
        dispatch(saveShippingAddress({
            fullName,
            address,
            city,
            postalCode,
            country,
            lat,
            lng,
        }));
        //TODO: Dispatch save shipping address action
        props.history.push('/map');
    }

    return (
        <div>
            <CheckoutSteps step1 step2></CheckoutSteps>
            <form className='form card' onSubmit={submitHandler}>
                <div>
                    <h1>Th??ng Tin V???n Chuy???n</h1>
                </div>
               
                    <div>
                        <label htmlFor="fullName">H??? V?? T??n</label>
                        <input type="text"
                            id="fullName"
                            value={fullName}
                            placeholder="Nh???p h??? v?? t??n"
                            onChange={e => setFullName(e.target.value)}
                            required
                        ></input>
                    </div>
                    <div>
                        <label htmlFor="address">?????a Ch???</label>
                        <input type="text"
                            id="address"
                            value={address}
                            placeholder="Nh???p ?????a ch???"
                            onChange={e => setAddress(e.target.value)}
                            required
                        ></input>
                    </div>
                    <div>
                        <label htmlFor="city">Th??nh Ph???</label>
                        <input type="text"
                            id="city"
                            value={city}
                            placeholder="Nh???p t??n th??nh ph???"
                            onChange={e => setCity(e.target.value)}
                            required
                        ></input>
                    </div>
                    <div>
                        <label htmlFor="postalCode">Postal Code</label>
                        <input type="text"
                            id="postalCode"
                            value={postalCode}
                            placeholder="Nh???p postal code"
                            onChange={e => setPostalCode(e.target.value)}
                            required
                        ></input>
                    </div>
                    <div>
                        <label htmlFor="country">Qu???c Gia</label>
                        <input type="text"
                            id="country"
                            value={country}
                            placeholder="Nh???p t??n qu???c gia"
                            onChange={e => setCountry(e.target.value)}
                            required
                        ></input>
                    </div>
                    <div>
                        <label htmlFor="chooseOnMap">V??? Tr??</label>
                        <button type="button" onClick={chooseOnMap}>
                            Ch???n V??? Tr?? Tr??n B???n ?????
                        </button>
                    </div>
                

                <div>
                    <label />
                    <button className="primary" type="submit">
                        Ti???p T???c
                    </button>
                </div>
            </form>
        </div>
    )
}
