<template>
    <q-page>
        <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4 noPrint">Reports <q-icon name="mdi-arrow-right-box" /> {{returnbyButtonReportLabel}} Remittance 
         <span v-show="transactionsTableView" class="text-weight-light"><q-icon name="mdi-arrow-right-box" v-show="transactionsTableView"/> {{returnSelectedBaseDate}} Transactions</span>
          <!-- <q-btn color="primary" icon="check" label="OK" @click="test" class="float-right q-mr-md" dense/> -->
          <q-btn color="grey-10" class="float-right q-mr-md noPrint" flat dense="" icon="arrow_left" label="back to remittance" @click="transactionsTableView = false,selected = {},filter = ''" v-show="transactionsTableView"/> 
        </h6>   
        <q-separator class="noPrint"/>   
        <div class="fit noPrint q-px-lg q-pt-lg">
            <q-btn color="grey-10" icon="print" label="print report" @click="printMe" class="float-right"/>
            <q-btn-toggle
            v-model="byButton"
            toggle-color="teal"
            :options="[
                {label: 'Day', value: 'day'},
                {label: 'Month', value: 'month'},
                {label: 'Year', value: 'year'}
            ]"
            class="float-right q-mr-md"
            v-show="!transactionsTableView"
            />
            <q-input v-model="filter" filled color="teal" type="search" dense  label="Search" clearable="" style="width:250px;">
                <template v-slot:append>
                <q-icon name="search" />
                </template>
            </q-input>
        </div>  
        <div class="fit table-cut" v-if="transactionsTableView == false">
        <div class="fit yesPrint">
            <div class="text-h6 row justify-between fit q-mb-md">
                <div>
                    {{returnbyButtonReportLabel}} Remittance Report
                    <div class="text-caption">Prepared By: {{returnLogged.FirstName}} {{returnLogged.LastName}}</div>
                </div>
                <div class="text-right">
                    <!-- {{$moment(today).format('LL')}}
                    <div class="text-caption">Printed On:</div> -->
                </div>
            </div>
            <hr style="border-height:1px;border-color:#444444" class="full-width">
        </div>

        <q-table
            v-show="!transactionsTableView"
            class="q-pa-md"
            :data="returnByButtonData"
            :columns="columns"
            row-key="baseDate"
            flat
            :pagination.sync="initialPagination"
            :filter="filter"
        >
            <!-- <template v-slot:top>
                <div class="fit noPrint">
                    <q-btn color="grey-10" icon="print" label="print report" @click="printMe" class="float-right"/>
                    <q-btn-toggle
                    v-model="byButton"
                    toggle-color="teal"
                    :options="[
                        {label: 'Day', value: 'day'},
                        {label: 'Month', value: 'month'},
                        {label: 'Year', value: 'year'}
                    ]"
                    class="float-right q-mr-md"
                    />
                    <q-input v-model="filter" filled color="teal" type="search" dense  label="Search" clearable="" style="width:250px;">
                        <template v-slot:append>
                        <q-icon name="search" />
                        </template>
                    </q-input>
                </div>
            </template>   -->
            <template v-slot:header="props">
                <q-tr :props="props">
                <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    :class="col.name == 'Actions' ? 'noPrint' : ''"
                >
                    {{ col.label }}
                </q-th>
                </q-tr>
            </template>
            <template v-slot:body="props">
                <q-tr :props="props"  :class="props.row == selected ? 'bg-teal-1 text-weight-bold text-teal' : ''">
                <q-td v-for="col in props.cols.filter(col => col.name !== 'Actions')" :key="col.name" >
                    <q-icon name="double_arrow" v-show="col.name == 'MemberID' && props.row == selected" />
                    <span v-if="col.typeOf == 'money'">{{ col.value | currency }}</span>
                    <span v-else-if="col.typeOf == 'date'">
                        <span v-if="byButton == 'day'">{{$moment(col.value).format('LL')}}</span>
                        <span v-else-if="byButton == 'month'">{{$moment(col.value).format('MMMM YYYY')}}</span>
                        <span v-else>{{$moment(col.value).format('YYYY')}}</span>

                    </span>
                    <span v-else>{{ col.value }}</span>
                </q-td>
                <q-td key="Actions" v-if="props.row == selected" class="noPrint">
                    <q-btn color="teal" icon="receipt" label="view transactions" @click="viewGo(props.row)" flat/>
                </q-td>
                <q-td key="Actions" v-else class="noPrint">
                    <q-btn color="teal" icon="receipt" label="view transactions" @click="viewGo(props.row)" flat v-if="props.row.transactions.length > 0"/>
                    <span v-else class="q-px-md text-grey">No Transactions to show.</span>
                </q-td>
                </q-tr>
            </template>  
        </q-table>
        
        <div class="q-px-md q-mx-md q-mb-xl" v-show="!transactionsTableView">

            <div class="text-h6 row justify-between fit bg-grey-1 q-pa-md">
                <div>
                    Payments Total
                    <br>
                    Account Recievables
                    <br>

                    

                </div>
                <div class="text-right">
                    {{returnSumDailyRemittancePayment | currency}}
                    <br>
                    {{returnSumDailyRemittanceBills | currency}}
                    <br>
                    
                </div>
            </div>
            <hr style="border-height:1px;border-color:#444444" class="full-width">
            <div class="text-h6 row justify-between fit q-mt-md text-teal text-weight-bold bg-grey-1 q-pa-md">
                <div>
                    Total Remittance Amount:
                </div>
                <div class="text-right">
                    {{returnSumDailyRemittance | currency}}
                </div>
            </div>
        </div>
        </div>
        <div class="q-mt-md bordered fit table-cut" v-else>
            <view-transactions-table  v-show="transactionsTableView" :transactdata="selected" :dashboardadmin="returnLogged" :filterSearch="filter"></view-transactions-table>
        </div>

        <q-dialog v-model="adjustDate" persistent>
          <q-card>

            <q-card-section class="row items-center">
              <q-date
                v-model="today"
                landscape
                flat 
                color="teal"
                minimal
                class="full-width"
              />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="done" color="teal" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-dialog v-model="payDialog" >
            <transaction-details :payID="selected['.key']" :memberName="selected.BillingName"></transaction-details>
        </q-dialog>
        <q-dialog v-model="printWholeReport" persistent maximized="" class="">
            <q-card class="my-card">
                <q-btn color="primary" icon="check" label="OK" @click="printWholeReport = false" />
                
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
import { firebaseDb, firebaseSto, firefirestore, Auth2,firebaseAuth } from 'boot/firebase';
import { date } from 'quasar'
import Vue from "vue";
import money from 'v-money'
import TransactionDetails from '../../components/TransactionDetails.vue'
import ViewTransactionsTable from '../../components/ViewTransactionsTable.vue'

