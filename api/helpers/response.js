module.exports = (res, status, errorStatus, msg, token, value) => {
  console.log("response:\n", msg, token);
  if (errorStatus) {
    res.status(status).send({
      error: errorStatus,
      data: {
        message: msg
      }
    });
  } else if (token) {
    res.status(status).send({
      error: errorStatus,
      data: {
        token: token
      }
    });
  } else if (value) {
    res.status(status).send({
      error: errorStatus,
      data: value
    });
  }
}
