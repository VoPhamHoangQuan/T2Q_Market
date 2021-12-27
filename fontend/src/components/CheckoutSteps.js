import React from 'react';

export default function CheckoutSteps(props) {
  return (
    <div className="row checkout-steps">
      <div className={props.step1 ? 'active' : ''}>Đăng Nhập</div>
      <div className={props.step2 ? 'active' : ''}>Thông Tin Vận Chuyển</div>
      <div className={props.step3 ? 'active' : ''}>Phương Thức Thanh Toán</div>
      <div className={props.step4 ? 'active' : ''}>Xác Nhận Đơn Hàng</div>
    </div>
  );
}