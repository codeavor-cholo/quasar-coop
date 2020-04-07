export const functions = require('firebase-functions');

const admin = require('firebase-admin')

admin.initializeApp();


const db = admin.firestore()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.AddUserRole = functions.auth.user().onCreate(async (authUser) => {

    if (authUser.email) {
      const customClaims = {
       // customer: true,
       //as of now once nag-Create ng user dapat Admin
          admin: true,
      };
      try {
        admin.auth().setCustomUserClaims(authUser.uid, customClaims)
        return  admin.firestore().collection("MemberData").doc(authUser.uid).set({
          email: authUser.email,
          role: customClaims
        })

      } catch (error) {
        console.log(error)
      }


    }

    // return db.collection("roles").doc(user.uid).set({
    //   email: user.email,
    //   subscriber: true
    // }).catch(error => {
    //   console.log(error)
    // })

  });

 exports.setUserRole = functions.https.onCall(async (data, context) => {

  if (!context.auth.token.admin) return


  try {
    var _ = await admin.auth().setCustomUserClaims(data.uid, data.role)

    return db.collection("MemberData").doc(data.uid).update({
      role: data.role
    })

  } catch (error) {
    console.log(error)
  }

});
