'use strict';

var RESPONSE_OK = 'ok';
var RESPONSE_ERROR = 'error';

var URL_INITIATE_TRANSACTION = 'https://paynow.webdevworld.com/interface/initiatetransaction';
var URL_INITIATE_MOBILE_TRANSACTION = 'https://paynow.webdevworld.com/interface/remotetransaction';
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InitResponse =

/**
 * Default constructor
 *
 * @param data
 */


/**
 * The instructions for USSD push for customers to dial incase of mobile money payments
 */


/**
 * The error message from Paynow, if any
 */


/**
 * Boolean indicating whether the response contains a url to redirect to
 */
function InitResponse(data) {
  _classCallCheck(this, InitResponse);

  this.status = data.status.toLowerCase();
  this.success = this.status === RESPONSE_OK;
  this.hasRedirect = typeof data.browserurl !== "undefined";

  if (!this.success) {
    this.error = data.error;
  } else {
    if (this.hasRedirect) {
      this.redirectUrl = data.browserurl;
      this.pollUrl = data.pollurl;
    }

    if (typeof data.instructions !== "undefined") {
      this.instructions = data.instructions;
    }
  }
}

/**
 * The status from paynow
 */


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

exports.default = InitResponse;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Payment = function () {

  /**
   * Payment constructor
   * @param {String} reference
   * @param {String} authEmail
   */


  /**
   * Items being paid from by client
   *
   * @type {Array}
   */
  function Payment(reference, authEmail) {
    _classCallCheck(this, Payment);

    this.reference = reference;
    this.authEmail = authEmail;

    this.items = [];
  }

  /**
   * Adds an item to the 'shopping cart'
   * @param {String} title
   * @param {Number} amount
   *
   * @returns {Payment} Returns false if parameters fail validation
   */


  /**
   * Email address from client
   *
   * @type {String}
   */

  /**
   * Unique identifier for transaction
   */


  _createClass(Payment, [{
    key: "add",
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

    /**
     * Generates the description for the payment
     *
     * @returns {String} The description of the payment
     */

  }, {
    key: "info",
    value: function info() {
      var str = "";
      var infoArr = [];
      this.items.forEach(function (value) {
        infoArr.push(value.title);
      });

      str = infoArr.join(",");
      return str;
    }

    /**
     * Get the total of the items in the cart
     *
     * @returns {*|Number}
     */

  }, {
    key: "total",
    value: function total() {
      return this.items.reduce(function (accumulator, value) {
        return accumulator + Number(value.amount);
      }, 0);
    }
  }]);

  return Payment;
}();

exports.default = Payment;
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _payment = require("./payment");

var _payment2 = _interopRequireDefault(_payment);

var _statusResponse = require("./statusResponse");

var _statusResponse2 = _interopRequireDefault(_statusResponse);

var _initResponse = require("./initResponse");

