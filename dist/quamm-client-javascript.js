'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var auth0Js = _interopDefault(require('auth0-js'));
var axios = _interopDefault(require('axios'));

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var defaultOptions = {
  domain: 'quamm.eu.auth0.com'
};

var WebAuth =
/*#__PURE__*/
function () {
  function WebAuth(clientID) {
    var domain = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultOptions.domain;

    _classCallCheck(this, WebAuth);

    if (typeof window === 'undefined') throw new Error('Not a browser');
    var auth = new auth0Js.WebAuth({
      domain: domain,
      clientID: clientID,
      responseType: 'token id_token'
    });
    this.auth0 = auth;
  }

  _createClass(WebAuth, [{
    key: "login",
    value: function login(audience, scope, username, password) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.auth0.client.login({
          realm: 'Username-Password-Authentication',
          username: username,
          password: password,
          audience: audience,
          scope: scope
        }, function (err, authResult) {
          if (err) return reject(err);
          resolve(authResult);
        });
      });
    }
  }], [{
    key: "getAuth",
    value: function getAuth(auth) {
      if (typeof auth !== 'undefined' && typeof auth.accessToken !== 'undefined' && typeof auth.tokenType !== 'undefined') return auth;
      var clientID = auth.clientID,
          username = auth.username,
          password = auth.password,
          audience = auth.audience,
          scope = auth.scope;
      var client = new WebAuth(clientID);
      return client.login(audience, scope, username, password);
    }
  }]);

  return WebAuth;
}();

var WebAuth_1 = WebAuth;

var defaultOptions$1 = {
  domain: 'https://quamm.eu.auth0.com/oauth/token'
};

var MachineAuth =
/*#__PURE__*/
function () {
  function MachineAuth(clientID) {
    var domain = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultOptions$1.domain;

    _classCallCheck(this, MachineAuth);

    this._clientID = clientID;
    this._domain = domain;
  }

  _createClass(MachineAuth, [{
    key: "login",
    value: function () {
      var _login = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(clientSecret, audience) {
        var _ref, data;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return axios({
                  url: this._domain,
                  method: 'post',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  data: JSON.stringify({
                    client_id: this._clientID,
                    client_secret: clientSecret,
                    audience: audience,
                    grant_type: 'client_credentials'
                  })
                });

              case 2:
                _ref = _context.sent;
                data = _ref.data;
                return _context.abrupt("return", {
                  accessToken: data.access_token,
                  tokenType: data.token_type,
                  scope: data.scope,
                  expiresIn: data.expires_in
                });

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function login(_x, _x2) {
        return _login.apply(this, arguments);
      }

      return login;
    }()
  }], [{
    key: "getAuth",
    value: function getAuth(auth) {
      if (typeof auth !== 'undefined' && typeof auth.accessToken !== 'undefined' && typeof auth.tokenType !== 'undefined') return auth;
      var clientID = auth.clientID,
          clientSecret = auth.clientSecret,
          audience = auth.audience;
      var client = new MachineAuth(clientID);
      return client.login(clientSecret, audience);
    }
  }]);

  return MachineAuth;
}();

var MachineAuth_1 = MachineAuth;

var auth = {
  WebAuth: WebAuth_1,
  MachineAuth: MachineAuth_1
};

var WebAuth$1 = auth.WebAuth,
    MachineAuth$1 = auth.MachineAuth;
var defaultOptions$2 = {
  token: '6LeCD24UAAAAAFMvAwTfy11CzcYxucevLfjFMHaC',
  ttl: 10000
};

var checkGRecaptcha = function checkGRecaptcha(resolve, timeout) {
  // TODO trasformare a request animation frame
  var interval = window.setInterval(function () {
    if (gRecaptchaReady()) {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
      return resolve();
    }
  }, 16);
};

var gRecaptchaReady = function gRecaptchaReady() {
  return typeof window.grecaptcha !== 'undefined' && typeof window.grecaptcha.execute === 'function';
};

var install =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var token,
        ttl,
        script,
        scriptReady,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            token = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : defaultOptions$2.token;
            ttl = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : defaultOptions$2.ttl;

            if (!(typeof window.grecaptcha !== 'undefined')) {
              _context2.next = 4;
              break;
            }

            throw new Error('Already installed');

          case 4:
            if (!(typeof window === 'undefined')) {
              _context2.next = 6;
              break;
            }

            throw new Error('Not a browser');

          case 6:
            // install script to head
            script = document.createElement('script');
            script.setAttribute('src', "https://www.google.com/recaptcha/api.js?render=".concat(token));
            document.head.appendChild(script); // wait until grecaptcha element is ready

            scriptReady = new Promise(function (resolve, reject) {
              var timeout = window.setTimeout(reject, ttl);
              checkGRecaptcha(resolve, timeout);
            });
            _context2.next = 12;
            return scriptReady;

          case 12:
            return _context2.abrupt("return", new Promise(function (resolve, reject) {
              var timeout = window.setTimeout(reject, ttl);
              window.grecaptcha.ready(
              /*#__PURE__*/
              _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        window.clearTimeout(timeout);
                        return _context.abrupt("return", resolve(true));

                      case 2:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              })));
            }));

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function install() {
    return _ref.apply(this, arguments);
  };
}();

