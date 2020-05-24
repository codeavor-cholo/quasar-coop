<template>
    <div>
        <q-page>
      <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4">Loans <q-icon name="mdi-arrow-right-box" /> {{tab}}</h6>
       <q-separator />
          <q-splitter
            v-model="splitterModel"
            style="height:80vh"
          >
          <template v-slot:before>
            <div class="q-mt-md">
              <q-tabs
                v-model="tab"
                class="text-grey-10"
                vertical=""
                active-bg-color="teal-1"
                active-color="teal"
                @click="drawer = false, selected = {}"
              >
                <q-tab name="Cash Loans" icon="receipt" label="Cash Loans" />
                <q-tab name="Loan Request" icon="queue" label="Loan Request" />
                <q-tab name="Approved Loans" icon="check" label="Approved Loans" />
                <q-tab name="Cash Released" icon="money" label="Cash Released" />
              </q-tabs>
            </div>
          </template>    
          <template v-slot:after>    
                  <q-table
                      :data="returnDataofTable"
                      :columns="returnColumnofTable"  
                      :pagination.sync="pagination"
                      row-key="memberid"
                      flat
                      class="cursor-pointer"
                      :filter="filter"
                  >
                    <template v-slot:top>
                      <div class="row justify-between">
                        <div class="text-h6 text-weight-regular"><q-icon :name="returnIconofTable" /> {{tab}}
                        <br>
                        <div class="text-caption">Click a row to perform transactions.</div>
                        </div>
                        
                        <q-input v-model="filter" filled type="search" dense class="absolute-right" label="Search" clearable="">
                          <template v-slot:append>
                            <q-icon name="search" />
                          </template>
                        </q-input>
                      </div>
                    </template>
                    <template v-slot:body="props">
                      <q-tr :props="props"  @click="onRowClick(props)" :class="props.row == selected ? 'bg-teal-1 text-weight-bold text-teal' : ''">
                        <q-td v-for="col in props.cols.filter(col => col.name !== 'actions')" :key="col.name" :class="col.name == 'memberid' ? 'text-left' : 'text-center'">
                          <q-icon name="double_arrow" v-show="col.name == 'memberid' && props.row == selected" />
                          {{ col.typeData == 'money' ? '₱ ' + col.value : col.value }}
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
          
            <q-list class="q-mt-md">
                <q-item class="q-pa-md">
                    <q-item-section avatar>
                    <q-avatar color="teal" class="text-white">
                        {{returnSelectRow.avatar}}
                    </q-avatar>
                    </q-item-section>
                    <q-item-section>
                    
                    <div class="text-weight-bold">{{returnSelectRow.firstname}} {{returnSelectRow.lastname}}</div>
                    <div class="text-caption text-uppercase">{{returnSelectRow.designation}}</div>
                    </q-item-section>
                </q-item>
                <q-item dense="">
                  <q-item-section>
                    <q-item-label caption lines="2">Advances</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>₱ {{returnSelectRow.advances}}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item dense="" v-show="tab != 'Cash Loans'">
                  <q-item-section>
                    <q-item-label caption lines="2">Request Amount</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>- ₱ {{returnSelectRow.requestAmount}}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator inset v-show="tab != 'Cash Loans'"/>
                <q-item dense="" v-show="tab != 'Cash Loans'">
                  <q-item-section>
                    <q-item-label caption lines="2">Remaining Balance</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>₱ {{returnSelectRow.balance}}</q-item-label>
                  </q-item-section>
                </q-item>                
                <q-item dense="" class="q-mt-md">
                  <q-item-section>
                    <q-item-label caption lines="2" v-if="tab == 'Loan Request'">Date Requested</q-item-label>
                    <q-item-label caption lines="2" v-else-if="tab == 'Approved Loans'">Date Approved</q-item-label>
                    <q-item-label caption lines="2" v-else-if="tab == 'Cash Released'">Date Released</q-item-label>
                    <q-item-label caption lines="2" v-else>Last Transaction</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>{{returnSelectRow.date}}</q-item-label>
                  </q-item-section>
                </q-item>
                <div class="text-h6 q-pt-md q-px-md" v-show="tab == 'Cash Loans'">Latest Transactions</div>
                <div v-for="(n,i) in getLatestTransationDate(returnSelectRow.memberid)" :key="i" v-show="tab == 'Cash Loans'">
                <q-item clickable="" v-ripple class="cursor-pointer" to="/reciept">
                    <q-item-section>
                    <q-item-label>#{{n.TransactionID}}</q-item-label>
                    <q-item-label caption lines="2">₱ {{n.Advances}}.00 (Advances)</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                    <q-item-label caption>{{n.showDate}}</q-item-label>
                    </q-item-section>
                </q-item>

                </div>
                <q-item>  
                  <q-btn color="teal" icon="check_circle" label="APPROVE CASH ADVANCE" class="q-mt-md full-width" disable="" v-if="tab == 'Loan Request'"/>
                  <q-btn color="teal" icon="money" label="RELEASE CASH ADVANCE" class="q-mt-md full-width" disable="" v-else-if="tab == 'Approved Loans'"/>   
                  <div v-else></div>                 
                </q-item>
                <q-item>
                  <q-btn flat icon="close" label="close" color="grey-10" @click="drawer = !drawer, selected = {}" class="full-width" />
                </q-item>

                
            </q-list>
            
        </q-drawer>    
       </q-page>
    </div>
