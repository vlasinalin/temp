var userContrib = {};
var paymentsCount = 0;
var noTrackUsersCount = 0;
var cursorPayment = db.payment.find({paymentState: "Confirmed", credited: false, paymentDate: {$gt: new Date("2020-02-01")}});
while (cursorPayment.hasNext()) {
   var cPayment = cursorPayment.next();
   var legalEntityId = ObjectId(cPayment.legalEntityId);
   var track = null;
   if (cPayment.operation === "MODIFICARE_FIRMA") {
      paymentsCount++;
      var companyModif = db.companyModification.findOne({_id: legalEntityId})
      var companyId = ObjectId(companyModif.companyId);
      track = db.companyModificationTrack.findOne({_id: companyId});
      if (track === null || track.callNotes === null) {
         printjson(cPayment);
      }
   }
   if (cPayment.operation === "SRL-2" || cPayment.operation === "SRL-D-2" || cPayment.operation === "PFA" || cPayment.operation === "II") {
      paymentsCount++;
      track = db.companyCreationTrack.findOne({_id: legalEntityId});
      if (track === null || track.callNotes === null) {
         printjson(cPayment);
      }
   }
   if (track !== null && track.callNotes !== null) {
      var trackUsers = [];
      for (var trackIt = 0; trackIt < track.callNotes.length; trackIt++) {
         var trackUser = track.callNotes[trackIt].user;
         if (trackUser && trackUsers.indexOf(trackUser) < 0 && (trackUser === "lucianbunea81@gmail.com" || trackUser === "zimbru.anisoara07@gmail.com")) {
            trackUsers.push(trackUser);
         }
      }
      for (var userIt = 0; userIt < trackUsers.length; userIt++) {
         var cUser = trackUsers[userIt];
         if (userContrib[cUser] === undefined) {
            userContrib[cUser] = 0.0;
         } else {
            userContrib[cUser] = (userContrib[cUser] + (1.0 / (1.0 * trackUsers.length)));
         }
      }
      if (trackUsers.length === 0) {
         noTrackUsersCount++;
         printjson(track.callNotes);
      }
   }
}
print(paymentsCount);
print(noTrackUsersCount);
printjson(userContrib);
