<template>
    <div class="q-pa-md">
        <q-card class="my-card" flat bordered>
        <!-- start toolbar -->
        <!-- <q-btn @click="test">test</q-btn> -->
        <q-card-actions align="right">
          <q-btn @click="inception = true; OrTid();" flat v-if="MemberData.MembershipFee">
            Membership Fee: {{ MemberData.MembershipFee }}
            </q-btn>

            <!-- start membership payment -->
            <div>
              <q-dialog v-model="inception">
                <q-card>
                  <q-card-section>
                    <div class="text-h6">Membership Fee Payment</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <div class="q-pa-md">
                      <q-input v-model="Payment.OrNo" label="OR No">
                        <template v-slot:before>
                        <q-icon name="mdi-human-handsup" />
                        </template>
                      </q-input>
                    </div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <div class="q-pa-md">
                      <q-input v-model="Payment.MembershipFee" label="Amount">
                        <template v-slot:before>
                        <q-icon name="mdi-human-handsup" />
                        </template>
                      </q-input>
                    </div>
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <div class="q-pa-md">
                      <q-input v-model="Payment.Total" label="Amount">
                        <template v-slot:before>
                        <q-icon name="mdi-human-handsup" />
                        </template>
                      </q-input>
                    </div>
                  </q-card-section>
                  <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Pay Fee" @click="PayFee" />
                    <q-btn flat label="Close" v-close-popup />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </div>
            <!-- end membership payment -->

            <q-btn flat round icon="event"/>
            <q-btn @click="contract = !contract" flat color="teal-4">
            Print Contract
            </q-btn>
            <q-btn flat color="teal-4" @click="qrdialog = !qrdialog; GenQr()">
            Print ID
            </q-btn>
            <q-btn flat color="teal-4" @click="bar = !bar; listDrivers();" v-if="MemberData.Designation == 'Operator'">
            Unit/s Details
            </q-btn>
            <q-btn flat color="teal-4" @click="bar = !bar; driverUnit();"  v-if="MemberData.Designation == 'Driver'">
            Jeepney
            </q-btn>

            <div class="">
              <div v-if="upd">
                <q-btn flat @click="upd = !upd, onUpdateMemberData()" color="teal-4">
                Update
                </q-btn>
              </div>

              <div v-else>
                <q-btn flat @click="updateMemberData()" color="teal-4" label="Save" />
                <q-btn flat @click="cancelUpdate()" color="teal-4" label="Cancel" />
              </div>

            </div>

            <q-btn flat color="teal-4">
            Resign
            </q-btn>
        </q-card-actions>
        <!-- end toolbar -->

        <q-separator />

        <q-card-section class="row">
        <q-card-section class="col-md-4 col-sm-12 col-xs-12 q-pt-md">
            <img
            style="height:200px; width:200px; border-radius: 50%;"
            class="rounded-borders"
            :src="MemberData.imageUrlPro"
            v-if="!loading"
            />
            <q-spinner
            color="primary"
            width='150'
            height='150'
            v-if="loading"
            />
          <q-btn @click="onFileClick1" v-if="!upd">Change Profile Picture</q-btn>
          <input type="file" accept="image/*" ref="fileInput1" @change="onFilePickedPro" v-show="false">


            <div class="text-h5 q-mt-sm q-ma-md">Member ID: {{ penRegId }}</div>
            <!-- <div class="text-h6 q-mt-sm q-ma-md"
            v-if="MemberData.Designation == 'Driver'">Operator: {{ MemberData.Operator.Name }}</div> -->
            <div class="q-pa-md">
              <q-input
              v-model="MemberData.FirstName"
              label="First Name"
              :readonly="upd"
              >
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>

            <div class="q-pa-md">
              <q-input v-model="MemberData.LastName" label="Last Name" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup"/>
                </template>
              </q-input>
            </div>

            <div class="q-pa-md">
              <q-select v-model="MemberData.Designation" :options="['Driver', 'Operator', 'Other']" label="Designation" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-select>
            </div>

            <div class="q-pa-md">
              <q-select v-model="MemberData.CivilStatus" label="Civil Status" :options="['Single', 'Married', 'Widow']" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-select>
            </div>
        </q-card-section>

        <q-card-section class="col-md-4 col-sm-12 col-xs-12 q-pt-md">
            <div class="q-pa-md">
              <q-input v-model="MemberData.BirthDate" label="BirthDate" stack-label type="date" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>

            <div class="q-pa-md">
              <q-input v-model="MemberData.BirthPlace" label="BirthPlace" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>

          <div class="q-pa-md">
              <q-input v-model="MemberData.Occupation" label="Occupation" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>

            <div class="q-pa-md">
              <q-input v-model="MemberData.EmployerCompany" label="Employer or Office" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>

            <div class="q-pa-md">
              <q-input v-model="MemberData.OtherIncome" label="Other Sources of Income" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>

            <div class="q-pa-md">
              <q-input v-model="MemberData.RelativeName" label="Nearest Relative" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>

            <div class="q-pa-md">
              <q-input v-model="MemberData.Relationship" label="Relationship" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>

            <div class="q-pa-md">
              <q-input v-model="MemberData.NoDependents" label="Number of Dependents" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>

        </q-card-section>

        <q-card-section class="col-md-4 col-sm-12 col-xs-12 q-pt-md">

          <div class="col-sm-4">
            <q-spinner
            color="primary"
            width='150'
            height='150'
            v-if="loading1"
            />
              <q-img
                class="rounded-borders"
                :src="MemberData.imageUrlLic"
                v-if="!loading1"
            />

          <q-btn @click="onFileClick2"  v-if="!upd">Change License Picture</q-btn>
          <input type="file" accept="image/*" ref="fileInput2" @change="onFilePickedLic" v-show="false">

          </div>

          <div class="col-sm-4">
              <div class="q-pa-md">
              <q-input v-model="MemberData.LicenseNo" label="License No." :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>
        </div>

        <div class="col-sm-4 col-sm-12 col-xs-12">
              <div class="q-pa-md">
              <q-input v-model="MemberData.LicenseExp" label="License Expiration" stack-label type="date" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>
        </div>

        <div class="q-pa-md">
              <q-input v-model="MemberData.Address" label="Adress" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>

            <div class="q-pa-md">
              <q-input v-model="MemberData.Phone" label="Phone" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>

            <div class="q-pa-md">
              <q-input v-model="MemberData.Email" label="Email" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>
        </q-card-section>
      </q-card-section>
    </q-card>

