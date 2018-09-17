export default class Payment {
  /**
   * Unique identifier for transaction
   */
  reference: string;

  /**
   * Items being paid from by client
   *
   * @type {Array}
   */
  items: [];

  /**
   * Email address from client
   *
   * @type {String}
   */
  authemail: String;

  /**
   * Payment constructor
   * @param {String} reference
   * @param {String} authEmail
   */
  constructor(reference, authEmail) {
    this.reference = reference;
    this.authEmail = authEmail;

    this.items = [];
  }

  /**
   * Adds an item to the 'shopping cart'
   * @param {String} title
   * @param {Number} amount
   *
   * @returns {Payment} Returns false if parameters fail validation
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

  /**
   * Generates the description for the payment
   *
   * @returns {String} The description of the payment
   */
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
   *
   * @returns {*|Number}
   */
  total() {
    return this.items.reduce(function(accumulator, value) {
      return accumulator + Number(value.amount);
    }, 0);
  }
}
