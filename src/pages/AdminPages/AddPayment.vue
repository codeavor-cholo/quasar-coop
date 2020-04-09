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

                        <q-page-sticky position="top-right" :offset="[18, 18]" >
                            <q-btn fab color="secondary" @click="scanner=!scanner"
                            style="height: 70px; width: 70px;" >QR Scanner </q-btn>
                        </q-page-sticky>
                        <q-btn label="test" @click="test" />
                     </div>

                    <!-- Start of Transaction ID -->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                      <div class="q-pa-xs">
                        <q-input dense color="teal-4" readonly v-model="Payment.TransactionID" label="Transaction ID"/>
                      </div>
                     </div>
                     <!-- End of Transaction ID -->
                     <!-- Start of OR number -->
                   <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                       <div class="q-pa-xs">
                           <q-input
                           dense
                           color="teal-4"
                           v-model="Payment.OrNo"
                           label="Official Reciept Number"
                           readonly
                           mask="###########" />
                       </div>
                   </div>
                    <!-- End of OR number -->
                    <!-- Start of Members ID -->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                      <div class="q-pa-xs">
                        <!-- <q-select
                          color="teal-4"
                          label="Member's ID"
                        >
                          <template class="q-pa-xs" v-slot:append>
                          <q-icon name="perm_identity" />
                          </template>
                        </q-select> -->

                        <q-select
                        dense
                         v-model="Payment.MemberID"
                         clearable
                         use-input
                         hide-selected
                         fill-input
                         input-debounce="0"
                         label="Member's ID"
                         emit-value
                         map-options
                         :options="membersIdOpt"
                         @filter="filterFn"
                         @input="onSelectMemberId"
                       >
                         <template v-slot:no-option>
                           <q-item>
                             <q-item-section class="text-grey">
                               No members found
                             </q-item-section>
                           </q-item>
                         </template>

                         <template v-slot:option="scope">
                            <q-item
                              v-bind="scope.itemProps"
                              v-on="scope.itemEvents"
                            >
                              <q-item-section>
                                <q-item-label v-html="scope.opt.label" />
                                <q-item-label caption>{{ scope.opt.fullName }}</q-item-label>
                              </q-item-section>
                            </q-item>
                          </template>
                       </q-select>
                      </div>
                     </div>

                     <!-- End of Members ID -->
                     <!-- Start of Members Name -->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div class="q-pa-xs">
                          <q-input dense readonly color="teal-4" v-model="MemberDetails.FullName" label="Member name" />
                        </div>
                     </div>
                     <!-- End of Members Name -->
                     <!-- Start of Designation-->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div class="q-pa-xs">
                          <q-input dense readonly color="teal-4" v-model="MemberDetails.Designation" label="Designation" />
                        </div>
                     </div>
                     <!-- End of Designation -->

                     <!-- Start of Operator -->
                    <div v-if="MemberDetails.Designation === 'Driver'" class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div class="q-pa-xs">
                          <q-input dense readonly color="teal-4" v-model="MemberDetails.Operator.FullName" label="Operator" />
                        </div>
                     </div>
                     <!-- End of Operator -->


                     <!-- if designation is Operator -->
                     <!-- start of Driver List -->
                     <div v-if="MemberDetails.Designation === 'Operator'" class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                       <div class="q-pa-xs">
                         <q-select
                          v-model="DriverList"
                          :options="optionsToReturn"
                          label="Driver List"
                          multiple
                          emit-value
                          map-options
                          @input="computeShareCapitalTotal"
                        >

                          <template v-slot:no-option>
                            <q-item>
                              <q-item-section class="text-grey">
                                Empty drivers
                              </q-item-section>
                            </q-item>
                          </template>

                          <template v-slot:option="scope">
                            <q-item
                              v-bind="scope.itemProps"
                              v-on="scope.itemEvents"
                            >
                              <q-item-section avatar>
                                <!-- <q-toggle v-model="DriverList" :val="scope.opt.value" /> -->
                                <q-checkbox v-model="DriverList" :val="scope.opt.value" />
                              </q-item-section>
                              <q-item-section>
                                <q-item-label v-html="scope.opt.label" ></q-item-label>
                              </q-item-section>

                            </q-item>
                          </template>
                        </q-select>
                       </div>
                      </div>

                     <!-- end of Driver List -->

                     <!-- Start of Membership Fee -->
                     <div  class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                       <q-separator inset spaced> </q-separator>
                       <span class="text-bold text-uppercase text-teal-4">Fees</span>
                       <q-checkbox v-if="MemberDetails.isNewMember" label="Pay membership fee only" v-model="isPayonlyMembership" @input="onPayonlyMembership"/>
                       <div v-if="MemberDetails.isNewMember" class="q-pa-xs">
                         <!-- <q-input prefix="₱" dense color="teal-4" readonly type="number" v-model="Payment.MembershipFee" label="Membership Fee" mask="######" /> -->

                         <q-field
                            dense
                            readonly
                            prefix="₱ "
                            v-model="Payment.MembershipFee"
                            label="Membership Fee"
                           >
                             <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                               <input readonly :id="id" class="q-field__input text-left" :value="value" @change="e => emitValue(e.target.value)" v-money="moneyFormatForDirective" v-show="floatingLabel">
                             </template>
                           </q-field>
                       </div>
                     </div>
                     <!-- End of Membership Fee -->

                     <div v-if="!isPayonlyMembership" class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                       <!-- Start of Management Fee -->
                       <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                         <div class="q-pa-xs">
                           <!-- <q-input prefix="₱" dense color="teal-4" readonly type="number" v-model="Payment.ManagementFee" label="Management Fee" mask="######" /> -->

                           <q-field
                              dense
                              readonly
                              prefix="₱ "
                              v-model="Payment.ManagementFee"
                              label="Management Fee"
                             >
                             <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                               <input readonly :id="id" class="q-field__input text-left" :value="value" @change="e => emitValue(e.target.value)" v-money="moneyFormatForDirective" v-show="floatingLabel">
                             </template>
                           </q-field>


                         </div>
                       </div>
                       <!-- End of Management Fee -->
                       <!-- Start of Share of Stocks -->
                       <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                         <div class="q-pa-xs">
                           <!-- <q-input prefix="₱" dense color="teal-4" type="number" v-model="Payment.ShareCapital" label="Share of Stocks" mask="######" /> -->



                           <q-field
                              dense
                              prefix="₱ "
                              v-model="Payment.ShareCapital"
                              label="Share of Stocks"
                             >
                               <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                                 <input :id="id" class="q-field__input text-left" :value="value" @change="e => emitValue(e.target.value)" v-money="moneyFormatForDirective" v-show="floatingLabel">
                               </template>
                             </q-field>
                         </div>
                       </div>
                       <!-- End of Share of Stocks -->
                        <!-- Start of Savings Deposit -->
                       <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                         <div class="q-pa-xs">
                           <!-- <q-input prefix="₱" dense color="teal-4" type="number" v-model="Payment.SavingsDeposit" label="Savings Deposit" mask="######" /> -->

                           <q-field
                              dense
                              prefix="₱ "
                              v-model="Payment.SavingsDeposit"
                              label="Savings Deposit"
                             >
                               <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                                 <input :id="id" class="q-field__input text-left" :value="value" @change="e => emitValue(e.target.value)" v-money="moneyFormatForDirective" v-show="floatingLabel">
                               </template>
                             </q-field>
                         </div>
                       </div>
                       <!-- End of Savings Deposit -->

                        <!-- Start of Advances -->
                       <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-mt-sm">
                         <div class="q-pa-xs">
                           <!-- <q-input prefix="₱" dense color="teal-4" type="number" v-model="Payment.Advances" label="Advances to Members" mask="######" /> -->

                           <q-field
                              dense
                              prefix="₱ "
                              v-model="Payment.Advances"
                              label="Advances to Member"
                             >
                               <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                                 <input :id="id" class="q-field__input text-left" :value="value" @change="e => emitValue(e.target.value)" v-money="moneyFormatForDirective" v-show="floatingLabel">
                               </template>
                             </q-field>
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
                           <q-input dense color="teal-4" v-model="Payment.OtherDes" label="Description" autogrow/>
                           <!-- <q-input prefix="₱" dense color="teal-4" v-model="Payment.Others" label="Amount"/> -->

                           <q-field
                            dense
                            prefix="₱ "
                            v-model="Payment.Others"
                            label="Amount"
                           >
                             <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                               <input :id="id" class="q-field__input text-left" :value="value" @change="e => emitValue(e.target.value)" v-money="moneyFormatForDirective" v-show="floatingLabel">
                             </template>
                           </q-field>
                        </div>
                      </div>
                      <!-- End of Description -->

                       <!-- Start of Amount-->
                      <!-- <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div class="q-pa-xs">
                          <span class="text-white">Others</span>
                          <q-input dense color="teal-4" v-model="Payment.Others" label="Amount" mask="₱ ###########" />
                        </div>
                      </div> -->
                      <!-- End of Amount -->
                     </div>



                    <q-separator inset spaced> </q-separator>
                    <!-- Start of Amount Paid-->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-mt-sm">
                        <div class="q-pa-xs">
                        <!-- <q-input prefix="₱" dense color="teal-4" v-model="AmountPaid" label="Amount Paid"> -->
                          <!-- <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                            <money :id="id" class="q-field__input text-right" :value="value" @input="emitValue" v-bind="moneyFormatForComponent" v-show="floatingLabel" />
                          </template> -->
                        <!-- </q-input> -->



                          <q-field
                            dense
                            prefix="₱ "
                            v-model="AmountPaid"
                            label="Amount Paid"
                          >
                            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                              <input :id="id" class="q-field__input text-left" :value="value" @change="e => emitValue(e.target.value)" v-money="moneyFormatForDirective" v-show="floatingLabel">
                            </template>
                          </q-field>
                        </div>
                    </div>
                    <!-- End of Amount Paid-->

                    <!-- Start of Total Amount -->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-mt-sm">
                        <div class="q-pa-xs">
                        <!-- <q-input prefix="₱" dense color="teal-4" v-model="Total" label="Total Amount" /> -->

                        <q-field
                           dense
                           readonly
                           prefix="₱ "
                           v-model="TotalAmount"
                           label="Total Amount"
                        >
                          <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                            <input :id="id" class="q-field__input text-left" :value="value" @change="e => emitValue(e.target.value)" v-money="moneyFormatForDirective" v-show="floatingLabel">
                          </template>
                        </q-field>

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
                      <q-input color="teal-4" v-model="Payment1.ShareCapital" label="Share of Stocks" fill-mask="#" mask="###,###" />
                    </div>
                  </div>
                    <!-- End of Share of Stocks -->
                     <!-- Start of Savings Deposit -->
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <span class="text-white">ABC</span>
                    <div class="q-pa-xs">
                      <q-input color="teal-4" v-model="Payment1.SavingsDeposit" label="Savings Deposit" mask="###,###" />
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
                            <span>asdfasdf</span>
                            <q-input readonly color="teal-4" v-model="Payment1.Total" label="Total Amount" hint="Mask: $ #,###.00 #">
                              <!-- <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                                <money :id="id" class="q-field__input text-right" :value="value" @input="emitValue" v-bind="moneyFormatForComponent" v-show="floatingLabel" />
                              </template> -->
                            </q-input>
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
import money from 'v-money'
import { mapGetters } from 'vuex'
import VueQrcodeReader from "vue-qrcode-reader";

