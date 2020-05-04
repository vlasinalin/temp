var userContrib = {};
var paymentsValue = 0;
var paymentsCount = 0;
var salesCallPayment = 0;
var salesPaymentsCount = 0;
var noTrackUsersCount = 0;
var cursorPayment = db.payment.find({paymentState: "Confirmed", credited: false, paymentDate: { $gt: new Date("2020-03-20"), $lt: new Date("2020-04-20") }});
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
      paymentsValue += cPayment.price;
      var salesCall = 0;
      var trackUsers = [];
      for (var trackIt = 0; trackIt < track.callNotes.length; trackIt++) {
         var trackUser = track.callNotes[trackIt].user;
         if (trackUser && trackUsers.indexOf(trackUser) < 0 && 
             (trackUser === "lucianbunea81@gmail.com" || trackUser === "zimbru.anisoara07@gmail.com")) {
            trackUsers.push(trackUser);
         }
         if (trackUser && trackUsers.indexOf(trackUser) < 0 && trackUser === "andreeavlasin26@gmail.com") {
            salesCall = 1;
         }
      }
      for (var userIt = 0; userIt < trackUsers.length; userIt++) {
         var cUser = trackUsers[userIt];
         if (userContrib[cUser] === undefined) {
            userContrib[cUser] = 0.0;
         } else {
            userContrib[cUser] = (userContrib[cUser] + (cPayment.price / (1.0 * trackUsers.length)));
         }
      }
      if (salesCall > 0) {
         salesCallPayment+= cPayment.price;
         salesPaymentsCount++;
      }
      if (trackUsers.length === 0) {
         noTrackUsersCount++;
         printjson(track.callNotes);
      }
   }
}
print("Payments value: " + paymentsValue);
print("Payments count: " + paymentsCount);
print("No track users count: " + noTrackUsersCount);
print("Sales call payment: " + salesCallPayment);
print("Sales payments count: " + salesPaymentsCount);
printjson(userContrib);
