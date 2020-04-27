<template>
    <q-page>
      <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4">Payment <q-icon name="mdi-arrow-right-box" /> Add Payment</h6>
       <q-separator />
    <q-stepper
        v-model="step"
        color="teal-4"
        animated
        ref="stepper"
        class="q-pa-none"
        active-color="teal-4"
        flat=""
    >
        <q-step
        :name="1"
        title="Select Member"
        icon="person"
        :done="step > 1"
        >

        <div class="row">
            <div class="col q-pa-md q-gutter-md text-center">
                <div class="text-h6 q-pb-md">Search Member</div>
                <q-select 
                    v-model="model" 
                    :options="membersIdOpt" 
                    label="Search Member" 
                    filled 
                    input-debounce="0"
                    use-input
                    color="grey-10"
                    use-chips
                    clearable=""
                    @new-value="createValue"
                    @filter="filterFn"
                    @input="changeMemberDetails"
                    @clear="removeMemberDetails"
                >
                    <template v-slot:selected-item="scope">
                        <q-chip
                            dense
                            :tabindex="scope.tabindex"
                            color="white"
                            text-color="secondary"
                            class="q-ma-none"
                        >
                            {{ scope.opt.label }}
                        </q-chip>
                    </template>
                </q-select>
                <div class="text-center text-h6">OR</div>
                <q-btn color="grey-10" icon="center_focus_weak" label="scan qr" size="lg" @click="onClick" />
            </div>
            <q-separator vertical/>
            <div class="col-4 q-pa-md q-gutter-md">
                <div class="text-h6">Member Details</div>
                <q-list>
                    <q-item v-if="MDetails.memberID == ''">
                        <q-item-section>
                            <q-banner class="bg-warning text-white">
                                <q-icon name="warning" /> Please select a member.
                            </q-banner>                  
                        </q-item-section>
                    </q-item>
                    <div v-else>
                        <q-item>
                            <q-item-section>
                                <q-item-label caption lines="2">Member ID</q-item-label>
                                <q-item-label>{{MDetails.memberID}}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-separator spaced inset />
                        <q-item>
                            <q-item-section avatar>
                            <q-avatar color="teal" text-color="white">{{MDetails.memberName.charAt(0).toUpperCase()}}</q-avatar>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label class="text-capitalize">{{MDetails.memberName}}</q-item-label>
                                <q-item-label caption lines="2">{{MDetails.memberDesignation}}</q-item-label>
                            </q-item-section>
                            <q-item-section side v-show="MDetails.isNewMember">
                             <q-item-label class="row" caption><q-icon name="star" color="amber"/> NEW MEMBER</q-item-label>
                            </q-item-section>
                        </q-item>
                    </div>
                </q-list>
                <div class="text-h6">Transaction Details</div>
                <q-list>
                    <q-item>
                        <q-item-section>
                            <q-item-label caption lines="2">Transaction ID</q-item-label>
                            <q-item-label>100046</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-separator spaced inset />
                    <q-item>
                        <q-item-section>
                            <q-item-label caption lines="2">Reciept ID</q-item-label>
                            <q-item-label>1000024</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </div>
        </div>

        <q-stepper-navigation class="text-right">
            <q-btn @click="step = 2" color="grey-10" label="Continue" :disable="MDetails.memberID == ''"/>
        </q-stepper-navigation>
        </q-step>

        <q-step
        :name="2"
        title="Payment Details"
        icon="payment"
        :done="step > 2"
        >
        <div class="row">
            <div class="col-4 q-px-md q-gutter-md">
                <div class="text-overline text-capitalize">PAYMENT ({{MDetails.memberName}}) - <span class="text-uppercase text-teal">{{MDetails.memberDesignation}}</span>  </div>
                <q-input v-model="membershipFee" readonly="" type="number" prefix="₱" label="Membership Fee" outlined="" color="teal" v-if="MDetails.isNewMember == true"/>
                <div class="q-gutter-md" v-else>
                    <q-input v-model="mf1" type="number" prefix="₱" label="Management Fee" outlined="" color="teal" clearable @clear="mf1 = 0" />
                    <q-input v-model="ss1" type="number" prefix="₱" label="Share of Stocks" outlined="" color="teal" clearable @clear="ss1 = 0" />
                    <q-input v-model="sd1" type="number" prefix="₱" label="Savings Deposit" outlined="" color="teal" clearable @clear="sd1 = 0"/>
                    <div class="text-overline"><q-checkbox v-model="showOther1" dense="" class="q-mr-sm"/> OTHERS</div>
                    <q-input v-model="otherDescription1" type="text" label="Description" outlined="" color="teal" clearable @clear="otherDescription1 = ''" v-show="showOther1"/>
                    <q-input v-model="other1" type="number" prefix="₱" label="Amount" outlined="" color="teal" clearable @clear="other1 = 0" v-show="showOther1"/>
                    <div class="text-overline" v-show="hasCA"><q-checkbox v-model="showCA" dense="" class="q-mr-sm" /> CASH ADVANCE</div> 
                    <q-banner class="bg-info text-white" v-show="hasCA">
                        <q-icon name="info" /> You have ₱ {{returnSelectedMember.Advances}}.00 cash advance to pay.
                    </q-banner>                     
                    <q-input v-model="ca" type="number" prefix="₱" label="Amount" outlined="" color="teal" :max="returnSelectedMember != {} ? returnSelectedMember.Advances : 0" clearable @clear="ca = 0" v-show="showCA"/>
                </div>
            </div>
            <div class="col-4 q-px-md q-gutter-md" v-show="ifDriver == true && MDetails.isNewMember == false">
                <div class="text-overline"><q-checkbox v-model="operator" dense="" class="q-mr-sm"/> 
                <span v-if="operator == true" class="text-capitalize">PAYMENT ({{driverOperator.FirstName+' '+driverOperator.LastName}}) - <span class="text-uppercase text-teal">OPERATOR</span></span> 
                <span v-else>Do you want to include the OPERATOR's payment in this transaction?</span>
                
                </div>
                <div v-show="operator" class="q-gutter-md">
                    <q-input v-model="mf2" type="number" prefix="₱" label="Management Fee" outlined="" color="teal" clearable @clear="mf2 = 0"/>
                    <q-input v-model="ss2" type="number" prefix="₱" label="Share of Stocks" outlined="" color="teal" clearable @clear="ss2 = 0"/>
                    <q-input v-model="sd2" type="number" prefix="₱" label="Savings Deposit" outlined="" color="teal" clearable @clear="sd2 = 0"/>
                    <div class="text-overline"><q-checkbox v-model="showOther2" dense="" class="q-mr-sm"/> OTHERS</div>
                    <q-input v-model="otherDescription2" type="text" label="Description" outlined="" color="teal" clearable @clear="otherDescription2 = ''" v-show="showOther2"/>
                    <q-input v-model="other2" type="number" prefix="₱" label="Amount" outlined="" color="teal" clearable @clear="other2 = 0" v-show="showOther2"/>
                                                
                </div>
            </div>
            <div class="col q-px-md q-gutter-md">
                <div class="text-h6">Transaction Details</div>  
                <q-input v-model="amountPaid" input-class="text-h6 text-right" clearable :rules="[val => val >= returnTotalAmount || 'Please enter amount greater than or equal to the total amount to pay.']" bottom-slots="" type="number" prefix="₱" label="Amount Paid" outlined="" color="teal"/>      
                <q-list>
                    <q-item>
                        <q-item-section>
                            <q-item-label>TOTAL DUE AMOUNT</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-item-label class="text-h6 text-left">₱ {{returnTotalAmount}}.00</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-separator spaced />
                    <q-item>
                        <q-item-section>
                            <q-item-label>CHANGE</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-item-label class="text-h6 text-left" v-if="returnChange !== 'INSUFFICIENT AMOUNT !'">₱ {{returnChange}}.00</q-item-label>
                            <q-item-label class="text-h6 text-left text-red" v-else>{{returnChange}}</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>         
            </div>
        </div>
        

        <q-stepper-navigation class="text-right">
            <q-btn @click="savePayment" color="grey-10" label="Continue" :disable="returnChange == 'INSUFFICIENT AMOUNT !'"/>
            <q-btn flat @click="step = 1" color="grey-10" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
        </q-step>

        <q-step
        :name="3"
        title="Payment Complete"
        icon="check"
        >
            <div class="text-center text-teal text-h4 q-mt-xl">Transaction Successful</div>
            <div class="text-center text-h6">Would you like to make another Transaction?</div> 


        <q-stepper-navigation class="text-center">
            <q-btn color="grey-10" label="Yes" @click="step = 1,clearForm()" />
            <q-btn flat  color="grey-10" label="see payment list" class="q-ml-sm" />
        </q-stepper-navigation>
        </q-step>
    </q-stepper>      
    </q-page>
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
    data(){
        return {
            text: '',
            step: 1,
            operator: false,
            ifDriver: false,
            model: null,
            membersIdOpt: Object.freeze(this.membersIdOptions),
            MemberData: [],
            MDetails:{
                memberID: '',
                memberName: '',
                memberDesignation: '',
                isNewMember: false,
            },
            membershipFee: 500,
            mf1: 0,
            ss1: 0,
            sd1: 0,
            other1: 0,
            otherDescription1: '',
            ca: 0,
            mf2: 0,
            ss2: 0,
            sd2: 0,
            otherDescription2: '',
            other2: 0,
            showOther1: false,
            showOther2: false,
            showCA: false,
            hasCA: false,
            driverOperator: {},
            amountPaid: 0,
            lastTransaction: {},
            TransactionID: '',
            OrNo: ''    

        }
    },
    firestore(){
        return {
            Transactions: firebaseDb.collection('Transactions'),
            MemberData: firebaseDb.collection('MemberData'),
        }
    },
    mounted() {
      this.$binding('lastTransaction', firebaseDb.collection('Transactions').orderBy('timestamp', 'desc').limit(1))
        .then(data => {
          if (data.length != 0) {
            // has data
            this.TransactionID = ++data[0].TransactionID
            this.OrNo = ++data[0].OrNo
          } else {
            // empty Transactions
            var transacIdFormat = 100000
            var ORFormat = 1000000
            this.TransactionID = transacIdFormat
            this.OrNo = ORFormat
          }
        })
    },
    computed: {
      membersIdOptions () {
        let opt = this.MemberData.map(d => {
            let full = d.FirstName + ' ' + d.LastName

          return {
            label: d['.key'] +' - '+full.toUpperCase() + ' ('+d.Designation+')',
            value: d['.key'] +' - '+full.toUpperCase() + ' ('+d.Designation+')',
            fullName: full,
            id: d['.key'],
            designation: d.Designation
          }
        })
        console.log(this.MemberData,'ppp')
        return opt
        // Object.freeze(options)
      },
      returnTotalAmount(){
          if(this.MDetails.isNewMember == false){
              let x = this
              let pay1 = parseInt(x.mf1) + parseInt(x.ss1) + parseInt(x.sd1) + parseInt(x.other1) + parseInt(x.ca)
              let pay2 = parseInt(x.mf2) + parseInt(x.ss2) + parseInt(x.sd2) + parseInt(x.other2)
              if(this.operator == true){
                  return pay1 + pay2
              } else {
                  return pay1
              }
          } else {
              return 500
          }
      },
      returnChange(){
          if(this.amountPaid >= this.returnTotalAmount){
              return this.amountPaid - this.returnTotalAmount
          } else {
              return 'INSUFFICIENT AMOUNT !'
          }
      },
      returnSelectedMember(){
          try {
            return this.MemberData.filter(d => {
                return d['.key'] === this.model.id
            })[0]
          } catch (error) {
            return {}
          }
      }
    },
    methods: {
        clearForm(){
            this.operator= false
            this.ifDriver= false
            this.model= null
            this.removeMemberDetails()
            this.membershipFee= 500
            this.mf1= 0
            this.ss1= 0
            this.sd1= 0
            this.other1= 0
            this.ca = 0
            this.showOther1 = false
            this.showOther2 = false
            this.showCA = false
            this.hasCA = false
            this.otherDescription1= ''
            this.mf2= 0
            this.ss2= 0
            this.sd2= 0
            this.otherDescription2= ''
            this.other2= 0
            this.driverOperator= {}
            this.amountPaid= 0
        },
        createValue (val, done) {
        // Calling done(var) when new-value-mode is not set or "add", or done(var, "add") adds "var" content to the model
        // and it resets the input textbox to empty string
        // ----
        // Calling done(var) when new-value-mode is "add-unique", or done(var, "add-unique") adds "var" content to the model
        // only if is not already set
        // and it resets the input textbox to empty string
        // ----
        // Calling done(var) when new-value-mode is "toggle", or done(var, "toggle") toggles the model with "var" content
        // (adds to model if not already in the model, removes from model if already has it)
        // and it resets the input textbox to empty string
        // ----
        // If "var" content is undefined/null, then it doesn't tampers with the model
        // and only resets the input textbox to empty string

        if (val.length > 2) {
            if (!this.membersIdOpt.includes(val)) {
            done(val, 'add-unique')
            }
        }
        },

        filterFn (val, update) {
            update(() => {
                if (val === '') {
                this.membersIdOpt = this.membersIdOptions
                }
                else {
                const needle = val.toLowerCase()
                this.membersIdOpt = this.membersIdOptions.filter(
                    v => v.value.toLowerCase().indexOf(needle) > -1
                )
                }
            })
        },
        onClick(){

        },
        removeMemberDetails(){
            this.MDetails.memberID = ''
            this.MDetails.memberName = ''
            this.MDetails.memberDesignation = ''
            this.MDetails.isNewMember = false
            console.log('remove')
        },
        changeMemberDetails(val){
            let member = this.MemberData.filter(d => {
            return d['.key'] === val.id
            })[0]

            console.log(member,'member')

            if(member.Advances != 0){
                this.hasCA = true
                console.log('HAS CA !')
            } else {
                this.hasCA = false
            }


            if(val !== null){
                this.MDetails.memberID = val.id
                this.MDetails.memberName = val.fullName
                this.MDetails.memberDesignation = val.designation
                this.MDetails.isNewMember = member.isNewMember
                console.log(this.MDetails.isNewMember,'isNewMember')
                if(val.designation.toUpperCase() == 'DRIVER'){
                    this.mf1 = 15
                    this.ss1 = 30
                    this.mf2 = 65
                    this.ss2 = 30   
                    this.ifDriver = true
                    this.driverOperator = member.Operator
                } else {
                    this.mf1 = 65
                    this.ss1 = 30    
                    this.ifDriver = false   
                    this.driverOperator = {}             
                }

            }
        },
        savePayment(){
            let Payment = {
                MemberID: '',
                OrNo: '',
                TransactionID: '',
                MembershipFee: 500,
                ManagementFee: 15,
                ShareCapital: 30,
                SavingsDeposit: 0,
                Advances: 0,
                Others: 0,
                OthersDes: '',
                Total: 0,
                timestamp: ''
            }
            console.log(Payment,'Payment')
            this.$refs.stepper.next()
        },
    }
}
</script>