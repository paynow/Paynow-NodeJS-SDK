"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paynow = exports.InitResponse = exports.StatusResponse = void 0;
var payment_1 = require("./types/payment");
var constants_1 = require("./constants");
var axios_1 = require("axios");
var StatusResponse = (function () {
    function StatusResponse(data) {
        if (data.status.toLowerCase() === constants_1.RESPONSE_ERROR) {
            this.error = data.error;
        }
        else {
            this.reference = data.reference;
            this.amount = data.amount;
            this.paynowReference = data.paynowreference;
            this.pollUrl = data.pollurl;
            this.status = data.status;
        }
    }
    return StatusResponse;
}());
exports.StatusResponse = StatusResponse;
var InitResponse = (function () {
    function InitResponse(data) {
        this.status = data.status.toLowerCase();
        this.success = this.status === constants_1.RESPONSE_OK;
        this.hasRedirect = typeof data.browserurl !== "undefined";
        this.isInnbucks = false;
        if (!this.success) {
            this.error = data.error;
        }
        else {
            this.pollUrl = data.pollurl;
            if (this.hasRedirect) {
                this.redirectUrl = data.browserurl;
            }
            if (typeof data.instructions !== "undefined") {
                this.instructions = data.instructions;
            }
            if (typeof data.authorizationcode !== "undefined") {
                this.isInnbucks = true;
                this.innbucks_info = [];
                this.innbucks_info.push({
                    authorizationcode: data.authorizationcode,
                    deep_link_url: constants_1.INNBUCKS_DEEPLINK_PREFIX + data.authorizationcode,
                    qr_code: constants_1.GOOGLE_QR_PREFIX + data.authorizationcode,
                    expires_at: data.authorizationexpires,
                });
            }
        }
    }
    return InitResponse;
}());
exports.InitResponse = InitResponse;
var Paynow = (function () {
    function Paynow(integrationId, integrationKey, resultUrl, returnUrl) {
        this.integrationId = integrationId;
        this.integrationKey = integrationKey;
        this.resultUrl = resultUrl;
        this.returnUrl = returnUrl;
    }
    Paynow.prototype.send = function (payment) {
        return this.init(payment);
    };
    Paynow.prototype.sendMobile = function (payment, phone, method) {
        return this.initMobile(payment, phone, method);
    };
    Paynow.prototype.createPayment = function (reference, authEmail) {
        return new payment_1.default(reference, authEmail);
    };
    Paynow.prototype.fail = function (message) {
        throw new Error(message);
    };
    Paynow.prototype.init = function (payment) {
        var _this = this;
        this.validate(payment);
        var data = this.build(payment);
        return (0, axios_1.default)({
            method: "POST",
            url: constants_1.URL_INITIATE_TRANSACTION,
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).then(function (response) {
            return _this.parse(response.data);
        })
            .catch(function (err) {
            console.log("An error occured while initiating transaction", err);
        });
    };
    Paynow.prototype.initMobile = function (payment, phone, method) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.validate(payment);
                        if (!this.isValidEmail(payment.authEmail))
                            this.fail("Invalid email. Please ensure that you pass a valid email address when initiating a mobile payment");
                        data = this.buildMobile(payment, phone, method);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, (0, axios_1.default)({
                                method: "POST",
                                url: constants_1.URL_INITIATE_MOBILE_TRANSACTION,
                                data: data,
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                            })];
                    case 2:
                        response = _a.sent();
                        return [2, this.parse(response.data)];
                    case 3:
                        err_1 = _a.sent();
                        console.log("An error occured while initiating transaction", err_1);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    Paynow.prototype.isValidEmail = function (emailAddress) {
        if (!emailAddress || emailAddress.length === 0)
            return false;
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress);
    };
    Paynow.prototype.parse = function (response) {
        if (typeof response === "undefined") {
            return null;
        }
        if (response) {
            var parsedResponseURL = this.parseQuery(response);
            if (parsedResponseURL.status.toString().toLowerCase() !== constants_1.RESPONSE_ERROR &&
                !this.verifyHash(parsedResponseURL)) {
                throw new Error("Hashes do not match!");
            }
            return new InitResponse(parsedResponseURL);
        }
        else {
            throw new Error("An unknown error occurred");
        }
    };
    Paynow.prototype.generateHash = function (values, integrationKey) {
        var sha512 = require("js-sha512").sha512;
        var string = "";
        for (var _i = 0, _a = Object.keys(values); _i < _a.length; _i++) {
            var key = _a[_i];
            if (key !== "hash") {
                string += values[key];
            }
        }
        string += integrationKey.toLowerCase();
        return sha512(string).toUpperCase();
    };
    Paynow.prototype.verifyHash = function (values) {
        if (typeof values["hash"] === "undefined") {
            return false;
        }
        else {
            return values["hash"] === this.generateHash(values, this.integrationKey);
        }
    };
    Paynow.prototype.urlEncode = function (url) {
        return encodeURI(url);
    };
    Paynow.prototype.urlDecode = function (url) {
        return decodeURIComponent((url + "")
            .replace(/%(?![\da-f]{2})/gi, function () {
            return "%25";
        })
            .replace(/\+/g, "%20"));
    };
    Paynow.prototype.parseQuery = function (queryString) {
        var query = {};
        var pairs = (queryString[0] === "?" ? queryString.substr(1) : queryString).split("&");
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split("=");
            query[this.urlDecode(pair[0])] = this.urlDecode(pair[1] || "");
        }
        return query;
    };
    Paynow.prototype.build = function (payment) {
        var data = {
            resulturl: this.resultUrl,
            returnurl: this.returnUrl,
            reference: payment.reference,
            amount: payment.total().toString(),
            id: this.integrationId,
            additionalinfo: payment.info(),
            authemail: typeof payment.authEmail === "undefined" ? "" : payment.authEmail,
            status: "Message",
        };
        for (var _i = 0, _a = Object.keys(data); _i < _a.length; _i++) {
            var key = _a[_i];
            if (key === "hash")
                continue;
            data[key] = this.urlEncode(data[key]);
        }
        data["hash"] = this.generateHash(data, this.integrationKey);
        return data;
    };
    Paynow.prototype.buildMobile = function (payment, phone, method) {
        var data = {
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
        for (var _i = 0, _a = Object.keys(data); _i < _a.length; _i++) {
            var key = _a[_i];
            if (key === "hash")
                continue;
            data[key] = this.urlEncode(data[key]);
        }
        data["hash"] = this.generateHash(data, this.integrationKey);
        return data;
    };
    Paynow.prototype.pollTransaction = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, (0, axios_1.default)({
                            method: "POST",
                            url: url,
                            data: null,
                        })];
                    case 1:
                        response = _a.sent();
                        return [2, this.parse(response.data)];
                }
            });
        });
    };
    Paynow.prototype.parseStatusUpdate = function (response) {
        if (response.length > 0) {
            response = this.parseQuery(response);
            if (!this.verifyHash(response)) {
                throw new Error("Hashes do not match!");
            }
            return new StatusResponse(response);
        }
        else {
            throw new Error("An unknown error occurred");
        }
    };
    Paynow.prototype.validate = function (payment) {
        if (payment.items.length() <= 0) {
            this.fail("You need to have at least one item in cart");
        }
        if (payment.total() <= 0) {
            this.fail("The total should be greater than zero");
        }
    };
    return Paynow;
}());
exports.Paynow = Paynow;
//# sourceMappingURL=paynow.js.map