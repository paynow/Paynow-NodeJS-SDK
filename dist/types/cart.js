"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CartItem = (function () {
    function CartItem(title, amount, quantity) {
        if (quantity === void 0) { quantity = 1; }
        this.title = title;
        this.amount = amount;
        this.quantity = quantity;
    }
    return CartItem;
}());
exports.CartItem = CartItem;
var Cart = (function () {
    function Cart(_items) {
        var _this = this;
        this.items = [];
        if (_items) {
            _items.forEach(function (thing) { _this.items.push(thing); });
        }
    }
    Cart.prototype.length = function () {
        return this.items.length;
    };
    Cart.prototype.add = function (item) {
        this.items.push(item);
        return this.items.length;
    };
    Cart.prototype.getTotal = function () {
        var cartTotal = 0;
        this.items.forEach(function (item) {
            cartTotal += item.amount * item.quantity;
        });
        return cartTotal;
    };
    Cart.prototype.summary = function () {
        var summary = "";
        this.items.forEach(function (item, index) {
            summary = summary.concat(item.title + ", ");
        });
        summary = summary.substr(0, summary.length - 3);
        return summary;
    };
    return Cart;
}());
exports.default = Cart;
//# sourceMappingURL=cart.js.map