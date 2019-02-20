'use strict';

const validator = require('validator');

const validUser = (user) => {

  //valid data
  let errors = [];
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  const nameRegex = /^[a-zA-Z ]+$/;

  if (!user.name || !validator.isAlpha(user.name)) {
    errors.push('Invalid name format.')
  }
  if (!user.surname || !validator.isAlpha(user.surname)) {
    errors.push('Invalid surname format.')
  }
  if (!user.email || !validator.isEmail(user.email)) {
    errors.push('Invalid email format.')
  }
  if (!passwordRegex.test(user.password)) {
    errors.push('Your password should contain at least one digit, one lower case, one upper case, and 8 character lenght.')
  }
  if (!user.country || !nameRegex.test(user.country)) {
    errors.push('Invalid country format.')
  }
  if (!nameRegex.test(user.city)) {
    errors.push('Invalid city format.')
  }
  return errors;
}

module.exports = {
  validUser
}