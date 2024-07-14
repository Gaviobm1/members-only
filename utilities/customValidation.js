const isEqual = (val, { req }) => {
  const otherVal = req.body.password;
  return val === otherVal;
};

module.exports = isEqual;
