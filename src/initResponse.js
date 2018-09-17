export default class InitResponse {
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
