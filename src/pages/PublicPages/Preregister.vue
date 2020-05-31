<template>
<div class="q-pa-md">

    <div class = "col-xs-12 col-sm-6 col-md-6 q-pa-md">
      <q-card class="q-pa-md doc-container" style="opacity: 0.7;">
        <q-card-section>
            <div class="text-h5">Be a Part of New GSIS Transport Cooperative </div>
            <div class="text-h6">Earn and Save the Cooperative Way</div>
        </q-card-section>

        <q-card-section class="q-pt-none text-center text-justify">
          <div class="text-subtitle2">
            Interested Applicants can start by undergoing our online Pre-registration.
            The information you provided will be subjected into an evaluation process by the cooperative.
            <br>
            You can also personally visit our office to directly apply for a membership.
          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-stepper
      v-model="step"
      color="teal"
      animated
      vertical
      ref="stepper"
    >
      <q-step
        color="teal"
        :name="1"
        title="Apply As?"
        icon="settings"
        :done="step > 1"
      >


        <div class="row justify-center">
          <q-btn class="col q-ma-md" :color="dbtn1" @click="PreRegData.Designation = 'Driver'; dbtncolor();" label="Driver" :size="PreRegData.Designation == 'Driver' ? 'lg' : 'md'" :icon="PreRegData.Designation == 'Driver' ? 'send' : ''"/>
          <q-btn class="col q-ma-md" :color="dbtn2" @click="PreRegData.Designation = 'Operator'; dbtncolor();" label="Operator" :size="PreRegData.Designation == 'Operator' ? 'lg' : 'md'" :icon="PreRegData.Designation == 'Operator' ? 'send' : ''"/>
        </div>

        <q-stepper-navigation>
          <q-btn @click="step = 2,this.$refs.firstName.focus();" color="teal" label="Continue"></q-btn>
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        color="teal"
        title="Answer the Application Form"
        icon="settings"
        :done="step > 2"
      >

        Fill the fields with the required information

         <div class="q-pa-md doc-container">
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
              @submit="onSubmit"
              @reset="onReset"
              class="q-gutter-md"
              >
                <div>
                  <h4 class="row justify-center items-center" style="color: #26A69A;">Information Sheet</h4>

                  <strong class="row justify-center items-center" style="color: #26A69A;">
                      Personal Data
                  </strong>

                  <q-separator class= "q-mb-md q-pt-xs" color="secondary" inset hidden = 'true'/>

                  <q-input standard color="teal-4" v-model="PreRegData.FirstName" label="First Name" ref="firstName"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                  />
                  <q-input standard color="teal-4" v-model="PreRegData.LastName" label="Last Name"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                  />
                  <q-select color="teal-4" v-model="PreRegData.CivilStatus"
                  :options="['Single', 'Married', 'Widow']"
                  label="Civil Status"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                  />
                  <strong class="row justify-center items-center" style="color: #26A69A;">
                      Birth
                  </strong>
                  <q-separator class= "q-mb-md q-pt-xs" color="secondary" inset hidden = 'true'/>

                   <q-input color="teal-4" standard v-model="PreRegData.BirthDate" stack-label label="Birthdate"
                  type="date"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                  />
                  <q-input  color="teal-4" standard v-model="PreRegData.BirthPlace" label="Birthplace"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                  />
                   <strong class="row justify-center items-center" style="color: #26A69A;">
                    Address and Contact Details
                  </strong>
                  <q-separator class= "q-mb-md q-pt-xs" color="secondary" inset hidden = 'true'/>

                  <q-input color="teal-4" standard v-model="PreRegData.Address" label="Address"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                  />
                  <q-input color="teal-4" standard v-model="PreRegData.Phone" label="Phone No."
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                  mask="(####) ### - ####"
                  />
                  <q-input color="teal-4" standard v-model="PreRegData.Email" label="Email Address (optional)"
                  />
                  <strong class="row justify-center items-center" style="color: #26A69A;">
                      Employment
                  </strong>
                  <q-separator class= "q-mb-md q-pt-xs" color="secondary" inset hidden = 'true'/>


                  <!--  -->
                  <q-input color="teal-4" standard v-model="PreRegData.Occupation" label="Occupation"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                  v-if="this.PreRegData.Designation == 'Driver'"
                  readonly
                  />
                  <q-input standard v-model="Occupation" label="Occupation"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                  v-if="this.PreRegData.Designation == 'Operator'"
                  />

                  <!-- for operator -->
                  <q-input color="teal-4" standard v-model="PreRegData.EmployerCompany" label="Employer/ Company"
                    lazy-rules
                    v-if="PreRegData.Designation == 'Operator'"
                    :rules="[ val => val && val.length > 0 || 'Please type something']"
                  />
                  <!-- for driver -->
                  <q-input standard v-model="Operator" label="Operator ID"
                    :color="!isOperatorFound ? '' : 'positive'"
                    v-if="PreRegData.Designation == 'Driver'"
                    lazy-rules
                    @blur="verifyoperator"
                    :loading="loadingState"
                    :rules="[ val => val && val.length > 0 || 'Please enter Operator ID']"
                    :error-message="foundOperatorErrorMessage"
                    :error="!isOperatorFound"
                  >

                    <template v-slot:append>

                      <q-icon v-if="isOperatorFound" name="check" color="positive"></q-icon>

                    </template>
                  </q-input>


                  <q-input color="teal-4" standard v-model="PreRegData.Salary" label="Salary"
                  type="number"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                  />
                  <q-input color="teal-4" standard v-model="PreRegData.OtherIncome" label="Other Sources of Income"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                  />
                  <strong class="row justify-center items-center" style="color: #26A69A;">
                      Family Background
                  </strong>
                  <q-separator class= "q-mb-md q-pt-xs" color="secondary" inset hidden = 'true'/>

                  <q-input color="teal-4" standard v-model="PreRegData.RelativeName" label="Nearest Relative"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                  />
                  <q-input color="teal-4" standard v-model="PreRegData.Relationship" label="Relationship"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                  />
                  <q-input color="teal-4"  standard v-model="PreRegData.NoDependents" label="Number of Dependents"
                  type="number"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                  />

                  <div>
                    <strong class="row justify-center items-center" style="color: #26A69A;">
                      {{PreRegData.Designation == 'Driver' ? 'License' : 'Valid ID'}}
                    </strong>
                    <q-separator class= "q-mb-md q-pt-xs" color="secondary" inset hidden = 'true'/>

                    <img :src="imageUrl" width='300' height='150'>

                    <q-input
                      color="teal-4"
                      type="file"
                      :hint="PreRegData.Designation == 'Driver' ? 'License Picture' : 'ID Picture'"
                      accept="image/*"
                      @change="onFilePicked"
                      @onfocus="resetimginput"
                      ref="imginput"
                      lazy-rules
                      :rules="[ val => imageUrl && imageUrl.length > 0 || 'Please attach ID']"
                      >
                      <template v-slot:prepend>
                        <q-icon name="attach_file"/>
                      </template>
                    </q-input>

                    <q-input  color="teal-4" standard v-model="PreRegData.LicenseNo"
                    :label="PreRegData.Designation == 'Driver' ? 'License No.' : 'ID No.'"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Please type something']"
                    />
                    <q-input color="teal-4"  standard stack-label
                    v-model="PreRegData.LicenseExp"
                    label="Expiration Date"
                    type="date"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Please type something']"
                    />
                  </div>
                </div>

                <div>
                    <q-btn
                    label="Submit"
                    type="submit"
                    class="full-width	justify-center items-center q-mb-md"
                    color="teal"/>

                    <q-btn label="Reset"
                    type="reset" color="teal"
                    flat class="full-width justify-center items-center q-ml-sm" />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

        <q-stepper-navigation>
          <q-btn flat @click="step = 1" color="teal" label="Back" class="q-ml-sm"></q-btn>
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="3"
        color="teal"
        title="Verify your mobile number"
        icon="mobile_friendly"
      >
        A SMS with your verification code is sent to this number. {{returnNumberNoMask}}
        <q-input v-model="verificationCode" type="text" label="Verification Code" filled="" mask="XXXXX" size="lg" class="q-mt-md" style="width:200px;"/>

        <q-stepper-navigation>
          <q-btn flat @click="step = 2" color="teal" label="Back" class="q-ml-sm"></q-btn>
          <q-btn color="teal" label="Verify" @click="verifyCode" :disable="verificationCode == ''"></q-btn>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="4"
        color="teal"
        title="Wait for a Confirmation SMS"
        icon="add_comment"
      >
        Your Application will be subjected to evaluation.
        Upon approval a SMS will be sent to you.
        In it, we will provide further instructions to complete your application.
        <q-stepper-navigation>

          <q-btn color="teal" label="Finish" :to="'/'" ></q-btn>
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<script>
import { firebaseDb, firebaseSto, firefirestore } from 'boot/firebase';
import axios from 'axios'
const sri = require('simple-random-id');
export default {
  data () {
    return {
      verificationCode: '',
      loadingState: false,
      step: 1,
      PreRegData: {
        FirstName: '',
        LastName: '',
        CivilStatus: '',
        BirthPlace: '',
        BirthDate: '',
        Address:'',
        Phone:'',
        Email:'',
        Occupation: 'Driver',
        EmployerCompany: '',
        Salary: '',
        OtherIncome: '',
        RelativeName: '',
        Relationship: '',
        NoDependents: '',
        LicenseNo:'',
        LicenseExp:'',
        Designation: 'Driver',
        MembershipFee: '',
        timestamp: '',
        verificationCode: sri(5)
      },
      accept: false,
      dbtn1: 'teal-4',
      dbtn2: 'teal-4',
      datetodaydata: '',
      imageUrl: null,
      LicenseImage: null,
      Occupation: '',
      verify: false,
      OperatorDetails: {},
      Operator:'',
      isOperatorFound: false,
      foundOperatorErrorMessage: 'Required field *'
    }
  },
  firestore () {
    return {
        // Collection
        PreReg: firebaseDb.collection('PreRegPersonalData'),
        Operators: firebaseDb.collection('MemberData').where('Designation', '==', 'Operator')
    }
  },
  methods: {

    verifyoperator () {
      this.loadingState = true
      let optID = this.Operator

      var optDetails = this.Operators.filter(function(e) {

        return e['.key'] === optID
      })

      

      if (optDetails.length != 0) {
        if (optDetails[0].Designation == 'Operator') {
          this.OperatorDetails = optDetails[0]
          this.loadingState = false
          this.isOperatorFound = true
        } else {
          this.isOperatorFound = false
          this.foundOperatorErrorMessage = 'Operator not found'
          this.loadingState = false
        }
      } else {
        this.isOperatorFound = false
        this.foundOperatorErrorMessage = 'Operator not found'
        this.loadingState = false
      }


      // this.OperatorDetails = optdetails
      //
      // if(optdetails.verify == true){
      //   this.$q.notify({
      //   color: 'green-4',
      //   textColor: 'white',
      //   icon: 'cloud_done',
      //   message: 'Operator Exists',
      //   })
      //   this.loadingState = false
      //   this.isOperatorFound = false
      // } else {
      //   // this.$q.notify({
      //   // color: 'red-4',
      //   // textColor: 'white',
      //   // icon: 'cloud_done',
      //   // message: "Operator Doesn't Exist",
      //   // })
      //   this.isOperatorFound = true
      //   this.foundOperatorErrorMessage = 'Operator not found'
      //   this.loadingState = false
      // }
    },
    regPre () {
      if (this.PreRegData.Designation == 'Driver') {
        this.PreRegData.Occupation = this.DriverOccupation

        if(this.isOperatorFound == true) {
          this.PreRegData.Operator = {
            MemberID: this.OperatorDetails['.key'],
            FirstName: this.OperatorDetails.FirstName,
            LastName: this.OperatorDetails.LastName,
            FullName: this.OperatorDetails.LastName + ', ' + this.OperatorDetails.FirstName
          }
        } else {
          this.$q.notify({
            color: 'red-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: "Invalid Operator",
            })
          return
        }
      } else {
        this.PreRegData.Occupation = this.Occupation
      }
      let id = ''
      let childurl = ''
      this.PreRegData.timestamp = firefirestore.FieldValue.serverTimestamp()
      this.PreRegData.Phone = this.returnNumberNoMask
      // console.log(this.PreRegData)
      this.$firestore.PreReg.add(this.PreRegData).then((doc) => {
        id = doc.id
        return id
      })
      .then(id => {

        const filename = this.LicenseImage.name
        const ext = filename.slice(filename.lastIndexOf('.'))
        console.log(id, 'id')
        childurl = id + '.'+ ext
        return firebaseSto.ref('PreReg/' + childurl).put(this.LicenseImage)
        .then(snapshot => {
            return snapshot.ref.getDownloadURL();
        }).
        then(downloadURL => {
            console.log(`Successfully uploaded file and got download link - ${downloadURL}`);
            return firebaseDb.collection("PreRegPersonalData").doc(id).update({
              imageUrlLic: downloadURL,
              imageUrlPro: 'https://cdn2.iconfinder.com/data/icons/4web-3/139/header-account-image-line-512.png'
              });
        })
        .catch(error => {
            // Use to signal error if something goes wrong.
            console.log(`Failed to upload file and get link - ${error.message}`);
         })
         
      })
      
    },
    dbtncolor(){
      if(this.PreRegData.Designation == 'Driver'){
        this.dbtn1 = 'teal-9'
        this.dbtn2 = 'grey'
      }else if (this.PreRegData.Designation == 'Operator'){
        this.dbtn1 = 'grey'
        this.dbtn2 = 'teal-9'
      }
    },
    onFilePicked(event){
      const files = event.target.files
      let filename = files[0].name
      if (filename.lastIndexOf('.') <= 0){
        return alter('Please add a valid file!')
      }
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
      this.LicenseImage = files[0]
    },
    onSubmit () {
     this.sendSMS()
    //  this.$q.notify({
    //       position: 'top',
    //       color: 'white',
    //       textColor: 'teal-4',
    //       icon: 'check_circle',
    //       message: 'Successfully Registered',
    //     })
         // this.$refs.stepbtn.click()
    },
    onReset () {
      this.FirstName = null
      this.LastName = null
      this.accept = false
    },
    datetoday(){
      var myDate = new Date();
      var month = ('0' + (myDate.getMonth() + 1)).slice(-2);
      var date = ('0' + myDate.getDate()).slice(-2);
      var year = myDate.getFullYear();
      var formattedDate = year + '-' + month + '-' + date;
      this.datetodaydata = formattedDate;
    },
    resetimginput(){
      this.$refs.imginput.resetValidation()
    },
    test () {
      console.log(this.Operators)
      console.log(this.Operator)
      let operatorDetails = this.Operators.forEach(function(e) {
        let optname = e.FirstName + ' ' + e.LastName
        let MemberID = e['.key']

        console.log(e)
        if(optname == this.Operator){
           var optdetails = {
            MemberID: MemberID,
            Name: this.optname,
            verify: true
          }
          return optdetails
        }
      })
    },
    verifyCode(){
      if(this.verificationCode == this.PreRegData.verificationCode){
        this.regPre()
        this.$refs.stepper.next()
      } else {
        this.$q.notify({
              position: 'top',
              color: 'white',
              textColor: 'red-4',
              icon: 'error',
              message: 'Wrong Verification Code',
            })        
      }
    },
    sendSMS(){
      // this.$refs.stepper.next()
      let header= {
            'Access-Control-Allow-Origin': '*',
      }
      let message = 'Use this code: ' + this.PreRegData.verificationCode.toString() + ' to verify you phone number.'
      let number = this.returnNumberNoMask.toString()
      let apinumber = 1

      var data = 'number=' + number + '&' + 'message=' + message + '&' + 'apinumber=' + apinumber
      console.log(data)
      axios.post('https://smsapisender.000webhostapp.com/index.php', data )
      .then(response => {
        console.log(response)
        this.$refs.stepper.next()
      })
      .catch((error) => {
      console.log(error.response)
      })   
    }
  },
  mounted(){
    this.datetoday();
    this.dbtn1 = 'teal-9'
    this.dbtn2 = 'grey'
  },
  computed: {
    DriverOccupation(){
      if(this.PreRegData.Designation == 'Driver'){
        return 'Driver'
      }
    },
    returnNumberNoMask(){
      let number = this.PreRegData.Phone.toString()
      console.log(number.replace(/[^a-zA-Z0-9]/g, ""),'number')
      return number.replace(/[^a-zA-Z0-9]/g, "")
    }
  }
}
</script>
