import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUserProfile } from '../redux/actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_PROFILE_RESET } from '../redux/constants/userConstants';

//NOTE: profile screen is a private route
export default function ProfileScreen() {
    const [name, setName] = useState('');//get current info
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const token = useSelector(state => state.token)
    const auth = useSelector(state => state.auth)
    const userDetails = useSelector((state) => state.userDetails);//get user from redux
    const { loading, error, user } = userDetails;//get detail info from be

    const userUpdateProfile = useSelector((state) => state.userUpdateProfile);//get info from redux
    const {
        success: successUpdate,
        error: errorUpdate,
        loading: loadingUpdate,
    } = userUpdateProfile;

    const dispatch = useDispatch();
    useEffect(() => {
        if (!user) {//null, run detail user action
            dispatch({ type: USER_UPDATE_PROFILE_RESET });//reset if done action and reload
            dispatch(detailsUser(auth.user._id, token));//fuc run, get user detail by user id
        } else {//set current info
            setName(user.name);
            setEmail(user.email);
        }
    }, [dispatch, auth.user._id, user, token]);//dependencies list, when user change, user effect will run again

    const submitHandler = (e) => {//send from data to be
        e.preventDefault();
        // dispatch update profile
        if (password !== confirmPassword) { //not true
            alert('Password and Confirm Password Are Not Matched');
        } else {//update info
            dispatch(updateUserProfile({ userId: auth.user._id, name, email, password }, token));
        }
    };
    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>User Profile</h1>
                </div>
                {loading ? (
                    <LoadingBox></LoadingBox>
                ) : error ? (
                    <MessageBox variant="danger">{error}</MessageBox>
                ) : (
                    <>
                        {loadingUpdate && <LoadingBox></LoadingBox>}
                        {errorUpdate && (
                            <MessageBox variant="danger">{errorUpdate}</MessageBox>
                        )}
                        {successUpdate && (
                            <MessageBox variant="success">
                                Profile Updated Successfully!
                            </MessageBox>
                        )}
                        <div>
                            <label htmlFor="name">Name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input ReadOnly = "true"
                                value={email}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                onChange={(e) => setPassword(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">confirm Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Enter confirm password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label />
                            <button className="primary" type="submit">
                                Update
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}
