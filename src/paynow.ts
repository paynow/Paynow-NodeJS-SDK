import { InitResponse } from "./components/init-response";
import { Payment } from "./components/payment";
import { StatusResponse } from "./components/status-response";
import { URL_INITIATE_MOBILE_TRANSACTION, URL_INITIATE_TRANSACTION } from "./constants";
import { decode } from "urlencode";


/**
 * Paynow Class
 *
 * @param integrationId {String} Merchant's integration id
 * @param integrationKey {String} Merchant's integration key
 * @param resultUrl {String} Url where where transaction status will be sent
 * @param returnUrl {String} Url to redirect the user after payment
 * 
 * 
 */
export class Paynow {
    constructor(
        public integrationId: string = process.env.PAYNOW_INTEGRATION_ID,
        public integrationKey: string = process.env.PAYNOW_INTEGRATION_KEY,
        public resultUrl: string,
        public returnUrl: string
    ) { }

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
     * @returns {Promise<InitResponse|null>}
     */
    async init(payment: Payment): Promise<InitResponse | null> {
        this.validate(payment);
        let data = this.build(payment);

        try {
            let response = await fetch(
                URL_INITIATE_TRANSACTION,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            )

            const responseData = response.json()

            return this.parse(responseData)

        } catch (error) {
            console.log("Paynow.init: Error occurred while initialising payment", error)
        }
    }

    /**
     * Initialize a new mobile transaction with PayNow
     * @param {Payment} payment
     * @returns {Promise<InitResponse|null>} the response from the initiation of the transaction
     */
    async initMobile(payment: Payment, phone: string, method: string): Promise<InitResponse | null> {
        this.validate(payment);

        if (!this.isValidEmail(payment.authEmail))
            this.fail(
                "Invalid email. Please ensure that you pass a valid email address when initiating a mobile payment"
            );

        let data = this.buildMobile(payment, phone, method);

        try {
            let response = await fetch(
                URL_INITIATE_MOBILE_TRANSACTION,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            )

            const responseData = response.json()

            return this.parse(responseData)

        } catch (error) {
            console.log("Paynow.initMobile: Error occurred while initialising payment", error)
        }
    }

    /**
     * Validates whether an email address is valid or not
     *
     * @param {string} emailAddress The email address to validate
     *
     * @returns {boolean} A value indicating an email is valid or not
     */
    isValidEmail(emailAddress: string): boolean {
        if (!emailAddress || emailAddress.length === 0) return false;

        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress);
    }

    /**
     * Parses the response from Paynow
     * @param response
     * @returns {InitResponse|null}
     */
    parse(response: any): InitResponse | null {
        if (!response) {
            return null;
        }

        let parsedResponseURL = this.parseQuery(response as unknown as string);

        if (parsedResponseURL["status"].toLowerCase() !== "error" && !this.verifyHash(parsedResponseURL)) {
            throw new Error("Hashes do not match!");
        }

        return new InitResponse(parsedResponseURL);
    }

    /**
     * Creates a SHA512 hash of the transactions
     * @param values
     * @param integrationKey
     * @returns {string}
     * 
     */
    generateHash(values: { [key: string]: string }, integrationKey: String) {
        let sha512 = require("js-sha512").sha512;
        let string: string = "";

        for (const key of Object.keys(values)) {
            if (key !== "hash") {
                string += values[key];
            }
        }

        string += integrationKey;

        return sha512(string).toUpperCase();
    }

    /**
     * Verify hashes at all interactions with server
     * @param {*} values
     */
    verifyHash(values: { [key: string]: string }) {
        if (!values["hash"]) {
            return false;
        } else {
            return values["hash"] === this.generateHash(values, this.integrationKey);
        }
    }

    /**
     * Parse responses from Paynow
     * @param queryString
     */
    parseQuery(queryString: string): { [key: string]: string } {
        let query: { [key: string]: string } = {};
        let pairs = (queryString[0] === "?" ? queryString.slice(1) : queryString).split("&");
        for (let i = 0; i < pairs.length; i++) {
            let pair = pairs[i].split("=");
            // lower case keys but do not lower case values before calculating hash
            query[decode(pair[0]).toLowerCase()] = decode(pair[1]);
        }

        return query;
    }

    /**
     * Build up a payment into the format required by Paynow
     * @param payment
     * @returns {{resulturl: String, returnurl: String, reference: String, amount: number, id: String, additionalinfo: String, authemail: String, status: String}}
     */
    build(payment: Payment): { [key: string]: string } {
        let data: { [key: string]: string } = {
            resulturl: this.resultUrl ? this.resultUrl : "",
            returnurl: this.returnUrl ? this.returnUrl : "",
            reference: payment.reference,
            amount: payment.total().toString(),
            id: this.integrationId,
            additionalinfo: payment.info(),
            authemail: payment.authEmail ? payment.authEmail : "",
            status: "Message",
        };

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
    ): { [key: string]: string } {
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
            status: "Message",
        };

        data["hash"] = this.generateHash(data, this.integrationKey);

        return data;
    }

    /**
     * Check the status of a transaction
     * @param url
     * @returns {PromiseLike<InitResponse> | Promise<InitResponse>}
     */
    async pollTransaction(url: string): Promise<StatusResponse> {
        try {
            const response = await fetch(
                url,
                { method: "POST" }
            )

            const responseData = await response.json()

            const parsedResponseURL = this.parseQuery(responseData as unknown as string);

            if (parsedResponseURL["status"].toLowerCase() !== "error" && !this.verifyHash(parsedResponseURL)) {
                throw new Error("Hashes do not match!");
            }

            return new StatusResponse(parsedResponseURL);
        } catch (error) {
            console.log("Paynow.pollTransaction: Error occurred while initialising payment", error)
        }
    }

    /**
     * Parses the response from Paynow
     * @param response
     * @returns {StatusResponse}
     */
    parseStatusUpdate(response: any): StatusResponse {
        if (response) {
            const parsedResponse = this.parseQuery(response);

            if (!this.verifyHash(parsedResponse)) {
                throw new Error("Hashes do not match!");
            }

            return new StatusResponse(parsedResponse);
        } else {
            throw new Error("An unknown error occurred");
        }
    }

    /**
     * Validates an outgoing request before sending it to Paynow (data sanity checks)
     * @param payment
     */
    validate(payment: Payment) {
        if (payment.cart.length() <= 0) {
            this.fail("You need to have at least one item in cart");
        }

        if (payment.total() <= 0) {
            this.fail("Cart total should be greater than zero");
        }
    }
}
