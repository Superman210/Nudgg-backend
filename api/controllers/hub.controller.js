const config = require('config'),
    express = require('express'),
    Goal = require('../models/goal'),
    User = require('../models/user'),
    auth = require('../helpers/auth-helper'),
    errorMsg = require('../helpers/error-msg'),
    validation = require('../helpers/validation'),
    resHandler = require('../helpers/response');

const router = express.Router();

const createGoal = (req, res) => {
    const decoded = req.token;

    if (decoded && decoded._id) {
        User.findOne( { _id: decoded._id, active: true }, (err, user) => {
            if (err) {
                return resHandler(res, config.failed, true, errorMsg.db);
            }
            if (!user) {
                return resHandler(res, config.failed, true, errorMsg.invalidUser);
            }
            Goal.findOne({
                userId: user._id,
                goalType: req.body.goalType,
                goalName: req.body.goalName
            }, (err, result) => {
                if (err) {
                    resHandler(res, config.failed, true, errorMsg.db);
                } else if (result) {
                    resHandler(res, config.failed, true, errorMsg.existGoal);
                } else if (!result) {
                    const goal = new Goal({
                        userId: user._id,
                        goalType: req.body.goalType,
                        goalName: req.body.goalName,
                        goalAmount: req.body.goalAmount
                    });
                    goal.save((err, goal) => {
                        if (err) {
                            resHandler(res, config.failed, true, errorMsg.db);
                        } else {
                            resHandler(res, config.success, false, null, null, {});
                        }
                    });
                }
            });            
        });
    } else {
        return resHandler(res, config.failed, true, errorMsg.unauth);
    }
}

const getGoal = (req, res) => {
    const decoded = req.token;
    if (decoded && decoded._id) {
        User.findOne({ _id: decoded._id, active: true }, (err, user) => {
            if (err) {
                return resHandler(res, config.failed, true, errorMsg.db);
            }
            if (user) {
                Goal.findOne({ userId: user._id }, {}, { sort: { 'created_at' : -1 } }, (err, goal) => {
                    if (err) {
                        return resHandler(res, config.failed, true, errorMsg.db);
                    }
                    if (goal) {
                        return resHandler(res, config.success, false, null, null, { 
                            goalType: goal.goalType, 
                            goalName: goal.goalName, 
                            goalAmount: goal.goalAmount
                        });
                    } else {
                        return resHandler(res, config.failed, true, errorMsg.emptyGoal);
                    }
                });
            } else {
                return resHandler(res, config.failed, true, errorMsg.invalidUser);
            }
        });
    } else {
        return resHandler(res, config.failed, true, errorMsg.unauth);
    }
}

//routes
router.post('/goal', validation.createGoal(), createGoal);
router.get('/goal', auth.checkAuth(), getGoal);
module.exports = router;