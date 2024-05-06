const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');
// Object untuk menyimpan jumlah login
const Attempt = {};
// Cek apakah email dilock
function isEmailLocked(email) {
  const { count, lastAttempt } = Attempt[email] || { count: 0, lastAttempt: null };

  return (count >= 5 && lastAttempt && (Date.now() - lastAttempt) < 30 * 60 * 1000);
}
// counter login attempt
function loginCounter(email) {
  if (!Attempt[email]) {
    Attempt[email] = {
      count: 0,
      lastAttempt: null,
    };
  }

  Attempt[email].count++;
  Attempt[email].lastAttempt = Date.now();
}
// reset counter jika berhasil login
function resetCounter(email) {
  delete Attempt[email];
}

async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    if (isEmailLocked(email)) {
      throw errorResponder(
        errorTypes.FORBIDDEN,
        'Too many failed login attempts, try log in again after 30 minutes.'
      );
    }

    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      loginCounter(email);

      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    resetCounter(email);

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
