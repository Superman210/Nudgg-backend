
const config = require('config'),
    nodemailer = require('nodemailer'),
    hbs = require('nodemailer-express-handlebars'),
    handlebars = require('express-handlebars'),
    path = require('path');
/**
 * @description Email sender
 * @return token
 */
module.exports = (params) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: true,
      auth: {
        user: config.email.user,
        pass: config.email.password
      }
    });

    const viewEngine = handlebars.create({});

    const options = {
      viewEngine: viewEngine,
      viewPath: path.resolve(__dirname, '../templates'),
    };

    transporter.use('compile', hbs(options));
    const mailOptions = {
      from: config.email.user,
      to: params.email,
      subject: 'Welcome to Nudgg',
      template: params.template,
      context: {
        name: params.firstName,
        token: params.token
      }
    };

    transporter.sendMail(mailOptions, (error, info) => {
      console.log("email error", error, info);
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
}