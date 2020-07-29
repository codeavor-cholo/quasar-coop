const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp();
const db = admin.firestore();
exports.newNotification = functions.firestore.document('{collection}/{id}').onCreate((snap, context) =>{
    const newData = snap.data();


    if(newData) {

        const collection = context.params.collection
        const id = context.params.id
        const adminNotifs = db.collection('AdminNotifications')
        // const clientNotifs = db.collection('ClientNotifications')
        const today  = new Date().toString()


        if(collection === 'Transactions'){
            return adminNotifs.add({MemberID: newData.MemberID , PaymentKey: id, message: `New ${newData.TransactionType} from ${newData.MemberID}`, total: newData.Total, transID: newData.TransactionID, dateTime: moment().toString()})
        } else if(collection === 'WithdrawalApplications'){
            return adminNotifs.add({MemberID: newData.MemberID , ApplicationKey: id, message: `New Withdrawal Application from ${newData.MemberID}` , amount: newData.Amount, dateTime: moment().toString()})
        } else if(collection === 'LoanApplications'){
            return adminNotifs.add({MemberID: newData.MemberID, ApplicationKey: id, message: `New Withdrawal Application from ${newData.MemberID}` , amount: newData.Amount, dateTime: moment().toString()})
        } else if(collection === 'PreRegPersonalData'){
            let dateObject = {dateTime: moment().toString(),message: 'New Membership Application'}
            let object = {...newData,...dateObject}
            return adminNotifs.add(object)
        } else if(collection === 'JeepneyData'){
            let dateObject = {dateTime: moment().toString(),message: 'New Unit Application'}
            let object = {...newData,...dateObject}
            return adminNotifs.add(object)            
        } else {
            return null
        }

    } else {
        return null
    }
    
});
