import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import { showErrMsg, showSuccessMsg } from '../components/utils/notification/Notification'
import { dispatchLogin } from '../redux/actions/authAction'
import { useDispatch } from 'react-redux'
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';


const initialState = {
    email: '',
    password: '',
    err: '',
    success: ''
}

function Login() {
    const [user, setUser] = useState(initialState)
    const dispatch = useDispatch()
    const history = useHistory()

    const { email, password, err, success } = user

    const handleChangeInput = e => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value, err: '', success: '' })
    }


    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const res = await axios.post('/login', { email, password })
            setUser({ ...user, err: '', success: res.data.msg })

            localStorage.setItem('firstLogin', true)

            dispatch(dispatchLogin())
            history.push("/")

        } catch (err) {
            err.response.data.msg &&
                setUser({ ...user, err: err.response.data.msg, success: '' })
        }
    }

    const responseGoogle = async (response) => {
        try {
            const res = await axios.post('/google_login', { tokenId: response.tokenId })

            setUser({ ...user, error: '', success: res.data.msg })
            localStorage.setItem('firstLogin', true)

            dispatch(dispatchLogin())
            history.push('/')
        } catch (err) {
            err.response.data.msg &&
                setUser({ ...user, err: err.response.data.msg, success: '' })
        }
    }

    const responseFacebook = async (response) => {
        try {
            const { accessToken, userID } = response
            const res = await axios.post('/facebook_login', { accessToken, userID })

            setUser({ ...user, error: '', success: res.data.msg })
            localStorage.setItem('firstLogin', true)

            dispatch(dispatchLogin())
            history.push('/')
        } catch (err) {
            err.response.data.msg &&
                setUser({ ...user, err: err.response.data.msg, success: '' })
        }
    }

    return (
        <div className='block-center'>  
            <div className="login_page login-card">
                <i className="fas fa-user-circle fa-5x card-body head-color-icon"></i>
                <h2 className='card-body'>????NG NH???P</h2>
                {err && showErrMsg(err)}
                {success && showSuccessMsg(success)}

                <form className='card-body' onSubmit={handleSubmit}>
                    <div className='card-body row'>
                        <i className="fas fa-user fa-lg input-icon" />
                        <input className='login-input' type="text" placeholder="Nh???p ?????a ch??? email" id="email"
                            value={email} name="email" onChange={handleChangeInput} />
                    </div>

                    <div className='card-body row'>
                        <i className="fas fa-unlock fa-lg input-icon"></i>
                        <input className='login-input' type="password" placeholder="Nh???p m???t kh???u" id="password"
                            value={password} name="password" onChange={handleChangeInput} />
                    </div>

                    <div>
                        <button className='button-confirm' type="submit">X??C NH???N</button>
                    </div>
                    <div className='card-body row'>
                        <Link to="/forgot_password">Qu??n m???t kh???u?</Link>

                    </div>
                </form>



                <div className='social-container'>
                    <p style={{marginLeft:'0rem'}}>Ho???c ????ng nh???p b???ng</p>

                    <FacebookLogin
                        appId="1075528103201688"
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={responseFacebook}
                        cssClass="btnFacebook"
                        icon={<i className="fa fa-facebook facebook-icon"></i>}
                    >
                    </FacebookLogin>

                    <GoogleLogin
                        clientId="356446452190-7qdj4cqhkget0ubhcamgm3mb2ubla53g.apps.googleusercontent.com"
                        buttonText="Login with google"
                        onSuccess={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                        className="btnGoogle"
                    >
                    </GoogleLogin>
                </div>

                <p>Ch??a c?? t??i kho???n? <Link to="/register">????ng k??</Link></p>
            </div>
        </div>

    )
}

export default Login
