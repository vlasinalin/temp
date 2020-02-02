var cursorPayment = db.payment.find({paymentState: "Confirmed", credited: false, paymentDate: {$gt: new Date("2020-01-01")}});
while (cursorPayment.hasNext()) {
   printjson(cursorPayment.next());
}
