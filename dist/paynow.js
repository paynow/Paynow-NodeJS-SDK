'use strict';

var RESPONSE_OK = 'ok';
var RESPONSE_PAID = 'paid';
var RESPONSE_ERROR = 'error';
var RESPONSE_FAILED = 'failed';
var RESPONSE_DELIVERED = 'delivered';
var RESPONSE_CANCELLED = 'cancelled';
var RESPONSE_INVALID_ID = 'invalid id.';
var RESPONSE_AWAITING_REDIRECT = 'awaiting redirect';
var RESPONSE_AWAITING_DELIVERY = 'awaiting delivery';
var RESPONSE_CREATED_NOT_PAID = 'created but not paid';

var URL_INITIATE_TRANSACTION = 'https://paynow.webdevworld.com/interface/initiatetransaction';
var URL_INITIATE_MOBILE_TRANSACTION = 'https://paynow.webdevworld.com/interface/remotetransaction';
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var http = require('request-promise-native');
// TODO: Verify hashes at all interactions with server

var StatusResponse =

/**
 * Default constructor
 *
 * @param data
 */


/**
 * The original amount of the transaction
 */
function StatusResponse(data) {
    _classCallCheck(this, StatusResponse);

    this.paid = data.status.toLowerCase() === RESPONSE_PAID;
    this.amount = data.amount;
    this.reference = data.reference;
}

/**
 * The original reference of the transaction
 */


/**
 * Boolean indicating whether the transaction was paid or not
 */
;

var InitResponse =

/**
 * Default constructor
 *
 * @param data
 */


/**
 * The error message from Paynow, if any
 */


/**
 * Boolean indicating whether the response contains a url to redirect to
 */
function InitResponse(data) {
    _classCallCheck(this, InitResponse);

    this.success = data.status.toLowerCase() !== 'error';
    this.hasRedirect = typeof data.browserurl !== "undefined";

    if (!this.success) {
        this.error = data.error;
    }

    if (this.hasRedirect) {
        this.redirectUrl = data.browserurl;
        this.pollUrl = data.pollurl;
    }
}

/**
 * The poll URL sent from Paynow
 */


/**
 * The url the user should be taken to so they can make a payment
 */


/**
 * Boolean indicating whether initiate request was successful or not
 */
;

var Payment = function () {

    /**
     * Payment constructor
     * @param reference
     */

    /**
     * Unique identifier for transaction
     */
    function Payment(reference) {
        _classCallCheck(this, Payment);

        this.reference = reference;

        this.items = [];
    }

    /**
     * Adds an item to the 'shopping cart'
     * @param title
     * @param amount
     * @returns {*} Returns false if parameters fail validation
     */


    /**
     * Items being paid from by client
     */


    _createClass(Payment, [{
        key: 'add',
        value: function add(title, amount) {
            if (title.isNullOrEmpty() || amount <= 0) {
                return false;
            }

            this.items.push({
                title: title,
                amount: amount
            });

            return this;
        }
    }, {
        key: 'info',
        value: function info() {
            var str = "";
            this.items.forEach(function (value) {
                str += value.title + ", "; // TODO: Update! This could be better
            });

            return str;
        }

        /**
         * Get the total of the items in the cart
         * @returns {*|number}
         */

    }, {
        key: 'total',
        value: function total() {
            return this.items.reduce(function (accumulator, value) {
                return accumulator + value.amount;
            }, 0);
        }
    }]);

    return Payment;
}();

