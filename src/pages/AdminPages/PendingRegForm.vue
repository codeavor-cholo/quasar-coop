<template>
<div class="q-pa-md">
   <div class="q-pa-md doc-container" id="printdiv">
     <!-- <q-btn @click="updateJeepData">test</q-btn> -->
      <div class="row  justify-center">
        <div
          class="col-xs-12 col-sm-12 col-md-10 q-pa-md"
          >

          <q-card
          class="my-card text-white"
          inline
          >
              <q-card-section>
                <q-form
                class="q-gutter-md"
                >
                    <div>
                        <h4 class="row justify-center items-center" style="color: #26A69A;">Information Sheet</h4>

                        <strong class="row justify-center items-center" style="color: #26A69A;">
                            Personal Data
                        </strong>

                        <q-separator class= "q-mb-md q-pt-xs" color="secondary" inset hidden = 'true'/>

                        <q-input standard v-model="PenReg.FirstName" label="First Name"
                        readonly
                        />
                        <q-input standard v-model="PenReg.LastName" label="Last Name"
                        readonly
                        />
                        <q-select v-model="PenReg.CivilStatus"
                        label="Civil Status"
                        readonly
                        />
                        <strong class="row justify-center items-center" style="color: #26A69A;">
                            Birth
                        </strong>
                        <q-separator class= "q-mb-md q-pt-xs" color="secondary" inset hidden = 'true'/>

                         <q-input standard v-model="PenReg.BirthDate" stack-label label="Birthdate"
                        type="date"
                        readonly
                        />
                        <q-input standard v-model="PenReg.BirthPlace" label="Birthplace"
                        readonly
                        />
                         <strong class="row justify-center items-center" style="color: #26A69A;">
                           Current Address
                        </strong>
                        <q-separator class= "q-mb-md q-pt-xs" color="secondary" inset hidden = 'true'/>

                        <q-input standard v-model="PenReg.Address" label="Address"
                        readonly
                        />

                        <q-input standard v-model="PenReg.Phone" label="Phone"
                        readonly
                        />

                        <q-input standard v-model="PenReg.Email" label="Email"
                        readonly
                        />
                        <strong class="row justify-center items-center" style="color: #26A69A;">
                            Employment
                        </strong>
                        <q-separator class= "q-mb-md q-pt-xs" color="secondary" inset hidden = 'true'/>

                        <q-input standard v-model="PenReg.Occupation" label="Occupation"
                        readonly
                        />
                        <q-input standard v-model="PenReg.EmployerCompany" label="Employer/ Company"
                        readonly
                        />
                        <q-input standard v-model="PenReg.Salary" label="Salary"
                        type="number"
                        readonly
                        />
                        <q-input standard v-model="PenReg.OtherIncome" label="Other Sources of Income"
                        readonly
                        />
                        <strong class="row justify-center items-center" style="color: #26A69A;">
                            Family Background
                        </strong>
                        <q-separator class= "q-mb-md q-pt-xs" color="secondary" inset hidden = 'true'/>

                        <q-input standard v-model="PenReg.RelativeName" label="Nearest Relative"
                        readonly
                        />
                        <q-input standard v-model="PenReg.Relationship" label="Relationship"
                        readonly
                        />
                        <q-input standard v-model="PenReg.NoDependents" label="Number of Dependents"
                        readonly
                        type="number"
                        />




                        <div v-if="PenReg.Designation == 'Driver'">
                          <strong class="row justify-center items-center" style="color: #26A69A;">
                            License Details
                          </strong>
                          <q-separator class= "q-mb-md q-pt-xs" color="secondary" inset hidden = 'true'/>

                          <img :src="PenReg.imageUrlLic" width='300' height='150'>

                          <q-input standard v-model="PenReg.LicenseNo" label="License Number"
                          readonly
                          />
                          <q-input standard stack-label v-model="PenReg.LicenseExp" label="License Expiration Date"
                          type="date"
                          readonly
                          />
                        </div>
                        <div v-else >
                          <strong class="row justify-center items-center" style="color: #26A69A;">
                              ID Presented
                          </strong>
                          <q-separator class= "q-mb-md q-pt-xs" color="secondary" inset hidden = 'true'/>
                          <div class="row justify-center q-pt-sm">
                            <q-img
                              :src="PenReg.imageUrlLic"
                              spinner-color="white"
                              style="height: 140px; max-width: 150px"
                            />
                          </div>

                        </div>
                    </div>
                </q-form>
              </q-card-section>
              <q-separator/>
              <div class="row justify-center">
                <q-btn
                class="col q-ma-md"
                color="teal-4"
                label="Approve"
                @click="regMember()"
                />
                <q-btn class="col q-ma-md"
                @click="rejectMember"
                color="teal-4"
                label="Reject"/>
              </div>
          </q-card>
        </div>
      </div>
    </div>
