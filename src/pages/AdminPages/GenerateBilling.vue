<template>
    <q-page>
        <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4">Generate Billing <q-icon name="mdi-arrow-right-box" /> {{tab}} Statements <span v-show="tab != 'Sent'">({{returnToday}})</span> 
          <q-btn color="grey-10" class="float-right q-mr-md" flat dense="" icon="event" label="adjust date" @click="adjustDate = true" /> 
        </h6>
        
        <q-separator />
        <q-splitter
        v-model="splitterModel"
        style="height:80vh"
        >
            <template v-slot:before>
              <q-tabs
                v-model="tab"
                class="text-grey-10"
                vertical=""
                active-bg-color="teal-1"
                active-color="teal"
                @click="selected = {}"
              >
                <q-tab name="New" icon="fiber_new" label="New Statements" />
                <q-tab name="Sent" icon="present_to_all" label="Sent Statements"/>
                <!-- <q-tab name="New Loan" icon="fiber_new" label="New Loan Billing" />
                <q-tab name="Sent Loan" icon="present_to_all" label="Sent Loan Billing"/> -->


              </q-tabs>
            </template>
            <template v-slot:after>
                  <q-table
                      :data="returnDataofTable"
                      :columns="returnColumnofTable"  
                      :pagination.sync="pagination"
                      row-key="SentID"
                      flat
                      class="cursor-pointer"
                      :filter="filter"
                  >
                    <template v-slot:top>
                      <div class="row justify-between">
                        <div class="text-h6 text-weight-regular"> {{tab}} Statements <span v-show="tab != 'Sent'">({{returnToday}})</span>
                        <br>
                        <div class="text-caption">Click a row to see billing details.</div>
                        </div>
                        
                        <q-input v-model="filter" filled type="search" dense class="absolute-right q-mr-md" label="Search" clearable="">
                          <template v-slot:append>
                            <q-icon name="search" />
                          </template>
                        </q-input>
                      </div>
                    </template>
                    <template v-slot:body="props">
                      <q-tr :props="props"  @click="onRowClick(props)" :class="props.row == selected ? 'bg-teal-1 text-weight-bold text-teal' : ''">
                        <q-td v-for="col in props.cols.filter(col => col.name !== 'actions')" :key="col.name" >
                          <q-icon name="double_arrow" v-show="col.name == 'PlateNumber' && props.row == selected" />
                          {{ col.typeOf == 'money' ? `₱ ${col.value}.00` : col.value }}
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>  
            </template>
        </q-splitter>
        <q-drawer
          v-model="drawer"
          overlay=""
          side="right"
          :width="300"
          :breakpoint="500"
          bordered
          content-class="bg-grey-2"
          
        >
            <h1 v-for="n in 10" :key="n">WTF</h1>
        </q-drawer>
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="present_to_all" color="teal" @click="generateQuotaBilling">
            <q-tooltip  anchor="top middle" self="bottom middle">
                Send Billing Statements
            </q-tooltip>
        </q-btn>
        </q-page-sticky>

        <q-dialog v-model="adjustDate" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <q-date
                v-model="today"
                landscape
                flat
                minimal
              />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

    </q-page>
