const { auth, recaptcha } = require('../src/index')

const clientID = '8dF8m8yQT8rlFnSJdP2lkJNjVTB75zTE'
const clientSecret = 'cAEjzkA7x61VY_smqwjEIG_Yl5JedvL5bMjyYA51Uf-luooFPLDGv971MkLjGDqO'
recaptcha.verifyToken('12345', { clientID, clientSecret })