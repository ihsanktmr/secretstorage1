const express = require('express');
const app = express();
const morgan = require('morgan')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
// + process.env.MONGO_ATLAS_PW +
mongoose.connect('mongodb+srv://ihsankatmer1:phirana14@secretstorage-puq1n.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser: true})

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false})); //bodyparser middleware what kind of body do you want to parse ? url and json... 
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

app.use((req,res,next)=>{   //configurations that for make it accesible from another single page applications
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
      res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'PATCH', 'DELETE', 'GET' )
      return res.status(200).json({});
    }
    next();
});

//routes that handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use("/users", userRoutes);


app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
});

module.exports = app; 