</template>
<script>
import { date, QDialog } from 'quasar'
import axios from 'axios'
import { firebaseDb, firebaseSto, firefirestore, Auth2 } from 'boot/firebase';
const sri = require('simple-random-id');
export default {
    data(){
        return {
            tab: 'New',
            today: date.formatDate(new Date(2020,6,1),'YYYY/MM/DD'),
            splitterModel: 20,
            drawer: false,
            filter: '',
            pagination: {},
            adjustDate: false,
            selected: {}
        }
    },
    firestore () {
      return {
        MemberData: firebaseDb.collection('MemberData'),
        JeepneyData: firebaseDb.collection('JeepneyData'),
        Transactions: firebaseDb.collection('Transactions'),
        BillingTrackers: firebaseDb.collection('BillingTrackers'),

        ManagementFeeDriver: firebaseDb.collection('FixedPayments').doc('ManagementFeeDriver'),
        ManagementFeeOperator: firebaseDb.collection('FixedPayments').doc('ManagementFeeOperator'),
        InterestRates: firebaseDb.collection('FixedPayments').doc('InterestRates'),
      }
    },
    computed:{
        returnToday(){
          return date.formatDate(new Date(this.today),'MMMM DD, YYYY')
        },
        returnDataofTable(){
            // console.log(this.returnJeepneyTransactions,'///')
            // console.log(this.returnWithBalance,'///')
            let bills = this.returnWithBalance

            let unsent = []
            let sent = []

            bills.forEach(b=>{
              if(this.$lodash.findIndex(this.BillingTrackers, a=>{ return a.SentID == b.SentID}) == -1){
                unsent.push(b)
              } else {
                b.DateSent = date.formatDate(this.getDateSent(b.SentID).timestamp.toDate(),'MM/DD/YYYY')
                b.trackID = this.getDateSent(b.SentID)['.key'].toString().slice(0,10)
                sent.push(b)
              }
            })

            console.log(this.returnAdvances,'withInterest')

            if(this.tab == 'New') return unsent
            else if(this.tab == 'Sent'){ return sent }
        },
        returnColumnofTable(){
          let columns = [
            { name: 'PlateNumber', align: 'left', label: 'Plate Number', field: 'PlateNumber', sortable: true },
            { name: 'BillingName', align: 'left', label: 'Billing Name', field: 'BillingName', sortable: true },
            { name: 'BillingMonth', align: 'left', label: 'Billing Month', field: 'BillingMonth', sortable: true },            
            { name: 'NoPayDays', align: 'left', label: 'Days Unpaid', field: 'NoPayDays', sortable: true },
            { name: 'AmountPerDay', align: 'left', label: 'MF', field: 'AmountPerDay', sortable: true, typeOf: 'money' },
            { name: 'QuotaBalance', align: 'left', label: 'Quota Balance', field: 'QuotaBalance', sortable: true, typeOf: 'money' },
          ]
            
            if(this.tab == 'New') return columns
            else if(this.tab == 'Sent'){ 
              columns.push({ name: 'DateSent', align: 'left', label: 'Date Sent', field: 'DateSent', sortable: true })
              return columns 
            }
        },
        returnJeepneyTransactions(){
          try {

              let today = this.today
              // console.log(today,'today base')
              let todayDate = date.formatDate(today,'DD')
              let todayMonth = date.formatDate(today,'M')
              let todayYear = date.formatDate(today,'YYYY')
              let lastMonthStart = new Date(todayYear,parseInt(todayMonth)-2,1) 
              let lastMonthEnd = date.endOfDate(lastMonthStart, 'month')
              let lastMonth = date.formatDate(lastMonthStart,'MMM')
              let lastMonthYear = date.formatDate(lastMonthStart,'YYYY')

              // console.log(todayDate,'today Date')
              // console.log(todayMonth,'month')
              // console.log(todayYear,'todayYear')
              // console.log(lastMonthStart,'lastMonthStart')
              // console.log(lastMonthEnd,'lastMonthEnd')

              if(todayDate >= 1 && todayDate <=7){
                let withJeeps = this.Transactions.filter(a=>{
                  if(a.jeepneyDetails !== undefined && a.jeepneyDetails !== null){
                    a.PlateNumber = a.jeepneyDetails.PlateNumber
                    // console.log(a.timestamp.toDate(),'time')
                    if (date.isBetweenDates(a.timestamp.toDate(),lastMonthStart, lastMonthEnd, { inclusiveFrom: true, inclusiveTo: true })) {
                      return a
                    }
                    
                  }
                }) 

                // console.log(withJeeps,'withJeeps')

                let groupings = this.$lodash.groupBy(withJeeps,'PlateNumber')
                // console.log(groupings,'grouping')

                let map = this.$lodash.map(groupings,function(value,key){
                  return {
                    PlateNumber: key,
                    Transactions: value,
                    Count: value.length
                  }
                })


                map.forEach(b=>{
                  let no = b.PlateNumber
                  b.MemberData = this.getMemberData(no)
                  b.BillingName = this.getMemberData(no).FirstName + ' ' + this.getMemberData(no).LastName
                  b.BillingPhone = this.getMemberData(no).Phone
                  b.BillingMonth = lastMonth+ ' '+lastMonthYear
                  let str = b.BillingName+b.BillingMonth+b.PlateNumber
                  b.SentID = str.replace(/\s/g, "");



                })

                return map
              } else {
                return  []
              }


          } catch (error) {
            return []
          }
        },
        returnWithBalance(){
          try {
            let pays = this.returnJeepneyTransactions

            let withBalance = []
            let noBalance = []

            pays.forEach(a=>{
              if(a.Count < 18){
                let noPay = 18 - a.Count
                let balance = parseInt(this.ManagementFeeOperator.amount) * noPay
                a.AmountPerDay = parseInt(this.ManagementFeeOperator.amount)
                a.NoPayDays = noPay
                a.QuotaBalance = balance
                withBalance.push(a)
              } else{
                noBalance.push(a)
              }
            })

            // console.log(withBalance,'withBalance')

            return withBalance
          } catch (error) {
            return []
          }
        },
        returnAdvances(){
          try {
            let today = this.today
            // console.log(today,'today base')
            let todayDate = date.formatDate(today,'DD')
            let todayMonth = date.formatDate(today,'M')
            let todayYear = date.formatDate(today,'YYYY')
            let lastMonthStart = new Date(todayYear,parseInt(todayMonth)-2,1) 
            let lastMonthEnd = date.endOfDate(lastMonthStart, 'month')
            let billingMonth = date.formatDate(today,'MMM')
            let billingMonthYear = date.formatDate(today,'YYYY')


            let withCashAdvance = this.MemberData.filter(a=>{
              return a.Advances !== 0 && a.activeLoans !== undefined
            })

            let withInterest = []
            withCashAdvance.forEach(w=>{
              w.activeLoans.forEach(q=>{
                let activated = new Date(q.dateActivated)
                // console.log(activated,'date activated')
                let dueInterestDate = date.addToDate(activated,{month: 2})
                let dueInterestDateStart = date.startOfDate(dueInterestDate,'day')
                console.log(dueInterestDateStart, 'due interest')

                let dueInterestDate1week = date.addToDate(new Date(dueInterestDateStart),{days: 7})

                console.log(dueInterestDate1week,'1 week')
                
                let balance  = q.TotalBalance - q.paidAmount
                let str = w.FirstName+ ' '+w.LastName+date.formatDate(today,'MMMDDYYYY')+q.CashReleaseTrackingID
                let SentID = str.replace(/\s/g, "");  

                if (date.isBetweenDates(new Date(today), new Date(dueInterestDateStart), new Date(dueInterestDate1week), { inclusiveFrom: true, inclusiveTo: true })) {
                  // Do something with dateTarget
                  console.log('due na advances mo')
                  //compute Interest to be added
                  
                  let interestRate = parseInt(this.InterestRates.amount) / 100
                  let interestAmount = balance * interestRate
                  console.log(balance,'advances to pay')
                  console.log(interestRate,'interestRate')
                  console.log(interestAmount,'interestAmount')
                  let total2Pay = balance + interestAmount
                  console.log(total2Pay,'total2Pay')
                
                  let object = {
                    BillingName: w.FirstName+ ' '+w.LastName,
                    BillingPhone: w.Phone,
                    BillingDate: date.formatDate(today,'MMM DD,YYYY'),
                    BillingBalance: total2Pay,
                    Advances: balance,
                    InterestAmount: interestAmount,
                    InterestRate: this.InterestRates.amount +'%', 
                    dateActivated: date.formatDate(new Date(q.dateActivated),'MMM DD,YYYY'),
                    MemberID: w['.key'],
                    MemberData: w,
                    SentID: SentID
                  }
                  console.log(object,'object')
                  withInterest.push(object)
                } 
                              
              })
            })
            



            return withInterest
          } catch (error) {
            console.log(error,'returnAdvances')
            return []
          }
        }
    },
    methods:{
      getMemberData(PlateNumber){
        let id = this.JeepneyData.filter(a=>{
          return PlateNumber == a.PlateNumber
        })[0]
        let memberid = id.MemberID
        return this.MemberData.filter(a=>{return a['.key'] == memberid})[0]
      },
      onRowClick(props){
          
        if(this.selected != props.row)
        {
          this.selected = props.row
          this.drawer = true
        } else {
          this.selected = {}
          this.drawer = false
        }
      },
      sendSMS(number,message){
        // this.$refs.stepper.next()
        let header= {
              'Access-Control-Allow-Origin': '*',
        }
        let apinumber = 3

        var data = 'number=' + number + '&' + 'message=' + message + '&' + 'apinumber=' + apinumber
        console.log(data)
        axios.post('https://smsapisender.000webhostapp.com/index.php', data)
        .then(response => {
          console.log(response)
        })
        .catch((error) => {
        console.log(error.response)
        })   
      },
      generateQuotaBilling(){
        try {
          let withBalance = this.returnWithBalance
          this.$q.dialog({
            title: this.tab == 'New' ? 'Confirm Billing': 'Confirm Resend',
            message: this.tab == 'New' ? 'Would you like to generate and send billing to members now?' : 'Would you like to resend billing to members now?',
            cancel: true,
            persistent: true
          }).onOk(() => {
            withBalance.forEach(a=>{
              let data = a
              data.timestamp = firefirestore.FieldValue.serverTimestamp()
              if(this.tab == 'New'){

                firebaseDb.collection("BillingTrackers").add(data)
                  .then((doc)=>{
                    console.log('created billing tracker')
                    let trackID = doc.id.toString().slice(0,10)
                    this.sendSMS(data.BillingPhone,`As of ${data.BillingMonth}, You have P${data.QuotaBalance}.00 worth of balances. Use this Tracking# ${trackID.toUpperCase()} to pay. `)
                    console.log('sent sucess!')
                  })
                  .catch(error=>{
                    console.log('bill generation error',error)
                  })                  
              } else if(this.tab == 'Sent'){
                this.sendSMS(data.BillingPhone,`As of ${data.BillingMonth}, You have P${data.QuotaBalance}.00 worth of balances. Use this Tracking# ${data.trackID.toUpperCase()} to pay. `)
                console.log('sent sucess!')
              }
            })
          })
        } catch (error) {
          console.log(error,'error')
        }
      },
      getDateSent(SentID){
        return this.BillingTrackers.filter(a=>{return SentID == a.SentID})[0]
      }
    }
}
</script>