import Payment from "./types/payment";
import * as http from "request-promise-native";
import {
  URL_INITIATE_MOBILE_TRANSACTION,
  URL_INITIATE_TRANSACTION,
  RESPONSE_ERROR,
  RESPONSE_OK
} from "./constants";
import request = require("request");

//#region StatusResponse Class
/**
 *
 * @property {String} reference - merchant transaction reference .
 * @property {String} amount - original amount for the transaction.
 * @property {String} paynowReference  - the Paynow transaction reference.
 * @property {String} pollUrl - the URL on Paynow the merchant can poll to confirm the transaction’s status.
 * @property {String} status - transaction status returned from paynow.
 * @property {String} error - error message sent from Paynow  (if any).
 *
 * @param data data from the status response
 */

export class StatusResponse {
  reference: String;
  amount: String;
  paynowReference: String;
  pollUrl: String;
  status: String;
  error: String;

  constructor(data: any) {
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
}
//#endregion

//#region InitResponse Class
/**
 *
 * @property {boolean} success - indicates if initiate request was successful or not.
 * @property {boolean} hasRedirect - indicates if the response has a URL to redirect to.
 * @property {String} redirectUrl - the URL the user should be redirected to so they can make a payment.
 * @property {String} error - error message sent from Paynow (if any).
 * @property {String} pollUrl  - pollUrl sent from Paynow that can be used to check transaction status.
 * @property {String} instructions - instructions for USSD push for customers to dial incase of mobile money payments.
 * @property {String} status - status from Paynow.
 *
 * @param data - data from the Response.
 *
 */

export class InitResponse {
  success: boolean;
  hasRedirect: boolean;
  redirectUrl: String;
  error: String;
  pollUrl: String;
  instructions: String;
  status: String;

  constructor(data: any) {
    this.status = data.status.toLowerCase();
    this.success = this.status === RESPONSE_OK;
    this.hasRedirect = typeof data.browserurl !== "undefined";

    if (!this.success) {
      this.error = data.error;
    } else {
      this.pollUrl = data.pollurl;

      if (this.hasRedirect) {
        this.redirectUrl = data.browserurl;
      }

      if (typeof data.instructions !== "undefined") {
        this.instructions = data.instructions;
      }
    }
  }
}
//#endregion

/**
 * Paynow Class
 * 
 * @param integrationId {String} Merchant's integration id
 * @param integrationKey {String} Merchant's integration key
 * @param resultUrl {String} Url where where transaction status will be sent
 * @param returnUrl {String} Url to redirect the user after payment
 **/

export default class Paynow {
  constructor(
    public integrationId: string,
    public integrationKey: string,
    public resultUrl: string,
    public returnUrl: string
  ) {}

  /**
   * Send a payment to paynow
   * @param payment
   */
  send(payment: Payment) {
    return this.init(payment);
  }

  /**
   * Send a mobile money payment to paynow
   * @param payment
   */
  sendMobile(payment: Payment, phone: string, method: string) {
    return this.initMobile(payment, phone, method);
  }

  /**
   * Create a new Paynow payment
   * @param {String} reference This is the unique reference of the transaction
   * @param {String} authEmail This is the email address of the person making payment. Required for mobile transactions
   * @returns {Payment}
   */
  createPayment(reference: string, authEmail: string): Payment {
    return new Payment(reference, authEmail);
  }

  /**
   * Throw an exception with the given message
   * @param message*
   * @returns void
   */
  fail(message: string): Error {
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
      }
    ).then((response: Response) => {
      return this.parse(response);
    }).catch(function(err) {
      console.log("An error occured while initiating transaction", err)
    });
  }

  /**
   * Initialize a new mobile transaction with PayNow
   * @param {Payment} payment
   * @returns {PromiseLike<InitResponse> | Promise<InitResponse>} the response from the initiation of the transaction
   */
  initMobile(payment: Payment, phone: string, method: string) {
    this.validate(payment);

    let data = this.buildMobile(payment, phone, method);

    return http(
      {
        method: "POST",
        uri: URL_INITIATE_MOBILE_TRANSACTION,
        form: data,
        json: false
      }
    ).then((response: Response) => {
      return this.parse(response);
    }).catch(function(err) {
      console.log("An error occured while initiating transaction", err)
    });;
  }

  /**
   * Parses the response from Paynow
   * @param response
   * @returns {InitResponse}
   */
  parse(response: Response) {
    if (typeof response === "undefined") {
      return null;
    }
    if (response) {
      let parsedResponseURL = this.parseQuery((response as unknown) as string);

      if (
        parsedResponseURL.status.toString() !== "error" &&
        !this.verifyHash(parsedResponseURL)
      ) {
        throw new Error("Hashes do not match!");
      }

      return new InitResponse(parsedResponseURL);
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
  generateHash(values: { [key: string]: string }, integrationKey: String) {
    let sha512 = require("js-sha512").sha512;
    let string: string = "";

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
  verifyHash(values: { [key: string]: string }) {
    if (typeof values["hash"] === "undefined") {
      return false;
    } else {
      return values["hash"] === this.generateHash(values, this.integrationKey);
    }
  }

  /**
   * URL encodes the given string
   * @param str {String}
   * @returns {String}
   */
  urlEncode(url: string) {
    return encodeURI(url);
  }

  /**
   * URL decodes the given string
   * @param str {String}
   * @returns {String}
   */
  urlDecode(url: string) {
    return decodeURIComponent(
      (url + "")
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
  parseQuery(queryString: string) {
    let query: { [key: string]: string } = {};
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
    let data: { [key: string]: string } = {
      resulturl: this.resultUrl,
      returnurl: this.returnUrl,
      reference: payment.reference,
      amount: payment.total().toString(),
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

    data["hash"] = this.generateHash(data, this.integrationKey);

    return data;
  }

  /**
   * Build up a mobile payment into the format required by Paynow
   * @param payment
   * @returns {{resulturl: String, returnurl: String, reference: String, amount: number, id: String, additionalinfo: String, authemail: String, status: String}}
   */
  buildMobile(
    payment: Payment,
    phone: string,
    method: string
  ): Error | { [key: string]: string } {
    if (payment.authEmail.length <= 0) {
      throw new Error(
        "Auth email is required for mobile transactions. You can pass it as the second parameter to the createPayment method call"
      );
    }

    let data: { [key: string]: string } = {
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

    for (const key of Object.keys(data)) {
      if (key === "hash") continue;

      data[key] = this.urlEncode(data[key]);
    }

    data["hash"] = this.generateHash(data, this.integrationKey);

    return data;
  }

  /**
   * Check the status of a transaction
   * @param url
   * @returns {PromiseLike<InitResponse> | Promise<InitResponse>}
   */
  pollTransaction(url: string) {
    return http(
      {
        method: "POST",
        uri: url,
        form: null,
        json: false
      }
    ).then((response: Response) => {
      return this.parse(response);
    })
  }

  /**
   * Parses the response from Paynow
   * @param response
   * @returns {StatusResponse}
   */
  parseStatusUpdate(response: any) {
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
    if (payment.items.length() <= 0) {
      this.fail("You need to have at least one item in cart");
    }

    if (payment.total() <= 0) {
      this.fail("The total should be greater than zero");
    }
  }
}
