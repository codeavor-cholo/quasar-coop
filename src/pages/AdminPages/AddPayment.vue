<template>
    <div>
      <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4">Payment <q-icon name="mdi-arrow-right-box" /> Add Payment</h6>
       <q-separator />
       <div class="q-pa-md">
           <q-card class="q-pa-lg">
               <div class="text-uppercase text-teal-4">Daily Payments</div>
          <q-card-section v-show="page == 1" class="page-1" >
                 <div class="row">
                     <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div class="q-pa-xs" v-if="scanner" style="height: 150px; width:150px;">
                            <qrcode-stream @decode="onDecode"></qrcode-stream>
                        </div>

                        <q-page-sticky position="top-left" :offset="[18, 18]" >
                            <q-btn fab color="secondary" @click="scanner=!scanner"
                            style="height: 100px; width:100px;">QR Scanner </q-btn>
                        </q-page-sticky>
                        
                     </div>

                    <!-- Start of Transaction ID -->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div class="q-pa-xs">
                            <q-input color="teal-4" readonly v-model="Payment.TransactionID" label="Transaction ID"/>
                        </div>
                     </div>
                     <!-- End of Transaction ID -->
                    <!-- Start of Members ID -->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div class="q-pa-xs">
                                <q-select
                                    color="teal-4"
                                    
                                    label="Member's ID"
                                >
                                    <template class="q-pa-xs" v-slot:append>
                                    <q-icon name="perm_identity" />
                                    </template>
                                </q-select>
                        </div>
                     </div>
                     <!-- End of Members ID -->
                     <!-- Start of Members Name -->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div class="q-pa-xs">
                            <q-input color="teal-4" v-model="DriverName" label="Members name" />
                        </div>
                     </div>
                     <!-- End of Members Name -->
                      <!-- Start of OR number -->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div class="q-pa-xs">
                            <q-input 
                            color="teal-4" 
                            v-model="Payment.OrNo" 
                            label="Official Reciept Number" 
                            readonly
                            mask="###########" />
                        </div>
                     </div>
                     <!-- End of OR number -->
                    <!-- Start of Management Fee -->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <span class="text-uppercase text-teal-4">Fees</span>
                        <div class="q-pa-xs">
                            <q-input color="teal-4" readonly type="number" v-model="Payment.ManagementFee" label="Management Fee" mask="######" />
                        </div>
                    </div>
                    <!-- End of Management Fee -->
                    <!-- Start of Share of Stocks -->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <span class="text-white">ABC</span>
                    <div class="q-pa-xs">
                      <q-input color="teal-4" type="number" v-model="Payment.ShareCapital" label="Share of Stocks" mask="######" />
                    </div>
                      </div>
                    <!-- End of Share of Stocks -->
                     <!-- Start of Savings Deposit -->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <span class="text-white">ABC</span>
                    <div class="q-pa-xs">
                      <q-input color="teal-4" type="number" v-model="Payment.SavingsDeposit" label="Savings Deposit" mask="######" />
                    </div>
                  </div>
                    <!-- End of Savings Deposit -->
              
                     <!-- Start of Advances -->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-mt-sm">
                        <div class="q-pa-xs">
                            <q-input color="teal-4" type="number" v-model="Payment.Advances" label="Advances to Members" mask="######" />
                        </div>
                    </div>
                    <!-- End of Advances -->
                          <!-- Start of Accounts Recievable -->
                    
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-mt-sm">
                        <div class="q-pa-xs">
                            <!-- <q-input color="teal-4" v-model="accountsrecievable" label="Accounts Recievable" mask="######" /> -->
                        </div>
                    </div>
                    <!-- End of Accounts Recievable -->
                    <!-- Start of Date -->
                        <!-- <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-mt-sm">
                            <div class=" q-pa-xs">
                            <q-input color="teal-4" label="Year/Month/Date" v-model="paymentdate" mask="date" hint="Date" :rules="['date']">
                                <template class="q-pa-none q-md-none" v-slot:before>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy
                                    ref="qDateProxy"
                                    transition-show="scale"
                                    transition-hide="scale"
                                    >
                                    <q-date v-model="date" @input="() => $refs.qDateProxy.hide()" />
                                    </q-popup-proxy>
                                </q-icon>
                                </template>
                            </q-input>
                            </div>
                        </div> -->
                    <!-- End of Date -->
                     <!-- Start of Description-->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div class="q-pa-xs">
                             <span class="text-uppercase text-teal-4">Others</span>
                             <q-input color="teal-4" v-model="Payment.OtherDes" label="Description" autogrow/>
                        </div>
                    </div>
                    <!-- End of Description -->
                     <!-- Start of Amount-->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div class="q-pa-xs">
                             <span class="text-white">Others</span>
                            <q-input color="teal-4" v-model="Payment.Others" label="Amount" mask="₱ ###########" />
                        </div>
                     </div>
                     

                      <!-- Start of Total Amount -->
                        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-mt-sm">
                              <div class="q-pa-xs">
                                <q-input color="teal-4" v-model="Total" label="Total Amount"/>
                              </div>
                        </div>
                    <!-- End of Total Amount -->
                    


                     <!-- Start of Blank Space -->
                      <div class="q-mb-lg q-pb-lg">
                        <div class="q-pa-md"></div>
                      </div>
                      <!-- End of Blank Space -->
                     <!-- Start of Add Payment button -->
                    
                     <!-- End of Add Payment button -->
                
                  <div class="absolute-bottom-right">
                        <div class="q-mt-lg">
                            <!-- <q-btn class="text-pink-4" icon-right="check" label="Add Payment" color="white" @click="PayFee"/> -->
                            <q-btn class="text-teal-4" 
                            icon-right="mdi-arrow-right-thick" 
                            label="Next" 
                            color="white" 
                            @click="page = 2"
                            v-if="alone"
                            />

                        <q-btn class="text-teal-4" icon-right="check" label="Add Payment" color="white" @click="PayFeeDriver"/>
                        </div>
                 </div>
                </div>
          </q-card-section>


          <q-card-section  v-show="page == 2" class="page-2" >
            <!-- <div v-if="Payment1.MemberID != ''" class="full-width"> -->
            <div class="row">
                     <!-- Start of Transaction ID -->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div class="q-pa-xs">
                            <q-input color="teal-4" v-model="Payment1.TransactionID" label="Transaction ID"/>
                        </div>
                     </div>
                     <!-- End of Transaction ID -->
                    <!-- Start of Members ID -->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div class="q-pa-xs">
                                <q-select
                                    color="teal-4"
                                    v-model="Payment1.MemberID"
                                    label="Member's ID"
                                >
                                    <template class="q-pa-xs" v-slot:append>
                                    <q-icon name="perm_identity" />
                                    </template>
                                </q-select>
                        </div>
                     </div>
                     <!-- End of Members ID -->
                     <!-- Start of Members Name -->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div class="q-pa-xs">
                            <q-input color="teal-4" v-model="OperatorName" label="Members name" />
                        </div>
                     </div>
                     <!-- End of Members Name -->
                      <!-- Start of OR number -->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div class="q-pa-xs">
                            <q-input color="teal-4" v-model="Payment1.OrNo" label="Official Reciept Number"/>
                        </div>
                     </div>
                     <!-- End of OR number -->
                    <!-- Start of Management Fee -->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <span class="text-uppercase text-teal-4">Fees</span>
                        <div class="q-pa-xs">
                            <q-input color="teal-4" v-model="Payment1.ManagementFee" label="Management Fee" mask="######" />
                        </div>
                    </div>
                    <!-- End of Management Fee -->
                    <!-- Start of Share of Stocks -->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <span class="text-white">ABC</span>
                    <div class="q-pa-xs">
                      <q-input color="teal-4" v-model="Payment1.ShareCapital" label="Share of Stocks" mask="######" />
                    </div>
                  </div>
                    <!-- End of Share of Stocks -->
                     <!-- Start of Savings Deposit -->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <span class="text-white">ABC</span>
                    <div class="q-pa-xs">
                      <q-input color="teal-4" v-model="Payment1.SavingsDeposit" label="Savings Deposit" mask="######" />
                    </div>
                  </div>
                    <!-- End of Savings Deposit -->
                     <!-- Start of Advances -->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-mt-md">
                        <div class="q-pa-xs q-mt-xs">
                            <q-input color="teal-4" v-model="Payment1.Advances" label="Advances" mask="######" />
                        </div>
                    </div>
                    <!-- End of Advances -->

                     <!-- <div class="q-mb-lg q-pb-lg">
                        <div class="q-pa-xs"></div>
                      </div> -->
                     <!-- Start of Description-->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div class="q-pa-xs">
                             <span class="text-uppercase text-teal-4">Others</span>
                             <q-input color="teal-4" v-model="Payment1.OtherDes" label="Description" autogrow/>
                        </div>
                    </div>
                    <!-- End of Description -->
                     <!-- Start of Amount-->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div class="q-pa-xs">
                             <span class="text-white">Others</span>
                            <q-input color="teal-4" v-model="Payment1.Others" label="Amount" mask="₱ ###########" />
                        </div>
                     </div>
                     

                      <!-- Start of Total Amount -->
                        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-mt-sm">
                              <div class="q-pa-xs">
                                <q-input color="teal-4" v-model="Payment1.Total" label="Total Amount"/>
                              </div>
                        </div>
                    <!-- End of Total Amount -->
                                        <!-- Start of Blank Space -->
                      <div class="q-mb-lg q-pb-lg">
                        <div class="q-pa-md"></div>
                      </div>
                      <!-- End of Blank Space -->
                    <div class="absolute-bottom-right">
                        <div class="q-mt-lg">
                            <q-btn class="text-teal-4 q-mr-md" icon="mdi-arrow-left-thick" label="Back" color="white" @click="page = 1"/>
                              <q-btn class="text-teal-4" icon-right="check" label="Add Payment" color="white" @click="PayFeeOperator"/>
                    </div>
                 </div>
                </div>     
                     <!-- End of Amount -->
          </q-card-section>


          </q-card>
       </div>
    </div>
