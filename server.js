require('dotenv').config();
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const helmet = require('helmet');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const db = require('./database/db');
const pageRoutes = require('./routes/pages');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');
const stripeRoutes = require('./routes/stripe');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');
app.use(expressLayouts);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
      frameSrc: ["https://js.stripe.com"],
      connectSrc: ["'self'", "https://api.stripe.com"]
    }
  }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  store: new SQLiteStore({ db: 'sessions.db', dir: __dirname }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  next();
});

app.use('/', pageRoutes);
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);
app.use('/stripe', stripeRoutes);

app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Page Not Found — AHG' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AHG server running on port ${PORT}`);
});