</div>
</template>

<script>
import { firebaseDb, firefirestore, Auth2, firebaseAuth } from 'boot/firebase';
// import { mapActions } from 'vuex'
import { date } from 'quasar'
import axios from 'axios'

export default {
  data () {
    return {
       newMessage: '',
       PenReg: [],
       Jeeps: [],
       mid: '',
       loadingState: false
    }
  },
  props: ['penRegId'],
  firestore () {
    return {
        // Doc
        PenReg: firebaseDb.collection('PreRegPersonalData').doc(this.penRegId),
        Jeeps: firebaseDb.collection('JeepneyData').where('operatorPreRegID', '==', this.penRegId),
        // PenReg: {
        //   ref: firebaseDb.collection('PreRegPersonalData').doc(this.penRegId),
        //   objects: true,
        //   resolve: (data) => {
        //     // console.log(data)
        //   }
        // },
        lastMember: firebaseDb.collection('Users').orderBy('MemberID', 'desc').limit(5),
        MemberData: firebaseDb.collection('MemberData'),
        DashboardUsers: firebaseDb.collection('DashboardUsers'),
        RejectedApplications: firebaseDb.collection('RejectedApplications'),
        PayTrackers: firebaseDb.collection('PayTrackers'),
        MembershipFee: firebaseDb.collection('FixedPayments').doc('MembershipFee'),
        // MemberID: firebaseDb.collection('Counter').doc("v65AIZI2jjNN2jlEv17N"),
    }
  },
  created(){
    // console.log(this.lastMember)
  },
  methods: {
    regMember () {
        function pad(num, size) {
          var s = num + ''
          while (s.length < size) s = '0' + s;
          return s
        }

        let user = firebaseAuth.currentUser
        let approver = this.DashboardUsers.filter(a=>{
          return a['.key'] == user.uid
        })[0]


        // this.loadingState = true
        this.$q.loading.show({
          message: '<h6>Some important <b>process</b> is in progress.<br/><span class="text-teal">Hang on...</span></h6>'
        })
        if (this.MemberData.length != 0) {
          let lastMember = this.lastMember[0]
          var lastId = lastMember.MemberID
          var lastNumber = lastId.slice(-3)
          var date = new Date()
          var id = 'NGTSC' + date.getFullYear() + pad(++lastNumber, 3)

          // console.log(id, 'not empty member data id to reg')
          this.$firestore.MemberData.doc(id).set({
            ...this.PenReg,
            isNewMember: true,
            ManagementFee: 0,
            ShareCapital: 0,
            SavingsDeposit: 0,
            Advances: 0,
            timestamp: firefirestore.FieldValue.serverTimestamp(),
            dateApproved: firefirestore.FieldValue.serverTimestamp(),
            approvedBy: approver.Username
          })
          .then(async () => {
            // create login account
            await this.createLoginUser(id, this.PenReg.Designation, this.PenReg.FirstName, this.PenReg.LastName, this.PenReg.Phone)

            // update jeep data

            // delete the registrationo in pending registration collection
            this.$firestore.PenReg.delete()
            .then(()=>{
                let payment = {
                  MemberID: id,
                  toPayAmount: 500
                }
                this.$firestore.PayTrackers.add(payment).then((doc) => {
                  let paymentid = doc.id
                  return paymentid
                })
                .then(paymentid => {
                  let trackID = paymentid.toString().slice(0,10)
                  let number = this.PenReg.Phone
                  let message = 'You passed the evaluation. Please pay P500.00 for your membership fee. Tracking# '+ trackID.toUpperCase()
                  let apinumber = 4

                  var data = 'number=' + number + '&' + 'message=' + message + '&' + 'apinumber=' + apinumber
                  // console.log(data)
                  // https://maleficent-sms.000webhostapp.com/index.php

                  const options = {
                    method: 'POST',
                    headers: { 'content-type': 'application/x-www-form-urlencoded',  'Access-Control-Allow-Origin': '*' },
                    data: data,
                    url: 'https://smsapisender.000webhostapp.com/index.php',
                  }              


                  // axios(options)
                  axios.post('https://toned-tabulation.000webhostapp.com/index.php', data)
                  .then(response => {
                    // console.log(response)
                    this.$q.notify({
                      icon: 'info',
                      message: 'Approved',
                      color: 'positive'
                    })
                    
                    this.updateJeepData(id)
                    // this.loadingState = false
                    this.$q.loading.hide()
                    this.loadPreReg(id)
                    // load the member form
                  })
                  .catch((error) => {
                  // console.log(error.response)
                  this.$q.loading.hide()
                  })   


                })
            })

          })
          .catch(err => {
            // console.log(err)
            this.$q.notify({
              icon: 'info',
              message: 'An error occur',
              color: 'negative'
            })
            this.$q.loading.hide()
          })

        } else {
          var date = new Date()
          let id = 'NGTSC' + date.getFullYear() + '000'
          // delete this.PenReg['.key']
          // console.log('empty memberdata', id)
          this.$firestore.MemberData.doc(id).set({
            ...this.PenReg,
            isNewMember: true,
            ManagementFee: 0,
            ShareCapital: 0,
            SavingsDeposit: 0,
            Advances: 0,
            timestamp: firefirestore.FieldValue.serverTimestamp(),
            dateApproved: firefirestore.FieldValue.serverTimestamp(),
            approvedBy: approver.Username
          })
          .then(async () => {
            // create login account
            await this.createLoginUser(id, this.PenReg.Designation, this.PenReg.FirstName, this.PenReg.LastName,this.PenReg.Phone)
            this.$firestore.PenReg.delete()
            .then(()=>{
                let payment = {
                  MemberID: id,
                  toPayAmount: this.MembershipFee.amount
                }
                this.$firestore.PayTrackers.add(payment).then((doc) => {
                  let paymentid = doc.id
                  return paymentid
                })
                .then(paymentid => {
                  let trackID = paymentid.toString().slice(0,10)
                  let number = this.PenReg.Phone

                  let message = 'Please pay P500.00 Membership Fee to activate your account. Tracking# '+ trackID.toUpperCase()

                  var data = 'number=' + number + '&' + 'message=' + message + 'apinumber=' + 2
                  // console.log(data)
                  // https://maleficent-sms.000webhostapp.com/index.php
                  axios.post('https://toned-tabulation.000webhostapp.com/index.php', data)
                  .then(response => {
                    // console.log(response)

                        this.$q.notify({
                          icon: 'info',
                          message: 'Approved',
                          color: 'positive'
                        })
                        // this.loadingState = false
                        this.$q.loading.hide()
                        this.loadPreReg(id)
                    // load the member form
                  })
                  .catch((error) => {
                  // console.log(error.response)
                  this.$q.loading.hide()
                  })   


                })
            })
          })
          .catch(err => {
            // console.log(err)
            this.$q.notify({
              icon: 'info',
              message: 'An error occur',
              color: 'negative'
            })
            this.$q.loading.hide()
          })
        }


      // this.mid = 'NGTSC'+ (this.MemberID.MemberID + 1)
      //
      // this.PenReg.timestamp = firefirestore.FieldValue.serverTimestamp()
      // this.$firestore.MemberData.doc(this.mid).set(this.PenReg)
      // const increment = firefirestore.FieldValue.increment(1)

      // this.$firestore.MemberID.update({ MemberID: increment })


    },
    rejectMember(){
        let user = firebaseAuth.currentUser
        let approver = this.DashboardUsers.filter(a=>{
          return a['.key'] == user.uid
        })[0]
        // console.log(approver)
        this.$q.dialog({
          title: 'Reject Member Application',
          message: 'Note below why you are rejecting this application.',
          prompt: {
            model: '',
            type: 'text' // optional
          },
          cancel: true,
          persistent: true
        }).onOk(data => {
          this.$q.loading.show({
            message: '<h6>Some important <b>process</b> is in progress.<br/><span class="text-teal">Hang on...</span></h6>'
          })
          let reason = data
          // console.log('>>>> OK, received', data)
          let obj = {...this.PenReg}
          let key = obj['.key']
          delete obj['.key']
          this.$firestore.PenReg.delete()
          .then(()=>{
            this.$firestore.RejectedApplications.doc(key).set({
              ...obj,
              dateRejected: firefirestore.FieldValue.serverTimestamp(),
              rejectedBy: approver.Username,
              rejectReason: reason
            }).then(()=>{
              // console.log('reject success')
              this.$q.loading.hide()
              this.$q.notify({
                icon: 'info',
                message: 'rejected application',
                color: 'negative'
              })
              this.$router.push('/admin/pendingreg')
              
            })
            .catch((err)=>{
              this.$q.notify({
                icon: 'info',
                message: 'An error occur =>' + err,
                color: 'negative'
              })
            })
          })
          .catch((err)=>{
            this.$q.notify({
              icon: 'info',
              message: 'An error occur =>' + err,
              color: 'negative'
            })
          })
        }).onCancel(() => {
          // // console.log('>>>> Cancel')
        })
        
      // this.$firestore.PenReg.delete()
    },
    loadPreReg(id) {
      this.$router.push('/admin/profile/' + id)
    },
    updateJeepData(id){
      if(this.PenReg.Designation == 'Operator'){
        this.Jeeps.forEach(a=>{
          firebaseDb.collection('JeepneyData').doc(a['.key']).update({MemberID: id})
          .then(()=>{
            // console.log('updated',a['.key'])
          })
        })
      } else {
        // console.log('not operator')
      }
    },
    test () {
      // NGTSC2020012
      const query = firebaseDb.collection('MemberData').where('Operator.MemberID', '==', 'NGTSC2020012')
      query.get().then((snapshot) => {
        // console.log(snapshot, 'snap')
        snapshot.forEach(doc => {
          // console.log(doc.data(), 'data')
        })
      })
    },
    createLoginUser (memberID, designation, firstName, lastName, mobile) {
      return new Promise(async (resolve) => {
        const email = memberID + '@coop.com'
        const password = Math.random().toString(36).slice(-6).toUpperCase()

          await this.sendAccountMessage(memberID,password,mobile)
          // console.log('sent message')
          Auth2.createUserWithEmailAndPassword(email, password)
            .then(async (data) => {
              // console.log(data, 'data')
              const userID = data.uid
              await firebaseDb.collection('Users').doc(data.user.uid).set({
                Email: email,
                Phone: mobile,
                Designation: designation,
                FirstName: firstName,
                LastName: lastName,
                MemberID: memberID
              }).then((doc) => {
                resolve(doc)
              }).catch((err) => {
                // console.log(err)
              })
              
            })
            .catch(err => {
              // console.log(err)
            })          

      })
    },
    sendAccountMessage(id,password,mobile){
      return new Promise(async (resolve) => {   

        let message = `You passed the evaluation! Your AccountNo. is ${id} and your Temporary Password is ${password}.`
        var senddata = 'number=' + mobile + '&' + 'message=' + message + '&' + 'apinumber=' + 4
        // console.log(senddata,'data')

        axios.post('https://toned-tabulation.000webhostapp.com/index.php', senddata)
        .then(response => {
          // console.log(response,'response')
          resolve(response)
        })
        .catch(err =>{
          // console.log('err',err)
        })
      })  
    }
    // printDiv(divName){
		// 	const prtHtml = document.getElementById(divName).innerHTML;

    //   // Get all stylesheets HTML
    //   let stylesHtml = '';
    //   for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
    //     stylesHtml += node.outerHTML;
    //   }
    //   // Open the print window
    //   const WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');

    //   WinPrint.document.write(`<!DOCTYPE html>
    //   <html>
    //     <head>
    //       ${stylesHtml}
    //     </head>
    //     <body>
    //       ${prtHtml}
    //     </body>
    //   </html>`);

    //   WinPrint.document.close();
    //   WinPrint.focus();
    //   WinPrint.print();
    //   WinPrint.close();
		// }
  }
}
</script>
