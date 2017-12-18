const config = require('config'),
    path = require('path'),
    express = require('express'),
    router = express.Router(),
    User = require('../models/user'),
    Account = require('../models/account'),
    request = require('request'),
    auth = require('../helpers/auth-helper'),
    yodlee = require('../helpers/generate-token'),
    balance = require('../helpers/balance'),
    validation = require('../helpers/validation'),
    resHandler = require('../helpers/response'),
    errorMsg = require('../helpers/error-msg');

// Add account into the yodlee and get the providerId, first and lastname and so on
const addYodleeAccount = (req, res) => {
  yodlee(req)
    .then(data => {
      const options = {
        url: config.yodleeURL + config.userRegister,
        method: config.post,
        headers: config.headers,
        json: req.body || config.yodleeUser
      };
      request(options, (err, response, body) => {
        if (err) {
          resHandler(res, config.failed, true, errorMsg.yodleeAuth);
        }
        req.body.providerId = body.user.id;
        req.body.userId = req.token._id;
        const yodleeUser = new Account(req.body);
        yodleeUser.save((err, yodleeUser) => {
          if (err) {
            resHandler(res, config.failed, true, errorMsg.db);
          } else {
            resHandler(res, config.success, false, false, false, body);    
          }
        });
      });
    })
    .catch(err => {
      resHandler(res, config.failed, true, errorMsg.yodleeAuth);
    });
}

// Get the Yodlee FastLink
const getFastLink = (req, res) => {
  yodlee(req)
    .then(session => {
      const options = {
        url: config.yodleeURL + config.accessToken,
        method: config.get,
        headers: config.headers
      };
      request(options, (err, response, body) => {
        if (err) {
          resHandler(res, config.failed, true, errorMsg.yodleeAuth);
        }
        const token = JSON.parse(body).user.accessTokens[0].value;
        const fastlink = {
          fastlink: config.fastlink,
          rsession: session,
          token: token,
          app: config.appId,
          redirectReq: true,
          extraParams: 'callback=' + config.host + config.redirectURL
        };
        resHandler(res, config.success, false, false, false, fastlink);
      });
    })
    .catch(err => {
      resHandler(res, config.failed, true, errorMsg.yodleeAuth);
    });
}

// Get the total of Balance with the current user
const getAccountsBalance = (req, res) => {
  yodlee(req)
    .then(session => {
      const options = {
        url: config.yodleeURL + config.accounts,
        method: config.get,
        headers: config.headers,
        json: {
          status: 'Active'
        }
      };
      request(options, (err, response, body) => {
        if (err) {
          resHandler(res, config.failed, true, errorMsg.yodleeAuth)
        }
        let acctList = response.body.account;
        balance(acctList)
          .then(balance => {
            resHandler(res, config.success, false, false, false, balance);
          })
          .catch(err => resHandler(res, config.failed, true, errorMsg.yodleeAuth));
      });
    })
    .catch(err => {
        resHandler(res, config.failed, true, errorMsg.yodleeAuth)
    });
}

// Returns the information related to the specified accounts aggregated by the User
const getAccountList = (req, res) => {
  const acctId = req.query.acctId;
  yodlee(req)
    .then(session => {
      const options = {
        url: config.yodleeURL + config.accounts,
        method: config.get,
        headers: config.headers,
        json: { status: 'Active' }
      };
      request(options, (err, response, body) => {
        if (err) {
          resHandler(res, config.failed, true, errorMsg.yodleeAuth);
        }
        const acctList = body.account;
        resHandler(res, config.success, false, false, false, acctList);
      });
    })
    .catch(err => resHandler(res, config.failed, true, errorMsg.yodleeAuth));
}

const getAccountDetails = (req, res) => {
  yodlee(req)
    .then(session => {
      const options = {
        url: config.yodleeURL + config.siteURL,
        method: config.get,
        headers: config.headers,
        json: {}
      };
      request(options, (err, response, body) => {
        if (err) {
          resHandler(res, config.failed, true, errorMsg.yodleeAuth);
        }
        resHandler(res, config.success, false, false, false, body);
      })
    })
    .catch(err => resHandler(res, config.failed, true, errorMsg.yodleeAuth));
}

const getProvider = (req, res) => {
  const providerId = req.query.providerId;
  if (providerId) {
    yodlee(req)
    .then(session => {
      const options = {
        url: config.yodleeURL + config.siteURL + '/' + providerId,
        method: config.get,
        headers: config.headers,
        json: {}
      };
      request(options, (err, response, body) => {
        if (err) {
          resHandler(res, config.failed, true, errorMsg.yodleeAuth);
        }
        resHandler(res, config.success, false, false, false, body);
      })
    })
    .catch(err => resHandler(res, config.failed, true, errorMsg.yodleeAuth));
  } else {
    resHandler(res, config.failed, true, errorMsg.yodleeAuth);
  }
}

const transaction = (req, res) => {
  yodlee(req)
    .then(session => {
      const options = {
        url: config.yodleeURL + config.transactionsURL,
        method: config.get,
        headers: config.headers,
        json: {
          container: config.container,
          baseType: 'DEBIT/CREDIT'
        }
      };
      request(options, (err, response, body) => {
        if (err) {
          resHandler(res, config.failed, true, errorMsg.yodleeAuth);
        }
        resHandler(res, config.success, false, false, false, body);
      });
    })
    .catch(err => {
      resHandler(res, config.failed, true, errorMsg.yodleeAuth)
    });
}

const getTransactionCount = (req, res) => {
  yodlee(req)
    .then(session => {
      const options = {
        url: config.yodleeURL + config.transactionsURL + '/count',
        method: config.get,
        headers: config.headers,
        json: {
          container: config.container
        }
      };
      request(options, (err, response, body) => {
        if (err) {
          resHandler(res, config.failed, true, errorMsg.yodleeAuth);
        }
        resHandler(res, config.success, false, false, false, body);
      })
    })
    .catch(err => resHandler(res, config.failed, true, errorMsg.yodleeAuth));
}
// routes
router.get('/add', validation.yodleeUser(), addYodleeAccount);
router.get('/fastlink', getFastLink);
router.get('/list', getAccountList);
router.get('/provider', getProvider);
router.get('/details', getAccountDetails);
router.get('/balance', getAccountsBalance);
router.get('/transactions', transaction);
router.get('/transactions/count', getTransactionCount);

module.exports = router;