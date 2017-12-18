const auth = require('../helpers/auth-helper');

module.exports = app => {
  app.use('/user', require('../controllers/user.controller'));
  app.use('/account', auth.checkAuth(), require('../controllers/account.controller'));
  app.use('/hub', auth.checkAuth(), require('../controllers/hub.controller'));
};
