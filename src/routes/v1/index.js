const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const interestRateRoute = require('./interestRate.route');
const savingRoute = require('./saving.route');
const bankAccountRoute = require('./bankAccount.route');
const systemBankAccountRoute = require('./systemBankAccount.route');
const transactionRoute = require('./transaction.route');
const docsRoute = require('./docs.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/interest-rates',
    route: interestRateRoute,
  },
  {
    path: '/savings',
    route: savingRoute,
  },
  {
    path: '/bank-accounts',
    route: bankAccountRoute,
  },
  {
    path: '/system-bank-account',
    route: systemBankAccountRoute,
  },
  {
    path: '/transactions',
    route: transactionRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
devRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
