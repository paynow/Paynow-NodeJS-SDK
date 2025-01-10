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

import { RESPONSE_ERROR } from "../constants";

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