</template>
<script>
import { firebaseDb, firebaseSto, firefirestore, Auth2 } from 'boot/firebase';
import { date } from 'quasar'
export default {
    data(){
        return{
            MemberData: [],
            Transactions: [],
            WithdrawalApplications: [],
            LoanApplications: [],
            drawer: false,
            selected: {},
            tab: 'Cash Loans',
            splitterModel: 20,
            filter: '',
            pagination: {
              sortBy: 'advances',
              descending: true,
              page: 1,
              rowsPerPage: 0
              // rowsNumber: xx if getting data from a server
            },
            savingsColumns: [
                { name: 'memberid', required: true, label: 'MemberID', align: 'left', field: 'memberid', sortable: true },
                { name: 'designation', align: 'center', label: 'Designation', field: 'designation', sortable: true },
                { name: 'lastname', align: 'center', label: 'Last name', field: 'lastname', sortable: true },
                { name: 'firstname', align: 'center', label: 'First name', field: 'firstname', sortable: true },
                { name: 'advances', align: 'center', label: 'Advances / Cash Loans', field: 'advances', sortable: true, typeData: 'money' },
                { name: 'date', align: 'center', label: 'Date', field: 'date', sortable: true},
            ],
            withdrawColumns: [
                { name: 'memberid', required: true, label: 'MemberID', align: 'left', field: 'memberid', sortable: true },
                { name: 'designation', align: 'center', label: 'Designation', field: 'designation', sortable: true },
                { name: 'lastname', align: 'center', label: 'Last name', field: 'lastname', sortable: true },
                { name: 'firstname', align: 'center', label: 'First name', field: 'firstname', sortable: true },
                { name: 'request', align: 'center', label: 'Request Amount', field: 'requestAmount', sortable: true, typeData: 'money' },
                { name: 'date', align: 'center', label: 'Date', field: 'date', sortable: true},
            ],
            approvedColumns: [
                { name: 'memberid', required: true, label: 'MemberID', align: 'left', field: 'memberid', sortable: true },
                { name: 'trackingNo',required: true,label: 'Tracking No#',align: 'left',field: 'trackingNo',sortable: true},
                { name: 'designation', align: 'center', label: 'Designation', field: 'designation', sortable: true },
                { name: 'lastname', align: 'center', label: 'Last name', field: 'lastname', sortable: true },
                { name: 'firstname', align: 'center', label: 'First name', field: 'firstname', sortable: true },
                { name: 'request', align: 'center', label: 'Request Amount', field: 'requestAmount', sortable: true, typeData: 'money' },
                { name: 'date', align: 'center', label: 'Date Approved', field: 'date', sortable: true},
            ],
            cashReleasedColumns: [
                { name: 'memberid', required: true, label: 'MemberID', align: 'left', field: 'memberid', sortable: true },
                { name: 'trackingNo',required: true,label: 'Tracking No#',align: 'left',field: 'trackingNo',sortable: true},
                { name: 'designation', align: 'center', label: 'Designation', field: 'designation', sortable: true },
                { name: 'lastname', align: 'center', label: 'Last name', field: 'lastname', sortable: true },
                { name: 'firstname', align: 'center', label: 'First name', field: 'firstname', sortable: true },
                { name: 'request', align: 'center', label: 'Released Amount', field: 'requestAmount', sortable: true, typeData: 'money' },
                { name: 'date', align: 'center', label: 'Date Released', field: 'date', sortable: true},
            ],
            //sampleDATA
            approvedSample: [
              {
                memberid: 'NTC202020202',
                trackingNo: 'ABCDEFGHI10',
                designation: 'Driver',
                lastname: 'Abu',
                firstname: 'Dahbi',
                requestAmount: 200,
                savings: 2000,
                balance: 1800,
                date: '04-12-2020' 
              }
            ],
            cashReleasedSample: [
              {
                memberid: 'NTC202020202',
                trackingNo: 'ABCDEFGHI10',
                designation: 'Driver',
                lastname: 'Abu',
                firstname: 'Dahbi',
                requestAmount: 200,
                savings: 2000,
                balance: 1800,
                date: '04-12-2020'                
              }
            ],
      }
    },
    firestore () {
      return {
        MemberData: firebaseDb.collection('MemberData'),
        Transactions: firebaseDb.collection('Transactions'),
        WithdrawalApplications: firebaseDb.collection('WithdrawalApplications'),
        LoanApplications: firebaseDb.collection('LoanApplications'),
      }
    },
    computed:{
      returnDataofTable(){
        try {
          if(this.tab == 'Cash Loans'){
            return this.returnAdvancesData
          } else if(this.tab == 'Loan Request'){
            return this.returnLoanRequestData
          } else if(this.tab == 'Approved Loans'){
            return this.approvedSample
          } else {
            return this.cashReleasedSample
          }
        } catch (error) {
          return []
        }
      },
      returnColumnofTable(){
        try {
          if(this.tab == 'Cash Loans'){
            return this.savingsColumns
          } else if(this.tab == 'Loan Request'){
            return this.withdrawColumns
          } else if(this.tab == 'Approved Loans'){
            return this.approvedColumns
          } else {
            return this.cashReleasedColumns
          }
        } catch (error) {
          return []
        }
      },
      returnIconofTable(){
        try {
          if(this.tab == 'Cash Loans'){
            return 'receipt'
          } else if(this.tab == 'Loan Request'){
            return 'queue'
          } else if(this.tab == 'Approved Loans'){
            return 'check'
          } else {
            return 'money'
          }
        } catch (error) {
          return 'check'
        }
      },
      returnAdvancesData(){
        try {
          let map = this.MemberData.map(a=>{
            let latest = this.getLatestTransationDate(a['.key'])
            if(latest.length !== 0){
              return {
                memberid: a['.key'],
                designation: a.Designation,
                lastname: a.LastName,
                firstname: a.FirstName,
                advances: a.Advances,
                date: date.formatDate(latest[0].dateCheck,'MM-DD-YYYY')
              }
            } else {
              return {
                memberid: a['.key'],
                designation: a.Designation,
                lastname: a.LastName,
                firstname: a.FirstName,
                advances: a.Advances,
                date: 'none'
              }              
            }
          })
          return map
        } catch (error) {
          return []
        }
      },
      returnLoanRequestData(){
        try {
          let req = this.LoanApplications.filter(b=>{return b.Status == 'onprocess'})
          let map = req.map(a=>{
            let id = a.MemberID
            console.log(this.getMemberData(id),'member')
            return {
                  memberid: a.MemberID,
                  designation: this.getMemberData(id).Designation,
                  lastname: this.getMemberData(id).LastName,
                  firstname: this.getMemberData(id).FirstName,
                  requestAmount: parseInt(a.Amount),
                  date: date.formatDate(a.timestamp.toDate(),'MM-DD-YYYY')            
            }
          })
          console.log(map,'loans')
          return map          
        } catch (error) {
          return []
        }
      },
      returnSelectRow(){
        try {
          if(this.selected == {}){
            return this.approvedSample[0]
          } else {
            this.selected.avatar = this.selected.firstname.charAt(0)
            return this.selected
          }
        } catch (error) {
          return this.approvedSample[0]
        }
      }
    },
    methods:{
      getLatestTransationDate(id){
        let filter = this.Transactions.filter(a=>{
          a.dateCheck = a.timestamp.toDate()
          a.showDate = date.formatDate(a.timestamp.toDate(),'MM-DD-YYYY')
          return id == a.MemberID && a.Advances != null && a.Advances != 0
        })
        let order = this.$lodash.orderBy(filter,'dateCheck','desc')
        // console.log(id, order)
        if(order.length == 0){
          return []
        } else {
          return order
        }
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
      getMemberData(id){
        try {
          return this.$lodash.filter(this.MemberData,a=>  {return a['.key'] == id} )[0]
        } catch (error) {
          return {}
        }
      }
    }
}
</script>
<style scoped>
.no-choice{
    opacity: 0.6;
}
</style>