const config = require('config');
const request = require('request');
const mongoose = require('mongoose');
const Account = require('../models/account');
global.yodlee = require('yodlee');

// Generate Yodlee Token every time because yodlee token refreshed every 30 minutes
module.exports = (req) => {
  return new Promise((resolve, reject) => {
    yodlee.use(config.cobrandParam.cobrand);
      mongoose.connection.db.listCollections({name: 'accounts'})
        .next(function(err, collinfo) {
            if (err) {
              reject(err);
            }
            Account.findOne({userId: req.token._id}, (err, data) => {
              let userCredential;
              if (err) {
                reject(err);
              } else if (data) {
                userCredential = {
                  username: data.userName,
                  password: data.password
                };
              }
              yodlee.getAppToken()
                .then(appSessionToken => {
                  yodlee.getAccessToken(userCredential || config.currentUser)
                    .then(accessToken => {
                      config.headers.Authorization = 'cobSession=' + appSessionToken + ',' + 'userSession=' + accessToken;
                      resolve(accessToken);
                    })
                    .catch(err => {
                      reject(err);
                    });
                })
                .catch(err => reject(err));
            });
        });
  });
}

