<template>
  <div>
    <q-page>
    <h6 class="q-ma-none q-pl-md q-pt-md text-teal">Members <q-icon name="mdi-arrow-right-box" /> Add Members</h6>
     <q-separator />
       <div class="q-pa-md">    
         <div class="q-gutter-y-md full-width">
        <q-form 
        @submit="onSubmit"
        @reset="Clear" >
          <div class="q-pa-md">
            <q-card class="q-pa-md">
           <q-card-section horizontal class="col">
             <!-- <span class="text-uppercase text-blue">Drivers Details</span> -->
             <div class="row">

                        <!-- Start of Upload Image -->
                   <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                     <div class="q-pa-md q-mt-xl q-pt-xl">
                          <div style=" text-align: center;">
                            <q-spinner
                              color="teal"
                              width='150' 
                              height='150'
                              v-if="loading"
                            />
                            <img 
                            v-if="!loading"
                            :src="MemberData.imageUrlPro" 
                            width='150' 
                            height='150' 
                            style="border-radius: 50%;">
                          </div>
                       <q-input 
                       color="teal-4"
                       type="file"
                       hint="Profile Picture"
                       accept="image/*"
                       @change="onFilePickedPro">
                        <template v-slot:prepend>
                          <q-icon name="attach_file" />
                        </template>
                      </q-input>
                     </div>
                   </div>
                      <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                        <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
                          <div class="q-pa-sm">
                          <div style=" text-align: center;">
                              <q-spinner
                                color="teal"
                                width='160' 
                                height='90'
                                v-if="loading1"
                              />
                                  <img 
                                  v-if="!loading1"
                                  :src="MemberData.imageUrlLic"
                                  width='368' 
                                  >
                          </div>
                                <q-input 
                                type="file"
                                hint="License / Valid ID"
                                accept="image/*"
                                @change="onFilePickedLic">
                                  <template v-slot:prepend>
                                    <q-icon name="attach_file" />
                                  </template>
                                </q-input>
                            </div>
                          </div>
                        </div>
                          <!-- <div class="col-sm-12">
                            <qrcode :value='qrvalue' :options="{ width: 200 }"></qrcode>
                        </div> -->
              <!-- Start of Firstname -->
                        <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                          <div class="q-pa-md">
                            <q-input color="teal" v-model="MemberData.FirstName" label="First name"
                            lazy-rules=""
                            :rules="[ val => val && val.length > 0 || 'Please type something']">
                            <template v-slot:before>
                              <q-icon name="mdi-human-handsup" />
                            </template>
                            </q-input>
                          </div>
                        </div>
                        <!-- End of Firstname -->
               <!-- Start of Lastname -->
                        <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                          <div class="q-pa-md">
                            <q-input color="teal-4" v-model="MemberData.LastName" label="Last name" 
                            lazy-rules=""
                            :rules="[ val => val && val.length > 0 || 'Please type something']"
                            >
                            <template v-slot:before>
                              <q-icon name="mdi-human-handsdown" />
                            </template>
                            </q-input>
                          </div>
                        </div>
                        <!-- End of Lastname -->
               <!-- Start of Designation -->
               <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                 <div class="q-pa-md">
                  <q-select color="teal-4" v-model="MemberData.Designation" :options="options" label="Designation"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please select something']"
                  @popup-hide="DesignationChange">
                  <template class="q-pa-md" v-slot:before>
                      <q-icon name="account_box" />
                    </template>
                  </q-select>
                  <!-- <q-input
                  color="blue-12"
                    disable
                    v-model="driversposition"
                    label="Designation"
                  >
                    <template class="q-pa-md" v-slot:before>
                      <q-icon name="account_box" />
                    </template>
                  </q-input> -->
                   </div>
                   </div>
                   <!-- End of Designation -->
                   
                        <!-- Start of Member ID -->
                        <!-- <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                          <div class="q-pa-md">
                            <q-input v-model="MemberData.MemberId" label="Member ID" mask="####-##########">
                              <template v-slot:before>
                                <q-icon name="mdi-comment-account-outline" />
                              </template>
                            </q-input>
                          </div>
                        </div> -->
                        <!-- End of Member ID -->
                        <!-- Start of Date -->
                        <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                          <div class="q-pa-md">
                             <!-- di ko gets -->
                            <q-input color="teal-4" label="Year/Month/Date" v-model="MemberData.BirthDate" mask="date" hint="Birthday" 
                            lazy-rules
                            :rules="['date'][ val => val && val.length > 0 || 'Please type something']"
                            >
                              <template class="q-pa-none q-md-none" v-slot:before>
                                <q-icon name="event" class="cursor-pointer">
                                  <q-popup-proxy
                                    ref="qDateProxy"
                                    transition-show="scale"
                                    transition-hide="scale"
                                  >
                                    <!-- <q-date v-model="driversentrydate" @input="() => $refs.qDateProxy.hide()" /> -->
                                  </q-popup-proxy>
                                </q-icon>
                              </template>
                            </q-input>
                          </div>
                        </div>
                        <!-- End of Date -->
                        <!-- Start of Status -->
                          <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                            <div class="q-pa-md">
                              <q-select
                                color="teal-4"
                                v-model="MemberData.CivilStatus"
                                :options="civilstatusoptions"
                                label="Civil Status"
                                lazy-rules
                                :rules="[ val => val && val.length > 0 || 'Please select something']"
                              >
                                <template class="q-pa-md" v-slot:before>
                                  <q-icon name="mdi-heart-box" />
                                </template>
                              </q-select>
                            </div>
                            </div>
                          <!-- End of Status -->
                        <!-- Start of Occupation -->
                          <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12" v-if="MemberData.Designation == 'Operator'">
                            <div class="q-pa-md">
                              <q-input color="teal-4" 
                              label="Occupation" 
                              v-model="MemberData.Occupation"
                              id="myInput"
                              lazy-rules
                              :rules="[ val => val && val.length > 0 || 'Please input something']"
                              >
                                <template v-slot:before>
                                  <q-icon name="mdi-briefcase" />
                                </template>
                              </q-input>
                            </div>
                          </div>
                        <!-- End of Occupation -->
                        <!-- Start of Employer or Office -->
                          <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12" v-if="MemberData.Designation == 'Driver'">
                            <div class="q-pa-md">
                              <q-input color="teal-4" v-model="MemberData.Occupation" label="Occupation" 
                              lazy-rules
                              :rules="[ val => val && val.length > 0 || 'Please input something']"
                              >
                                <template v-slot:before>
                                  <q-icon name="mdi-briefcase" />
                                </template>
                              </q-input>
                            </div>
                          </div>
                        <!-- Start of Employer or Office -->
                        <!-- Start of Employer or Office -->
                          <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12" v-if="MemberData.Designation == 'Operator'">
                            <div class="q-pa-md">
                              <q-input color="teal-4" v-model="MemberData.EmployerCompany" label="Employer or Office" 
                              lazy-rules
                              :rules="[ val => val && val.length > 0 || 'Please input something']"
                              >
                                <template v-slot:before>
                                  <q-icon name="mdi-briefcase" />
                                </template>
                              </q-input>
                            </div>
                          </div>
                        <!-- Start of Employer or Office -->

                        <!-- Start of Driver Unit -->
                        <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12" v-if="MemberData.Designation == 'Driver'">
                          <div class="q-pa-md">
                            <q-input color="teal-4" v-model="Operator" label="Operator" 
                            :loading="loadingState"
                            @input="verifyoperator"
                            lazy-rules
                            :rules="[ val => val && val.length > 0 || 'Please input something']"
                            >
                              <template v-slot:before>
                                <q-icon name="mdi-briefcase" />
                              </template>
                            </q-input>
                          </div>
                        </div>
                        <!-- Start of Driver Unit -->
                        
                        <!-- Start of Other sources of Income -->
                          <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                            <div class="q-pa-md">
                              <q-input color="teal-4" v-model="MemberData.OtherIncome" label="Other sources of Income" 
                              lazy-rules
                              :rules="[ val => val && val.length > 0 || 'Please input something']"
                              >
                                <template v-slot:before>
                                  <q-icon name="mdi-briefcase" />
                                </template>
                              </q-input>
                            </div>
                          </div>
                        <!-- Start of Other sources of Income -->
                        <!-- Start of Nearest Relative -->
                          <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                            <div class="q-pa-md">
                              <q-input color="teal-4" v-model="MemberData.RelativeName" label="Nearest Relative" 
                              lazy-rules
                              :rules="[ val => val && val.length > 0 || 'Please input something']"
                              >
                                <template v-slot:before>
                                  <q-icon name="mdi-briefcase" />
                                </template>
                              </q-input>
                            </div>
                          </div>
                        <!-- Start of Nearest Relative -->
                        <!-- Start of Relationships -->
                          <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                            <div class="q-pa-md">
                              <q-input color="teal-4" v-model="MemberData.Relationship" label="Relationship" 
                              lazy-rules
                              :rules="[ val => val && val.length > 0 || 'Please input something']"
                              >
                                <template v-slot:before>
                                  <q-icon name="mdi-briefcase" />
                                </template>
                              </q-input>
                            </div>
                          </div>
                        <!-- Start of Relationships -->
                          <!-- Start of Number of dependents -->
                          <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                            <div class="q-pa-md">
                              <q-input color="teal-4" v-model="MemberData.NoDependents" label="Number of dependents"
                              type="number" 
                              lazy-rules
                              :rules="[ val => val && val.length > 0 || 'Please input something']"
                              >
                                <template v-slot:before>
                                  <q-icon name="mdi-briefcase" />
                                </template>
                              </q-input>
                            </div>
                          </div>
                        <!-- Start of Number of dependents -->
                        
                        <!-- Start of Birth place -->
                        <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                          <div class="q-pa-md">
                            <q-input color="teal-4" label="Birth place" v-model="MemberData.BirthPlace"
                            lazy-rules
                            :rules="[ val => val && val.length > 0 || 'Please input something']"
                            >
                              <template v-slot:before>
                                <q-icon name="mdi-home-map-marker" />
                              </template>
                            </q-input>
                          </div>
                        </div>
                        <!-- End of Birth place -->
                        <!-- Start of Address -->
                        <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                          <div class=" q-pa-md">
                            <q-input color="teal-4" v-model="MemberData.Address" label="Address" autogrow 
                            lazy-rules
                            :rules="[ val => val && val.length > 0 || 'Please input something']"
                            >
                            <template v-slot:before>
                              <q-icon name="mdi-home" />
                            </template>
                            </q-input>
                          </div>
                        </div>
                        <!-- End of Address -->
                        <!-- Start of Phone -->
                        <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                          <div class="q-pa-md">
                            <q-input color="teal-4" v-model="MemberData.Phone" label="Phone" mask="(##) - (####) - (#####)" 
                            lazy-rules
                            :rules="[ val => val && val.length > 0 || 'Please input something']"
                            >
                              <template v-slot:before>
                                <q-icon name="mdi-cellphone" />
                              </template>
                            </q-input>
                          </div>
                        </div>
                        <!-- End of Phone -->

                        <!-- Start of Email -->
                        <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                          <div class="q-pa-md">
                            <q-input color="teal-4" label="Email" v-model="MemberData.Email" type="email"
                            lazy-rules
                            :rules="[ val => val && val.length > 0 || 'Please input something']"
                            >
                              <template v-slot:before>
                                <q-icon name="mail" />
                              </template>
                            </q-input>
                          </div>
                        </div>
                        <!-- End of Email -->
                       
                  
                  <!-- ############################################################################# -->
                        <!-- Start of License number --> 
                        <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                          <div class="q-pa-md">
                            <q-input color="teal-4" v-model="MemberData.LicenseNo" label="License number"
                            lazy-rules
                            :rules="[ val => val && val.length > 0 || 'Please input something']"
                            >
                              <template v-slot:before>
                                <q-icon name="mdi-account-card-details" />
                              </template>
                            </q-input>
                          </div>
                        </div>
                        <!-- End of License number -->
                        <!-- Start of Expiration date of Drivers License -->
                        <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                          <div class="q-pa-md">
                              <q-input
                                color="teal-4"
                                label="Year/Month/Date"
                                v-model="MemberData.LicenseExp"
                                mask="date"
                                :rules="['date']"
                                hint="Expiration Date"
                              >
                                <template class="q-pa-none q-md-none" v-slot:before>
                                  <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy
                                      ref="qDateProxy"
                                      transition-show="scale"
                                      transition-hide="scale"
                                    >
                                      <q-date
                                        v-model="MemberData.LicenseExp"
                                        @input="() => $refs.qDateProxy.hide()"
                                      />
                                    </q-popup-proxy>
                                  </q-icon>
                                </template>
                              </q-input>
                          </div>
                        </div> 

                        <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                          <div class="q-pa-md">
                            <q-btn class="q-mr-md text-white full-width" @click="unitdialog = !unitdialog; listUnits();" label="Unit Details" outline color="teal"/>
                          </div>
                        </div>

                        <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12 q-mb-lg q-pb-md">
                            <div class="q-pa-md">
                            </div>
                        </div>
                        <!-- End of Row -->
                         <div class="absolute-bottom-right">
                            <q-btn class="q-mr-md text-white" icon="cancel" type="reset" label="Reset" color="red-6" />
                            <q-btn type="submit" class="text-white" icon="check" label="Register" color="teal-6" />
                         </div>
                      </div>
                    </q-card-section>
                   </q-card>
                  </div>
              </q-form>
          </div>   
       </div>  
    </q-page> 
    

    <q-dialog v-model="unitdialog" persistent>
      <q-card class="my-card">
        <q-card-section>
          <div class="row no-wrap items-center">
            Unit Details
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none"  v-if="MemberData.Designation == 'Driver'">
          <!-- Start of Driver Unit -->
          <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
            <div class="q-pa-md">
              <q-input color="teal-4" v-model="Operator" label="Operator" 
              :loading="loadingState"
              @input="verifyoperator"
              lazy-rules
              readonly
              :rules="[ val => val && val.length > 0 || 'Please input something']"
              >
                <template v-slot:before>
                  <q-icon name="mdi-briefcase" />
                </template>
              </q-input>

              <div class="q-gutter-sm" v-for="(unit, id) in UnitsOperator" :key="id">
                <q-radio dense v-model="MemberData.PlateNo" :val="id" :label='id'/>
              </div>
            </div>
          </div>
          </q-card-section>
          <!-- Start of Driver Unit -->

          <!-- Start of Employer or Office -->
          <q-card-section class="q-pt-none"  v-if="MemberData.Designation == 'Operator'">
          <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
            <div class="q-pa-md">
              <ul class="list-group">
                <li class="list-group-item" v-for= "(unit, id) in MemberData.PlateNo" :key="id">
                  {{unit}} <button @click="removeUnit(id)" class="badge">x</button>
                </li>
              </ul>

              <q-input color="teal" outlined class="form-control" type="text" v-model="PlateNo" v-on:keyup.enter="addUnit()" />
              <br>
              <q-btn class="btn btn-primary full-width" @click="addUnit()">Add Jeep</q-btn>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat color="teal" @click='unitdialog = !unitdialog' label="Save" />
          <q-btn flat color="red" @click="clearUnit" v-close-popup label="Cancel"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
    