<q-dialog v-model="bar">
  <q-card class="my-card" style="width: 700px; max-width: 80vw;">

    <q-bar>
      <q-space />
      <q-btn dense flat icon="close" v-close-popup>
      <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
      </q-btn>
    </q-bar>

    <div v-if="MemberData.Designation == 'Driver'">
      <q-card-section>
        <div class="text-h6">Jeepney & Operator</div>
      </q-card-section>

      <q-card-section class="row items-center q-pb-none">
        <div class="q-pa-md">
              <q-input v-model="drvOperator" label="Operator" readonly>
                <template v-slot:before>
                 <q-icon name="mdi-face" />
                </template>
              </q-input>
            </div>

            <div class="q-pa-md">
              <q-input v-model="MemberData.PlateNo" label="Plate No"
              @input="plateNoVerify()"
              :loading="loadingState"
              >
                <template v-slot:before>
                 <q-icon name="mdi-jeepney" />
                </template>
              </q-input>
            </div>
      </q-card-section>
    </div>

    <div v-if="MemberData.Designation == 'Operator'">
      <q-card-section>
        <div class="text-h6">Jeepney & Drivers</div>
      </q-card-section>

      <q-card-section class="row items-center q-pa-md" v-for="(data, id) in UnitsDriver" :key="id">
        <div class="full-width">
          <div class="q-pb-md">
              <q-input :value=id label="Plate No"
              outlined
              >
                <template v-slot:before>
                 <q-icon name="mdi-jeepney" />
                </template>
                 <q-btn flat icon="add" @click="addDriverDialog = !addDriverDialog">
                   <q-tooltip content-class="bg-white text-primary">Add Driver</q-tooltip>
                 </q-btn>
                 <q-btn flat icon="edit">
                   <q-tooltip content-class="bg-white text-primary">Update Plate No.</q-tooltip>
                 </q-btn>
                 <q-btn flat icon="cancel">
                   <q-tooltip content-class="bg-white text-primary">Delete</q-tooltip>
                 </q-btn>
              </q-input>
            </div>

        <div class="q-pa-md" v-if="addDriverDialog">
          <q-input v-model="Driver" label="Driver"
            @input="driverVerify()"
            :loading="loadingState"
            >
              <template v-slot:before>
                <q-icon name="mdi-face" />
              </template>
              <q-btn flat icon="save"></q-btn>
            </q-input>
        </div>

          <div v-for="(dat, i) in data" :key="i" class="q-pa-md">
            <q-input :value="dat.FirstName +' '+ dat.LastName" label="Driver"
              @input="driverVerify()"
              readonly
              >
                <template v-slot:before>
                 <q-icon name="mdi-face" />
                </template>
                 <q-btn flat icon="cancel"></q-btn>
              </q-input>
          </div>
        </div>
      </q-card-section>
    </div>
  </q-card>
