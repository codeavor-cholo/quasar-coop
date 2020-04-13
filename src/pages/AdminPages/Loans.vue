<template>
  <div>
    <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4">Loans </h6>
    <q-separator />
    <div class="q-pa-md">
      
      <q-card class="center">
        <q-card-section>
        <div class="row">
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <div class="q-pa-md">
              <q-input disable outlined color="teal" v-model="transactionID" label="Transaction ID" >
                <template v-slot:append>
                  <q-icon name="mdi-account" />
                </template>
              </q-input>
            </div>
          </div>
          
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <div class="q-pa-md">
              <!-- <q-select outlined color="teal" :options="membersid" v-model="memberid" label="Members ID" >
                <template v-slot:append>
                  <q-icon name="mdi-account" />
                </template>
              </q-select> -->

              <q-select
                outlined
                v-model="memberID"
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

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <div class="q-pa-md">
              <q-input outlined readonly color="teal" v-model="memberFullName" label="Members name" >
                <template v-slot:append>
                  <q-icon name="mdi-account" />
                </template>
              </q-input>
            </div>
          </div>

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <div class="q-pa-md">
              <q-input outlined readonly color="teal" v-model="designation" label="Designation" >
                <template v-slot:append>
                  <q-icon name="mdi-account" />
                </template>
              </q-input>
            </div>
          </div>

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <div class="q-pa-md">
              <!-- <q-input disable outlined color="teal" v-model="sharecapital" label="Total Share Capital" >
                <template v-slot:append>
                  <q-icon name="mdi-account" />
                </template>
              </q-input> -->


              <q-field
                outlined
                readonly
                prefix="₱ "
                v-model="sharecapital"
                label="Share Capital"
                >
                <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                  <input :id="id" class="q-field__input text-left" :value="value" @change="e => emitValue(e.target.value)" v-money="moneyFormatForDirective" v-show="floatingLabel">
                </template>
              </q-field>
            </div>
          </div>

            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <div class="q-pa-md">
                <!-- <q-input disable outlined color="teal" v-model="savings" label="Total Savings" >
                  <template v-slot:append>
                    <q-icon name="mdi-account" />
                  </template>
                </q-input> -->


                <q-field
                  outlined
                  readonly
                  prefix="₱ "
                  v-model="savings"
                  label="Savings Deposit"
                  >
                  <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                    <input :id="id" class="q-field__input text-left" :value="value" @change="e => emitValue(e.target.value)" v-money="moneyFormatForDirective" v-show="floatingLabel">
                  </template>
                </q-field>
              </div>
          </div>

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-mb-lg">
            <div class="q-pa-md">
              <!-- <q-input disable outlined color="teal" v-model="totalLoanBalance" label="Total Loan Balance" >
                <template v-slot:append>
                  <q-icon name="mdi-account" />
                </template>
              </q-input> -->

              <q-field
                outlined
                readonly
                prefix="₱ "
                v-model="totalLoanBalance"
                label="Total Loan Balance"
                >
                <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                  <input :id="id" class="q-field__input text-left" :value="value" @change="e => emitValue(e.target.value)" v-money="moneyFormatForDirective" v-show="floatingLabel">
                </template>
              </q-field>

            </div>
          </div>

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <div class="q-pa-md">
            </div>
          </div>
          <div class="absolute-bottom-right">
            <div class="q-pa-md">
              <q-btn class="text-teal-4 q-mr-md" icon="fas fa-money-check" label="Withdraw" color="white" @click="Withdraw"/>
            </div>
          </div>
        </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
import { firebaseDb } from 'boot/firebase'
import money from 'v-money'
import Vue from 'vue'


Vue.use(money, {precision: 4})



export default {
  mounted () {
    this.$binding('lastTransaction', firebaseDb.collection('Transactions').orderBy('timestamp', 'desc').limit(1))
      .then(data => {
        
        if (data.length != 0) {
          // has data
          this.transactionID = ++data[0].TransactionID
        } else {
          // empty Transactions
          var transacIdFormat = 100000
          this.transactionID = transacIdFormat
        }
      })
  },
  firestore () {
    return {
      MemberData: firebaseDb.collection('MemberData')
    }
  },
  data(){
    return{
      moneyFormatForDirective: {
        decimal: '.',
        thousands: ',',
        precision: 0,
        masked: false
      },
      membersIdOpt: Object.freeze(this.membersIdOptions),
      transactionID: '',
      memberID: '',
      memberFullName: '',
      designation: '',
      sharecapital: '',
      savings: '',
      totalLoanBalance: '',
    }
  },
  computed: {
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
  },
  methods: {
    test () {
      
    },
    onSelectMemberId (val) {
      let member = this.MemberData.filter(d => {
        return d['.key'] === val
      })[0]
      this.memberFullName = member.LastName + ', ' + member.FirstName
      this.designation = member.Designation
      this.sharecapital = member.ShareCapital
      this.savings = member.SavingsDeposit
      this.totalLoanBalance = member.Advances


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
    Withdraw(){
        this.$q.dialog({
      title: 'Withdrawal Breakdown',
      message: '<h6> Total Share Capital: <h6><hr> <h6> Total Savings: <h6> <hr> <h6> Total Loan Balance: <h6> ',
    
      cancel: true,
      persistent: true,
      html: true
    }).onOk(() => {
      // console.log('>>>> OK')
    }).onOk(() => {
      // console.log('>>>> second OK catcher')
    }).onCancel(() => {
      // console.log('>>>> Cancel')
    }).onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    })
    }
  },
}
</script>
<style scoped>
/* .q-field{
  width: 205px;
} */
</style>