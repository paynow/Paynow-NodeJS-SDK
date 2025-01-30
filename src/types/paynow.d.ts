
    export interface PaymentItem {
        title: string;
        amount: number;
    }

    export class Payment {
        reference: string;
        authEmail: string;
        items: PaymentItem[];

        constructor(reference: string, authEmail: string);
        addItem(item: PaymentItem): void;
        total(): number;
        info(): string;
    }

    export interface StatusResponse {
        reference: string;
        amount: string;
        paynowReference: string;
        pollUrl: string;
        status: string;
        error?: string;
    }

    export interface InitResponse {
        success: boolean;
        hasRedirect: boolean;
        redirectUrl?: string;
        error?: string;
        pollUrl: string;
        instructions?: string;
        status: string;
        innbucks_info?: Array<{
            authorizationcode: string;
            deep_link_url: string;
            qr_code: string;
            expires_at: string;
        }>;
        isInnbucks: boolean;
    }

    export class Paynow {
        constructor(
            integrationId: string,
            integrationKey: string,
            resultUrl: string,
            returnUrl: string
        );

        send(payment: Payment): Promise<InitResponse>;
        sendMobile(payment: Payment, phone: string, method: string): Promise<InitResponse>;
        createPayment(reference: string, authEmail: string): Payment;
        pollTransaction(url: string): Promise<StatusResponse>;
    }

    // Constants
    export const URL_INITIATE_MOBILE_TRANSACTION: string;
    export const URL_INITIATE_TRANSACTION: string;
    export const RESPONSE_ERROR: 'error';
    export const RESPONSE_OK: 'ok';
    export const GOOGLE_QR_PREFIX: string;
    export const INNBUCKS_DEEPLINK_PREFIX: string;

