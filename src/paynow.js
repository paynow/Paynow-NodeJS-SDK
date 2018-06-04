const http = require('request-promise-native');
// TODO: Verify hashes at all interactions with server
class StatusResponse {

    /**
     * Boolean indicating whether the transaction was paid or not
     */
    paid: boolean;

    /**
     * The original amount of the transaction
     */
    amount: String;

    /**
     * The original reference of the transaction
     */
    reference: String;



    /**
     * Default constructor
     *
     * @param data
     */
    constructor(data) {
        this.paid = data.status.toLowerCase() === RESPONSE_PAID;
        this.amount = data.amount;
        this.reference = data.reference;
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
     * Default constructor
     *
     * @param data
     */
    constructor(data) {
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
     * Payment constructor
     * @param reference
     */
    constructor(reference) {
        this.reference = reference;

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
        this.items.forEach(function (value) {
            str += value.title + ", "; // TODO: Update! This could be better
        });

        return str;
    }

    /**
     * Get the total of the items in the cart
     * @returns {*|number}
     */
    total() {
        return this.items.reduce(function (accumulator, value) {
            return accumulator + value.amount;
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
        this.returnUrl = returnUrl
    }

    /**
     * Send a payment to paynow
     * @param payment 
     */
    send(payment) {
        if(typeof payment !== Object) {
            return false;
        }

        if(!(payment instanceof Payment)) {
            if('reference' in payment && 'description' in payment && 'amount' in payment) {
                payment = new Payment(payment['reference']).add(payment['reference'], payment['amount'])
            } else {
                this.fail('Invalid object passed to function. Object must have the following keys: reference, description, amount');
            }
        }

        return this.init(payment);
    }

    /**
     * Create a new Paynow payment
     * @param reference
     * @returns {Payment}
     */
    createPayment(reference: string) {
        return new Payment(reference);
    }

    /**
     * Throw an exception with the given message
     * @param message*
     * @returns void
     */
    fail(message) {
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

        return http({
            method: 'POST',
            uri: URL_INITIATE_TRANSACTION,
            form: data,
            json: false
        }, false)

            .then((response) => {
                return this.parse(response)
            })
    }

    /**
     * Parses the response from Paynow
     * @param response
     * @returns {InitResponse}
     */
    parse(response) {
        if (response.length > 0) {
            response = this.parseQuery(response);

            return new InitResponse(response);
        } else {
            throw new Error("An unknown error occurred")
        }
    }

    /**
     * Creates a SHA512 hash of the transactions
     * @param values
     * @param integrationKey
     * @returns {string}
     */
    generateHash(values: Object, integrationKey: String) {
        let sha512 = require('js-sha512').sha512;
        let string = "";

        for (const key of Object.keys(values)) {
            string += (values[key]);
        }

        string += integrationKey;

        return sha512(string).toUpperCase();
    }

    /**
     * URL encodes the given string
     * @param str {String}
     * @returns {String}
     */
    urlEncode(str) {
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A')
            .replace(/%20/g, '+')
    }

    /**
     * URL decodes the given string
     * @param str {String}
     * @returns {String}
     */
    urlDecode(str) {
        return decodeURIComponent((str + '')
            .replace(/%(?![\da-f]{2})/gi, function () {
                return '%25'
            })
            .replace(/\+/g, '%20')
        )
    }

    /**
     * Parse responses from Paynow
     * @param queryString
     */
    parseQuery(queryString) {
        let query = {};
        let pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
        for (let i = 0; i < pairs.length; i++) {
            let pair = pairs[i].split('=');
            query[this.urlDecode(pair[0])] = this.urlDecode(pair[1] || '');
        }
        return query;
    }

    /**
     * Build up a payment into the format required by Paynow
     * @param payment
     * @returns {{resulturl: String, returnurl: String, reference: String, amount: number, id: String, additionalinfo: String, authemail: String, status: String}}
     */
    build(payment: Payment) {
        let data = {
            'resulturl': this.resultUrl,
            'returnurl': this.returnUrl,
            'reference': payment.reference,
            'amount': payment.total(),
            'id': this.integrationId,
            'additionalinfo': payment.info(),
            'authemail': '',
            'status': 'Message'
        };


        for (const key of Object.keys(data)) {
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
    checkTransactionStatus(url) {
        return http({
            method: 'POST',
            uri: url,
            json: false
        }, false)

            .then((response) => {
                return this.parse(response)
            })
    }

    /**
     * Check the status of a transaction
     * @param url
     * @returns {PromiseLike<InitResponse> | Promise<InitResponse>}
     */
    processStatusUpdate(url) {
        return http({
            method: 'POST',
            uri: url,
            json: false
        }, false)

            .then((response) => {
                return this.parse(response)
            })
    }

    /**
     * Parses the response from Paynow
     * @param response
     * @returns {InitResponse}
     */
    parseStatusUpdate(response) {
        if (response.length > 0) {
            response = this.parseQuery(response);

            return new StatusResponse(response);
        } else {
            throw new Error("An unknown error occurred")
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
            this.fail("You need to have at least one item in cart")
        }

        if (payment.total() <= 0) {
            this.fail("The total should be greater than zero")
        }
    }
}
