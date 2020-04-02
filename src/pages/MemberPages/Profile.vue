<template>
    <div class="q-pa-md">
        <q-card class="my-card" flat bordered>
        <!-- start toolbar -->
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
            <q-btn @click="printDiv('page')" flat color="teal-4">
            Print Contract
            </q-btn>
            <q-btn flat color="teal-4" @click="qrdialog = !qrdialog; GenQr()">
            Print ID        
            </q-btn>
            <q-btn flat color="teal-4" @click="bar = !bar" v-if="MemberData.Designation == 'Operator'">
            Drivers       
            </q-btn>
            <!-- <q-btn flat @click="upd = !upd; updateMemberData()" color="teal-4">
            Update
            </q-btn> -->
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
            <div class="text-h6 q-mt-sm q-ma-md" 
            v-if="MemberData.Designation == 'Driver'">Operator: {{ MemberData.Operator.Name }}</div>
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

<q-dialog v-model="bar" persistent transition-show="flip-down" transition-hide="flip-up">
  <q-card>

    <q-bar>
      <q-space />
      <q-btn dense flat icon="close" v-close-popup>
      <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
      </q-btn>
    </q-bar>

    <div>
      <q-card-section>
        <div class="text-h6">Driver</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row col-lg-4 col-md-12 col-sm-12 col-xs-12 q-pa-md">
          <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12"> 
              <div class="q-pa-md">
                <q-input color="teal-4" 
                v-model="Driver"
                label="Driver" 
                v-on:keyup.enter="addDriver();"
                >
                  <template v-slot:before>
                  <q-icon name="mdi-jeepney" />
                  </template>
                </q-input>

                <ul class="list-group">
                  <li class="list-group-item" v-for= "(driver, key) in Drivers" :key="key">
                      {{driver}} <button @click="remove(driver);" class="badge">x</button>
                  </li>
                </ul>

                <q-btn @click="addDriver()">Add Driver</q-btn>
              </div>
            </div>
        </div>
      </q-card-section>
    </div>     
  </q-card>
</q-dialog> 


  <q-dialog v-model="qrdialog">
    <q-card class="my-card" flat bordered>
      <q-card-section horizontal id="idpage">
      <div class="id-card-tag"></div>
        <div class="id-card-tag-strip"></div>
        <div class="id-card-hook"></div>
        <div class="id-card-holder">
          <div class="id-card">
            <div class="header">
                  <strong>New GSIS Transport Service Cooperative</strong>
            </div>
            <div class="photo">
                  <img
                  style="height:80px; width:80px; border-radius: 50%;"
                  class="rounded-borders"
                  :src="MemberData.imageUrlPro"
                  />
            </div>
            <strong>{{MemberData.FirstName +' '+ MemberData.LastName }}</strong>
            <br>
            {{ penRegId }}
            <div class="qr-code">
                <qrcode :value="qrvalue" tag="img"></qrcode>
            </div>
            <h3>www.newgsistsc.com</h3>
            <hr>
            <p><strong>"PENGG"</strong>HOUSE,4th Floor, TC 11/729(4), Division Office Road <p>
            <p>Near PMG Junction, Thiruvananthapuram Kerala, India <strong>695033</strong></p>
            <p>Ph: 9446062493 | E-ail: info@onetikk.info</p>
        </div>
	    </div>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn color="secondary" class="full-width" @click="printDiv('idpage')">
          Print
        </q-btn>
      </q-card-actions>

    </q-card>
  </q-dialog>

        <div>
            <q-form
              class="q-gutter-md"
              id="page"
              v-show="false"
            >
              <p>&nbsp;</p>
              <h6 class="h6">APPLICATION FOR MEMBERSHIP</h6>
              
              <span style="padding-left: 150px;">I hereby apply for membership to the <strong>New GSIS Transport Service Cooperative.</strong></span>
                <br><span style="text-align: left;">&nbsp;I agree to obey faithfully its rules and regulations as set down in its Articles of Cooperation and Bylaws, the decisions of the general membership meetings and those of the Board of Directors.</span>
                <br><span style="text-align: left; padding-left: 30px;">I hereby pledge to:</span>
                <ol>
                <li style="text-align: left; padding-left: 30px;">Attend and finish the prescribed membership education courses.</li>
                <li style="text-align: left; padding-left: 30px;">Pay the membership fee of P 500.</li>
                <li style="text-align: left; padding-left: 30px;">Participate in the following savings program:
                <ol style="list-style-type: lower-alpha;">
                <li style="text-align: left; padding-left: 30px;">Subscribed fo at least 18 shares and pay for them either in lumpsum or installment, under the terms and conditions prescribed in the Membership Agreement.</li>
                <li style="text-align: left; padding-left: 30px;">Contribute daily/weekly/bi-monthly/monthly atleast 2% of my salary into the share capital; and</li>
                <li style="text-align: left; padding-left: 30px;">Contribute into the share capital at least 50% of the annual interest on capital and patronage refund due me.</li>
                </ol>
                </li>
                <li style="text-align: left; padding-left: 30px;">Comply with the membership and subscription agreement. For your consideration, I hereby attach my information sheet.</li>
                </ol>
                <br><span style="float:right"> .................................................</span>
                <p style="float:right">Signature</p>
                  
                <!-- <p style="padding-left: 90px;">&nbsp;Date</p> -->
                <p style="padding-left: 75px;"><span style="text-decoration: underline;"><span class="w8qArf">&nbsp; {{ datetodaydata }} </span><span class="LrzXr"> </span></span></p>
                <p style="padding-left: 100px;">Date</p>
                <p><span style="text-decoration: underline;"><span class="w8qArf">&nbsp;</span><span class="LrzXr">65-C Shorthorn St, Project 8, Quezon City</span></span></p>
                <p style="padding-left: 100px;">Place</p>

                <div id="personaldata">
                <strong>PERSONAL DATA</strong>
                  <br> <span style="float:left"> Name: {{ MemberData.FirstName }}  {{ MemberData.LastName }} </span> 
                      <span style="float:right">Civil Status:  {{ MemberData.CivilStatus }} &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span> 
                      <br><span style="float:left"> BirthPlace: {{ MemberData.BirthPlace }} </span> 
                    <span style="float:right"> Date of birth:  {{ MemberData.BirthDate }} &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span> 
                    <br><span style="float:left"> Present Address: {{ MemberData.Address }} </span> 
                  <br><span style="float:left"> Occupation: {{ MemberData.Occupation }} </span> 
                <br><span style="float:left"> Employer or office: {{ MemberData.EmployerCompany }} </span>
                <span style="float:right"> Salary:  {{ MemberData.Salary }} &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span> 
                <br><span style="float:left"> Other sources of income: {{ MemberData.OtherIncome }} </span> 
                <br><span style="float:left"> Nearest relative: {{ MemberData.RelativeName }} </span>
                <span style="float:right"> Relationship: {{ MemberData.Relationship }} &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span> 
                <br><span style="float:left"> Number of Dependents: {{ MemberData.NoDependents }} </span>

                <p>&nbsp;</p>
                <h6 style="text-align: center;">EARN AND SAVE THE COOPERATIVE WAY</h6>
              </div>
            </q-form>
        </div>


    </div>
