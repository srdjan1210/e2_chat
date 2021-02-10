const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
//Routers
const registerRouter = require('./routes/registerRouter');
const loginRouter = require('./routes/loginRouter');
// Constants
const PORT = process.env.PORT;


//Request settings
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/register', registerRouter);
app.use('/login', loginRouter);



//Starting server
http.listen(PORT, () => {
    console.log("Listening at " + PORT);
});


