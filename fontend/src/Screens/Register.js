import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {showErrMsg, showSuccessMsg} from '../components/utils/notification/Notification'
import {isEmpty, isEmail, isLength, isMatch} from '../components/utils/validation/Validation'


const initialState = {
    name: '',
    email: '',
    password: '',
    cf_password: '',
    err: '',
    success: ''
}

function Register() {
    const [user, setUser] = useState(initialState)

    const {name, email, password,cf_password, err, success} = user

    const handleChangeInput = e => {
        const {name, value} = e.target
        setUser({...user, [name]:value, err: '', success: ''})
    }


    const handleSubmit = async e => {
        e.preventDefault()
        if(isEmpty(name) || isEmpty(password))
                return setUser({...user, err: "Vui lòng nhập tất cả thông tin cần thiết.", success: ''})

        if(!isEmail(email))
            return setUser({...user, err: "Email không hợp lệ.", success: ''})

        if(isLength(password))
            return setUser({...user, err: "Mật khẩu có ít nhất 6 ký tự.", success: ''})
        
        if(!isMatch(password, cf_password))
            return setUser({...user, err: "Mật khẩu không khớp, xin vui lòng kiểm tra lại.", success: ''})

        try {
            const res = await axios.post('/register', {
                name, email, password
            })

            setUser({...user, err: '', success: res.data.msg})
        } catch (err) {
            err.response.data.msg && 
            setUser({...user, err: err.response.data.msg, success: ''})
        }
    }

    return (
        <div className="login_page">
            <h2>ĐĂNG KÝ</h2>
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">HỌ VÀ TÊN</label>
                    <input type="text" placeholder="Nhập họ và tên của bạn" id="name"
                    value={name} name="name" onChange={handleChangeInput} />
                </div>

                <div>
                    <label htmlFor="email">ĐỊA CHỈ EMAIL</label>
                    <input type="text" placeholder="Nhập địa chỉ email" id="email"
                    value={email} name="email" onChange={handleChangeInput} />
                </div>

                <div>
                    <label htmlFor="password">MẬT KHẨU</label>
                    <input type="password" placeholder="Nhập mật khẩu" id="password"
                    value={password} name="password" onChange={handleChangeInput} />
                </div>

                <div>
                    <label htmlFor="cf_password">XÁC NHẬN MẬT KHẨU</label>
                    <input type="password" placeholder="Nhập lại mật khẩu" id="cf_password"
                    value={cf_password} name="cf_password" onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <button type="submit">XÁC NHẬN</button>
                </div>
            </form>

            <p>Đã có tài khoản? <Link to="/signin">Đăng nhập</Link></p>
        </div>
    )
}

export default Register
