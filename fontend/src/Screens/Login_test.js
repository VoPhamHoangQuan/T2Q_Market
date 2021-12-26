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
        <div className="content">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-5">
                        <span className="d-block text-center my-4 text-muted"> or sign in with</span>
                        <div className="social-login text-center">
                            <a href="#" className="facebook btn btn-block">
                            <i class="fab fa-facebook-f fa-2x align-center"></i>
                            </a>
                            <a href="#" className="google btn btn-block">
                            <i class="fab fa-google fa-2x align-center"></i>
                            </a>
                        </div>

                    </div>
                    <div className="col-md-2 text-center">
                        &mdash; or &mdash;
                    </div>
                    <div className="col-md-5 contents">
                        <div className="form-block">
                            <div className="mb-4">
                                <h3>Sign In to <strong>Colorlib</strong></h3>
                                <p className="mb-4">Lorem ipsum dolor sit amet elit. Sapiente sit aut eos consectetur adipisicing.</p>
                            </div>
                            <form action="#" method="post">
                                <div className="form-group first">
                                    <label for="username">Username</label>
                                    <input type="text" className="form-control" id="username"/>

                                </div>
                                <div className="form-group last mb-4">
                                    <label for="password">Password</label>
                                    <input type="password" className="form-control" id="password"/>

                                </div>

                                <div className="d-flex mb-5 align-items-center">
                                    <label className="control control--checkbox mb-0"><span className="caption">Remember me</span>
                                        <input type="checkbox" checked="checked" />
                                        <div className="control__indicator"></div>
                                    </label>
                                    <span className="ml-auto"><a href="#" className="forgot-pass">Forgot Password</a></span>
                                </div>

                                <input type="submit" value="Log In" className="btn btn-pill text-white btn-block btn-primary"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