</template>

<script>
import { firebaseDb, firebaseSto, firefirestore, Auth2 } from 'boot/firebase';

import Vue from "vue";
import VueQrcodeReader from "vue-qrcode-reader";

Vue.use(VueQrcodeReader);


export default {
    data(){
        return{
            page: 1,
            scanner: false,
            Payment: {
              MemberID: '',
              OrNo: '',
              TransactionID: '',
              ShareCapital: 30,
              ManagementFee: 15,
              Advances: 0,
              SavingsDeposit: 0,
              Others: 0,
              OthersDes: '',
              Total: 0,
              timestamp: ''
            },
            Payment1: {
              MemberID: '',
              OrNo: '',
              TransactionID: '',
              ShareCapital: 30,
              ManagementFee: 65,
              Advances: 0,
              SavingsDeposit: 0,
              Others: 0,
              OthersDes: 0,
              Total: 0,
              timestamp: ''
            },
            DriverName: '',
            OperatorName: '',
            alone: false

        }
    },
    firestore () {
        return {
            // Doc
            Transactions: firebaseDb.collection('Transactions'),
            Counter: firebaseDb.collection('Counter').doc("v65AIZI2jjNN2jlEv17N"),
            MemberData: firebaseDb.collection('MemberData')
        }
    },
    methods: {
        // GetDriverName(){
        //     var mystring = this.Payment.MemberID
        //     mystring = mystring.replace('0','0');
        //     console.log(mystring)
        //     this.$firestore.MemberData.doc(mystring)
        //     .get().then(function(doc) {
        //     if (doc.exists) {
        //         console.log("Document data:", doc.data());
        //     } else {
        //         // doc.data() will be undefined in this case
        //         console.log("No such document!");
        //     }
        // }).catch(function(error) {
        //     console.log("Error getting document:", error);
        // });
        // },

        PayFeeOperator(){
        this.Payment1.timestamp = firefirestore.FieldValue.serverTimestamp()
        var payment = {
              MemberID: this.Payment1.MemberID,
              OrNo: this.Payment1.OrNo,
              TransactionID: this.Payment1.TransactionID,
              ShareCapital: Number(this.Payment1.ShareCapital),
              ManagementFee: Number(this.Payment1.ManagementFee),
              Advances: Number(this.Payment1.Advances),
              SavingsDeposit: Number(this.Payment1.SavingsDeposit),
              Others: Number(this.Payment1.Others),
              OthersDes: this.Payment1.OthersDes,
              Total: this.Total,
              timestamp: this.Payment1.timestamp
        }
        this.$firestore.Transactions.doc(this.datetodaydata.toString()).collection('Payment').doc().set(payment)
        .then(() => {
            const increment = firefirestore.FieldValue.increment(1)
            this.$firestore.Counter.update({ TransactionID: increment })
            .then(() => {
                 this.$firestore.Counter.update({ OrNo: increment })
                 .then(()=>{
                     console.log('Counter Incremented')
                 })
            })
        })
        },
        PayFeeDriver(){
        this.Payment.timestamp = firefirestore.FieldValue.serverTimestamp()
        var payment = {
              MemberID: this.Payment.MemberID,
              OrNo: this.Payment.OrNo,
              TransactionID: this.Payment.TransactionID,
              ShareCapital: Number(this.Payment.ShareCapital),
              ManagementFee: Number(this.Payment.ManagementFee),
              Advances: Number(this.Payment.Advances),
              SavingsDeposit: Number(this.Payment.SavingsDeposit),
              Others: Number(this.Payment.Others),
              OthersDes: this.Payment.OthersDes,
              Total: this.Total1,
              timestamp: this.Payment.timestamp
        }
        this.$firestore.Transactions.doc(this.datetodaydata.toString()).collection('Payment').doc().set(payment)
        .then(() => {
            const increment = firefirestore.FieldValue.increment(1)
            this.$firestore.Counter.update({ TransactionID: increment })
            .then(() => {
                 console.log('Counter Incremented')
            })
        })
        },
        onDecode (decodedString) {
            if(decodedString.substring(0,1) == 'D'){
                this.alone = false
                this.Payment.OrNo = (this.Counter.OrNo + 1),
                this.Payment.TransactionID = (this.Counter.TransactionID + 1)
                this.Payment.MemberID = decodedString.substring(8,21)
                
                this.Payment1.OrNo = (this.Counter.OrNo + 2),
                this.Payment1.TransactionID = (this.Counter.TransactionID + 2)
                this.Payment1.MemberID= decodedString.substring(31, 44)

                console.log(decodedString)
                this.scanner = false
            }else{
                this.alone = true
                this.page = 2
                this.Payment1.OrNo = (this.Counter.OrNo + 1),
                this.Payment1.TransactionID = (this.Counter.TransactionID + 1)
                this.Payment1.MemberID = decodedString.substring(10,23)
                
                console.log(decodedString)
                this.scanner = false
            }
        },
        datetoday(){
        var myDate = new Date();
        var month = ('0' + (myDate.getMonth() + 1)).slice(-2);
        var date = ('0' + myDate.getDate()).slice(-2);
        var year = myDate.getFullYear();
        var formattedDate = year + '-' + month + '-' + date;
        this.datetodaydata = formattedDate;
        }   
    },
    mounted () {
        this.datetoday()
    },
    computed: {
        Total(){
            return (parseInt(this.Payment.ManagementFee) + 
            parseInt(this.Payment.ShareCapital) + 
            parseInt(this.Payment.Advances) + 
            parseInt(this.Payment.SavingsDeposit) + 
            parseInt(this.Payment.Others))
        },
        Total1(){
            return (parseInt(this.Payment1.ManagementFee) + 
            parseInt(this.Payment1.ShareCapital) + 
            parseInt(this.Payment1.Advances) + 
            parseInt(this.Payment1.SavingsDeposit) + 
            parseInt(this.Payment1.Others))
        }
    },
    created() {
    //since 0 is considered false it will put an empty string in case priceFromDB is 0
    // this.Payment.ManagementFee = 0 || ''
    //  this.Payment.ShareCapital = 0 || ''
    //   this.Payment.Advances = 0 || ''
    //    this.Payment.SavingsDeposit = 0 || ''
    //     this.Payment.Others = 0 || ''
  }
    
}
</script>

<style scoped>
.q-field--focused, .q-field--standard, .q-field--float{
    color: teal;
}
</style>