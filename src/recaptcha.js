const { WebAuth, MachineAuth } = require('./auth')
const axios = require('axios')

const defaultOptions = {
  token: '6LeCD24UAAAAAFMvAwTfy11CzcYxucevLfjFMHaC',
  ttl: 10000
}

const checkGRecaptcha = (resolve, timeout) => {
  // TODO trasformare a request animation frame
  const interval = window.setInterval(() => {
    if (typeof window.grecaptcha !== 'undefined') {
      window.clearTimeout(timeout)
      window.clearInterval(interval)
      return resolve()
    }
  }, 16)
}

const install = async (token = defaultOptions.token, ttl = defaultOptions.ttl) => {
  if (typeof window.grecaptcha !== 'undefined') throw new Error('Already installed')
  if (typeof window === 'undefined') throw new Error('Not a browser')

  // install script to head
  const script = document.createElement('script')
  script.setAttribute('src', `https://www.google.com/recaptcha/api.js?render=${token}`)
  document.head.appendChild(script)

  // wait until grecaptcha element is ready
  const scriptReady = new Promise((resolve, reject) => {
    const timeout = window.setTimeout(reject, ttl)
    checkGRecaptcha(resolve, timeout)
  })

  await scriptReady

  // prepare ready status
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(reject, ttl)
    window.grecaptcha.ready(async () => {
      window.clearTimeout(timeout)
      return resolve(true)
    })
  })
}

const getToken = (action = 'defaultAction', token = defaultOptions.token) => {
  if (typeof window === 'undefined') throw new Error('Not a browser')
  return window.grecaptcha.execute(token, { action })
}

const saveToken = async (token, uniqueData, auth, recaptchaService = 'https://recaptcha.quamm.it') => {
  const login = await WebAuth.getAuth(Object.assign({}, auth, { audience: recaptchaService, scope: 'create:token' }))
  if (typeof login.accessToken === 'undefined' || typeof login.tokenType === 'undefined') throw new Error('Bad credetials.')

  try {
    const { data } = await axios({
      url: `${recaptchaService}/validate`,
      method: 'post',
      headers: {
        Authorization: `${login.tokenType} ${login.accessToken}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        code: token,
        data: uniqueData
      })
    })

    if (data.status === 'pass') return data.hash
  } catch (e) {}
  return false
}

const verifyToken = async (hash, auth, recaptchaService = 'https://recaptcha.quamm.it') => {
  const login = await MachineAuth.getAuth(Object.assign({}, auth, { audience: recaptchaService }))
  if (
    typeof login.accessToken === 'undefined' ||
    typeof login.tokenType === 'undefined' ||
    !login.scope.includes('read:token')) throw new Error('Bad credetials.')

  try {
    const { data } = await axios({
      url: `${recaptchaService}/verify/${hash}`,
      method: 'get',
      headers: {
        Authorization: `${auth.tokenType} ${auth.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    return data.status === 'pass'
  } catch (e) {}
  return false
}

module.exports = {
  install,
  getToken,
  saveToken,
  verifyToken
}
