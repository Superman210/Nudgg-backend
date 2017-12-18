const resHandler = require('./response'),
  config = require('config'),
  errorMsg = require('./error-msg'),
  Constant = require('./constant');

const regex = /^[_A-Za-z0-9-]+(\.[_A-Za-z0-9-]+)*(\+[A-Za-z0-9-]+)?@[A-Za-z0-9-]+(\.[A-Za-z0-9-]{2,})*$/,
  nameRegex = /^(?=[a-zA-Z-\s]{2,}$)^[a-zA-Z\s]+(-[a-zA-Z\s]+)*$/,
  pwdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
  yodleePwdRegex = /^(((?=.*[!@#$%^&*()])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])))(?=.{8,})$/,
  date_regex = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/,
  phoneRegex = /^\(?(?:(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?\(?(?:0\)?[\s-]?\(?)?|0)(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}|\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4}|\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3})|\d{5}\)?[\s-]?\d{4,5}|8(?:00[\s-]?11[\s-]?11|45[\s-]?46[\s-]?4\d))(?:(?:[\s-]?(?:x|ext\.?\s)\d+)?)$/;

exports.signup = () => {
  return (req, res, next) => {
    console.log("form:\n", req.body);
    const email = req.body.email,
      firstName = req.body.firstName,
      lastName = req.body.lastName,
      password = req.body.password,
      phoneNumber = req.body.phoneNumber,
      dateOfBirth = req.body.dob;

    if (!email || !regex.test(email)) {
      return resHandler(res, config.failed, true, errorMsg.invalidEmail);
    }

    if (!firstName || !lastName || !nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      return resHandler(res, config.failed, true, errorMsg.invalidName);
    }

    if (!password || !pwdRegex.test(password)) {
      return resHandler(res, config.failed, true, errorMsg.invalidPwd);
    }
    
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      return resHandler(res, config.failed, true, errorMsg.invalidPhone);
    }

    if (!dateOfBirth || !date_regex.test(dateOfBirth)) {
      return resHandler(res, config.failed, true, errorMsg.invalidBirth);
    }
    next();
  };
};

exports.signin = () => {
  return (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !regex.test(email)) {
      return resHandler(res, config.failed, true, errorMsg.invalidEmail);
    }

    if (!password || !pwdRegex.test(password)) {
      return resHandler(res, config.failed, true, errorMsg.invalidPwd);
    }
    next();
  }
}

exports.resend = () => {
  return (req, res, next) => {
    const email = req.body.email;
    if (!email || !regex.test(email)) {
      return resHandler(res, config.failed, true, errorMsg.invalidEmail);
    }
    next();
  }
}

exports.yodleeUser = () => {
  return (req, res, next) => {
    const loginName = req.body.loginName,
      password = req.body.password,
      email = req.body.email;

    if (!email || !regex.test(email)) {
      return resHandler(res, config.failed, true, errorMsg.invalidEmail);
    }

    if (!loginName || !nameRegex.test(loginName)) {
      return resHandler(res, config.failed, true, errorMsg.invalidName);
    }

    if (!password || !yodleePwdRegex.test(password)) {
      return resHandler(res, config.failed, true, errorMsg.invalidYodleePwd);
    }
    next();
  }
} 

exports.changePassword = () => {
  return (req, res, next) => {
    const password = req.body.password;

    if (!password || !pwdRegex.test(password)) {
      return resHandler(res, config.failed, true, errorMsg.invalidPwd);
    }
    next();
  }
}

exports.createGoal = () => {
  return (req, res, next) => {
    const goalType = req.body.goalType,
      goalName = req.body.goalName,
      goalAmount = req.body.goalAmount;

    if (!goalType || goalType.trim() == '' || Constant.goalType.indexOf(goalType) === -1) {
      return resHandler(res, config.failed, true, errorMsg.invalidGoalType);
    }
    
    if (!goalName || goalName.trim() == '' || goalName.length < 5 || goalName.length > 30) {
      return resHandler(res, config.failed, true, errorMsg.invalidGoalName);
    }

    if (!goalAmount || (typeof goalAmount == 'string' && goalAmount.trim() == '') 
      || isNaN(goalAmount) || parseInt(goalAmount) <= 1) {
      return resHandler(res, config.failed, true, errorMsg.invalidGoalAmount);
    }
    next();
  }
} 

exports.checkEmail = () => {
  return (req, res, next) => {
    const email = req.body.email;
    if (!email || !regex.test(email)) {
      return resHandler(res, config.failed, true, errorMsg.invalidEmail);
    }
    next();
  }
}
