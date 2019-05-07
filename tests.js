const { Paynow } = require("./dist");

let testIntegrationId = "4198";
let testIntegrationKey = "5c74798d-f9b0-42e0-9a61-a48138a7189c";

let paynow = new Paynow(testIntegrationId, testIntegrationKey);


paynow.resultUrl = "https://www.example.com/gateways/paynow/update";
paynow.returnUrl = "httpw://www.example.com/return?gateway=paynow";

let payment = paynow.createPayment("Invoice 007", "james@mailinator.com");

payment.add("Laser Guided Missile", 11.99);
payment.add("Glock 19", 5.49);

paynow.send(payment).then(response => {
  if (response.success) {
    let link = response.redirectUrl;
    console.log("Go to " + link + " to complete the transaction.");
  } else {
    console.log(response.error);
  }
});
