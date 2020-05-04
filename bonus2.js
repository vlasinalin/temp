var userContrib = {};
var userOperations = {};
var paymentsValue = 0;
var paymentsCount = 0;
var dateFrom = new Date("2020-03-01");

var cursorPayment = db.payment.find({paymentState: "Confirmed", credited: false, paymentDate: { $gt: new Date("2020-03-10"), $lt: new Date("2020-05-01") }});

while (cursorPayment.hasNext()) {
   var cPayment = cursorPayment.next();
   var legalEntityId = ObjectId(cPayment.legalEntityId);
   var track = null;
   var validPaymentOperation = false;
   if (cPayment.operation === "MODIFICARE_FIRMA") {
      validPaymentOperation = true;
      paymentsCount++;
      paymentsValue += cPayment.price;
      var companyModif = db.companyModification.findOne({_id: legalEntityId})
      var companyId = ObjectId(companyModif.companyId);
      track = db.companyModificationTrack.findOne({_id: companyId});
   }
   if (cPayment.operation === "SRL-2" || cPayment.operation === "SRL-D-2" || cPayment.operation === "PFA" || cPayment.operation === "II") {
      validPaymentOperation = true;
      paymentsCount++;
      paymentsValue += cPayment.price;
      track = db.companyCreationTrack.findOne({_id: legalEntityId});
   }
   if (validPaymentOperation) {
      if (track === null || track.callNotes === null || track.callNotes.length < 1) {
         print("No track notes:");
         printjson(cPayment);
      } else {    
         var resolutions = {};
         for (var trackIt = 0; trackIt < track.callNotes.length; trackIt++) {
            var callNote = track.callNotes[trackIt];
            if (callNote.callDate > dateFrom && callNote.user && callNote.note) {
               if (callNote.note === "DOSAR GHISEU VERIFICAT") {
                  resolutions[callNote.note] = callNote.user;
               }
               if (callNote.note === "DOSAR DEPUS ONLINE") {
                  resolutions[callNote.note] = callNote.user;
               }
               if (callNote.note === "UPLOAD REZERVARE DENUMIRE") {
                  resolutions[callNote.note] = callNote.user;
               }
               if (callNote.note === "SINCRONIZARE ONRC") {
                  resolutions[callNote.note] = callNote.user;
               }
            }
         }
         var user;
         user = resolutions["DOSAR GHISEU VERIFICAT"];
         if (user) {
            userContrib[user] = (userContrib[user] || 0) + 10;
            userOperations["DGV-" + user] =  (userOperations["DGV-" + user] || 0) + 1;
         }
         user = resolutions["DOSAR DEPUS ONLINE"];
         if (user) {
            userContrib[user] = (userContrib[user] || 0) + 20;
            userOperations["DDO-" + user] =  (userOperations["DDO-" + user] || 0) + 1;
         }
         user = resolutions["UPLOAD REZERVARE DENUMIRE"];
         if (user) {
            userContrib[user] = (userContrib[user] || 0) + 5;
            userOperations["URD-" + user] =  (userOperations["URD-" + user] || 0) + 1;
         }
         user = resolutions["SINCRONIZARE ONRC"];
         if (user) {
            userContrib[user] = (userContrib[user] || 0) + 5;
            userOperations["SO-" + user] =  (userOperations["SO-" + user] || 0) + 1;
         }
      }
   }
}
print("Payments value: " + paymentsValue);
print("Payments count: " + paymentsCount);
print("User contrib:");
printjson(userContrib);
print("User operations:");
printjson(userOperations);
