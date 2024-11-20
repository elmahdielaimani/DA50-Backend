const express = require('express')
const app = express()

const mongoose = require('mongoose');
mongoose.set('strictQuery',false);

var routes =require('./route/routes');
const cors =require('cors');
multer   = require('multer');


app.use(cors(
    {
        origin:"http://localhost:4200"
    }
));

app.listen(9992,function check(err)
{
if(err)
    console.log("error")
else
    console.log("started")
});






async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb://localhost:27017/DA50');
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database', error);
    }
}

connectToDatabase();
app.use('/images' , express.static('images'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const bodyParser = require('body-parser');
app.use(routes);