</template>

<script>
import Vue from 'vue'

import { firebaseDb, firebaseSto, firefirestore } from 'boot/firebase';
import VueQrcode from '@chenfengyuan/vue-qrcode'

Vue.component(VueQrcode.name, VueQrcode);

export default {
    data(){
        return{
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
        }
    },
    props: ['penRegId'],
      firestore () {
        return {
            // Doc
            MemberData: firebaseDb.collection('MemberData').doc(this.penRegId),
            Members: firebaseDb.collection('MemberData'),
            Transactions: firebaseDb.collection('Transactions'),
            Counter: firebaseDb.collection('Counter').doc("v65AIZI2jjNN2jlEv17N"),
        }
      },
    methods: {
      remove(e) {
        //remove unit operator
        this.$firestore.MemberData.update({
          Driver: firefirestore.FieldValue.arrayRemove(e)
        })
      },
      addDriver(){
        var newdriver = this.Driver
        this.$firestore.MemberData.update({
          Driver: firefirestore.FieldValue.arrayUnion(newdriver)
        })
      },
      wala(){
          // GetOperatorUnits(){
          // var OpUnits = []
          // this.MemberData.Unit.forEach(function(munit) {
          //   console.log('MemberDataUnit: ', munit)

          //   OpUnits.push(this.Units.doc(munit))
          // })
          //   console.log('Operator: ', unitopt)
          //   this.Unit.Operator = unitopt
          // },
        //   GetUnitOperator(){
        //   var unitpltno = this.MemberData.Unit[0]
        //   this.Unit.PlateNo = unitpltno
        //   var unitdet
        //   var verified = false
        //   this.Units.forEach(function(e) {
        //         if(e['.key'] == unitpltno){

        //           return unitdet = {
        //             Operator: e.Operator.FirstName +' '+ e.Operator.LastName,
        //             MemberId: e.MemberID
        //           }
        //         }
        //     })
        //     this.Unit.Operator = unitdet.Operator
        //   },
        //   updateUnit(){
        //   //update unit sa driver registration
        //       var newdriver = {
        //       MemberID: 'NGTSC'+ (this.MemberID.MemberID + 1),
        //       FirstName:  this.MemberData.FirstName,
        //       LastName: this.MemberData.LastName
        //     }
          
        //     this.$firestore.Units.doc(this.Unit.PlateNo).update({
        //     Driver: firefirestore.FieldValue.arrayUnion(newdriver)
        //   })
        // },
      },
      GenQr(){
      
      if(this.MemberData.Designation == 'Driver'){
          this.qrvalue = 
            'Driver: ' + this.MemberData['.key'] +' '+ 'Operator: ' + this.MemberData.Operator.MemberID
          
      }else{
        this.qrvalue = 'Operator: ' + this.MemberData['.key']
      }
    
      },
      // updateMemberData () {
      //     this.$firestore.MemberData.set(this.MemberData);
      // },
      //new code
      OrTid(){
        this.Payment.TransactionID = (this.Counter.TransactionID + 1)
        this.Payment.OrNo = (this.Counter.OrNo + 1)
      },
      // PayFee(){
      //   this.Payment.timestamp = firefirestore.FieldValue.serverTimestamp()
      //   this.$firestore.Transactions.doc(this.datetodaydata).collection('Payment').add(this.Payment)

      //   this.$firestore.MemberData.update({
      //           MembershipFee: firefirestore.FieldValue.delete()
      //   })
      // },
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
    Drivers(){
      return this.MemberData.Driver
    }
  }
}
</script>

<style>

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