</q-dialog>

<!-- <q-dialog v-model="addDriverDialog" persistent >
  <q-card class="my-card">
    <q-card-section class="row items-center q-pa-md">
      <div class="q-pa-md">
        <q-input v-model="Driver" label="Driver"
          @input="driverVerify()"
          :loading="loadingState"
          >
            <template v-slot:before>
              <q-icon name="mdi-face" />
            </template>
          </q-input>
        </div>
    </q-card-section>

    <q-card-actions>
        <q-btn flat color="secondary" class="col-5">
          Save
        </q-btn>
        <q-btn flat color="red" class="col-5">
          Cancel
        </q-btn>
      </q-card-actions>
  </q-card>
</q-dialog> -->

  <!-- Print ID Dialog -->
  <q-dialog v-model="qrdialog">
    <print-id 
    :MemberData="MemberData" 
    :penRegId="penRegId" 
    :qrvalue="qrvalue"
    ref="printIdRef"></print-id>
  </q-dialog>

  <!-- Print Contract Dialog -->
  <q-dialog v-model="contract">
      
    <print-contract :MemberData="MemberData"></print-contract>
    
  </q-dialog>

  </div>
</template>

<script>
import Vue from 'vue'

import { firebaseDb, firebaseSto, firefirestore } from 'boot/firebase';
import VueQrcode from '@chenfengyuan/vue-qrcode'
import Swal from 'sweetalert2'

import PrintContract from '../../components/Admin/Members/PrintContact.vue'
import PrintId from '../../components/Admin/Members/PrintID.vue'


Vue.component(VueQrcode.name, VueQrcode);

