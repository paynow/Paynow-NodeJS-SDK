import { PAID_STATUSES, RESPONSE_ERROR } from "../constants";

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
    reference: string;
    amount: string;
    paynowReference: string;
    pollUrl: string;
    status: string;
    error: string;

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

    paid(): boolean {
        return PAID_STATUSES.includes(this.status)
    }
}