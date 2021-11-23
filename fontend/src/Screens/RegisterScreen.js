import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/actions/userAction';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function RegisterScreen(props) {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const submitHandler = (e) => {
        e.preventDefault();
        if (confirmPassword !== password) {
            alert('Password and confirm password is not match');
        } else {
            dispatch(register(name, email, password));
        }
    }
    //get user info if loged in
    const userRegister = useSelector(state => state.userRegister);
    const { userInfo, loading, error } = userRegister;

    const redirect = props.location.search
        ? props.location.search.split('=')[1]
        : '/';

    useEffect(() => {
        userInfo && props.history.push(redirect);
    }, [redirect, userInfo, props.history]);

    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>Sign in form</div>

                {loading && <LoadingBox></LoadingBox>}
                {error && <MessageBox variant="danger">{error}</MessageBox>}


                <div>
                    <label htmlFor="name">Email address</label>
                    <input type="name" id="name"
                        placeholder="Enter name" required
                        onChange={e => setName(e.target.value)} />
                </div>
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
                    <label htmlFor="comfirmPassword">Comfirm Password</label>
                    <input type="password" id="comfirmPassword"
                        placeholder="Enter Comfirm Password" required
                        onChange={e => setConfirmPassword(e.target.value)} />
                </div>
                <div>
                    <button className="primary" type="submit">
                        Register
                    </button>
                </div>
                <div>
                    <div>
                        Already have an account?
                        <Link to={`/signin?redirect=${redirect}`}>Signin</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}
