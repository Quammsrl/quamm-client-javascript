const axios = require('axios')

const defaultOptions = {
  domain: 'https://quamm.eu.auth0.com/oauth/token'
}

class MachineAuth {
  constructor (clientID, domain = defaultOptions.domain) {
    this._clientID = clientID
    this._domain = domain
  }

  async login (clientSecret, audience) {
    const { data } = await axios({
      url: this._domain,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        client_id: this._clientID,
        client_secret: clientSecret,
        audience,
        grant_type: 'client_credentials'
      })
    })

    return {
      accessToken: data.access_token,
      tokenType: data.token_type
    }
  }

  static getAuth (auth) {
    if (typeof auth !== 'undefined' && typeof auth.accessToken !== 'undefined' && typeof auth.tokenType !== 'undefined') return auth

    const { clientID, clientSecret, audience } = auth
    const client = new MachineAuth(clientID)
    return client.login(clientSecret, audience)
  }
}

module.exports = MachineAuth
