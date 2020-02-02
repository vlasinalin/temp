var cursorPayment = db.payment.find({paymentState: "Confirmed", credited: false, paymentDate: {$gt: "2020-01-01"}});
while (cursorPayment.hasNext()) {
   printjson(cursorPayment.next());
}
