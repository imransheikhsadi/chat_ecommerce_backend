const express = require('express');
const cookieParser = require('cookie-parser')
const globalErrorhandler = require('./controllers/error.controller');
const userRoute = require('./routes/user.route');
const productRoute = require('./routes/product.route');
const otherRoute = require('./routes/other.route');
const orderRoute = require('./routes/order.route');
const statsRoute = require('./routes/stats.route');
const reviewRoute = require('./routes/review.route');
const messageRoute = require('./routes/message.route');
const cors = require('cors');
var bodyParser = require('body-parser')


const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());
app.use(cookieParser());


// app.use(cors({
//     preflightContinue: true,
//     credentials: true
// }))

app.use((req,res,next)=>{

    res.setHeader('Access-Control-Allow-Origin',process.env.FRONT_END_DOMAIN);
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Credentials',true)

    next();
});

app.use('/api/v1/products', productRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/orders', orderRoute);
app.use('/api/v1/others', otherRoute);
app.use('/api/v1/stats', statsRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/messages', messageRoute);


app.use(globalErrorhandler)



module.exports = app;