<script>
import { firebaseDb, firebaseSto, firefirestore, Auth2 } from 'boot/firebase';
import Swal from 'sweetalert2'

export default {
    data(){
        return{
          unitdialog: false,
          loadingState: false,
            bar1: false,
            bar2: false,
            choices: false,
            page: 1,
            MemberData: {
              FirstName: '',
              LastName: '',
              CivilStatus: '',
              BirthPlace: '',
              BirthDate: '1997/11/11',
              Address:'',
              Phone:'',
              Email:'',
              Occupation: '',
              PlateNo: [],
              EmployerCompany: '',
              Salary: '',
              OtherIncome: '',
              RelativeName: '',
              Relationship: '',
              NoDependents: '',
              LicenseNo:'',
              LicenseExp:'1997/11/11',
              MembershipFee: 'To be Paid',
              Designation: '',
              imageUrlPro: 'https://image.shutterstock.com/image-vector/social-member-vector-icon-person-260nw-1139787308.jpg',
              imageUrlLic: 'https://www.pinoydriver.com/resources/wp-content/uploads/2019/06/foreign-drivers-license-ph.png',
              timestamp: '',
            },
            PlateNo: '',
            options: ['Operator', 'Driver'],
            civilstatusoptions: ['Single', 'Married', 'Widow'],
            loading: false,
            loading1: false,
            verifyunit: false,
            UnitsOperator: {},
              verify: false,
              Operator: ''
            }
            OperatorDetails: {}
    },
  firestore: function () {
    return {
        AddMemberData: firebaseDb.collection('MemberData'),
        Operators: firebaseDb.collection('MemberData').where('Designation', '==', 'Operator'),
        Members: firebaseDb.collection('MemberData'),
        RegUnits: firebaseDb.collection('RegUnits'),
        Units: firebaseDb.collection('Units'),
        Users: firebaseDb.collection('Users'),
        MemberID: firebaseDb.collection('Counter').doc("v65AIZI2jjNN2jlEv17N"),
    }
  },
    methods: {
      listUnits(){
        if(this.MemberData.Designation == 'Driver' && this.OperatorDetails != null){
          var UnitsData = {}
          this.$firestore.Units.where('Operator', '==' , this.OperatorDetails.MemberID)
          .get()
          .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                  // doc.data() is never undefined for query doc snapshots
                  UnitsData[doc.id] = doc.data();
                  // console.log(doc.id, " => ", doc.data());
              })
          })
          .then(() => {
            this.UnitsOperator = UnitsData
          })
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          })
        }
      },
      verifyoperator(){
        this.loadingState = true
        var opt = this.Operator
        var optname = ''
        var MemberID= ''
        var optdetails = {}
        this.Operators.forEach(function(e) {
          optname = e.FirstName + ' ' + e.LastName
          MemberID = e['.key']

            if(optname == opt){
               optdetails = {
                MemberID: MemberID,
                Name: optname,
                verify: true
              }
              return optdetails
            }
        })
        this.OperatorDetails = optdetails

        if(optdetails.verify == true){
          Swal.fire(
            'Operator Exists!',
            '',
            'success'
          )
          this.loadingState = false
          this.verify = true
        }else {
          // this.$q.notify({
          // color: 'red-4',
          // textColor: 'white',
          // icon: 'cloud_done',
          // message: "Operator Doesn't Exist",
          // })
          this.verify = false
        }
        
      },
     onSubmit () {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Register!'
      }).then((result) => {
        if (result.value) {
          this.regMember()
          Swal.fire(
            'Member Registered!',
            'success'
          )
        }
      })
    },
    addUnit(){
      var mp = this.MemberData.PlateNo
      var p = this.PlateNo
        if (mp.length > 0 && p != ''){
          mp.forEach(function(e){
            if (e != p){
              mp.push(p)
            }
          })
        }else if (p != ''){
          mp.push(p)
        }
      this.PlateNo = ''
    },
    removeUnit(id){
      this.MemberData.PlateNo.splice(id, 1);
    },
    clearUnit(){
      this.PlateNo = []
    },
    regUnit(mid){
      var uu = this.$firestore.Units
      if(this.MemberData.Designation == 'Operator'){
        this.MemberData.PlateNo.forEach(function(e, i) {
          uu.doc(e).set({
            Operator: mid
          })
        })
      }
    },
    DesignationChange(){
      if(this.MemberData.Designation == 'Driver'){
        this.MemberData.Occupation = 'Driver'
      }else{
        this.MemberData.Occupation = ''
      }
    },
    adduser(email, password){
      Auth2.createUserWithEmailAndPassword(email, password)
      .then(() => {
        let userId = Auth2.currentUser.uid
        console.log("User " + userId + " created successfully!");
        Auth2.signOut();

        this.$firestore.Users.doc(userId).set({
          Designation: this.MemberData.Designation,
          Email: email,
          FirstName: this.MemberData.FirstName,
          LastName: this.MemberData.LastName,
          MemberID: email.substring(0,12)
        })
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
      })
    },
    log(){
      console.log(this.OperatorDetails)
    },
    regMember() {

      if(this.MemberData.Designation == 'Driver'){
        this.verifyoperator()
        if(this.verify == false){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Invalid Operator!',
          })
          return
        }
      }

        var mid = 'NGTSC'+ (this.MemberID.MemberID + 1)
        this.MemberData.timestamp = firefirestore.FieldValue.serverTimestamp()
        this.$firestore.AddMemberData.doc(mid).set(this.MemberData)
        .then(() => {
            var id = mid+'@coop.com'
            console.log('Member Registered')
            this.adduser(id, 'p@ssw0rd')

            this.regUnit(mid)
        })
        .then(() => {
            const increment = firefirestore.FieldValue.increment(1)
            this.$firestore.MemberID.update({ MemberID: increment })
            .then(() => {
              console.log('MemberID Incremented')
            })
        }) 
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Successfully Created',
          })
    },
      onFilePickedPro(e){
        this.loading = true
        let file = e.target.files[0]
        var storageRef = firebaseSto.ref('mempic/'+ file.name)
        let uploadTask = storageRef.put(file)
        uploadTask.on('state_changed', (snapshot) => {

        },(error) => {

        }, () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.MemberData.imageUrlPro = downloadURL
          }).then(() => {
            this.loading = false
          })
        })
      },
      onFilePickedLic(e){
        this.loading1 = true
        let file = e.target.files[0]
        var storageRef = firebaseSto.ref('mempic/'+ file.name)
        let uploadTask = storageRef.put(file)
        uploadTask.on('state_changed', (snapshot) => {

        },(error) => {

        }, () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.MemberData.imageUrlLic = downloadURL
          }).then(() => {
            this.loading1 = false
          })
        })
      },
      Clear(){
        this.file = '',
        this.date = '',
        this.Lastname = '',
        this.phone = ''
      } 
 },
 computed: {
   
  },
  mounted () {
    // this.addLine()
  }
}
</script>
<style scoped>
.designationborder{
  padding:5px;
  border:.3px solid;
  margin:6px;
}
.designationborder>span{
  position:absolute;
  top:33px;
  left:40px;
  background-color: white;
}
.the-jeep{
    opacity: 0.6;
}
.q-field_control{
  color: teal;
}
</style>