var _initResponse2 = _interopRequireDefault(_initResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var http = require("request-promise-native");


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
   *
   * @returns {InitResponse}
   */


  /**
   * Url to redirect the user after payment
   */


  /**
   * Merchant's integration key
   */


  _createClass(Paynow, [{
    key: "send",
    value: function send(payment) {
      if ((typeof payment === "undefined" ? "undefined" : _typeof(payment)) !== "object") {
        return false;
      }

      if (!(payment instanceof _payment2.default)) {
        if ("reference" in payment && "description" in payment && "amount" in payment) {
          payment = new _payment2.default(payment["reference"]).add(payment["reference"], payment["amount"]);
        } else {
          this.fail("Invalid object passed to function. Object must have the following keys: reference, description, amount");
        }
      }

      return this.init(payment);
    }

    /**
     * Send a mobile money payment to paynow
     *
     * @param {Payment} payment The payment to send to paynow
     * @param {String} phone The phone number making payment
     * @param {String} method The mobile money method to use (currently only ecocash is supported)
     *
     * @returns {InitResponse}
     */

  }, {
    key: "sendMobile",
    value: function sendMobile(payment, phone, method) {
      if ((typeof payment === "undefined" ? "undefined" : _typeof(payment)) !== "object") {
        return false;
      }

      if (!(payment instanceof _payment2.default) && phone && method) {
        if ("reference" in payment && "description" in payment && "amount" in payment && "authemail" in payment) {
          payment = new _payment2.default(payment["reference"], payment["authEmail"]).add(payment["reference"], payment["amount"]);
        } else {
          this.fail("Invalid object passed to function. Object must have the following keys: reference, description, amount, authemail");
        }
      }

      return this.initMobile(payment, phone, method);
    }

    /**
     * Create a new Paynow payment
     *
     * @param {*} reference The unique reference for the transaction
     * @param {String} authEmail The payer's email address
     *
     * @returns {Payment}
     */

  }, {
    key: "createPayment",
    value: function createPayment(reference, authEmail) {
      return new _payment2.default(reference, authEmail);
    }

    /**
     * Throw an exception with the given message
     *
     * @param {*} message
     *
     * @returns {void}
     */

  }, {
    key: "fail",
    value: function fail(message) {
      throw new Error(message);
    }

    /**
     * Initialize a new transaction with PayNow
     *
     * @param {Payment} payment
     *
     * @returns {PromiseLike<InitResponse> | Promise<InitResponse>}
     */

  }, {
    key: "init",
    value: function init(payment) {
      var _this = this;

      this.validate(payment);

      var data = this.build(payment);

      return http({
        method: "POST",
        uri: URL_INITIATE_TRANSACTION,
        form: data,
        json: false
      }, false).then(function (response) {
        return _this.parse(response);
      });
    }

    /**
     * Initialize a new mobile transaction with PayNow
     *
     * @param {Payment} payment The payment to send to paynow
     * @param {String} phone The phone number making payment
     * @param {String} method The mobile money method to use (currently only ecocash is supported)
     *
     * @returns {PromiseLike<InitResponse> | Promise<InitResponse>}
     */

  }, {
    key: "initMobile",
    value: function initMobile(payment, phone, method) {
      var _this2 = this;

      this.validate(payment);

      var data = this.buildMobile(payment, phone, method);

      return http({
        method: "POST",
        uri: URL_INITIATE_MOBILE_TRANSACTION,
        form: data,
        json: false
      }, false).then(function (response) {
        return _this2.parse(response);
      });
    }

    /**
     * Parses the response from Paynow
     *
     * @param response
     *
     * @returns {InitResponse}
     */

  }, {
    key: "parse",
    value: function parse(response) {
      if (typeof response === "undefined") {
        return null;
      }
      if (response.length > 0) {
        response = this.parseQuery(response);

        if (!this.verifyHash(response)) {
          throw new Error("Hashes do not match!");
        }

        return new _initResponse2.default(response);
      } else {
        throw new Error("An unknown error occurred");
      }
    }

    /**
     * Creates a SHA512 hash of the transactions
     *
     * @param {Object} values Key-value pair values to hash
     * @param {String} integrationKey The integration key to use when hashing the items
     *
     * @returns {string}
     */

  }, {
    key: "generateHash",
    value: function generateHash(values, integrationKey) {
      var sha512 = require("js-sha512").sha512;
      var string = "";

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(values)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          if (key !== "hash") {
            string += values[key];
          }
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

      string += integrationKey.toLowerCase();

      return sha512(string).toUpperCase();
    }

    /**
     * Verify hashes at all interactions with server
     *
     * @param {*} values The values to validate
     *
     * @returns {Boolean}
     */

  }, {
    key: "verifyHash",
    value: function verifyHash(values) {
      if (typeof values.hash === "undefined") {
        return false;
      } else {
        return values.hash === this.generateHash(values, this.integrationKey);
      }
    }

    /**
     * URL encodes the given string
     *
     * @param {String} str The string to encode
     *
     * @returns {String} The encoded URL
     */

  }, {
    key: "urlEncode",
    value: function urlEncode(str) {
      return encodeURI(str);
    }

    /**
     * URL decodes the given string
     *
     * @param {String} str The string to decode
     *
     * @returns {String} The decoded url
     */

  }, {
    key: "urlDecode",
    value: function urlDecode(str) {
      return decodeURIComponent((str + "").replace(/%(?![\da-f]{2})/gi, function () {
        return "%25";
      }).replace(/\+/g, "%20"));
    }

    /**
     * Parse responses from Paynow
     *
     * @param {String} queryString The query string to parse
     *
     * @returns {Object}
     */

  }, {
    key: "parseQuery",
    value: function parseQuery(queryString) {
      var query = {};
      var pairs = (queryString[0] === "?" ? queryString.substr(1) : queryString).split("&");
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split("=");
        query[this.urlDecode(pair[0])] = this.urlDecode(pair[1] || "");
      }

      // if(!this.verifyHash(query))
      //         throw new Error("Hash mismatch");
      return query;
    }

    /**
     * Build up a payment into the format required by Paynow
     *
     * @param {Payment} payment The payment to format
     *
     * @returns {{resulturl: String, returnurl: String, reference: String, amount: number, id: String, additionalinfo: String, authemail: String, status: String}}
     */

  }, {
    key: "build",
    value: function build(payment) {
      var data = {
        resulturl: this.resultUrl,
        returnurl: this.returnUrl,
        reference: payment.reference,
        amount: payment.total(),
        id: this.integrationId,
        additionalinfo: payment.info(),
        authemail: typeof payment.authEmail === "undefined" ? "" : payment.authEmail,
        status: "Message"
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
     * Build up a mobile payment into the format required by Paynow
     *
     * @param {Payment} payment The payment to send to paynow
     * @param {String} phone The phone number making payment
     * @param {String} method The mobile money method to use (currently only ecocash is supported)
     *
     * @returns {{resulturl: String, returnurl: String, reference: String, amount: number, id: String, additionalinfo: String, authemail: String, status: String}}
     */

  }, {
    key: "buildMobile",
    value: function buildMobile(payment, phone, method) {
      var data = {
        resulturl: this.resultUrl,
        returnurl: this.returnUrl,
        reference: payment.reference,
        amount: payment.total(),
        id: this.integrationId,
        additionalinfo: payment.info(),
        authemail: payment.authEmail,
        phone: phone,
        method: method,
        status: "Message"
      };

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = Object.keys(data)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var key = _step3.value;

          data[key] = this.urlEncode(data[key]);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      data.hash = this.generateHash(data, this.integrationKey);
      return data;
    }

    /**
     * Check the status of a transaction
     * @param {String} url
     * @returns {PromiseLike<InitResponse> | Promise<InitResponse>}
     */

  }, {
    key: "pollTransaction",
    value: function pollTransaction(url) {
      var _this3 = this;

      return http({
        method: "POST",
        uri: url,
        json: false
      }, false).then(function (response) {
        return _this3.parseStatusUpdate(response);
      });
    }

    /**
     * Parses the response from Paynow
     *
     * @param {String} response
     *
     * @returns {StatusResponse}
     */

  }, {
    key: "parseStatusUpdate",
    value: function parseStatusUpdate(response) {
      if (response.length > 0) {
        response = this.parseQuery(response);

        if (!this.verifyHash(response)) {
          throw new Error("Hashes do not match!");
        }

        return new _statusResponse2.default(response);
      } else {
        throw new Error("An unknown error occurred");
      }
    }

    /**
     * Validates an outgoing request before sending it to Paynow (data sanity checks)
     * @param {Payment} payment The payment to validate
     * @returns {void}
     */

  }, {
    key: "validate",
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

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StatusResponse =

/**
 * Default constructor
 *
 * @param data
 */


/**
 * Status returned from Paynow
 */


/**
 * Paynow transaction reference
 */

/**
 * Merchant Transaction Reference
 */
function StatusResponse(data) {
  _classCallCheck(this, StatusResponse);

  if (data.status.toLowerCase() === RESPONSE_ERROR) {
    this.error = data.error;
  } else {
    this.reference = data.reference;
    this.amount = data.amount;
    this.paynowreference = data.paynowreference;
    this.pollurl = data.pollurl;
    this.status = data.status;
  }
}

/**
 * The error message returned from Paynow
 */


/**
 * The URL on Paynow the merchant site can poll to confirm the transaction’s current status.
 */


/**
 * The original amount of the transaction
 */
;

exports.default = StatusResponse;
"use strict";

String.prototype.isNullOrEmpty = function (e) {
    return !(this == null ? e : this);
};

//# sourceMappingURL=index.js.map