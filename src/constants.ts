/**
 * Success response from Paynow
 */
export const RESPONSE_OK : string = "ok";

/**
 * Error response from Paynow
 */
export const RESPONSE_ERROR: string  = "error";

/**
 * API endpoint for initiating normal web-based transactions
 */
export const URL_INITIATE_TRANSACTION : string =
  "https://www.paynow.co.zw/interface/initiatetransaction";

/**
 * API endpoint for initiating mobile based transactions
 */
export const URL_INITIATE_MOBILE_TRANSACTION: string =
  "https://www.paynow.co.zw/interface/remotetransaction";

  export const INNBUCKS_DEEPLINK_PREFIX = "schinn.wbpycode://innbucks.co.zw?pymInnCode=";
  export const GOOGLE_QR_PREFIX = "https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=";