export default {
  components: {
    PrintContract,
    PrintId
  },
    data(){
        return{
          addDriverDialog: false,
          loadingState: false,
          contract: false,
          inception: false,
          qrvalue: '',
          bar: false,
          qrdialog: false,
          upd: true,
          loading: false,
          loading1: false,
          datetodaydata: '',
          inception: false,
          Payment: {
            MemberID: this.penRegId,
            OrNo: '',
            TransactionID: '',
            MembershipFee: 500,
            Total: 500,
            timestamp: ''
          },
          Unit: {
            Operator: '',
            PlateNo: ''
          },
          Driver: '',
          UnitsDriver: {},
          drvOperator: '',
          verifyPlateNo: true,
          tempMemData: {},
      
        }
    },
    props: ['penRegId'],
    firestore () {
      return {
          // Doc
          MemberData: firebaseDb.collection('MemberData').doc(this.penRegId),
          Members: firebaseDb.collection('MemberData'),
          DriverData: firebaseDb.collection('MemberData').where('Designation', '==', 'Driver'),
          Units: firebaseDb.collection('Units'),
          Transactions: firebaseDb.collection('Transactions'),
          // Counter: firebaseDb.collection('Counter').doc("v65AIZI2jjNN2jlEv17N"),
      }
    },
    methods: {
      test () {
        // this.bus.$emit('genQR')
        console.log(this)
      },
      driverVerify () {
        this.loadingState = true
        var drvname
        this.DriverData.forEach((e) => {
          drvname = e.FirstName + ' ' + e.LastName

          if(this.Driver == drvname){
              this.loadingState = false
          }
        })
      },
      plateNoVerify(){
        this.loadingState = true
        var plt = this.MemberData.PlateNo
        var MemberID= ''
        var vrf

        this.Units.forEach((e) => {
          // PlateNo = e['.key']
            if(plt == e.PlateNo){
              return vrf = true
            }
        })

        if(vrf == true){
          Swal.fire(
              {
                customClass: {
                  container: 'my-swal3',
                },
                title: 'Plate No Exists!!',
                text: 'success',
              }
            )
          this.verifyPlateNo = true
          this.loadingState = false
        }else{
          this.verifyPlateNo = false
        }
      },
      driverUnit(){
        var drvOp
        var drvOpnm
        var dd = this.$firestore.Members

        this.$firestore.Units.doc(this.MemberData.PlateNo)
        .get()
        .then((doc) => {
          drvOp = doc.data()
          })
          .then(()=>{
            dd.doc(drvOp.Operator)
            .get()
            .then((doc) => {
              drvOpnm = doc.data()
              })
              .then(()=>{
                this.drvOperator = drvOpnm.FirstName + ' ' +  drvOpnm.LastName
              })
          })
      },
      listDrivers(){

        var UnitDriver = {}
        var test = []
        var mb =this.$firestore.Members
        var set = this.$set
        var key

          this.MemberData.PlateNo.forEach(function(key, index){
            mb.where('PlateNo', '==' , key)
            .get()
            .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                //  UnitDriver[key] = doc.data()
                  // UnitDriver.push({
                  //   MemberID: doc.id,
                  //   data: doc.data()
                  // })
                  test.push(doc.data())
                })
                  set(UnitDriver, key , test)
                  test = []
             })
           })

          this.UnitsDriver = UnitDriver
          console.log('resolvec', this.UnitsDriver)
      },
      removedriver(id, key){
        Swal.fire({
          customClass: {
            container: 'my-swal'
          },
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
          if (result.value) {

            this.UnitsDriver.splice(key, 1);
            this.$firestore.Members.doc(id).update({
              PlateNo: ''
              })

            Swal.fire(
              {
                customClass: {
                  container: 'my-swal2',
                },
                title: 'Removed!',
                text: 'Driver has been removed.',
              }
            )
          }
        })

      },
      loadProfile(id) {
            this.bar = !this.bar
            this.$router.push('/admin/profile/' + id)
            window.location.reload();
      },
      GenQr(){
        if(this.MemberData.Designation == 'Driver'){

          var op

          this.$firestore.Units.doc(this.MemberData.PlateNo)
          .get()
          .then((doc) => {
            op = doc.data().Operator
            })
            .then(() => {
              this.qrvalue =
              'Driver: ' + this.MemberData['.key'] +' '+ 'Operator: ' + op
            })
        }else{
          this.qrvalue = 'Operator: ' + this.MemberData['.key']
        }

      },
      onUpdateMemberData () {
        this.tempMemData = this.MemberData
        let temp = this.$store.getters['subModules/getPlainValue'](this.MemberData)
        this.MemberData = temp
      },
      updateMemberData () {
        this.$firestore.MemberData.set(this.MemberData)
        .then(() => {
          this.upd = !this.upd
        })
      },
      cancelUpdate () {
        this.MemberData = this.tempMemData
        this.upd = !this.upd
      },
      //new code
      OrTid(){
        this.Payment.TransactionID = (this.Counter.TransactionID + 1)
        this.Payment.OrNo = (this.Counter.OrNo + 1)
      },
      PayFee(){
        this.Payment.timestamp = firefirestore.FieldValue.serverTimestamp()
        this.$firestore.Transactions.doc(this.datetodaydata).collection('Payment').add(this.Payment)

        this.$firestore.MemberData.update({
                MembershipFee: firefirestore.FieldValue.delete()
        })
      },
       //new code
      printDiv(divName){
        const prtHtml = document.getElementById(divName).innerHTML;
        // Get all stylesheets HTML
        let stylesHtml = '';
        for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
            stylesHtml += node.outerHTML;
        }
        // Open the print window
        const WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');

        WinPrint.document.write(`<!DOCTYPE html>
        <html>
            <head>
            ${stylesHtml}
            </head>
            <body>
            ${prtHtml}
            </body>
        </html>`);

        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
      },
      datetoday(){
        var myDate = new Date();
        var month = ('0' + (myDate.getMonth() + 1)).slice(-2);
        var date = ('0' + myDate.getDate()).slice(-2);
        var year = myDate.getFullYear();
        var formattedDate = year + '-' + month + '-' + date;
        this.datetodaydata = formattedDate;
        },
      onFileClick1(){
        this.$refs.fileInput1.click()
      },
      onFileClick2(){
        this.$refs.fileInput2.click()
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
            console.log('ProfilePro:', downloadURL)
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
            console.log('ProfileLic:', downloadURL)
          }).then(() => {
            this.loading1 = false
          })
        })
      }
 },
  mounted () {
    // this.addLine()
    this.datetoday()
  },
  computed: {
    // Drivers(){
    //   console.log('ss', this.UnitsDriver)
    //   return this.UnitsDriver
    // }
  }
}
</script>

