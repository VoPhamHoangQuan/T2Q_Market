const userRouter = require('./user')
const authRouter = require('./auth')
const productRouter = require('./product')
const orderRouter = require('./order')
const paymentRouter = require('./payment')
const uploadRouter = require('./upload')
const adminRouter = require('./admin')

function route(app) {
    app.use('/api/users', userRouter)
    app.use('api/admin', adminRouter)
    app.use('/api/products', productRouter)
    app.use('/api/orders', orderRouter)
    app.use('/api/config', paymentRouter)
    app.use('/api/uploads', uploadRouter)
    app.use('/', authRouter)
}

module.exports = route;