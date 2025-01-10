"use strict";
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
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
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
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = function(target, all) {
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = function(to, from, except, desc) {
    if (from && (typeof from === "undefined" ? "undefined" : _type_of(from)) === "object" || typeof from === "function") {
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            var _loop = function() {
                var key = _step.value;
                if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
                    get: function() {
                        return from[key];
                    },
                    enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
                });
            };
            for(var _iterator = __getOwnPropNames(from)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    return to;
};
var __toCommonJS = function(mod) {
    return __copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
};
// src/index.ts
var index_exports = {};
__export(index_exports, {
    Cart: function() {
        return Cart;
    },
    CartItem: function() {
        return CartItem;
    },
    InitResponse: function() {
        return InitResponse;
    },
    Payment: function() {
        return Payment;
    },
    Paynow: function() {
        return Paynow;
    },
    StatusResponse: function() {
        return StatusResponse;
    }
});
module.exports = __toCommonJS(index_exports);
// src/constants.ts
var RESPONSE_OK = "ok";
var RESPONSE_ERROR = "error";
var URL_INITIATE_TRANSACTION = "https://www.paynow.co.zw/interface/initiatetransaction";
var URL_INITIATE_MOBILE_TRANSACTION = "https://www.paynow.co.zw/interface/remotetransaction";
var INNBUCKS_DEEPLINK_PREFIX = "schinn.wbpycode://innbucks.co.zw?pymInnCode=";
var GOOGLE_QR_PREFIX = "https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=";
var PAID_STATUSES = [
    "Awaiting Delivery",
    "Delivered",
    "Paid"
];
// src/components/init-response.ts
var InitResponse = function InitResponse(data) {
    "use strict";
    _class_call_check(this, InitResponse);
    this.status = data.status;
    this.success = this.status.toLowerCase() === RESPONSE_OK;
    this.hasRedirect = data.browserurl ? true : false;
    this.isInnbucks = false;
    if (!this.success) {
        this.error = data.error;
    } else {
        this.pollUrl = data.pollurl;
        if (this.hasRedirect) {
            this.redirectUrl = data.browserurl;
        }
        if (data.instructions) {
            this.instructions = data.instructions;
        }
        if (data.authorizationcode) {
            this.isInnbucks = true;
            this.innbucks_info = [];
            this.innbucks_info.push({
                authorizationcode: data.authorizationcode,
                deep_link_url: INNBUCKS_DEEPLINK_PREFIX + data.authorizationcode,
                qr_code: GOOGLE_QR_PREFIX + data.authorizationcode,
                expires_at: data.authorizationexpires
            });
        }
    }
};
// src/components/cart.ts
var CartItem = function CartItem(title, amount) {
    "use strict";
    var quantity = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
    _class_call_check(this, CartItem);
    this.title = title;
    this.amount = amount;
    this.quantity = quantity;
};
var Cart = /*#__PURE__*/ function() {
    "use strict";
    function Cart(_items) {
        var _this = this;
        _class_call_check(this, Cart);
        this.items = [];
        if (_items) {
            _items.forEach(function(item) {
                _this.items.push(item);
            });
        }
    }
    _create_class(Cart, [
        {
            key: "length",
            value: function length() {
                return this.items.length;
            }
        },
        {
            key: "add",
            value: function add(item) {
                this.items.push(item);
                return this.items.length;
            }
        },
        {
            key: "getTotal",
            value: function getTotal() {
                var cartTotal = 0;
                this.items.forEach(function(item) {
                    cartTotal += item.amount * item.quantity;
                });
                return cartTotal;
            }
        },
        {
            key: "summary",
            value: function summary() {
                var summary = "";
                this.items.forEach(function(item, index) {
                    summary = summary.concat(item.title + ", ");
                });
                summary = summary.slice(0, summary.length - 3);
                return summary;
            }
        }
    ]);
    return Cart;
}();
// src/components/payment.ts
var Payment = /*#__PURE__*/ function() {
    "use strict";
    function Payment(reference, authEmail) {
        var cart = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : new Cart();
        _class_call_check(this, Payment);
        this.reference = reference;
        this.authEmail = authEmail;
        this.cart = cart;
    }
    _create_class(Payment, [
        {
            /**
   * 
   * Adds an item to the 'shopping cart'
   * @param title name of item to be added to cart
   * @param amount price of item to be added to cart
   * @param quantity (optional) quantity, default is 1
   * 
   */ key: "add",
            value: function add(title, amount, quantity) {
                this.cart.add(new CartItem(title, amount, quantity));
            }
        },
        {
            /**
   * List all items in the cart
   * @returns {string}
   * 
   */ key: "info",
            value: function info() {
                return this.cart.summary();
            }
        },
        {
            /**
   * Get the total price of the items in the cart
   * @returns {number}
   * 
   */ key: "total",
            value: function total() {
                return this.cart.getTotal();
            }
        }
    ]);
    return Payment;
}();
// src/components/status-response.ts
var StatusResponse = /*#__PURE__*/ function() {
    "use strict";
    function StatusResponse(data) {
        _class_call_check(this, StatusResponse);
        if (data.status.toLowerCase() === RESPONSE_ERROR) {
            this.error = data.error;
        } else {
            this.reference = data.reference;
            this.amount = data.amount;
            this.paynowReference = data.paynowreference;
            this.pollUrl = data.pollurl;
            this.status = data.status;
        }
    }
    _create_class(StatusResponse, [
        {
            key: "paid",
            value: function paid() {
                return PAID_STATUSES.includes(this.status);
            }
        }
    ]);
    return StatusResponse;
}();
// src/paynow.ts
var import_urlencode = require("urlencode");
var Paynow = /*#__PURE__*/ function() {
    "use strict";
    function Paynow() {
        var integrationId = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : process.env.PAYNOW_INTEGRATION_ID, integrationKey = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : process.env.PAYNOW_INTEGRATION_KEY, resultUrl = arguments.length > 2 ? arguments[2] : void 0, returnUrl = arguments.length > 3 ? arguments[3] : void 0;
        _class_call_check(this, Paynow);
        this.integrationId = integrationId;
        this.integrationKey = integrationKey;
        this.resultUrl = resultUrl;
        this.returnUrl = returnUrl;
    }
    _create_class(Paynow, [
        {
            /**
   * Send a payment to paynow
   * @param payment
   */ key: "send",
            value: function send(payment) {
                return this.init(payment);
            }
        },
        {
            /**
   * Send a mobile money payment to paynow
   * @param payment
   */ key: "sendMobile",
            value: function sendMobile(payment, phone, method) {
                return this.initMobile(payment, phone, method);
            }
        },
        {
            /**
   * Create a new Paynow payment
   * @param {String} reference This is the unique reference of the transaction
   * @param {String} authEmail This is the email address of the person making payment. Required for mobile transactions
   * @returns {Payment}
   */ key: "createPayment",
            value: function createPayment(reference, authEmail) {
                return new Payment(reference, authEmail);
            }
        },
        {
            /**
   * Throw an exception with the given message
   * @param message*
   * @returns void
   */ key: "fail",
            value: function fail(message) {
                throw new Error(message);
            }
        },
        {
            key: "init",
            value: /**
   * Initialize a new transaction with PayNow
   * @param payment
   * @returns {Promise<InitResponse|null>}
   */ function init(payment) {
                var _this = this;
                return _async_to_generator(function() {
                    var data, response, responseData, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _this.validate(payment);
                                data = _this.build(payment);
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    3,
                                    ,
                                    4
                                ]);
                                return [
                                    4,
                                    fetch(URL_INITIATE_TRANSACTION, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(data)
                                    })
                                ];
                            case 2:
                                response = _state.sent();
                                responseData = response.json();
                                return [
                                    2,
                                    _this.parse(responseData)
                                ];
                            case 3:
                                error = _state.sent();
                                console.log("Paynow.init: Error occurred while initialising payment", error);
                                return [
                                    3,
                                    4
                                ];
                            case 4:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "initMobile",
            value: /**
   * Initialize a new mobile transaction with PayNow
   * @param {Payment} payment
   * @returns {Promise<InitResponse|null>} the response from the initiation of the transaction
   */ function initMobile(payment, phone, method) {
                var _this = this;
                return _async_to_generator(function() {
                    var data, response, responseData, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _this.validate(payment);
                                if (!_this.isValidEmail(payment.authEmail)) _this.fail("Invalid email. Please ensure that you pass a valid email address when initiating a mobile payment");
                                data = _this.buildMobile(payment, phone, method);
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    3,
                                    ,
                                    4
                                ]);
                                return [
                                    4,
                                    fetch(URL_INITIATE_MOBILE_TRANSACTION, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(data)
                                    })
                                ];
                            case 2:
                                response = _state.sent();
                                responseData = response.json();
                                return [
                                    2,
                                    _this.parse(responseData)
                                ];
                            case 3:
                                error = _state.sent();
                                console.log("Paynow.initMobile: Error occurred while initialising payment", error);
                                return [
                                    3,
                                    4
                                ];
                            case 4:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            /**
   * Validates whether an email address is valid or not
   *
   * @param {string} emailAddress The email address to validate
   *
   * @returns {boolean} A value indicating an email is valid or not
   */ key: "isValidEmail",
            value: function isValidEmail(emailAddress) {
                if (!emailAddress || emailAddress.length === 0) return false;
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress);
            }
        },
        {
            /**
   * Parses the response from Paynow
   * @param response
   * @returns {InitResponse|null}
   */ key: "parse",
            value: function parse(response) {
                if (!response) {
                    return null;
                }
                var parsedResponseURL = this.parseQuery(response);
                if (parsedResponseURL["status"].toLowerCase() !== "error" && !this.verifyHash(parsedResponseURL)) {
                    throw new Error("Hashes do not match!");
                }
                return new InitResponse(parsedResponseURL);
            }
        },
        {
            /**
   * Creates a SHA512 hash of the transactions
   * @param values
   * @param integrationKey
   * @returns {string}
   * 
   */ key: "generateHash",
            value: function generateHash(values, integrationKey) {
                var sha512 = require("js-sha512").sha512;
                var string = "";
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = Object.keys(values)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var key = _step.value;
                        if (key !== "hash") {
                            string += values[key];
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                string += integrationKey;
                return sha512(string).toUpperCase();
            }
        },
        {
            /**
   * Verify hashes at all interactions with server
   * @param {*} values
   */ key: "verifyHash",
            value: function verifyHash(values) {
                if (!values["hash"]) {
                    return false;
                } else {
                    return values["hash"] === this.generateHash(values, this.integrationKey);
                }
            }
        },
        {
            /**
   * Parse responses from Paynow
   * @param queryString
   */ key: "parseQuery",
            value: function parseQuery(queryString) {
                var query = {};
                var pairs = (queryString[0] === "?" ? queryString.slice(1) : queryString).split("&");
                for(var i = 0; i < pairs.length; i++){
                    var pair = pairs[i].split("=");
                    query[(0, import_urlencode.decode)(pair[0]).toLowerCase()] = (0, import_urlencode.decode)(pair[1]);
                }
                return query;
            }
        },
        {
            /**
   * Build up a payment into the format required by Paynow
   * @param payment
   * @returns {{resulturl: String, returnurl: String, reference: String, amount: number, id: String, additionalinfo: String, authemail: String, status: String}}
   */ key: "build",
            value: function build(payment) {
                var data = {
                    resulturl: this.resultUrl ? this.resultUrl : "",
                    returnurl: this.returnUrl ? this.returnUrl : "",
                    reference: payment.reference,
                    amount: payment.total().toString(),
                    id: this.integrationId,
                    additionalinfo: payment.info(),
                    authemail: payment.authEmail ? payment.authEmail : "",
                    status: "Message"
                };
                data["hash"] = this.generateHash(data, this.integrationKey);
                return data;
            }
        },
        {
            /**
   * Build up a mobile payment into the format required by Paynow
   * @param payment
   * @returns {{resulturl: String, returnurl: String, reference: String, amount: number, id: String, additionalinfo: String, authemail: String, status: String}}
   */ key: "buildMobile",
            value: function buildMobile(payment, phone, method) {
                var data = {
                    resulturl: this.resultUrl,
                    returnurl: this.returnUrl,
                    reference: payment.reference,
                    amount: payment.total().toString(),
                    id: this.integrationId,
                    additionalinfo: payment.info(),
                    authemail: payment.authEmail,
                    phone: phone,
                    method: method,
                    status: "Message"
                };
                data["hash"] = this.generateHash(data, this.integrationKey);
                return data;
            }
        },
        {
            key: "pollTransaction",
            value: /**
   * Check the status of a transaction
   * @param url
   * @returns {PromiseLike<InitResponse> | Promise<InitResponse>}
   */ function pollTransaction(url) {
                var _this = this;
                return _async_to_generator(function() {
                    var response, responseData, parsedResponseURL, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    3,
                                    ,
                                    4
                                ]);
                                return [
                                    4,
                                    fetch(url, {
                                        method: "POST"
                                    })
                                ];
                            case 1:
                                response = _state.sent();
                                return [
                                    4,
                                    response.json()
                                ];
                            case 2:
                                responseData = _state.sent();
                                parsedResponseURL = _this.parseQuery(responseData);
                                if (parsedResponseURL["status"].toLowerCase() !== "error" && !_this.verifyHash(parsedResponseURL)) {
                                    throw new Error("Hashes do not match!");
                                }
                                return [
                                    2,
                                    new StatusResponse(parsedResponseURL)
                                ];
                            case 3:
                                error = _state.sent();
                                console.log("Paynow.pollTransaction: Error occurred while initialising payment", error);
                                return [
                                    3,
                                    4
                                ];
                            case 4:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            /**
   * Parses the response from Paynow
   * @param response
   * @returns {StatusResponse}
   */ key: "parseStatusUpdate",
            value: function parseStatusUpdate(response) {
                if (response) {
                    var parsedResponse = this.parseQuery(response);
                    if (!this.verifyHash(parsedResponse)) {
                        throw new Error("Hashes do not match!");
                    }
                    return new StatusResponse(parsedResponse);
                } else {
                    throw new Error("An unknown error occurred");
                }
            }
        },
        {
            /**
   * Validates an outgoing request before sending it to Paynow (data sanity checks)
   * @param payment
   */ key: "validate",
            value: function validate(payment) {
                if (payment.cart.length() <= 0) {
                    this.fail("You need to have at least one item in cart");
                }
                if (payment.total() <= 0) {
                    this.fail("Cart total should be greater than zero");
                }
            }
        }
    ]);
    return Paynow;
}();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
    Cart: Cart,
    CartItem: CartItem,
    InitResponse: InitResponse,
    Payment: Payment,
    Paynow: Paynow,
    StatusResponse: StatusResponse
});
