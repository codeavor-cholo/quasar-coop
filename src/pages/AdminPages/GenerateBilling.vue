<template>
    <q-page>
        <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4">Generate Billing <q-icon name="mdi-arrow-right-box" /> {{returnTitle(tab)}} Statements <span v-show="tab != 'Sent'">({{returnToday}})</span> 
          <!-- <q-btn color="primary" icon="check" label="OK" @click="test" class="float-right q-mr-md" dense/> -->
          <q-btn color="grey-10" class="float-right q-mr-md" flat dense="" icon="event" label="adjust date" @click="adjustDate = true" /> 
          <!-- <q-btn color="pink" class="float-right q-mr-md" flat dense="" icon="event" label="delele today sent" @click="deleteTodayShortCut" />  -->

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
                <q-tab name="New" icon="fiber_new" label="New Statements (Quota)" />
                <q-tab name="Sent" icon="present_to_all" label="Sent Statements (Quota)"/>
                <q-tab name="New Loan" icon="fiber_new" label="New Statement (Cash Advance)" />
                <q-tab name="Sent Loan" icon="present_to_all" label="Sent Statement (Cash Advance)"/>


              </q-tabs>
            </template>
            <template v-slot:after>
                  <q-table
                      :data="returnDataofTable"
                      :columns="returnColumnofTable"  
                      :pagination.sync="pagination"
                      row-key="SentID"
                      flat
                      :loading="loadingData"
                      loading-label="Loading your Data..."
                      class="cursor-pointer"
                      :filter="filter"
                  >
                    <template v-slot:top>
                      <div class="row justify-between">
                        <div class="text-h6 text-weight-regular"> {{returnTitle(tab)}} Statements <span v-show="tab != 'Sent'">({{returnToday}})</span>
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
                          <span v-if="col.typeOf == 'money'">{{col.value | currency}}</span><span v-else>{{col.value}}</span>
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
            <q-banner class="bg-info text-white full-width q-mt-md">
              <q-icon name="info" /> This function is for demo purposes only.
            </q-banner>
              <q-date
                v-model="today"
                landscape
                flat 
                color="teal"
                minimal
                class="full-width"
              />
              <q-banner class="bg-warning text-white">
                <q-icon name="warning" /> When testing this function, adjust date once and refresh the window to refresh the data correctly for the next adjustment of date.
              </q-banner>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="done" color="teal" v-close-popup />
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

function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}

