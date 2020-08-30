<template>
    <q-page>
        <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4 noPrint">Reports <q-icon name="mdi-arrow-right-box" /> Member Payments
          <!-- <q-btn color="primary" icon="check" label="OK" @click="test" class="float-right q-mr-md" dense/> -->
          <span v-if="returnLabel !== null" class="text-weight-light"><q-icon name="mdi-arrow-right-box" /> {{returnLabel}}</span>
          <q-chip @click="adjustDate = true" clickable="" icon="event" color="warning" text-color="white" :label="returnFilterLabel" dense removable="" class="float-right q-mr-md cursor-pointer" v-show="goFilter" @remove="goFilter = false"/>
          <q-btn color="grey-10" class="float-right q-mr-md" flat dense="" icon="event" label="filter date" @click="adjustDate = true" v-show="model !== null" /> 
        </h6>   
        <q-separator class="noPrint"/>     
        <div class="fit  table-cut">
        <div class="fit yesPrint">
            <div class="text-h6 row justify-between fit q-mb-md">
                <div>
                    <div>Member Payments</div>
                    <span v-show="returnLabel !== null"><q-icon name="mdi-arrow-right-box" /> {{returnLabel}}</span>
                    <br><span><q-icon name="mdi-arrow-right-box"/> <span v-if="returnFilterLabel !== ''"> {{returnFilterLabel}}</span> <span v-else> All Payments</span> </span>
                    <div class="text-caption">Prepared By: {{returnLogged.FirstName}} {{returnLogged.LastName}}</div>
                </div>
                <div class="text-right">
                    
                </div>
            </div>
            <hr style="border-height:1px;border-color:#444444" class="full-width">
        </div>
        <q-table
            class="q-pa-md"
            :data="returnMemberPayments"
            :columns="columns"
            row-key="name"
            flat
            :pagination.sync="initialPagination"
            :filter="filter"
        >
            <template v-slot:top>

                <div class="fit noPrint row justify-between">
                    
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
    
                    <q-select 
                        :dense="model !== null"
                        style="width:450px;"
                        v-model="model" 
                        :options="membersIdOpt" 
                        :label="model == null ? 'Search Member': ''" 
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
                    <div class="row" v-if="model == null">
                        <q-banner class="bg-info text-white float-right">
                           <q-icon name="info" /> Select a member to show payment records
                        </q-banner>
                    </div>
                    <div class="row" v-else>
                    <q-input v-model="filter" v-show="model !== null" filled color="teal" type="search" dense  label="Search"  clearable="" style="width:250px;" class="q-mr-md">
                            <template v-slot:append>
                            <q-icon name="search" />
                            </template>
                    </q-input>
                    <q-btn color="grey-10" icon="print" label="print report" @click="printMe" v-show="model !== null"/>
                    </div>
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
                    <span v-if="col.typeOf == 'money'">{{ col.value | currency }}</span>
                    <span v-else-if="col.typeOf == 'date'">
                        {{$moment(col.value).format('LLL')}}
                    </span>
                    <span v-else>{{ col.value }}</span>
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
                    Member Payment Total:
                </div>
                <div class="text-right">
                    {{returnSumDailyCollections | currency}}
                </div>
            </div>
        </div>
        </div>

        <q-dialog v-model="adjustDate" persistent>
          <q-card style="width:50vw" class="q-pa-md">
            <q-card-section class="row items-center justify-between">
                <div class="text-h6">Filter Date</div>
                <q-btn-toggle
                v-model="dateButtonOption"
                toggle-color="teal"
                :options="[
                    {label: 'by date', value: 'byDate'},
                    {label: 'date range', value: 'dateRange'},
                ]"
                @input="goFilter = false"
                />
            </q-card-section>
            <q-card-section class="row items-center" v-if="dateButtonOption == 'byDate'">
                <q-input v-model="filterDateInput" type="date" label="Date" outlined="" class="col q-mr-md" color="teal" :rules="[val => !!val || 'Field is required']"/>
            </q-card-section>
            <q-card-section class="row items-center" v-else>
                <q-input v-model="filterDateFrom" type="date" label="From" outlined="" class="col q-mr-md" color="teal" :rules="[val=> new Date(val) < new Date(this.filterDateTo) || 'Check Your Date Range',val => !!val || 'Field is required']"/>
                <q-input v-model="filterDateTo" type="date" label="To" outlined="" class="col" color="teal" :rules="[val=> new Date(val) > new Date(this.filterDateFrom) || 'Check Your Date Range',val => !!val || 'Field is required',val=> new Date(val) < new Date() || `There is no payment records in the future. Please select today's date for the date range maximum.`]"/>
            </q-card-section>

            <q-card-actions align="right" class="row justify-between">
              <q-btn flat label="remove filter" color="grey-10" icon="close" v-close-popup @click="goFilter = false" v-show="goFilter"/>
              <q-btn flat label="done" color="teal" v-close-popup @click="showInputData"/>
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
                    :data="returnMemberPayments"
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
                            <span v-if="col.typeOf == 'money'">{{ col.value | currency }}</span>
                            <span v-else-if="col.typeOf == 'date'">
                                {{$moment(col.value).format('LLL')}}
                            </span>
                            <span v-else>{{ col.value }}</span>
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
                                Member Payment Total:
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
import { mapGetters, mapMutations } from 'vuex'
import money from 'v-money'
import TransactionDetails from '../../components/TransactionDetails.vue'