module.exports = function () {

    /**
     * Default constructor
     *
     * @param integrationId {String} Merchant's integration id
     * @param integrationKey {String} Merchant's integration key
     * @param resultUrl {String} Url where where transaction status will be sent
     * @param returnUrl {String} Url to redirect the user after payment
     */


    /**
     * Url where where transaction status will be sent
     */

    /**
     * Merchant's integration id
     */
    function Paynow(integrationId, integrationKey, resultUrl, returnUrl) {
        _classCallCheck(this, Paynow);

        this.integrationId = integrationId;
        this.integrationKey = integrationKey;
        this.resultUrl = resultUrl;
        this.returnUrl = returnUrl;
    }

    /**
     * Send a payment to paynow
     * @param payment
     */


    /**
     * Url to redirect the user after payment
     */


    /**
     * Merchant's integration key
     */


    _createClass(Paynow, [{
        key: 'send',
        value: function send(payment) {
            return this.init(payment);
        }

        /**
         * Create a new Paynow payment
         * @param reference
         * @returns {Payment}
         */

    }, {
        key: 'createPayment',
        value: function createPayment(reference) {
            return new Payment(reference);
        }

        /**
         * Throw an exception with the given message
         * @param message*
         * @returns void
         */

    }, {
        key: 'fail',
        value: function fail(message) {
            throw new Error(message);
        }

        /**
         * Initialize a new transaction with PayNow
         * @param payment
         * @returns {PromiseLike<InitResponse> | Promise<InitResponse>}
         */

    }, {
        key: 'init',
        value: function init(payment) {
            var _this = this;

            this.validate(payment);

            var data = this.build(payment);

            return http({
                method: 'POST',
                uri: URL_INITIATE_TRANSACTION,
                form: data,
                json: false
            }, false).then(function (response) {
                return _this.parse(response);
            });
        }

        /**
         * Parses the response from Paynow
         * @param response
         * @returns {InitResponse}
         */

    }, {
        key: 'parse',
        value: function parse(response) {
            if (response.length > 0) {
                response = this.parseQuery(response);

                return new InitResponse(response);
            } else {
                throw new Error("An unknown error occurred");
            }
        }

        /**
         * Creates a SHA512 hash of the transactions
         * @param values
         * @param integrationKey
         * @returns {string}
         */

    }, {
        key: 'generateHash',
        value: function generateHash(values, integrationKey) {
            var sha512 = require('js-sha512').sha512;
            var string = "";

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(values)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var key = _step.value;

                    string += values[key];
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            string += integrationKey;

            return sha512(string).toUpperCase();
        }

        /**
         * URL encodes the given string
         * @param str {String}
         * @returns {String}
         */

    }, {
        key: 'urlEncode',
        value: function urlEncode(str) {
            return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
        }

        /**
         * URL decodes the given string
         * @param str {String}
         * @returns {String}
         */

    }, {
        key: 'urlDecode',
        value: function urlDecode(str) {
            return decodeURIComponent((str + '').replace(/%(?![\da-f]{2})/gi, function () {
                return '%25';
            }).replace(/\+/g, '%20'));
        }

        /**
         * Parse responses from Paynow
         * @param queryString
         */

    }, {
        key: 'parseQuery',
        value: function parseQuery(queryString) {
            var query = {};
            var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i].split('=');
                query[this.urlDecode(pair[0])] = this.urlDecode(pair[1] || '');
            }
            return query;
        }

        /**
         * Build up a payment into the format required by Paynow
         * @param payment
         * @returns {{resulturl: String, returnurl: String, reference: String, amount: number, id: String, additionalinfo: String, authemail: String, status: String}}
         */

    }, {
        key: 'build',
        value: function build(payment) {
            var data = {
                'resulturl': this.resultUrl,
                'returnurl': this.returnUrl,
                'reference': payment.reference,
                'amount': payment.total(),
                'id': this.integrationId,
                'additionalinfo': payment.info(),
                'authemail': '',
                'status': 'Message'
            };

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = Object.keys(data)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var key = _step2.value;

                    data[key] = this.urlEncode(data[key]);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            data.hash = this.generateHash(data, this.integrationKey);
            return data;
        }

        /**
         * Check the status of a transaction
         * @param url
         * @returns {PromiseLike<InitResponse> | Promise<InitResponse>}
         */

    }, {
        key: 'checkTransactionStatus',
        value: function checkTransactionStatus(url) {
            var _this2 = this;

            return http({
                method: 'POST',
                uri: url,
                json: false
            }, false).then(function (response) {
                return _this2.parse(response);
            });
        }

        /**
         * Check the status of a transaction
         * @param url
         * @returns {PromiseLike<InitResponse> | Promise<InitResponse>}
         */

    }, {
        key: 'processStatusUpdate',
        value: function processStatusUpdate(url) {
            var _this3 = this;

            return http({
                method: 'POST',
                uri: url,
                json: false
            }, false).then(function (response) {
                return _this3.parse(response);
            });
        }

        /**
         * Parses the response from Paynow
         * @param response
         * @returns {InitResponse}
         */

    }, {
        key: 'parseStatusUpdate',
        value: function parseStatusUpdate(response) {
            if (response.length > 0) {
                response = this.parseQuery(response);

                return new StatusResponse(response);
            } else {
                throw new Error("An unknown error occurred");
            }
        }

        /**
         * Validates an outgoing request before sending it to Paynow (data sanity checks)
         * @param payment
         */

    }, {
        key: 'validate',
        value: function validate(payment) {
            if (payment.reference.isNullOrEmpty()) {
                this.fail("Reference is required");
            }

            if (payment.items.length <= 0) {
                this.fail("You need to have at least one item in cart");
            }

            if (payment.total() <= 0) {
                this.fail("The total should be greater than zero");
            }
        }
    }]);

    return Paynow;
}();
"use strict";

String.prototype.isNullOrEmpty = function (e) {
    return !(this == null ? e : this);
};

//# sourceMappingURL=paynow.js.map