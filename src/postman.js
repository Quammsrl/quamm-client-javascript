const { MachineAuth } = require('./auth')
const axios = require('axios')

const sendDirectusMail = async (caller, auth, postmanService = 'https://postman.quamm.it') => {
  const login = await MachineAuth.getAuth(Object.assign({}, auth, { audience: postmanService }))
  if (
    typeof login.accessToken === 'undefined' ||
    typeof login.tokenType === 'undefined' ||
    !login.scope.includes('create:mail')) throw new Error('Bad credetials.')

  try {
    const { data } = await axios({
      url: `${postmanService}/webhooks/directus/${caller}`,
      method: 'post',
      headers: {
        Authorization: `${login.tokenType} ${login.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    return data.status === 'pass'
  } catch (e) {}
  return false
}

module.exports = {
  sendDirectusMail
}
