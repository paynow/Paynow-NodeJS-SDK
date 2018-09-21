const http = require("request-promise-native");

class StatusResponse {
  /**
   * Merchant Transaction Reference
   */
  reference: String;

  /**
   * The original amount of the transaction
   */
  amount: String;

  /**
   * Paynow transaction reference
   */
  paynowreference: String;

  /**
   * The URL on Paynow the merchant site can poll to confirm the transaction’s current status.
   */
  pollurl: String;

  /**
   * Status returned from Paynow
   */
  status: String;

  error: String;

  /**
   * Default constructor
   *
   * @param data
   */
  constructor(data) {
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
}

class InitResponse {
  /**
   * Boolean indicating whether initiate request was successful or not
   */
  success: boolean;

  /**
   * Boolean indicating whether the response contains a url to redirect to
   */
  hasRedirect: boolean;

  /**
   * The url the user should be taken to so they can make a payment
   */
  redirectUrl: String;

  /**
   * The error message from Paynow, if any
   */
  error: String;

  /**
   * The poll URL sent from Paynow
   */
  pollUrl: String;

  /**
   * The instructions for USSD push for customers to dial incase of mobile money payments
   */
  instructions: String;

  /**
   * The status from paynow
   * @type {String}
   */
  status: String;

  /**
   * Default constructor
   *
   * @param data
   */
  constructor(data) {
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
}

class Payment {
  /**
   * Unique identifier for transaction
   */
  reference: string;

  /**
   * Items being paid from by client
   */
  items: [];

  /**
   * Email address from client
   */
  authemail: String;

  /**
   * Payment constructor
   * @param reference
   */
  constructor(reference, authEmail) {
    this.reference = reference;
    this.authEmail = authEmail;

    this.items = [];
  }

  /**
   * Adds an item to the 'shopping cart'
   * @param title
   * @param amount
   * @returns {*} Returns false if parameters fail validation
   */
  add(title: String, amount: Number) {
    if (title.isNullOrEmpty() || amount <= 0) {
      return false;
    }

    this.items.push({
      title,
      amount
    });

    return this;
  }

  info() {
    let str = "";
    let infoArr = [];
    this.items.forEach(function(value) {
      infoArr.push(value.title);
    });

    str = infoArr.join(",");
    return str;
  }

  /**
   * Get the total of the items in the cart
   * @returns {*|number}
   */
  total() {
    return this.items.reduce(function(accumulator, value) {
      return accumulator + Number(value.amount);
    }, 0);
  }
}

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
   * @param payment
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
   * @param {String} reference This is the unique reference of the transaction
   * @param {String} authEmail This is the email address of the person making payment. Required for mobile transactions
   * @returns {Payment}
   */
  createPayment(reference: string, authEmail: string) {
    return new Payment(reference, authEmail);
  }

  /**
   * Throw an exception with the given message
   * @param message*
   * @returns void
   */
  fail(message: String) {
    throw new Error(message);
  }

  /**
   * Initialize a new transaction with PayNow
   * @param payment
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
   * @param payment
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
   * @param response
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
   * @param values
   * @param integrationKey
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
   * @param {*} values
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
   * @param str {String}
   * @returns {String}
   */
  urlEncode(str) {
    return encodeURI(str);
  }

  /**
   * URL decodes the given string
   * @param str {String}
   * @returns {String}
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
   * @param queryString
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
   * @param payment
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
      if (key === "hash") continue;

      data[key] = this.urlEncode(data[key]);
    }

    data.hash = this.generateHash(data, this.integrationKey);

    return data;
  }

  /**
   * Build up a mobile payment into the format required by Paynow
   * @param payment
   * @returns {{resulturl: String, returnurl: String, reference: String, amount: number, id: String, additionalinfo: String, authemail: String, status: String}}
   */
  buildMobile(payment: Payment, phone: String, method: String) {
    if (payment.authEmail.isNullOrEmpty() || payment.authEmail.length <= 0) {
      throw new Error(
        "Auth email is required for mobile transactions. You can pass it as the second parameter to the createPayment method call"
      );
    }

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
      if (key === "hash") continue;

      data[key] = this.urlEncode(data[key]);
    }

    data.hash = this.generateHash(data, this.integrationKey);

    return data;
  }

  /**
   * Check the status of a transaction
   * @param url
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
   * @param response
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
   * @param payment
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