export default {
    data(){
        return {
            tab: 'New',
            today: date.formatDate(new Date(),'YYYY/MM/DD'),
            splitterModel: 20,
            drawer: false,
            filter: '',
            pagination: {
              page: 1,
              rowsPerPage: 0
            },
            adjustDate: false,
            selected: {},
            loadingData: false,
            backdoor: 0
        }
    },
    firestore () {
      return {
        MemberData: firebaseDb.collection('MemberData'),
        JeepneyData: firebaseDb.collection('JeepneyData'),
        Transactions: firebaseDb.collection('Transactions'),
        BillingTrackers: firebaseDb.collection('BillingTrackers'),
        LastBillingTrackers: firebaseDb.collection('BillingTrackers'),
        PayLater: firebaseDb.collection('PayLater'),

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
            // // // console.log(this.returnJeepneyTransactions,'///')
            // // // console.log(this.returnWithBalance,'///')
            let bills = this.returnWithBalance.filter(a=>{
                  if(this.$lodash.findIndex(this.BillingTrackers, x=> {return a.SentID == x.SentID}) == -1)
                  {
                    return a
                  }
                })

            let unsent = []

            let billFilterSent = this.BillingTrackers.filter(a=>{
              return a.PlateNumber !== undefined
            })
            let sent = billFilterSent.map(b=>{
              return {
                ...b,
                DateSent: date.formatDate(this.getDateSent(b.SentID).timestamp.toDate(),'MM/DD/YYYY'),
                trackID: this.getDateSent(b.SentID)['.key'].toString().slice(0,10)
              }
            })

            // // console.log(bills,'returnWithBalance')

            bills.forEach(b=>{
              if(this.$lodash.findIndex(this.BillingTrackers, a=>{ return a.SentID == b.SentID}) == -1){
                unsent.push(b)
              } 
            })

            // console.log(unsent,'XXXXX')
            // console.log(sent,'sent items')

            let dataSaved = []
            let withoutBills = []

            let cloneUnsent = this.$lodash.clone(unsent) 
            let otherUnsent = []

            if(cloneUnsent.length > 0){
              // console.log('CHECKXXXXXXXXXXXXXXXXX', cloneUnsent)
              let withRemainingBalanceBills = this.$lodash.uniq(this.returnWithQuotaBalanceLastMonth,'SentID')
              // // console.log(withRemainingBalanceBills,'after unsent')
              withRemainingBalanceBills.forEach(a=>{
                if(this.$lodash.findIndex(this.BillingTrackers, x=> {return a.SentID == x.SentID}) == -1){
                  cloneUnsent.forEach(q=>{
                    if(a.PlateNumber == q.PlateNumber && a.BillingName == q.BillingName){
                      // console.log(a,'same')
                      let obj = {...q}
                      // console.log(obj,'obj')
                      obj.thisMonthQuota = q.QuotaBalance
                      obj.QuotaBalance = a.lastBillBalance + q.QuotaBalance
                      obj.BillingMonth = q.BillingMonth
                      obj.lastMonthBillingStatement = {...a}
                      delete obj.billPaidAmount
                      delete obj.trackID
                      delete obj.DateSent
                      obj.Transactions = q.Transactions
                      obj.NoPayDays = q.NoPayDays
                      obj.Count = q.Count
                      obj.AmountPerDay = q.AmountPerDay
                      
                      dataSaved.push(obj)
                    } 
                  })
                    let index = this.$lodash.findIndex(dataSaved,x=>{
                      return x.PlateNumber == a.PlateNumber && x.BillingName == a.BillingName
                    })

                    if(index < 0){
                      let obj = {...a}
                      obj.lastMonthBillingStatement = {...a}
                      dataSaved.push(obj)
                    }
                }
              }) 
 
              
              cloneUnsent.forEach(q=>{
                let index = this.$lodash.findIndex(dataSaved,a=>{
                  return a.PlateNumber == q.PlateNumber && a.BillingName == q.BillingName
                })

                if(index < 0){
                  withoutBills.push(q)
                }
              }) 

              otherUnsent = [...dataSaved,...withoutBills]


              unsent = this.$lodash.uniq(this.payLaterCheckerFunction(this.$lodash.clone(otherUnsent)),'SentID')
              // console.log(dataSaved,'dataSaved')
              // console.log(withoutBills,'without')
              // console.log('otherUnsent concat',otherUnsent)


            } else {
              const passOn = this.$lodash.uniq(this.returnWithQuotaBalanceLastMonth,'SentID')
              let arrayShowForSending = passOn.filter(a=>{
                if(this.$lodash.findIndex(this.BillingTrackers, x=> {return a.SentID == x.SentID}) == -1)
                {
                  return a
                }
              })

              unsent = this.$lodash.uniq(this.payLaterCheckerFunction(arrayShowForSending),'SentID')
              // console.log('XXXCHECK',unsent)
            }

            let loans = this.returnWithAdvancesInterest
            let unsentloans = []
            let sentloans = []

            loans.forEach(b=>{
              if(this.$lodash.findIndex(this.BillingTrackers, a=>{ return a.SentID == b.SentID}) == -1){
                unsentloans.push(b)
              } else {
                sentloans.push(b)
              }
            })

            let sentAdvances = this.BillingTrackers.filter(a=>{
                a.DateSent = date.formatDate(this.getDateSent(a.SentID).timestamp.toDate(),'MM/DD/YYYY')
                a.trackID = this.getDateSent(a.SentID)['.key'].toString().slice(0,10)
              return a.Advances !== undefined
            })

            let todayBase = new Date(this.today)
            let todayStartMonth = date.startOfDate(todayBase,'month')
            let todayBase1week = date.addToDate(todayStartMonth,{days: 7})
            // console.log(todayStartMonth,'todayStart')
            // console.log(todayBase1week,'todayBase1week')
            if (date.isBetweenDates(todayBase,todayStartMonth, todayBase1week, { inclusiveFrom: true, inclusiveTo: false })) {
              console.log(this.$lodash.uniqBy(unsent,'SentID'),'sent id')
              if(this.tab == 'New') return this.$lodash.uniqBy(unsent,'SentID')
            }

            // // console.log(this.payLaterCheckerFunction(sent,true),'start of paylater checking sent')
            if(this.tab == 'New') return []
            else if(this.tab == 'Sent'){ return sent }
            else if(this.tab == 'New Loan'){ return unsentloans }
            else { return sentAdvances }
        },
        returnColumnofTable(){
          let quotacolumns = [
            { name: 'PlateNumber', align: 'left', label: 'Plate Number', field: 'PlateNumber', sortable: true },
            { name: 'BillingName', align: 'left', label: 'Billing Name', field: 'BillingName', sortable: true },
            { name: 'BillingMonth', align: 'left', label: 'Billing Month', field: 'BillingMonth', sortable: true },            
            { name: 'NoPayDays', align: 'left', label: 'Days Unpaid', field: 'NoPayDays', sortable: true },
            { name: 'AmountPerDay', align: 'left', label: 'MF', field: 'AmountPerDay', sortable: true, typeOf: 'money' },
            { name: 'AmountPayables', align: 'left', label: 'Amount Payables', field: 'AmountPayables', sortable: true, typeOf: 'money' },
            { name: 'QuotaBalance', align: 'left', label: 'Quota Balance + AP', field: 'QuotaBalance', sortable: true, typeOf: 'money' },
          ]

          let loancolumns = [
            { name: 'MemberID', align: 'left', label: 'Member ID', field: 'MemberID', sortable: true },
            { name: 'BillingName', align: 'left', label: 'Billing Name', field: 'BillingName', sortable: true },
            { name: 'BillingDate', align: 'left', label: 'Billing Date', field: 'BillingDate', sortable: true },            
            { name: 'BillingBalance', align: 'left', label: 'Unpaid Advances', field: 'BillingBalance', sortable: true, typeOf: 'money'  },
            { name: 'InterestRate', align: 'left', label: 'Rate', field: 'InterestRate', sortable: true, },
            { name: 'InterestAmount', align: 'left', label: 'Added Amount', field: 'InterestAmount', sortable: true, typeOf: 'money' }, 
            { name: 'Status', align: 'left', label: 'Status', field: 'Status', sortable: true, },             
          ]
            
            if(this.tab == 'New') return quotacolumns
            else if(this.tab == 'Sent'){ 
              quotacolumns.push({ name: 'DateSent', align: 'left', label: 'Date Sent', field: 'DateSent', sortable: true })
              return quotacolumns 
            } else if(this.tab == 'New Loan'){ return loancolumns }
            else { 
              loancolumns.push({ name: 'DateSent', align: 'left', label: 'Date Sent', field: 'DateSent', sortable: true })
              return loancolumns 
            }
        },
        returnPayLaterLastMonth(){
          try {
            let lastMonth = date.subtractFromDate(new Date(this.today),{month: 1})
            let payLaterMonth = date.formatDate(lastMonth,'MMM')
            let payLaterMonthYear = date.formatDate(lastMonth,'YYYY')  
            let payLaterDate = `${payLaterMonth} ${payLaterMonthYear}`


            // console.log('returnPayLaterLastMonth')
            // console.log(lastMonth,'lastMonth')
            let filter = this.$lodash.filter(this.PayLater,a=>{
              let dateBase = a.timestamp.toDate()
              let dateMonth = date.formatDate(dateBase,'MMM')
              let dateYear = date.formatDate(dateBase,'YYYY')  
              let payLaterDateBase = `${dateMonth} ${dateYear}`

              return payLaterDate == payLaterDateBase
            })

            // console.log(filter,'filter date months')

            // console.log('returnPayLaterLastMonth')
            return filter
          } catch (error) {
            // console.log(error,'returnPayLaterLastMonth')
            return []
          }
        },
        returnWithQuotaBalanceLastMonth(){
          try {
            const bills = this.LastBillingTrackers
            // console.log(bills,'bills')
            let lastMonth2 = date.subtractFromDate(new Date(this.today),{month: 2})
            // // console.log(lastMonth,'lastMonth')
            let billingMonth = date.formatDate(lastMonth2,'MMM')
            let billingMonthYear = date.formatDate(lastMonth2,'YYYY')    
            let lastBillingMonth = billingMonth+' '+billingMonthYear
            // console.log(lastBillingMonth,'lastBillingMonth')
            let withRemainingBalanceBills = []

            bills.forEach(a=>{
              let paidBills = a.billPaidAmount !== undefined ? parseFloat(a.billPaidAmount) : 0
              let remainingBal = parseFloat(a.QuotaBalance) - paidBills

              if(lastBillingMonth == a.BillingMonth && a.paymentStatus !== 'Full Payment' && remainingBal !== 0){
                a.lastBillBalance = remainingBal
                withRemainingBalanceBills.push(a)
              }
            })
            
            let today = this.today
            // // console.log(today,'today base')
            let todayDate = date.formatDate(today,'DD')
            let todayMonth = date.formatDate(today,'M')
            let todayYear = date.formatDate(today,'YYYY')
            let lastMonthStart = new Date(todayYear,parseInt(todayMonth)-2,1) 
            let lastMonthEnd = date.endOfDate(lastMonthStart, 'month')
            let lastMonth = date.formatDate(lastMonthStart,'MMM')
            let lastMonthYear = date.formatDate(lastMonthStart,'YYYY')

            let out = []
            
            withRemainingBalanceBills.forEach(a=>{
                  a.BillingMonth = lastMonth+ ' '+lastMonthYear
                  a.QuotaBalance = a.lastBillBalance
                  let str = a.BillingName+a.BillingMonth+a.PlateNumber
                  a.SentID = str.replace(/\s/g, "")  
                  a.NoPayDays = 0
                  a.Count = 0   
                  a.AmountPerDay = this.ManagementFeeOperator.amount
                  let object2Push = {...a}
                  delete object2Push.trackID
                  delete object2Push['.key']
                  delete object2Push.timestamp
                  delete object2Push.Transactions
                  a.LastMonthBillStatement = object2Push
                  out.push(object2Push) 
            })

            return out.filter(a=>{
                  if(this.$lodash.findIndex(this.BillingTrackers, x=> {return a.SentID == x.SentID}) == -1)
                  {
                    return a
                  }
                })
          } catch (error) {
            // console.log(error,'returnWithQuotaBalanceLastMonth')
            return []
          }
        },
        returnJeepneyTransactions(){
          try {

              let today = this.today
              // // console.log(today,'today base')
              let todayDate = date.formatDate(today,'DD')
              let todayMonth = date.formatDate(today,'M')
              let todayYear = date.formatDate(today,'YYYY')
              let lastMonthStart = new Date(todayYear,parseInt(todayMonth)-2,1) 
              let lastMonthEnd = date.endOfDate(lastMonthStart, 'month')
              let lastMonth = date.formatDate(lastMonthStart,'MMM')
              let lastMonthYear = date.formatDate(lastMonthStart,'YYYY')

              // // console.log(todayDate,'today Date')
              // // console.log(todayMonth,'month')
              // // console.log(todayYear,'todayYear')
              // // console.log(lastMonthStart,'lastMonthStart')
              // // console.log(lastMonthEnd,'lastMonthEnd')

              if(todayDate >= 1 && todayDate <=7){
                let withJeeps = this.Transactions.filter(a=>{
                  if(a.jeepneyDetails !== undefined && a.jeepneyDetails !== null){
                    a.PlateNumber = a.jeepneyDetails.PlateNumber
                    // // console.log(a.timestamp.toDate(),'time')
                    if (date.isBetweenDates(a.timestamp.toDate(),lastMonthStart, lastMonthEnd, { inclusiveFrom: true, inclusiveTo: true })) {
                      return a
                    }
                    
                  }
                }) 

                // // console.log(withJeeps,'withJeeps')

                let groupings = this.$lodash.groupBy(withJeeps,'PlateNumber')
                // // console.log(groupings,'grouping')

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
                  b.CheckMonth = lastMonth
                  let str = b.BillingName+b.BillingMonth+b.PlateNumber
                  b.SentID = str.replace(/\s/g, "");


                })

                return map.filter(a=>{
                  if(this.$lodash.findIndex(this.BillingTrackers, x=> {return a.SentID == x.SentID}) == -1)
                  {
                    return a
                  }
                })
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

            return withBalance.filter(a=>{
                  if(this.$lodash.findIndex(this.BillingTrackers, x=> {return a.SentID == x.SentID}) == -1)
                  {
                    return a
                  }
                })
          } catch (error) {
            return []
          }
        },
        returnWithAdvances(){
          try {
            let withCashAdvance = this.MemberData.filter(a=>{
              return a.Advances !== 0 && a.activeLoans !== undefined
            })
            return withCashAdvance            
          } catch (error) {
            // console.log(error,'returnWithAdvances')
            return []
          }
        },
        returnWithAdvancesInterest(){
          try {
            let today = this.today
            // // console.log(today,'today base')
            let todayDate = date.formatDate(today,'DD')
            let todayMonth = date.formatDate(today,'M')
            let todayYear = date.formatDate(today,'YYYY')
            let billingMonth = date.formatDate(today,'MMM')
            let billingMonthYear = date.formatDate(today,'YYYY')

            let withCashAdvance = this.returnWithAdvances

            let withInterest = []
            withCashAdvance.forEach(w=>{
              w.activeLoans.forEach(q=>{
                let activated = new Date(q.dateActivated)
                // // console.log(activated,'date activated')
                let dueInterestDate = date.addToDate(activated,{month: 2})
                let dueInterestDateStart = date.startOfDate(dueInterestDate,'day')
                // // console.log(dueInterestDateStart, 'due interest')

                let base = 0
                if(q.TotalBalance == undefined){
                  base = parseFloat(q.toPayAmount)
                } else {
                  base = parseFloat(q.TotalBalance)
                }
                let balance  = base - parseFloat(q.paidAmount)
                let str = w.FirstName+ ' '+w.LastName+date.formatDate(today,'MMMYYYY')+q.CashReleaseTrackingID
                let SentID = str.replace(/\s/g, "");  

                if(new Date(today) >= new Date(dueInterestDateStart)){
                  // console.log('due na advances mo with interest na')
                  // every month add interest to the remaining balance

                  let diff = date.getDateDiff(new Date(today),new Date(activated),  'months')
                  // console.log(diff,'diff')

                  let dueDate = date.addToDate(activated,{month: diff})
                  
                  let dueDateStart = date.startOfDate(dueDate,'day')
                  // console.log(dueDateStart,'dueDateStart')

                  let dueDate1week = date.addToDate(new Date(dueDateStart),{days: 7})
                  // console.log(dueDate1week,'dueDate1week')

                  if (date.isBetweenDates(new Date(today), new Date(dueDateStart), new Date(dueDate1week), { inclusiveFrom: true, inclusiveTo: true })) {
                    // Do something with dateTarget
                    // console.log('due na advances mo')
                    //compute Interest to be added
                    
                    let interestRate = parseInt(this.InterestRates.amount) / 100
                    let interestAmount = balance * interestRate
                    // console.log(balance,'advances to pay')
                    // console.log(interestRate,'interestRate')
                    // console.log(interestAmount,'interestAmount')
                    let total2Pay = balance + interestAmount
                    // console.log(total2Pay,'total2Pay')
                  
                    let arrayUpdate = {...q}
                    let toAdd = 0
                    if(q.TotalBalance == undefined){
                      toAdd = parseFloat(q.toPayAmount)
                    } else {
                      toAdd = parseFloat(q.TotalBalance)
                    }

                    arrayUpdate.TotalBalance = toAdd + interestAmount

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
                      SentID: SentID,
                      Status: 'Interest Rate Added',
                      CashReleaseTrackingID: q.CashReleaseTrackingID,
                      arrayUpdate: arrayUpdate,
                      arrayRemove: {...q}
                    }
                    // console.log(object,'object')
                    withInterest.push(object)
                  } 

                } else {
                    let AMonthAfter = date.addToDate(activated,{month: 1})
                    let AMonthAfterStart = date.startOfDate(AMonthAfter,'day')
                    // // console.log(AMonthAfterStart,'AMonthAfterStart')

                    let AMonthAfter1week = date.addToDate(new Date(AMonthAfterStart),{days: 7})
                    // // console.log(AMonthAfter1week,'AMonthAfter1week')
                    if (date.isBetweenDates(new Date(today), new Date(AMonthAfterStart), new Date(AMonthAfter1week), { inclusiveFrom: true, inclusiveTo: true })) {
                      let object = {
                        BillingName: w.FirstName+ ' '+w.LastName,
                        BillingPhone: w.Phone,
                        BillingDate: date.formatDate(today,'MMM DD,YYYY'),
                        BillingBalance: balance,
                        Advances: balance,
                        InterestAmount: 0,
                        InterestRate: 0 +'%', 
                        dateActivated: date.formatDate(new Date(q.dateActivated),'MMM DD,YYYY'),
                        MemberID: w['.key'],
                        MemberData: w,
                        SentID: SentID,
                        Status: 'Notice To Pay',
                        CashReleaseTrackingID: q.CashReleaseTrackingID,
                      }      
                      // // console.log(object,'object')
                      withInterest.push(object)    
                    }        
                }
                              
              })
            })
            
            return withInterest
          } catch (error) {
            // console.log(error,'returnWithAdvancesInterest')
            return []
          }
        }
    },
    methods:{
      checkIfNeedPaused(a){
            const pause = {
              PlateNumber: 'ABC-123',
              PauseStartDate: Date.now(),
              DaySpan: 3
            }

            let PauseStartDateEnd = date.endOfDate(pause.PauseStartDate, 'month')
            let EndPauseDate = date.addToDate(pause.PauseStartDate,{ days: pause.DaySpan})
            let EndPauseDateEnd = date.endOfDate(EndPauseDate,'month')

            // // console.log(PauseStartDateEnd,'PauseStartDateEnd')
            // // console.log(EndPauseDate,'EndPauseDate')
            if(a.PlateNumber === pause.PlateNumber){
              // console.log('been here')
              if(this.returnMonth(pause.PauseStartDate) == this.returnMonth(EndPauseDate)){
                // console.log('status505: isan month lng sila')

              } else {
                // console.log('status505: they are not')
                // get differences
                let startDiff = date.getDateDiff(PauseStartDateEnd, pause.PauseStartDate,  'days')

                let endDiff = date.getDateDiff(EndPauseDateEnd, EndPauseDate,  'days')

                // console.log(`difference start ${startDiff} end ${endDiff}`)
              }
            }
            //check if pasok sa isang month

      },
      returnMonth(params){
        return date.formatDate(params,'MMM')
      },
      getIndexActiveLoans(array,cashID){
        let index = this.$lodash.findIndex(array,a=>{
          return a.CashReleaseTrackingID == cashID
        })
        return index
      },
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
          // this.drawer = true
        } else {
          this.selected = {}
          // this.drawer = false
        }
      },
      delay() {
        return new Promise(resolve => setTimeout(resolve, 300));
      },
      async sendSMS(number,message){
        // this.$refs.stepper.next()
        
        let header= {
              'Access-Control-Allow-Origin': '*',
        }
        let apinumber = 4

        var data = 'number=' + number + '&' + 'message=' + message + '&' + 'apinumber=' + apinumber
        await this.delay();
        // console.log(data)
        axios.post('https://toned-tabulation.000webhostapp.com/index.php', data)
        .then(response => {
          // console.log(response)
        })
        .catch((error) => {
        // console.log(error.response)
        })   
      },
      generateQuotaBilling(){
        try {
          let withBalance = this.returnDataofTable
          let withAdvances = this.returnDataofTable

          this.$q.dialog({
            title: this.tab.includes('New') ? 'Confirm Billing': 'Confirm Resend',
            message: this.tab.includes('New') ? 'Would you like to generate and send billing to members now? Note: Please do generate billing statements in proper order of months to prevent error.' : 'Would you like to resend billing to members now? Note: Please do generate billing statements in proper order of months to prevent error',
            cancel: true,
            persistent: true
          }).onOk(() => {
            this.$q.loading.show({
              message: 'Generating Billing.'
            })      
            
            this.loadingData = true
            if(this.tab == 'New' || this.tab == 'Sent'){
              if(this.tab == 'New'){

                // withBalance.forEach(a=>{
                //   let data = a
                //   data.timestamp = firefirestore.FieldValue.serverTimestamp()

                //     firebaseDb.collection("BillingTrackers").add(data)
                //       .then((doc)=>{
                //         // console.log('created billing tracker')
                //         let trackID = doc.id.toString().slice(0,10)
                //         this.sendSMS(data.BillingPhone,`As of ${data.BillingMonth}, You have P${data.QuotaBalance}.00 worth of balances. Use this Tracking# ${trackID.toUpperCase()} to pay. `)
                //         // console.log('sent sucess!')

                //       })
                //       .catch(error=>{
                //         // console.log('bill generation error',error)
                //       })                  
                  
                // })
                this.$q.loading.show({
                  message: 'Sending Billing.'
                })  
                this.processArray(withBalance)

                this.tab = 'Sent'
                this.$q.loading.hide()
                this.$forceUpdate()
                this.loadingData = false
                
              } else {
                this.$q.dialog({
                  title: 'Resend billing ?',
                  message: 'This will resend the recent generated billings only. Click OK to Continue.',
                  cancel: true,
                  persistent: true
                }).onOk(() => {
                  this.$q.loading.show({
                    message: 'Resending Billing.'
                  })      
                  this.loadingData = true
                  let sentAll = []
                  withBalance.forEach(a=>{
                    let data = a
                    if(date.formatDate(new Date(a.DateSent),'MM-DD-YYYY') == date.formatDate(new Date(),'MM-DD-YYYY')){
                      this.sendSMS(data.BillingPhone,`As of ${data.BillingMonth}, You have P${data.QuotaBalance} worth of balances. Use this Tracking# ${data.trackID.toUpperCase()} to pay. `)
                      sentAll.push(a)
                      // console.log('sent sucess!')
                      this.$q.loading.hide()
                      this.$forceUpdate();
                      this.loadingData = false
                    } 

                  })
                  if(sentAll.length == 0){
                      this.$q.notify({
                        type: 'negative',
                        message: `NO RECENT BILLINGS TO SEND`
                      })  
                      this.$q.loading.hide()
                      this.$forceUpdate();
                      this.loadingData = false
                  }
              
                })
              }
            } else {
               if(this.tab == 'New Loan'){
                  this.$q.loading.show({
                    message: 'Generating Billing.'
                  }) 
                  this.loadingData = true
                    this.$q.loading.show({
                      message: 'Sending Billing.'
                    })   
                 withAdvances.forEach(a=>{
                   let data = a
                   data.timestamp = firefirestore.FieldValue.serverTimestamp()
                    firebaseDb.collection("BillingTrackers").add(data)
                      .then((doc)=>{
                        // console.log('created billing tracker')
                        let trackID = doc.id.toString().slice(0,10)
                      
                        this.sendSMS(data.BillingPhone,`${data.Status}, P${data.BillingBalance} worth of balances in your cash advance. Use this Tracking# ${trackID.toUpperCase()} to pay. `)
                        // console.log('sent sucess!')
                    

                        if(data.Status == 'Interest Rate Added'){
                          firebaseDb.collection('MemberData').doc(data.MemberID).update({
                              Advances: firefirestore.FieldValue.increment(data.InterestAmount),
                              activeLoans: firefirestore.FieldValue.arrayRemove(data.arrayRemove),
                              // activeLoans: firefirestore.FieldValue.arrayUnion(data.arrayUpdate),
                          }).then(()=>{
                            // console.log('active Loans remove success')
                            firebaseDb.collection('MemberData').doc(data.MemberID).update({
                                // Advances: firefirestore.FieldValue.increment(data.InterestAmount),
                                // activeLoans: firefirestore.FieldValue.arrayRemove(data.arrayRemove),
                                activeLoans: firefirestore.FieldValue.arrayUnion(data.arrayUpdate),
                            }).then(()=>{
                              // console.log('active Loans union success')
                              
                            }).catch(error=>{
                            // console.log(error,'active Loans union  error')
                            })   
                          }).catch(error=>{
                            // console.log(error,'active Loans remove error')
                          })                          
                        }


                      }).catch(error=>{
                        // console.log('bill generation error',error)
                      })   
                 })
                  
                  this.tab = 'Sent Loan'
                  
                  this.$q.loading.hide()
                  
                  this.loadingData = false
                  // console.log('umaabot nmn dto ee')
                  this.$forceUpdate();
               } else {
                this.$q.dialog({
                  title: 'Resend billing ?',
                  message: 'This will resend the recent generated billings only. Click OK to Continue.',
                  cancel: true,
                  persistent: true
                }).onOk(() => {
                    this.$q.loading.show({
                      message: 'Re-sending Billing.'
                    })  
                    this.loadingData = true
                  let sentAll = []
                  withBalance.forEach(a=>{
                    let data = a
                    if(date.formatDate(new Date(a.DateSent),'MM-DD-YYYY') == date.formatDate(new Date(),'MM-DD-YYYY')){
                      this.sendSMS(data.BillingPhone,`As of ${data.BillingMonth}, You have P${data.QuotaBalance} worth of balances. Use this Tracking# ${data.trackID.toUpperCase()} to pay. `)
                      sentAll.push(a)
                      // console.log('sent sucess!')
                      this.$q.loading.hide()
                      this.$forceUpdate();
                      this.loadingData = false
                    }
                  })
                  if(sentAll.length == 0){
                      this.$q.notify({
                        type: 'negative',
                        message: `NO RECENT BILLINGS TO SEND`
                      })
                      this.$q.loading.hide()  
                      this.$forceUpdate();
                      this.loadingData = false
                  }
              
                })
               }          
            }
          })
        } catch (error) {
          // console.log(error,'error')
        }
      },
      getDateSent(SentID){
        return this.BillingTrackers.filter(a=>{return SentID == a.SentID})[0]
      },
      test(){
        // console.log(this.returnWithQuotaBalanceLastMonth)
      },
      payLaterCheckerFunction(arrayset){
        try {
          const paylater = this.returnPayLaterLastMonth 
          
          let group = this.$lodash.groupBy(paylater,'plateNumber')

          let map = this.$lodash.map(group,function(value,key){
            return {
              PlateNumber: key,
              PayLaterData: value,
            }
          })

          map.forEach(a=>{
            a.PayLaterSum = this.$lodash.sumBy(a.PayLaterData,b=>{
              return parseFloat(b.amountToPayBilling)
            })
          })


          let payLaterAdded = []
          arrayset.forEach(a=>{
            let filterPay = this.$lodash.filter(map,x=>{
              return a.PlateNumber == x.PlateNumber
            })[0]

            if(filterPay == undefined){
              a.AmountPayables = 0
            } else {
              a.AmountPayables = filterPay.PayLaterSum
              a.QuotaBalance = parseFloat(filterPay.PayLaterSum) + parseFloat(a.QuotaBalance)
            }

          })

          // console.log('arraysetXXXX',arrayset)
          // console.log(paylater,'paylater')
          // console.log(group,'group')
          // console.log(map,'map')
          // console.log(payLaterAdded,'payLaterAdded')

          return this.$lodash.uniq(arrayset,'SentID')
        } catch (error) {
          // console.log(error,'payLaterCheckerFunction')
          return this.$lodash.uniq(arrayset,'SentID')
        }
      },
      async processArray(array) {
        array.forEach(async a => {
          let data = a
          data.timestamp = firefirestore.FieldValue.serverTimestamp()

            await firebaseDb.collection("BillingTrackers").add(data)
              .then(async (doc)=>{
                // console.log('created billing tracker')
                let trackID = doc.id.toString().slice(0,10)
                await this.sendSMS(data.BillingPhone,`As of ${data.BillingMonth}, You have P${data.QuotaBalance} worth of balances. Use this Tracking# ${trackID.toUpperCase()} to pay. `)
                // console.log('sent sucess!')

              })
              .catch(error=>{
                // console.log('bill generation error',error)
              }) 
          
        })
      },
      deleteTodayShortCut(){
        let uniq = this.$lodash.uniqBy(this.returnDataofTable,'PlateNumber')
          // console.log(uniq,'ASDF')
      
        // let showToday = this.BillingTrackers.filter(a=>{
        //   let today = date.formatDate(this.today,'MM-DD-YYYY')
        //   let time = date.formatDate(a.timestamp.toDate(),'MM-DD-YYYY')
        //   // console.log(today)
        //   // console.log(time)
        //   return a.timestamp !== undefined && today == time
        // })

        // // console.log(showToday,'showToday')
        // if(showToday.length > 0){
        //   showToday.forEach(a=>{
        //     firebaseDb.collection("BillingTrackers").doc(a['.key']).delete()
        //     .then(()=>{
        //       // console.log('success delete')
        //     })
        //   })
        // }

        //   // console.log(showToday,'showToday')
        
      },
      returnTitle(tab){
        if(tab == 'New Loan') return 'New Cash Advance'
        if(tab == 'Sent Loan') return 'Sent Cash Advance'
        return tab
      }
    }
}
</script>