Vue.use(money, {precision: 4})
export default {
    components: {
        TransactionDetails,
        ViewTransactionsTable
    },
    data(){
        return{
            transactionsTableView: false,
            byButton: 'day',
            printWholeReport: false,
            payDialog: false,
            initialPagination: {
                descending: false,
                page: 1,
                rowsPerPage:0
                // rowsNumber: xx if getting data from a server
            },            
            filter: '',
            adjustDate: false,
            today: date.formatDate(new Date(),'MM-DD-YYYY'),
            data: [],
            selected: {},
            columns: [
                { name: 'baseDate', align: 'left', label: 'Date', field: 'basis', sortable: true, typeOf: 'date' },
                { name: 'paymentSum', align: 'left', label: 'Payments Sum', field: 'paymentSum', sortable: true, typeOf: 'money'},
                { name: 'billSum', align: 'left', label: 'Accounts Recievables', field: 'billSum', sortable: true,  typeOf: 'money' }, 
                { name: 'totalSum', align: 'left', label: 'Total Remittance', field: 'totalSum', sortable: true, typeOf: 'money' },
                { name: 'Actions', align: 'left', label: 'Actions', },            
            ],
            columnsPrint: [
                { name: 'baseDate', align: 'left', label: 'Date', field: 'basis', sortable: true, typeOf: 'date' },
                { name: 'paymentSum', align: 'left', label: 'Payments Sum', field: 'paymentSum', sortable: true, typeOf: 'money'},
                { name: 'billSum', align: 'left', label: 'Accounts Recievables', field: 'billSum', sortable: true,  typeOf: 'money' }, 
                { name: 'totalSum', align: 'left', label: 'Total Remittance', field: 'totalSum', sortable: true, typeOf: 'money' },          
            ]
        }
    },
    firestore () {
      return {
        MemberData: firebaseDb.collection('MemberData'),
        JeepneyData: firebaseDb.collection('JeepneyData'),
        Transactions: firebaseDb.collection('Transactions'),
        DashboardUsers: firebaseDb.collection('DashboardUsers'),
      }
    },
    computed:{
        returnbyButtonReportLabel(){
            if(this.byButton == 'day'){
                return 'Daily'
            } else if(this.byButton == 'month'){
                return 'Monthly'
            } else {
                return 'Yearly'
            }            
        },
        returnLogged(){
            try {
                let user = firebaseAuth.currentUser
                let uid = user.uid

                return this.DashboardUsers.filter(a=>{
                    return a['.key'] == uid
                })[0]
            } catch (error) {
                return null
            }
        },
        returnToday(){
            return this.today
        },
        returnSumDailyRemittanceBills(){
            let sum = this.$lodash.sumBy(this.returnDailyRemittance,b=>{
                return parseFloat(b.billSum)
            })
            return sum
        },
        returnSumDailyRemittancePayment(){
            let sum = this.$lodash.sumBy(this.returnDailyRemittance,b=>{
                return parseFloat(b.paymentSum)
            })
            console.log(sum,'returnSumDailyRemittancePayment')
            return sum
        },
        returnSumDailyRemittance(){
            let sum = this.$lodash.sumBy(this.returnDailyRemittance,b=>{
                return parseFloat(b.totalSum)
            })
            return sum
        },
        returnByButtonData(){
            if(this.byButton == 'day'){
                return this.returnDailyRemittance
            } else if(this.byButton == 'month'){
                return this.formatDataForMonth
            } else {
                return this.formatDataForYear
            }
        },
        returnDailyRemittance(){
            try {
                let filter = this.Transactions.filter(a=>{
                    let member = this.getMemberData(a.MemberID)
                    if(member !== undefined){
                        a.BillingName = `${member.FirstName} ${member.LastName}`
                        return date.formatDate(a.timestamp.toDate(),'MMM DD YYYY') == date.formatDate(this.today,'MMM DD YYYY')
                    }
                })
                console.log(filter,'filter')

                let remittance = this.$lodash.groupBy(this.Transactions,a=>{
                    return date.formatDate(a.timestamp.toDate(),'MMM DD YYYY')
                })

                console.log(remittance,'remittance')

                let mapping = this.$lodash.map(remittance,function(value,key){
                    let timestamp = value[0].timestamp
                    return {
                        baseDate: key,
                        transactions: value,
                        timestamp: timestamp
                    }
                })
                console.log(mapping,'mapping')

                let order = this.$lodash.orderBy(mapping,'timestamp','asc')

                console.log(order,'order')

                let allDate = []

                let first = this.$lodash.head(order).timestamp.toDate()

                console.log(first,'first')

                let diff = date.getDateDiff(new Date(), first, 'days')

                console.log(diff,'diff')

                for(var x = 0; x <= diff; x++){
                    let basis = date.addToDate(first, { days: x})
                    let basisFormat = date.formatDate(basis,'MM YY DDDD')

                    let filterData = order.filter(a=>{
                        return date.formatDate(a.timestamp.toDate(),'MM YY DDDD') == basisFormat
                    })[0]

                    let obj = {
                        basis: basis,
                        basisMonth: date.formatDate(basis,'MMMM'),
                        basisYear: date.formatDate(basis,'YYYY'),
                    }

                    if(filterData !== undefined){
                        let bills = this.getBillCountAndSum(filterData.transactions)
                        let payments = this.getPaymentCountAndSum(filterData.transactions)
                        let total = this.$lodash.sumBy(filterData.transactions,a=>{
                             return parseFloat(a.Total)
                        })

                        obj.totalSum = total

                        allDate.push({...filterData,...obj,...bills,...payments})
                    } else {
                        obj.billSum = 0
                        obj.billCount = 0
                        obj.paymentCount = 0
                        obj.paymentSum = 0
                        obj.totalSum = 0
                        obj.baseDate = date.formatDate(basis,'MMM DD YYYY')
                        obj.transactions = []
                        allDate.push(obj)
                    }
                } 

                console.log(allDate,'allDate')

                return allDate
            } catch (error) {
                console.log(error,'returnDailyRemittance')
                return []
            }
        },
        formatDataForMonth(){
            try {
                let group = this.$lodash.groupBy(this.returnDailyRemittance,a=>{
                    return `${a.basisMonth} ${a.basisYear}`
                })
                console.log(group,'formatDataForMonth')

                let mapping = this.$lodash.map(group,function(value,key){
                    return {
                        baseDate: key,
                        remittances: value
                    }
                })

                mapping.forEach(a => {
                    let transactions = []
                    a.remittances.forEach(x=>{
                        x.transactions.forEach(q=>{
                            transactions.push(q)
                        })
                    })
                    a.transactions = transactions
                    a.basis = a.remittances[0].basis
                })

                let finalMap = mapping.map(a=>{
                    let bills = this.getBillCountAndSum(a.transactions)
                    let payments = this.getPaymentCountAndSum(a.transactions)
                    let total = this.$lodash.sumBy(a.transactions,x=>{
                            return parseFloat(x.Total)
                    })
                    a.totalSum = total

                    return {...a,...bills,...payments}
                })

                console.log(mapping,'formatDataForMonth')
                console.log(finalMap,'finalMap')

                return finalMap
            } catch (error) {
                console.log(error,'formatDataForMonth')
                return []
            }
        },
        formatDataForYear(){
            try {
                let group = this.$lodash.groupBy(this.returnDailyRemittance,a=>{
                    return `${a.basisYear}`
                })
                console.log(group,'formatDataForYear')

                let mapping = this.$lodash.map(group,function(value,key){
                    return {
                        baseDate: key,
                        remittances: value
                    }
                })

                mapping.forEach(a => {
                    let transactions = []
                    a.remittances.forEach(x=>{
                        x.transactions.forEach(q=>{
                            transactions.push(q)
                        })
                    })
                    a.transactions = transactions
                    a.basis = a.remittances[0].basis
                })

                let finalMap = mapping.map(a=>{
                    let bills = this.getBillCountAndSum(a.transactions)
                    let payments = this.getPaymentCountAndSum(a.transactions)
                    let total = this.$lodash.sumBy(a.transactions,x=>{
                            return parseFloat(x.Total)
                    })
                    a.totalSum = total

                    return {...a,...bills,...payments}
                })

                console.log(mapping,'formatDataForMonth')
                console.log(finalMap,'finalMap')

                return finalMap
            } catch (error) {
                console.log(error,'formatDataForMonth')
                return []
            }
        },
        returnSelectedBaseDate(){
            try {
                if(this.selected !== {}) return this.selected.baseDate
                else { return '' }
            } catch (error) {
                console.log(error,'returnSelectedBaseDate')
                return ''
            }
        }
    },

    methods:{
        getBillCountAndSum(array){
            let count = this.$lodash.filter(array,a=>{
                return a.TransactionType == 'Bills Payment'
            })

            let sum = this.$lodash.sumBy(count,a=>{
                return parseFloat(a.Total)
            })

            // console.log(count.length,'getBillCountAndSum',sum)
            return {billCount: count.length,billSum: sum}
        },
        getPaymentCountAndSum(array){
            let count = this.$lodash.filter(array,a=>{
                return a.TransactionType == 'Payment'
            })

            let sum = this.$lodash.sumBy(count,a=>{
                return parseFloat(a.Total)
            })

            // console.log(count.length,'getPaymentCountAndSum',sum)
            return {paymentCount: count.length,paymentSum: sum}
        },
        getMemberData(id){
            try {
                return this.MemberData.filter(a=>{
                    return a['.key'] == id
                })[0]                
            } catch (error) {
                console.log(error,'get')
                return []
            }

        },
        onRowClick(props){
            
            if(this.selected != props.row)
            {
            this.selected = props.row
            console.log(this.selected,'selected')
            } else {
            this.selected = {}
            }
        },
        viewGo(props){
            console.log(props,'props')
            this.selected = props
            this.transactionsTableView = true
        },
        printMe(){
            window.print();
        }
    }
}
</script>
<style type = "text/css">
   .yesPrint {display:none;}
@media print {
   .noPrint {display:none;}
   .yesPrint {display:block;}

    ::-webkit-scrollbar {
        display: none;
    }

    .table-cut{
        page-break-after: always;
        margin: 0;
        padding: 0;
        height: 100%;
    }

    div .q-table__top{
        display: none;
    }


}

</style>