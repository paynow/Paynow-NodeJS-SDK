import Payment from "./types/payment";
export declare class StatusResponse {
    reference: String;
    amount: String;
    paynowReference: String;
    pollUrl: String;
    status: String;
    error: String;
    constructor(data: any);
    paid() : boolean;
}
export declare class InitResponse {
    success: boolean;
    hasRedirect: boolean;
    redirectUrl: String;
    error: String;
    pollUrl: String;
    instructions: String;
    status: String;
    constructor(data: any);
}
export default class Paynow {
    integrationId: string;
    integrationKey: string;
    resultUrl: string;
    returnUrl: string;
    constructor(integrationId: string, integrationKey: string, resultUrl: string, returnUrl: string);
    send(payment: Payment): Promise<void | InitResponse>;
    sendMobile(payment: Payment, phone: string, method: string): Promise<void | InitResponse>;
    createPayment(reference: string, authEmail: string): Payment;
    fail(message: string): Error;
    init(payment: Payment): Promise<void | InitResponse>;
    initMobile(payment: Payment, phone: string, method: string): Promise<void | InitResponse>;
    isValidEmail(emailAddress: string): boolean;
    parse(response: Response): InitResponse;
    generateHash(values: {
        [key: string]: string;
    }, integrationKey: String): any;
    verifyHash(values: {
        [key: string]: string;
    }): boolean;
    urlEncode(url: string): string;
    urlDecode(url: string): string;
    parseQuery(queryString: string): {
        [key: string]: string;
    };
    build(payment: Payment): {
        [key: string]: string;
    };
    buildMobile(payment: Payment, phone: string, method: string): Error | {
        [key: string]: string;
    };
    pollTransaction(url: string): Promise<InitResponse>;
    parseStatusUpdate(response: any): StatusResponse;
    validate(payment: Payment): void;
}