Vue.use(money, {precision: 4})
export default {
    components: {
        TransactionDetails
    },
    data(){
        return{
            goFilter: false,
            filterDateInput: date.formatDate(new Date(),'YYYY-MM-DD'),
            filterDateTo:  date.formatDate(new Date(),'YYYY-MM-DD'),
            filterDateFrom: '',
            membersIdOpt: Object.freeze(this.membersIdOptions),
            model: null,
            dateButtonOption: 'byDate',
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
                { name: 'Date', align: 'left', label: 'Date', field: 'basisDate', sortable: true, typeOf: 'date' },   
                { name: 'TransactionID', align: 'left', label: 'TransactionID#', field: 'TransactionID', sortable: true }, 
                { name: 'OrNo', align: 'left', label: 'OrNo#', field: 'OrNo', sortable: true },            
                { name: 'TransactionType', align: 'left', label: 'Transaction Type', field: 'TransactionType', sortable: true },

                { name: 'Total', align: 'left', label: 'Total', field: 'Total', sortable: true, typeOf: 'money' },
                
                { name: 'Actions', align: 'left', label: 'Actions', },            
            ],
            columnsPrint: [
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
        returnFilterLabel(){
            try {
                if(this.goFilter){
                    if(this.dateButtonOption == 'byDate'){
                        return `${this.$moment(this.filterDateInput).format('LL')}`
                    } else {
                        return `${this.$moment(this.filterDateFrom).format('LL')} - ${this.$moment(this.filterDateTo).format('LL')}`
                    }
                } else {
                    return ''
                }
            } catch (error) {
                return ''
            }
        },
        returnLabel(){
            try {
                return this.model.label
            } catch (error) {
                return null
            }
        },
        membersIdOptions () {
            let opt = this.MemberData.map(d => {
                let full = d.FirstName + ' ' + d.LastName
                let opID = ''
                if(d.Designation == 'Operator'){ opID = d['.key'] }
                else { 
                    let op = {...d.Operator}
                    opID = op.MemberID 
                }
            return {
                label: d['.key'] +' - '+full.toUpperCase() + ' ('+d.Designation+')',
                value: d['.key'] +' - '+full.toUpperCase() + ' ('+d.Designation+')',
                fullName: full,
                id: d['.key'],
                designation: d.Designation,
                OperatorID: opID
            }
            })
            // console.log(opt,'opt')
            return opt
            // Object.freeze(options)
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
        returnSumDailyCollectionsBills(){
            let sum = this.$lodash.sumBy(this.returnMemberPayments.filter(a=>{
                return a.TransactionType == 'Bills Payment'
            }),b=>{
                return parseFloat(b.Total)
            })
            return sum
        },
        returnSumDailyCollectionsPayment(){
            let sum = this.$lodash.sumBy(this.returnMemberPayments.filter(a=>{
                return a.TransactionType == 'Payment'
            }),b=>{
                return parseFloat(b.Total)
            })
            // console.log(sum,'returnSumDailyCollectionsPayment')
            return sum
        },
        returnSumDailyCollections(){
            let sum = this.$lodash.sumBy(this.returnMemberPayments,b=>{
                return parseFloat(b.Total)
            })
            return sum
        },
        returnMemberPayments(){
            try {
                let filter = this.Transactions.filter(a=>{
                    let member = this.getMemberData(a.MemberID)
                    if(member !== undefined){
                        a.BillingName = `${member.FirstName} ${member.LastName}`
                    }                    
                    a.basisDate = a.timestamp.toDate()
                    return a.MemberID == this.model.id
                })
                // console.log(filter,'filter')

                if(this.goFilter){
                    let baseStart = null
                    if(this.dateButtonOption == 'byDate'){
                        filter = filter.filter(a=>{
                             return date.formatDate(a.timestamp.toDate(),'MMM DD YYYY') == date.formatDate(this.filterDateInput,'MMM DD YYYY')
                        })
                    } else {
                        filter = filter.filter(a=>{
                            if (date.isBetweenDates(a.timestamp.toDate(),new Date(this.filterDateFrom), new Date(this.filterDateTo), { inclusiveFrom: true, inclusiveTo: true, onlyDate: true  })) {
                                return a
                            }
                        })
                    }
                }

                return this.$lodash.orderBy(filter,a=>{
                    return a.timestamp.toDate()
                },'desc')
            } catch (error) {
                // console.log(error,'returnMemberPayments')
                return []
            }
        }
    },

    methods:{
        changeMemberDetails(val){
            // console.log(val,'selected val')
        },  
        removeMemberDetails(){
            this.model = null
            this.goFilter = false
            this.dateButtonOption = 'byDate'
        },
        getMemberData(id){
            try {
                return this.MemberData.filter(a=>{
                    return a['.key'] == id
                })[0]                
            } catch (error) {
                // console.log(error,'get')
                return []
            }

        },
        onRowClick(props){
            
            if(this.selected != props.row)
            {
            this.selected = props.row
            // console.log(this.selected,'selected')
            } else {
            this.selected = {}
            }
        },
        viewGo(props){
            // console.log(props,'props')
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
        showInputData(){
            this.goFilter = true
            // console.log(this.filterDateInput, 'specific')

            // console.log(this.filterDateFrom, 'from')

            // console.log(this.filterDateTo, 'to')
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