<style>
    .my-swal {
        z-index: 300000;
      }

    .my-swal2 {
        z-index: 300000;
      }

    .my-swal3 {
        z-index: 300000;
      }

		.id-card-holder {
			width: 300px;
		    padding: 4px;
		    margin: 0 auto;
		    background-color:teal;
		    border-radius: 5px;
		    position: relative;
		}
		.id-card-holder:after {
		    content: '';
		    width: 7px;
		    display: block;
		    background-color:teal;
		    height: 100px;
		    position: absolute;
		    top: 105px;
		    border-radius: 0 5px 5px 0;
		}
		.id-card-holder:before {
		    content: '';
		    width: 7px;
		    display: block;
		    background-color:teal;
		    height: 100px;
		    position: absolute;
		    top: 105px;
		    left: 290px;
		    border-radius: 5px 0 0 5px;
		}
		.id-card {

			background-color: #fff;
			padding: 10px;
			border-radius: 10px;
			text-align: center;
			box-shadow: 0 0 1.5px 0px #b9b9b9;
		}
		.id-card img {
			margin: 0 auto;
		}
		.header img {
			width: 100px;
    		margin-top: 15px;
		}
		.photo img {
			width: 80px;
    		margin-top: 15px;
		}
		h2 {
			font-size: 15px;
			margin: 5px 0;
		}
		h3 {
			font-size: 12px;
			margin: 2.5px 0;
			font-weight: 300;
		}
		.qr-code img {
			width: 180px;
		}
		p {
			font-size: 5px;
			margin: 2px;
		}


  .h6 {
    text-align: center;
    text-decoration: overline underline;
  }

  .page {
    width: 21cm;
    min-height: 29.7cm;
    padding: 2cm;
    margin: 1cm auto;
    border: 1px #D3D3D3 solid;
    border-radius: 5px;
    background: white;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }

  @page {
    size: A4;
    margin: 0;
  }
  @media print {
    html, body {
      width: 210mm;
      height: 400mm;
    }
  }
</style>
