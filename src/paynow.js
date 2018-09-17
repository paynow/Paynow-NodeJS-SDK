const http = require("request-promise-native");
import Payment from "./payment";
import StatusResponse from "./statusResponse";
import InitResponse from "./initResponse";

module.exports = class Paynow {
  /**
   * Merchant's integration id
   */
  integrationId: String;

  /**
   * Merchant's integration key
   */
  integrationKey: String;

  /**
   * Url where where transaction status will be sent
   */
  resultUrl: String;

  /**
   * Url to redirect the user after payment
   */
  returnUrl: String;

  /**
   * Default constructor
   *
   * @param integrationId {String} Merchant's integration id
   * @param integrationKey {String} Merchant's integration key
   * @param resultUrl {String} Url where where transaction status will be sent
   * @param returnUrl {String} Url to redirect the user after payment
   */
  constructor(integrationId, integrationKey, resultUrl, returnUrl) {
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
  send(payment) {
    if (typeof payment !== "object") {
      return false;
    }

    if (!(payment instanceof Payment)) {
      if (
        "reference" in payment &&
        "description" in payment &&
        "amount" in payment
      ) {
        payment = new Payment(payment["reference"]).add(
          payment["reference"],
          payment["amount"]
        );
      } else {
        this.fail(
          "Invalid object passed to function. Object must have the following keys: reference, description, amount"
        );
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
  sendMobile(payment, phone: String, method: String) {
    if (typeof payment !== "object") {
      return false;
    }

    if (!(payment instanceof Payment) && phone && method) {
      if (
        "reference" in payment &&
        "description" in payment &&
        "amount" in payment &&
        "authemail" in payment
      ) {
        payment = new Payment(payment["reference"], payment["authEmail"]).add(
          payment["reference"],
          payment["amount"]
        );
      } else {
        this.fail(
          "Invalid object passed to function. Object must have the following keys: reference, description, amount, authemail"
        );
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
  createPayment(reference: string, authEmail: string) {
    return new Payment(reference, authEmail);
  }

  /**
   * Throw an exception with the given message
   *
   * @param {*} message
   *
   * @returns {void}
   */
  fail(message) {
    throw new Error(message);
  }

  /**
   * Initialize a new transaction with PayNow
   *
   * @param {Payment} payment
   *
   * @returns {PromiseLike<InitResponse> | Promise<InitResponse>}
   */
  init(payment: Payment) {
    this.validate(payment);

    let data = this.build(payment);

    return http(
      {
        method: "POST",
        uri: URL_INITIATE_TRANSACTION,
        form: data,
        json: false
      },
      false
    ).then(response => {
      return this.parse(response);
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
  initMobile(payment: Payment, phone: String, method: String) {
    this.validate(payment);

    let data = this.buildMobile(payment, phone, method);

    return http(
      {
        method: "POST",
        uri: URL_INITIATE_MOBILE_TRANSACTION,
        form: data,
        json: false
      },
      false
    ).then(response => {
      return this.parse(response);
    });
  }

  /**
   * Parses the response from Paynow
   *
   * @param response
   *
   * @returns {InitResponse}
   */
  parse(response) {
    if (typeof response === "undefined") {
      return null;
    }
    if (response.length > 0) {
      response = this.parseQuery(response);

      if (!this.verifyHash(response)) {
        throw new Error("Hashes do not match!");
      }

      return new InitResponse(response);
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
  generateHash(values: Object, integrationKey: String) {
    let sha512 = require("js-sha512").sha512;
    let string = "";

    for (const key of Object.keys(values)) {
      if (key !== "hash") {
        string += values[key];
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
  verifyHash(values: Object) {
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
  urlEncode(str) {
    return encodeURI(str);
  }

  /**
   * URL decodes the given string
   *
   * @param {String} str The string to decode
   *
   * @returns {String} The decoded url
   */
  urlDecode(str) {
    return decodeURIComponent(
      (str + "")
        .replace(/%(?![\da-f]{2})/gi, function() {
          return "%25";
        })
        .replace(/\+/g, "%20")
    );
  }

  /**
   * Parse responses from Paynow
   *
   * @param {String} queryString The query string to parse
   *
   * @returns {Object}
   */
  parseQuery(queryString) {
    let query = {};
    let pairs = (queryString[0] === "?"
      ? queryString.substr(1)
      : queryString
    ).split("&");
    for (let i = 0; i < pairs.length; i++) {
      let pair = pairs[i].split("=");
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
  build(payment: Payment) {
    let data = {
      resulturl: this.resultUrl,
      returnurl: this.returnUrl,
      reference: payment.reference,
      amount: payment.total(),
      id: this.integrationId,
      additionalinfo: payment.info(),
      authemail:
        typeof payment.authEmail === "undefined" ? "" : payment.authEmail,
      status: "Message"
    };

    for (const key of Object.keys(data)) {
      data[key] = this.urlEncode(data[key]);
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
  buildMobile(payment: Payment, phone: String, method: String) {
    let data = {
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

    for (const key of Object.keys(data)) {
      data[key] = this.urlEncode(data[key]);
    }

    data.hash = this.generateHash(data, this.integrationKey);
    return data;
  }

  /**
   * Check the status of a transaction
   * @param {String} url
   * @returns {PromiseLike<InitResponse> | Promise<InitResponse>}
   */
  pollTransaction(url) {
    return http(
      {
        method: "POST",
        uri: url,
        json: false
      },
      false
    ).then(response => {
      return this.parseStatusUpdate(response);
    });
  }

  /**
   * Parses the response from Paynow
   *
   * @param {String} response
   *
   * @returns {StatusResponse}
   */
  parseStatusUpdate(response) {
    if (response.length > 0) {
      response = this.parseQuery(response);

      if (!this.verifyHash(response)) {
        throw new Error("Hashes do not match!");
      }

      return new StatusResponse(response);
    } else {
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Validates an outgoing request before sending it to Paynow (data sanity checks)
   * @param {Payment} payment The payment to validate
   * @returns {void}
   */
  validate(payment: Payment) {
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
};
