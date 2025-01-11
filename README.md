# Typescript SDK for Paynow Zimbabwe's API reimagined

This fork fixes bug in the main repository including typescript features. Comphrehensive tests not only improve reliability but can provide developers with better insight of what is happening under the hood. Furthermore this fork aims to be more responsive to issues and engage with the community. The package is hosted on npm.org. Install and enjoy!!! 

## Sign in to Paynow and get integration details

> Before you can start making requests to Paynow's API, you need to get an integration ID and integration Key from Paynow. 
See Documentation [Generating Integration Key and Viewing integration ID](https://developers.paynow.co.zw/docs/integration_generation.html)

## Documentation

See the [Paynow QuickStart](https://developers.paynow.co.zw/docs/quickstart.html).

## Prerequisites

This library has a set of prerequisites that must be met for it to work

1.  Node
1.  NPM (node's package manager, used to install the node library)

## Installation

Install the library using NPM or yarn

```sh
$ npm install --save better-paynow
```
```sh
$ yarn add better-paynow
```

## Usage example

### Importing library

```typescript
import { Paynow, Payment, InitResponse, StatusReponse, Cart } from "better-paynow";
```

Create an instance of the Paynow class optionally setting the result and return url(s)

```typescript
const paynow = new Paynow("INTEGRATION_ID", "INTEGRATION_KEY");

paynow.resultUrl = "http://example.com/gateways/paynow/update";
paynow.returnUrl = "http://example.com/return?gateway=paynow";

/* The return url can be set at later stages. 
You might want to do this if you want to pass data to the return url (like the reference of the transaction) */
```
The Integration ID and Key can be optionally loaded from `PAYNOW_INTEGRATION_ID` and `PAYNOW_INTEGRATION_KEY` environment variables (respectively). An instance of the Paynow class can then be created using the following: 

```typescript
const paynow = new Paynow();
```

Create a new payment passing in the reference for that payment (e.g invoice id, or anything that you can use to identify the transaction.

```typescript
const payment: Payment = paynow.createPayment("unique-reference-id-for-each-payment");
```

You can then start adding items to the payment

```typescript
// Passing in the name of the item and the price of the item
payment.add("Bananas", 2.5);
payment.add("Apples", 3.4);
```

Once you're done building up your cart and you're finally ready to send your payment to Paynow, you can use the `send` method in the `paynow` object.

```typescript
// Save the response from paynow in a variable
const initRes: InitResponse = await paynow.send(payment);
```

The send method will return a `Promise<InitResponse>`, the InitResponse object being the response from Paynow and it will contain some useful information like whether the request was successful or not. If it was, for example, it contains the url to redirect the user so they can make the payment. You can view the full list of data contained in the response in our wiki

If request was successful, you should consider saving the poll url sent from Paynow in your database

```typescript
paynow.send(payment).then(response => {
  // Check if request was successful
  if (response.success) {
    // Get the link to redirect the user to, then use it as you see fit
    let link = response.redirectUrl;
  }
});
```

> Mobile Transactions

If you want to send an express (mobile) checkout request instead, the only thing that differs is the last step. You make a call to the `sendMobile` in the `paynow` object
instead of the `send` method.

The `sendMobile` method unlike the `send` method takes in two additional arguments i.e The phone number to send the payment request to and the mobile money method to use for the request. **Note that currently only Ecocash and OneMoney are supported**

```typescript
const initRes: InitResponse = await paynow.sendMobile(payment, '0777000000', 'ecocash')
```

The response object is almost identical to the one you get if you send a normal request. With a few differences, firstly, you don't get a url to redirect to. Instead you instructions (which ideally should be shown to the user instructing them how to make payment on their mobile phone)

```typescript
paynow.sendMobile(
    
    // The payment to send to Paynow
    payment, 

    // The phone number making payment
    '0777000000',
    
    // The mobile money method to use.
    'ecocash' 

).then(function(response) {
    if(response.success) {
        // These are the instructions to show the user. 
        // Instruction for how the user can make payment
        let instructions = response.instructions // Get Payment instructions for the selected mobile money method

        // Get poll url for the transaction. This is the url used to check the status of the transaction. 
        // You might want to save this, we recommend you do it
        let pollUrl = response.pollUrl; 

        console.log(instructions)

    } else {
        console.log(response.error)
    }
}).catch(ex) {
    // Ahhhhhhhhhhhhhhh
    // *freak out*
    console.log('Your application has broken an axle', ex)
};
```

# Checking transaction status

The SDK exposes a handy method that you can use to check the status of a transaction. Once you have instantiated the Paynow class.

```typescript
// Check the status of the transaction with the specified pollUrl
// Now you see why you need to save that url ;-)
const status: StatusResponse = await paynow.pollTransaction(pollUrl);

```

## Full Usage Example

```typescript
// Import the Paynow class
import { Paynow } from "better-paynow";

// Create instance of Paynow class
const paynow = new Paynow("INTEGRATION_ID", "INTEGRATION_KEY");

// Set return and result urls
paynow.resultUrl = "http://example.com/gateways/paynow/update";
paynow.returnUrl = "http://example.com/return?gateway=paynow";

// Create a new payment
const payment = paynow.createPayment("Invoice 35");

// Add items to the payment list passing in the name of the item and it's price
payment.add("Bananas", 2.5);
payment.add("Apples", 3.4);

// Send off the payment to Paynow
paynow.send(payment).then( (response) => {

    // Check if request was successful
    if(response.success) {
        // Get the link to redirect the user to, then use it as you see fit
        let link = response.redirectUrl;

        // Save poll url, maybe (recommended)?
        let pollUrl = response.pollUrl;
    }

});
```

## Using async/await

```typescript
// Import the Paynow class
import { Paynow, InitResponse } from "better-paynow";

// Create instance of Paynow class
const paynow = new Paynow("INTEGRATION_ID", "INTEGRATION_KEY");

// Set return and result urls
paynow.resultUrl = "http://example.com/gateways/paynow/update";
paynow.returnUrl = "http://example.com/return?gateway=paynow";

// Create a new payment
const payment = paynow.createPayment("Invoice 35");

// Add items to the payment list passing in the name of the item and it's price
payment.add("Bananas", 2.5);
payment.add("Apples", 3.4);


async function processPayment() {
    try {
        const initRes: InitResponse = await paynow(payment)

        if (initRes.success) {
            // get the link
            const link = initRes.redirectUrl

            // save poll url
            const pollUrl = initRes.pollUrl
        }

    } catch (error) {
        console.log("Stuff went wrong!", error)
    }
}

processPayment()
```
