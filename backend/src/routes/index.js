const userRouter = require('./user')
const authRouter = require('./auth')
const productRouter = require('./product')
const orderRouter = require('./order')

function route(app) {
    app.use('/api/users', userRouter)
    app.use('/api/products', productRouter)
    app.use('/order', orderRouter)
    app.use('/', authRouter)
}

module.exports = route;