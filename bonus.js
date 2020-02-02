var userContrib = {};
var cursorPayment = db.payment.find({paymentState: "Confirmed", credited: false, paymentDate: {$gt: new Date("2020-01-01")}});
while (cursorPayment.hasNext()) {
   var cPayment = cursorPayment.next();
   var legalEntityId = ObjectId(cPayment.legalEntityId);
   var track = null;
   print(legalEntityId);
   print(cPayment.operation);
   if (cPayment.operation === "MODIFICARE_FIRMA") {
      track = db.companyModificationTrack.findOne({_id: legalEntityId});
   }
   if (cPayment.operation === "SRL-2" || cPayment.operation === "SRL-D-2" || cPayment.operation === "PFA" || cPayment.operation === "II") {
      track = db.companyCreationTrack.findOne({_id: legalEntityId});
   }
   if (track !== null && track.callNotes !== null) {
      var trackUsers = [];
      for (var trackIt = 0; trackIt < track.callNotes.length; trackIt++) {
         var trackUser = track.callNotes[trackIt].user;
         if (trackUser && !trackUsers.contains(trackUser)) {
            trackUsers.push(trackUser);
         }
      }
      for (var userIt = 0; userIt < trackUsers.length; userIt++) {
         var cUser = trackUsers[userIt];
         if (!userContrib[cUser]) {
            userContrib[cUser] = 0;
         } else {
            userContrib[cUser] = userContrib[cUser] + (1.0 / trackUsers.length);
         }
      }
   }
}
printjson(userContrib);
