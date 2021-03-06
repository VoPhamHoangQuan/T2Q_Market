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
                    <h1>Thông Tin Vận Chuyển</h1>
                </div>
               
                    <div>
                        <label htmlFor="fullName">Họ Và Tên</label>
                        <input type="text"
                            id="fullName"
                            value={fullName}
                            placeholder="Nhập họ và tên"
                            onChange={e => setFullName(e.target.value)}
                            required
                        ></input>
                    </div>
                    <div>
                        <label htmlFor="address">Địa Chỉ</label>
                        <input type="text"
                            id="address"
                            value={address}
                            placeholder="Nhập địa chỉ"
                            onChange={e => setAddress(e.target.value)}
                            required
                        ></input>
                    </div>
                    <div>
                        <label htmlFor="city">Thành Phố</label>
                        <input type="text"
                            id="city"
                            value={city}
                            placeholder="Nhập tên thành phố"
                            onChange={e => setCity(e.target.value)}
                            required
                        ></input>
                    </div>
                    <div>
                        <label htmlFor="postalCode">Postal Code</label>
                        <input type="text"
                            id="postalCode"
                            value={postalCode}
                            placeholder="Nhập postal code"
                            onChange={e => setPostalCode(e.target.value)}
                            required
                        ></input>
                    </div>
                    <div>
                        <label htmlFor="country">Quốc Gia</label>
                        <input type="text"
                            id="country"
                            value={country}
                            placeholder="Nhập tên quốc gia"
                            onChange={e => setCountry(e.target.value)}
                            required
                        ></input>
                    </div>
                    <div>
                        <label htmlFor="chooseOnMap">Vị Trí</label>
                        <button type="button" onClick={chooseOnMap}>
                            Chọn Vị Trí Trên Bản Đồ
                        </button>
                    </div>
                

                <div>
                    <label />
                    <button className="primary" type="submit">
                        Tiếp Tục
                    </button>
                </div>
            </form>
        </div>
    )
}
