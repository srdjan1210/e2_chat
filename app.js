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
const mongoose = require('mongoose');
const compression = require('compression');
require('./controllers/chatController')(io);
//Routers
const registerRouter = require('./routes/registerRouter');
const loginRouter = require('./routes/loginRouter');
const homeRouter = require('./routes/homeRouter');
const userRouter = require('./routes/userRouter');
// Constants
const PORT = process.env.PORT;

//Database
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true,  useFindAndModify: false })
.then((connected) => {
    console.log('Database connected')
})
.catch((err) => {
    console.log(err);
});
//Middlewares
app.use(compression());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/home', homeRouter);
app.use('/user', userRouter);



//Starting server
http.listen(PORT, () => {
    console.log("Listening at " + PORT);
});



