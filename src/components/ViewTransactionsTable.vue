<template>
        <div class="fit table-cut">
        <div class="fit yesPrint">
            <div class="text-h6 row justify-between fit q-mb-md">
                <div>
                    Daily Remittance Report
                    <div class="text-caption">Prepared By: {{dashboardadmin.FirstName}} {{dashboardadmin.LastName}}</div>
                </div>
                <div class="text-right text-weight-light">
                    {{transactdata.baseDate}} Transactions
                </div>
            </div>
            <hr style="border-height:1px;border-color:#444444" class="full-width">
        </div>
        <q-table
            class="q-pa-md "
            :data="returnDailyCollections"
            :columns="columns"
            row-key="name"
            flat
            :pagination.sync="initialPagination"
            :filter="filterSearch"
        >
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
                    <span v-if="col.typeOf !== 'money'">{{ col.value  }}</span><span v-else>{{ col.value | currency }}</span>
                </q-td>
                <q-td key="Actions" v-if="props.row == selected" class="noPrint">
                    <q-btn color="teal" icon="receipt" label="view receipt" @click="viewGo(props.row)" flat/>
                </q-td>
                <q-td key="Actions" v-else class="noPrint">
                    <q-btn color="teal" icon="receipt" label="view receipt" @click="viewGo(props.row)" flat/>
                </q-td>
                </q-tr>
            </template>  
        </q-table>
        
        <div class="q-px-md q-mx-md q-mb-xl">

            <div class="text-h6 row justify-between fit bg-grey-1 q-pa-md">
                <div>
                    Payments Total
                    <br>
                    Account Recievables
                    <br>

                    

                </div>
                <div class="text-right">
                    {{returnSumDailyCollectionsPayment | currency}}
                    <br>
                    {{returnSumDailyCollectionsBills | currency}}
                    <br>
                    
                </div>
            </div>
            <hr style="border-height:1px;border-color:#444444" class="full-width">
            <div class="text-h6 row justify-between fit q-mt-md text-teal text-weight-bold bg-grey-1 q-pa-md">
                <div>
                    Total Collections Amount:
                </div>
                <div class="text-right">
                    {{returnSumDailyCollections | currency}}
                </div>
            </div>
        </div>
        <q-dialog v-model="payDialog" >
            <transaction-details :payID="selected['.key']" :memberName="selected.BillingName"></transaction-details>
        </q-dialog>
        </div>
</template>
<script>
import { firebaseDb, firebaseSto, firefirestore, Auth2,firebaseAuth } from 'boot/firebase';
import { date } from 'quasar'
import Vue from "vue";
import money from 'v-money'
import TransactionDetails from './TransactionDetails.vue'

Vue.use(money, {precision: 4})
export default {
    components:{
        TransactionDetails
    },
    data(){
        return {
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
                { name: 'MemberID', align: 'left', label: 'Member ID', field: 'MemberID', sortable: true },
                { name: 'BillingName', align: 'left', label: 'Name', field: 'BillingName', sortable: true },
                { name: 'TransactionID', align: 'left', label: 'TransactionID#', field: 'TransactionID', sortable: true }, 
                { name: 'OrNo', align: 'left', label: 'OrNo#', field: 'OrNo', sortable: true },            
                { name: 'TransactionType', align: 'left', label: 'Transaction Type', field: 'TransactionType', sortable: true },
                { name: 'Total', align: 'left', label: 'Total', field: 'Total', sortable: true, typeOf: 'money' },
                { name: 'Actions', align: 'left', label: 'Actions', },            
            ],
            columnsPrint: [
                { name: 'MemberID', align: 'left', label: 'Member ID', field: 'MemberID', sortable: true },
                { name: 'BillingName', align: 'left', label: 'Name', field: 'BillingName', sortable: true },
                { name: 'TransactionID', align: 'left', label: 'TransactionID#', field: 'TransactionID', sortable: true }, 
                { name: 'OrNo', align: 'left', label: 'OrNo#', field: 'OrNo', sortable: true },            
                { name: 'TransactionType', align: 'left', label: 'Type', field: 'TransactionType', sortable: true },
                { name: 'Total', align: 'left', label: 'Total', field: 'Total', sortable: true, typeOf: 'money' },           
            ]
        }
    },
    props: {
        transactdata: {
            type: Object,
            required: true,
            default: () => {
                return {
                    baseDate: "",
                    basis: new Date(),
                    basisMonth: "",
                    basisYear: "2020",
                    billCount: 0,
                    billSum: 0,
                    paymentCount: 0,
                    paymentSum: 0,
                    timestamp: new Date(),
                    totalSum: 0,
                    transactions: []
                }
            }
        },
        dashboardadmin:{
            type: Object,
            required: true,
        },
        filterSearch:{
            type: String,
            required: true,            
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
        returnSumDailyCollectionsBills(){
            let sum = this.$lodash.sumBy(this.returnDailyCollections.filter(a=>{
                return a.TransactionType == 'Bills Payment'
            }),b=>{
                return parseFloat(b.Total)
            })
            return sum
        },
        returnSumDailyCollectionsPayment(){
            let sum = this.$lodash.sumBy(this.returnDailyCollections.filter(a=>{
                return a.TransactionType == 'Payment'
            }),b=>{
                return parseFloat(b.Total)
            })
            console.log(sum,'returnSumDailyCollectionsPayment')
            return sum
        },
        returnSumDailyCollections(){
            let sum = this.$lodash.sumBy(this.returnDailyCollections,b=>{
                return parseFloat(b.Total)
            })
            return sum
        },
        returnDailyCollections(){
            try {
                let wow = this.transactdata.transactions
                console.log(wow,'wow')
                let filter = wow.filter(a=>{
                    let member = this.getMemberData(a.MemberID)
                    if(member !== undefined){
                        a.BillingName = `${member.FirstName} ${member.LastName}`
                        return a
                    }
                })
                console.log(filter,'filter')
                return this.$lodash.orderBy(filter,a=>{
                    return a.timestamp.toDate()
                },'desc')
            } catch (error) {
                console.log(error,'returnDailyCollections')
                return []
            }
        }
    },

    methods:{
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
            this.payDialog = true
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

}
</script>