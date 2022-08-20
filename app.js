import 'express-async-errors';
import config from './config/default.js';
import express from 'express';
import database from './src/database/mongoose.js';
import indexRoute from './src/routes/index.js';
import notFound from './src/middlewares/notFound.js';
import errorHandler from './src/middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import './src/utils/passport.js';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

//security
app.use(helmet());

// cors
app.use(
  cors({
    origin: config.origin,
  })
);

//webstatic
app.use(express.static('public'));

//body parser
app.use(express.json());

// cookie parse
app.use(cookieParser());

// session
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 * 300 },
    store: MongoStore.create({ mongoUrl: config.mongoUrl }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

//route
app.use('/', indexRoute);
app.use(notFound);
app.use(errorHandler);
const port = config.port || 5000;

const start = async () => {
  try {
    await database(config.mongoUrl);
    console.log('database connected');
    app.listen(port, () => {
      console.log(`server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
