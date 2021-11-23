import bcrypt from 'bcrypt'
const data = {
    users:[
        {
            name: 'quan',
            email: 'quan@gmail.com',
            password: bcrypt.hashSync('123456',8),
            isAdmin: true
        },
        {
            name: 'quoc',
            email: 'quoc@gmail.com',
            password: bcrypt.hashSync('123456',8),
            isAdmin: false
        }
    ],
    products: [
        {
            cateid: 0,
            companyid: 0,
            price: 120,
            amount: 0,
            name: 'product 01',
            description: 'description 01 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaddddddddddddddddddddddddddđ',
            origin: 'origin 01',
            image: '/image/product01.jpg',
            rating:5,
            numReview: 12,
            discount: null,
            IsDelete: null

        },
        {
            cateid: 0,
            companyid: 0,
            price: 120,
            amount: 10,
            name: 'product 02',
            description: 'description 02',
            origin: 'origin 02',
            image: '/image/product01.jpg',
            rating:4,
            numReview: 11,
            discount: null,
            IsDelete: null

        },
        {
            cateid: 0,
            companyid: 0,
            price: 120,
            amount: 2,
            name: 'product 03',
            description: 'description 01',
            origin: 'origin 01',
            image: '/image/product01.jpg',
            rating:3,
            numReview: 10,
            discount: null,
            IsDelete: null

        },
        {
            cateid: 0,
            companyid: 0,
            price: 120,
            amount: 2,
            name: 'product 04',
            description: 'description 01',
            origin: 'origin 01',
            image: '/image/product01.jpg',
            rating:1,
            numReview: 1,
            discount: null,
            IsDelete: null

        },
        {
            cateid: 0,
            companyid: 0,
            price: 120,
            amount: 2,
            name: 'product 05',
            description: 'description 01',
            origin: 'origin 01',
            image: '/image/product01.jpg',
            rating:2,
            numReview: 1,
            discount: null,
            IsDelete: null

        },
        {
            cateid: 0,
            companyid: 0,
            price: 120,
            amount: 2,
            name: 'product 06',
            description: 'description 01',
            origin: 'origin 01',
            image: '/image/product01.jpg',
            rating:3,
            numReview: 5,
            discount: null,
            IsDelete: null

        },
    ]
}

export default data