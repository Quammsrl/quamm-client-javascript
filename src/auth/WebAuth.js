const auth0 = require('auth0-js')

const defaultOptions = {
  domain: 'quamm.eu.auth0.com'
}

class WebAuth {
  constructor (clientID, domain = defaultOptions.domain) {
    if (typeof window === 'undefined') throw new Error('Not a browser')

    const auth = new auth0.WebAuth({
      domain,
      clientID,
      responseType: 'token id_token'
    })

    this.auth0 = auth
  }

  login (audience, scope, username, password) {
    return new Promise((resolve, reject) => {
      this.auth0.client.login({
        realm: 'Username-Password-Authentication',
        username,
        password,
        audience,
        scope
      }, (err, authResult) => {
        if (err) return reject(err)
        resolve(authResult)
      })
    })
  }

  static getAuth (auth) {
    if (typeof auth !== 'undefined' && typeof auth.accessToken !== 'undefined' && typeof auth.tokenType !== 'undefined') return auth

    const { clientID, username, password, audience, scope } = auth
    const client = new WebAuth(clientID)
    return client.login(audience, scope, username, password)
  }
}

module.exports = WebAuth
