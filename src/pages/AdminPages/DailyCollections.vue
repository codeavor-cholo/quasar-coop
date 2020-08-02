<template>
    <q-page>
        <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4 noPrint">Reports <q-icon name="mdi-arrow-right-box" /> Daily Collections ({{returnToday}})
          <!-- <q-btn color="primary" icon="check" label="OK" @click="test" class="float-right q-mr-md" dense/> -->
          <q-btn color="grey-10" class="float-right q-mr-md" flat dense="" icon="event" label="filter date" @click="adjustDate = true" /> 
        </h6>   
        <q-separator class="noPrint"/>     
        <div class="fit  table-cut">
        <div class="fit yesPrint">
            <div class="text-h6 row justify-between fit q-mb-md">
                <div>
                    Daily Collections Report
                    <div class="text-caption">Prepared By: {{returnLogged.FirstName}} {{returnLogged.LastName}}</div>
                </div>
                <div class="text-right">
                    {{$moment(today).format('LL')}}
                </div>
            </div>
            <hr style="border-height:1px;border-color:#444444" class="full-width">
        </div>
        <q-table
            class="q-pa-md"
            :data="returnDailyCollections"
            :columns="showInDetails == true ? columns2 : columns"
            row-key=".key"
            flat
            :pagination.sync="initialPagination"
            :filter="filter"
        >
            <template v-slot:top>

                <div class="fit noPrint">
                    <q-btn color="teal" :label="showInDetails == true ? 'Back to Summary' : 'Show In Detailed'"  :icon="showInDetails == true ? 'arrow_right' : 'view_module    '" @click="showInDetails = !showInDetails" class="float-right q-ml-md"/>
                    <q-btn color="grey-10" icon="print" label="print report" @click="printMe" class="float-right"/>
                    <!-- <q-btn-toggle
                    v-model="byButton"
                    toggle-color="teal"
                    :options="[
                        {label: 'Day', value: 'day'},
                        {label: 'Month', value: 'month'},
                        {label: 'Year', value: 'year'}
                    ]"
                    class="float-right q-mr-md"
                    /> -->
                    <q-input v-model="filter" filled color="teal" type="search" dense  label="Search" clearable="" style="width:250px;">
                        <template v-slot:append>
                        <q-icon name="search" />
                        </template>
                    </q-input>
                </div>
            </template>  
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
                <q-td key="Actions" class="noPrint">
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

            <q-card flat class="q-pb-lg my-card table-cut" id="printShit">
                <q-card-section class="row items-center q-pb-none noPrint ">
                <q-btn label="Print Report" color="grey-10" v-close-popup @click="printMe"/>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-card-section >
                <q-table
                    :data="returnDailyCollections"
                    :columns="columnsPrint"
                    row-key="name"
                    
                    flat
                    :pagination.sync="initialPagination"
                    :filter="filter"
                    separator="false"
                >
                    <template v-slot:top>
                        <div class="text-h6 row justify-between fit q-mb-md">
                            <div>
                                Daily Collections Report
                                <div class="text-caption">Prepared By: {{returnLogged.FirstName}} {{returnLogged.LastName}}</div>
                            </div>
                            <div class="text-right">
                                {{$moment(today).format('LL')}}
                            </div>
                        </div>
                        <hr style="border-height:1px;border-color:#444444" class="full-width">
                    </template>  
                    <template v-slot:body="props" class="body-cut">
                        <q-tr :props="props"  :class="props.row == selected ? 'bg-teal-1 text-weight-bold text-teal' : '#'">
                        <q-td v-for="col in props.cols.filter(col => col.name !== 'Actions')" :key="col.name" >
                            <q-icon name="double_arrow" v-show="col.name == 'MemberID' && props.row == selected" />
                            <span v-if="col.typeOf !== 'money'">{{ col.value  }}</span><span v-else>{{ col.value | currency }}</span>
                        </q-td>
                        </q-tr>
                    </template>  
                    <template v-slot:bottom>
                        <div class="text-h6 row justify-between fit q-my-md">
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
                        <div class="text-h6 row justify-between fit q-mt-md text-teal text-weight-bold">
                            <div>
                                Total Collections Amount:
                            </div>
                            <div class="text-right">
                                {{returnSumDailyCollections | currency}}
                            </div>
                        </div>
                    </template>  
                </q-table>      
                </q-card-section>
                <q-card-actions align="center" class="noPrint">

                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
import { firebaseDb, firebaseSto, firefirestore, Auth2,firebaseAuth } from 'boot/firebase';
import { date } from 'quasar'
import Vue from "vue";
import money from 'v-money'
import { mapGetters, mapMutations } from 'vuex'
import TransactionDetails from '../../components/TransactionDetails.vue'

Vue.use(money, {precision: 4})
export default {
    components: {
        TransactionDetails
    },
    data(){
        return{
            showInDetails: false,
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
            columns2: [
                { name: 'MemberID', align: 'left', label: 'Member ID', field: 'MemberID', sortable: true },
                { name: 'OrNo', align: 'left', label: 'OrNo#', field: 'OrNo', sortable: true },            
                { name: 'TransactionType', align: 'left', label: 'Transaction Type', field: 'TransactionType', sortable: true },
                { name: 'MF', align: 'left', label: 'MGT.FEE', field: 'ManagementFee', sortable: true, typeOf: 'money' }, 
                { name: 'SS', align: 'left', label: 'S/S', field: 'ShareCapital', sortable: true, typeOf: 'money' }, 
                { name: 'MSD', align: 'left', label: 'MSD', field: 'SavingsDeposit', sortable: true, typeOf: 'money' }, 
                { name: 'ADV', align: 'left', label: 'ADV.', field: 'AdvancesAmount', sortable: true, typeOf: 'money' }, 
                { name: 'AR', align: 'left', label: 'AR', field: 'AmountPaid', sortable: true, typeOf: 'money' }, 
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
                let filter = this.Transactions.filter(a=>{
                    let member = this.getMemberData(a.MemberID)
                    if(member !== undefined){
                        a.BillingName = `${member.FirstName} ${member.LastName}`
                        return date.formatDate(a.timestamp.toDate(),'MMM DD YYYY') == date.formatDate(this.today,'MMM DD YYYY')
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
        ...mapMutations('SubModule', {
            closeDrawer: 'setDrawerPrint'
        }),
        printMe(){
            this.closeDrawer()
            let self = this
            setTimeout(function(){ 
            window.print();
            }, 2000);
        },
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