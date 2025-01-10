import { GOOGLE_QR_PREFIX, INNBUCKS_DEEPLINK_PREFIX, RESPONSE_OK } from "../constants";
import { InnBucksInfo } from "../types";

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
    redirectUrl: string;
    error: string;
    pollUrl: string;
    instructions: string;
    status: string;
    innbucks_info: InnBucksInfo[];
    isInnbucks: boolean;

    constructor(data: any) {
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
                    expires_at: data.authorizationexpires,
                });
            }
        }
    }
}