Vue.use(money, {precision: 4})


Vue.use(VueQrcodeReader);

export default {
    data () {
      return {
        page: 1,
        scanner: false,
        Payment: {
          MemberID: '',
          OrNo: '',
          TransactionID: '',
          ShareCapital: 30,
          MembershipFee: 500,
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
        alone: false,
        AmountPaid: 0,
        membersIdOpt: Object.freeze(this.membersIdOptions),
        MemberDetails: {
          FullName: '',
          Designation: '',
          isNewMember: false,
          Operator: {
            MemberID: '',
            FullName: ''
          }
        },
        DriverList: [],
        isPayonlyMembership: false,
        moneyFormatForDirective: {
          decimal: '.',
          thousands: ',',
          precision: 0,
          masked: false
        },
        optionsToReturn: []
      }
    },
    firestore () {
      return {
        // Doc
        // Transactions: firebaseDb.collection('Transactions').doc('2020-04-07').collection('Payment'),
        lastTransaction: {
          ref: firebaseDb.collection('Transactions').orderBy('timestamp', 'desc').limit(1),
          objects: false,
          resolve: (data) => {
            if (data.length != 0) {
              // has data
              this.Payment.TransactionID = ++data[0].TransactionID
              this.Payment.OrNo = ++data[0].OrNo
            } else {
              // empty Transactions
              var transacIdFormat = 100000
              var ORFormat = 1000000
              this.Payment.TransactionID = transacIdFormat
              this.Payment.OrNo = ORFormat
            }
          },
          reject: (err) => {
            console.log(err)
          }
        },
        // Counter: firebaseDb.collection('Counter').doc("v65AIZI2jjNN2jlEv17N"),
        MemberData: firebaseDb.collection('MemberData'),
        testData: firebaseDb.collection('MemberData').where('Designation', '==', 'Driver')
      }
    },
    methods: {
      async test () {
        var a = parseInt(this.Payment.SavingsDeposit.replace(/\,/g,''))
        console.log(this.currencyToNumber('200,000'))
        // let drivers = await this.getDrivers('NGTSC2020012')
      },
      computeShareCapitalTotal (val) {
        console.log(val, 'drivers')
        let ShareCapitalBaseFee = this.getShareCapitalBaseFee

        // number of driver * ShareOfStock + operator SC
        this.Payment.ShareCapital = (ShareCapitalBaseFee * val.length) + 30
      },
      OperatorDriverListOpt () {
        if (this.MemberDetails.Designation === 'Operator') {
          console.log(this.Payment.MemberID)
          console.log('is operator')
          let options = []
          this.getDrivers(this.Payment.MemberID).then((drivers) => {
            console.log(drivers, 'drivers')
            let opts = drivers.map(d => {
              return {
                label: d.LastName + ', ' + d.FirstName,
                value: d.MemberID
              }
            })
            this.optionsToReturn = opts
          })
          console.log(options, 'options t oreturn')
        }
      },
      getDrivers (memberID) {
        return new Promise((resolve, reject) => {
          let datas = []
          let query = firebaseDb.collection('MemberData').where('Designation', '==', 'Driver').where('Operator.MemberID', '==', memberID)
          query.get().then(snapshot => {
            snapshot.forEach(doc => {
              console.log(doc.id, 'id in doc')
              var passthis = {
                MemberID: doc.id,
                ...doc.data()
              }
              console.log(passthis, 'passthis')
              datas.push(passthis)
            })
            resolve(datas)
          }).catch(err => {
            reject(err)
          })
        })
      },
      onPayonlyMembership (val) {
        if (val) {
          this.Payment.ShareCapital = 0
          this.Payment.ManagementFee = 0
          this.Payment.Advances = 0
          this.Payment.SavingsDeposit = 0
          this.Payment.Others = 0
        } else {
          this.Payment.ShareCapital = 30
          this.Payment.ManagementFee = 15
          this.Payment.Advances = 0
          this.Payment.SavingsDeposit = 0
          this.Payment.Others = 0
        }
      },
      onSelectMemberId (val) {
        let member = this.MemberData.filter(d => {
          return d['.key'] === val
        })[0]
        this.MemberDetails.FullName = member.LastName + ', ' + member.FirstName
        this.MemberDetails.Designation = member.Designation
        this.MemberDetails.isNewMember = member.isNewMember

        // if member is new member
        if (!member.isNewMember) {
          this.Payment.MembershipFee = 0
        } else {
          this.Payment.MembershipFee = 500
        }

        // if designation is operator or driver
        if (this.MemberDetails.Designation === 'Operator') {
          this.Payment.ManagementFee = 65
          this.OperatorDriverListOpt()
        } else {
          this.Payment.ManagementFee = 15
          this.MemberDetails.Operator = member.Operator

        }
      },
      filterFn (val, update, abort) {
        // call abort() at any time if you can't retrieve data somehow
        update(() => {
          if (val == '') {
            this.membersIdOpt = this.membersIdOptions
          } else {
            const needle = val.toLowerCase()
            this.membersIdOpt = this.membersIdOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
          }
       })
      },
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

      PayFeeOperator () {
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
      PayFeeDriver () {
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
        } else {
            this.alone = true
            this.page = 2
            this.Payment1.OrNo = (this.Counter.OrNo + 1),
            this.Payment1.TransactionID = (this.Counter.TransactionID + 1)
            this.Payment1.MemberID = decodedString.substring(10,23)

            console.log(decodedString)
            this.scanner = false
        }
      },
      datetoday () {
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
      // this.$binding('Transactions', firebaseDb.collection('Transactions').doc('2020-04-07').collection('Payment'))
      //   .then((doc) => {
      //     console.log(doc, 'doc')
      //   })
    },
    computed: {
      ...mapGetters('subModules', ['currencyToNumber']),
      getShareCapitalBaseFee () {
        // must be dynamic comming thru the settings of admin
        return 30
      },
      getDateToday () {
        var myDate = new Date()
        var month = ('0' + (myDate.getMonth() + 1)).slice(-2)
        var date = ('0' + myDate.getDate()).slice(-2)
        var year = myDate.getFullYear()
        var formattedDate = year + '-' + month + '-' + date
        return formattedDate
      },
      membersIdOptions () {
        let opt = this.MemberData.map(d => {
          return {
            label: d['.key'],
            value: d['.key'],
            fullName: d.LastName + ', ' + d.FirstName
          }
        })
        return opt
        // Object.freeze(options)
      },
      TotalAmount: {
        get () {
          return this.Payment.Total
        },
        set (val) {
          this.Payment.Total = (
            this.currencyToNumber(this.Payment.MembershipFee) +
            this.currencyToNumber(this.Payment.ManagementFee) +
            this.currencyToNumber(this.Payment.ShareCapital) +
            this.currencyToNumber(this.Payment.Advances) +
            this.currencyToNumber(this.Payment.SavingsDeposit) +
            this.currencyToNumber(this.Payment.Others)
          )
        }
      },
      Total1 () {
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
