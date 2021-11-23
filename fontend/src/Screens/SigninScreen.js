import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signin } from '../redux/actions/userAction';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox'; 

export default function SigninScreen(props) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(signin(email, password));
    }
    //get user info if loged in
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo ,loading,error} = userSignin;

    const redirect = props.location.search
        ? props.location.search.split('=')[1]
        : '/';

    useEffect(() => {
        userInfo && props.history.push(redirect);
    }, [redirect,userInfo,props.history]);

    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>Sign in form</div>

                {loading && <LoadingBox></LoadingBox>}
                {error && <MessageBox variant = "danger">{error}</MessageBox> }

                <div>
                    <label htmlFor="email">Email address</label>
                    <input type="email" id="email"
                        placeholder="Enter email" required
                        onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password"
                        placeholder="Enter password" required
                        onChange={e => setPassword(e.target.value)} />
                </div>
                <div>
                    <button className="primary" type="submit">
                        Sign In
                    </button>
                </div>
                <div>
                    <div>
                        New customer?
                        <Link to={`/register?redirect=${redirect}`}>Create your account</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}
