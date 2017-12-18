const config = require('config'),
    path = require('path'),
    express = require('express'),
    router = express.Router(),
    mail = require('../helpers/mail'),
    User = require('../models/user'),
    auth = require('../helpers/auth-helper'),
    validation = require('../helpers/validation'),
    errorMsg = require('../helpers/error-msg'),
    resHandler = require('../helpers/response');

const signUp = (req, res) => {
  User.findOne({ email: req.body.email }, (err, result) => {
    if (err) {
      resHandler(res, config.failed, true, errorMsg.db);
    } else if (result) {
      resHandler(res, config.failed, true, errorMsg.exist);
    } else if (!result) {
      const user = new User(req.body);
      user.save((err, user) => {
        if (err) {
          resHandler(res, config.failed, true, errorMsg.db);
        } else {
          const token = auth.generateToken(auth.serializeUser(user));
          const params = {
            email: req.body.email,
            firstName: req.body.firstName,
            token: token,
            template: config.email.templates.activate
          };
          mail(params)
            .then( data => resHandler(res, config.success, false, '', token))
            .catch(err => resHandler(res, config.failed, true, errorMsg.mail));
        }
      });
    }
  });
};

const emailResend = (req, res) => {
  const decoded = req.token,
    token = req.query.Authorization || req.headers.authorization;
  User.findById({_id: decoded._id}, (err, user) => {
    if (err) {
      return resHandler(res, config.failed, true, errorMsg.db);
    }
    if (user) {
      if (user.email != req.body.email) {
        return resHandler(res, config.failed, true, errorMsg.invalidEmail);
      } else {
        const params = {
          email: user.email,
          firstName: user.firstName,
          token: token,
          template: config.email.templates.activate
        };
        mail(params)
          .then( data => resHandler(res, config.success, false, null, null, {}))
          .catch(err => resHandler(res, config.failed, true, errorMsg.mail));
      }
    } else {
      return resHandler(res, config.failed, true, errorMsg.invalidEmail);
    }
  });
};

const activateAccount = (req, res) => {
  User.findById({ _id: req.token._id }, (err, user) => {
    if (err) {
      return resHandler(res, config.failed, true, errorMsg.db);
    }
    if (user) {
      user.active = true;
      user.save((err, user) => {
        if (err) {
          return resHandler(res, config.failed, true, errorMsg.db);
        }
        if (user) {
          const token = req.headers.authorization;
          return resHandler(res, config.success, false, null, null, { token: token, firstName: user.firstName });
        }
      });
    } else {
      return resHandler(res, config.failed, true, errorMsg.invalidUser);
    }
  });
}

const signIn = (req, res) => {
  const payload = {
    email: req.body.email
  }
  User.findOne(payload, (err, result) => {
    if (err) {
      resHandler(res, config.failed, true, errorMsg.db)
    } else if (result) {
      if(!result.active) {
        resHandler(res, config.failed, true, errorMsg.inactive);
      } else if (result.checkPassword(req.body.password)) {
        const token = auth.generateToken({_id: result._id});
        resHandler(res, config.success, false, null, null, { token: token, firstName: result.firstName });
      } else {
        resHandler(res, config.failed, true, errorMsg.dismatch);
      }
    } else {
      resHandler(res, config.failed, true, errorMsg.dismatch);
    }
  })
}

const changePassword = (req, res) => {
  const decoded = req.token;
  User.findById({ _id: decoded._id }, (err, user) => {
    if (err) {
      return resHandler(res, config.failed, true, errorMsg.db);
    }
    if (user) {
      user.hashedPassword = user.encryptPassword(req.body.password);
      user.save((err, user) => {
        if (err) {
          return resHandler(res, config.failed, true, errorMsg.db);
        }
        if (user) {
          return resHandler(res, config.success, false, null, null, {});  
        }
      });
    } else {
      return resHandler(res, config.failed, true, errorMsg.invalidUser);
    }
  });
}

const resetPassword = (req, res) => {
  User.findOne({email: req.body.email}, (err, user) => {
    if (err) {
      return resHandler(res, config.failed, true, errorMsg.db);
    }
    if (user) {
      const token = auth.generateToken({_id: user._id}, config.jwt.resetExpires);
      const params = {
        email: user.email,
        firstName: user.firstName,
        token: token,
        template: config.email.templates.reset
      };
      mail(params)
      .then(data => resHandler(res, config.success, false, null, null, {}))
      .catch(err => resHandler(res, config.failed, true, errorMsg.mail));
    } else {
      return resHandler(res, config.failed, true, errorMsg.invalidUser);
    }
  });
}

const verifyToken = (req, res) => {
  const decoded = req.token;
  User.findById({ _id: decoded._id }, (err, user) => {
    if (err) {
      return resHandler(res, config.failed, true, errorMsg.db);
    }
    if (user) {
      return resHandler(res, config.success, false, null, null, {firstName: user.firstName});  
    } else {
      return resHandler(res, config.failed, true, errorMsg.invalidUser);
    }
  });
}

// routes
router.post('/activate', auth.checkAuth(), activateAccount);
router.post('/resend', [auth.checkAuth(), validation.resend()], emailResend);
router.post('/signup', validation.signup(), signUp);
router.post('/login', validation.signin(), signIn);
router.post('/changePassword', [auth.checkAuth(), validation.changePassword()], changePassword);
router.post('/forgotten', validation.checkEmail(), resetPassword);
router.post('/verifyToken', auth.checkAuth(), verifyToken);
module.exports = router;