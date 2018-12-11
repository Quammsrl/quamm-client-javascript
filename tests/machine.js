const { auth, recaptcha } = require('../src/index')

const clientID = '2LbA90s7RzaR4FNbBV19XHstloG6tcMe'
const clientSecret = '_Wh-L2QxmYMJdrBgfdtvgNOCmT0d5j940OQ0U5WPAfKhSGQeXKf_AIUtjroGslHJ'
recaptcha.verifyToken('12345', { clientID, clientSecret })