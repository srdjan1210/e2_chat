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
const events = require('events');
const emitter = new events.EventEmitter();
require('./controllers/chatController')(io, emitter);
//Routers
const registerRouter = require('./routes/registerRouter');
const loginRouter = require('./routes/loginRouter');
const homeRouter = require('./routes/homeRouter');
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
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
app.set('emitter', emitter);
//Routes
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/home', homeRouter);
app.use('/user', userRouter);
app.use('/feed', postRouter);


app.use((error, req, res, next) => {
    return res.status(500).send('We are sorry! Some error happened!');
})


//Starting server
http.listen(PORT, () => {
    console.log("Listening at " + PORT);
});



