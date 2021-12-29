import React, { useState } from 'react'
import axios from 'axios'
import { isEmail } from '../components/utils/validation/Validation'
import { showErrMsg, showSuccessMsg } from '../components/utils/notification/Notification'

const initialState = {
    email: '',
    err: '',
    success: ''
}

function ForgotPassword() {
    const [data, setData] = useState(initialState)

    const { email, err, success } = data

    const handleChangeInput = e => {
        const { name, value } = e.target
        setData({ ...data, [name]: value, err: '', success: '' })
    }

    const forgotPassword = async () => {
        if (!isEmail(email))
            return setData({ ...data, err: 'Invalid emails.', success: '' })

        try {
            const res = await axios.post('/forgot', { email })

            return setData({ ...data, err: '', success: res.data.msg })
        } catch (err) {
            err.response.data.msg && setData({ ...data, err: err.response.data.msg, success: '' })
        }
    }

    return (
        <div className='block-center'>
            <div className="fg_pass login_page login-card">
                <i className="fab fa-get-pocket fa-5x card-body head-color-icon"></i>
                <h2 className='card-body'>LẤY LẠI MẬT KHẨU</h2>

                <div className=" card-body row">
                    {err && showErrMsg(err)}
                    {success && showSuccessMsg(success)}

                    <i className="fas fa-envelope fa-lg input-icon"></i>
                    <input type="email" name="email" id="email" value={email}
                        onChange={handleChangeInput} placeholder="Nhập địa chỉ email" />

                </div>
                <div className=" card-body">
                    <button className='button-confirm'
                        onClick={forgotPassword}>GỬI EMAIL KÍCH HOẠT</button>
                </div>
            </div>
        </div>

    )
}

export default ForgotPassword