var getToken = function getToken() {
  var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'defaultAction';
  var token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultOptions$2.token;
  if (typeof window === 'undefined') throw new Error('Not a browser');
  return window.grecaptcha.execute(token, {
    action: action
  });
};

var saveToken =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(token, uniqueData, auth$$1) {
    var recaptchaService,
        login,
        _ref4,
        data,
        _args3 = arguments;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            recaptchaService = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : 'https://recaptcha.quamm.it';
            _context3.next = 3;
            return WebAuth$1.getAuth(Object.assign({}, auth$$1, {
              audience: recaptchaService,
              scope: 'create:token'
            }));

          case 3:
            login = _context3.sent;

            if (!(typeof login.accessToken === 'undefined' || typeof login.tokenType === 'undefined')) {
              _context3.next = 6;
              break;
            }

            throw new Error('Bad credetials.');

          case 6:
            _context3.prev = 6;
            _context3.next = 9;
            return axios({
              url: "".concat(recaptchaService, "/validate"),
              method: 'post',
              headers: {
                Authorization: "".concat(login.tokenType, " ").concat(login.accessToken),
                'Content-Type': 'application/json'
              },
              data: JSON.stringify({
                code: token,
                data: uniqueData
              })
            });

          case 9:
            _ref4 = _context3.sent;
            data = _ref4.data;

            if (!(data.status === 'pass')) {
              _context3.next = 13;
              break;
            }

            return _context3.abrupt("return", data.hash);

          case 13:
            _context3.next = 17;
            break;

          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3["catch"](6);

          case 17:
            return _context3.abrupt("return", false);

          case 18:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this, [[6, 15]]);
  }));

  return function saveToken(_x, _x2, _x3) {
    return _ref3.apply(this, arguments);
  };
}();

var verifyToken =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(hash, auth$$1) {
    var recaptchaService,
        login,
        _ref6,
        data,
        _args4 = arguments;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            recaptchaService = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : 'https://recaptcha.quamm.it';
            _context4.next = 3;
            return MachineAuth$1.getAuth(Object.assign({}, auth$$1, {
              audience: recaptchaService
            }));

          case 3:
            login = _context4.sent;

            if (!(typeof login.accessToken === 'undefined' || typeof login.tokenType === 'undefined' || !login.scope.includes('read:token'))) {
              _context4.next = 6;
              break;
            }

            throw new Error('Bad credetials.');

          case 6:
            _context4.prev = 6;
            _context4.next = 9;
            return axios({
              url: "".concat(recaptchaService, "/verify/").concat(hash),
              method: 'get',
              headers: {
                Authorization: "".concat(login.tokenType, " ").concat(login.accessToken),
                'Content-Type': 'application/json'
              }
            });

          case 9:
            _ref6 = _context4.sent;
            data = _ref6.data;
            return _context4.abrupt("return", data.status === 'pass');

          case 14:
            _context4.prev = 14;
            _context4.t0 = _context4["catch"](6);

          case 16:
            return _context4.abrupt("return", false);

          case 17:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this, [[6, 14]]);
  }));

  return function verifyToken(_x4, _x5) {
    return _ref5.apply(this, arguments);
  };
}();

var recaptcha = {
  install: install,
  getToken: getToken,
  saveToken: saveToken,
  verifyToken: verifyToken
};

var src = {
  auth: auth,
  recaptcha: recaptcha
};
var src_1 = src.auth;
var src_2 = src.recaptcha;

exports.default = src;
exports.auth = src_1;
exports.recaptcha = src_2;
