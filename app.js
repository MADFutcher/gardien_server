require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const session       = require('express-session');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const cors         = require('cors')
const passport     = require('passport')
const cron         = require('node-cron')
 
// cron.schedule('*/5 * * * * *', () => {
//   console.log('running a task 5 seconds');
// });

cron.schedule('0 0 0 */1 * *', () => {
  console.log('running a task every 1 day');
});


require('./configs/passport');


mongoose
  .connect('mongodb://localhost/gardien-server', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// CORS
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5000']
  })
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// SESSION SETTINGS:
app.use(session({
  secret:"ironducks jumping through the mountains",
  resave: true,
  saveUninitialized: true
}));


// USE passport.initialize() and passport.session():
app.use(passport.initialize());
app.use(passport.session());


// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const index = require('./routes/index');
app.use('/', index);

const AuthRoutes = require('./routes/auth/auth');
app.use('/api', AuthRoutes);

const UserRoutes = require('./routes/user/User');
app.use('/api/users', UserRoutes);

const LocationRoutes = require('./routes/location/Location');
app.use('/api/users', LocationRoutes);

const PlantRoutes = require('./routes/plant/Plant');
app.use('/api/users', PlantRoutes);

module.exports = app;
