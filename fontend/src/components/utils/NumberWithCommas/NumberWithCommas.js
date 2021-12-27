import React from 'react'

export default function NumberWithCommas(num) {
    return (
        num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    )
}
