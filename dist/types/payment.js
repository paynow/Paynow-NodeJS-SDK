"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cart_1 = require("./cart");
var Payment = (function () {
    function Payment(reference, authEmail, items) {
        if (items === void 0) { items = new cart_1.default(); }
        this.reference = reference;
        this.authEmail = authEmail;
        this.items = items;
    }
    Payment.prototype.add = function (title, amount, quantity) {
        this.items.add(new cart_1.CartItem(title, amount, quantity));
        return this;
    };
    Payment.prototype.info = function () {
        return this.items.summary();
    };
    Payment.prototype.total = function () {
        return this.items.getTotal();
    };
    return Payment;
}());
exports.default = Payment;
//# sourceMappingURL=payment.js.map