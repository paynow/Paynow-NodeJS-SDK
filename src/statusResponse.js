export default class StatusResponse {
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

  /**
   * The error message returned from Paynow
   */
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
