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
                <q-tab name="Loan Request" icon="queue" label="Loan Request" />
                <q-tab name="Approved Loans" icon="check" label="Approved Loans" />
                <q-tab name="Rejected Loans" icon="cancel" label="Rejected Loans" />
                <q-tab name="Active Loans" icon="autorenew" label="Active Loans" />
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
                        
                        <q-input v-model="filter" filled type="search" dense class="absolute-right q-mr-md" label="Search" clearable="">
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
                <q-item>
                    <q-item-section avatar>
                    <q-avatar color="teal" class="text-white">
                        {{returnSelectRow.avatar}}
                    </q-avatar>
                    </q-item-section>
                    <q-item-section>
                    
                    <div class="text-weight-bold">{{returnSelectRow.firstname}} {{returnSelectRow.lastname}}</div>
                    <div class="text-caption text-uppercase">{{returnSelectRow.designation}}</div>
                    </q-item-section>
                    <q-item-section side>
                      <span class="text-overline text-uppercase" :class="returnSelectRow.status == 'approved' ? 'text-primary' : 'text-red'" v-show="returnSelectRow.status != 'onprocess'">{{returnSelectRow.status}}</span>
                    </q-item-section>
                </q-item>
                <q-item dense="" v-show="tab == 'Cash Loans'">
                  <q-item-section>
                    <q-item-label caption lines="2">Advances</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>₱ {{returnSelectRow.advances}}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item dense="" v-show="tab != 'Cash Loans'">
                  <q-item-section>
                    <q-item-label caption lines="2">Advances Balance</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>₱ {{returnSelectRow.cashAdvanceBalance}}</q-item-label>
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
                <q-item dense="" v-show="tab != 'Cash Loans'">
                  <q-item-section>
                    <q-item-label caption lines="2">Reason</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label  caption lines="2">{{returnSelectRow.reason}}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item dense="" v-show="tab != 'Cash Loans'">
                  <q-item-section>
                    <q-item-label caption lines="2">Daily Charge</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>₱ {{returnSelectRow.dailyCharge}} <span class="text-caption">/ trip</span> </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item dense="" v-show="tab != 'Cash Loans'" class="q-mb-sm">
                  <q-item-section>
                    <q-item-label caption lines="2">Estimated Days to Pay</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>{{returnSelectRow.estimatedDays}} <span class="text-caption">days</span> </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item dense="" v-show="tab != 'Cash Loans'" class="q-mb-sm">
                  <q-item-section>
                    <q-item-label caption lines="2">Amount to Pay<br>Request Amount + {{InterestRates.amount * 2}}% Interest Rates</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>₱ {{returnSelectRow.toPayAmount}}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item dense="" v-show="tab == 'Rejected Loans'" class="q-mb-sm">
                  <q-item-section>
                    <q-item-label caption lines="2">Reason for Rejecting</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption lines="2" class="text-red">{{returnSelectRow.RejectReason}} </q-item-label>
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
                  <q-btn color="teal"  label="VIEW CASH ADVANCE REQUEST" class="q-mt-md full-width" v-if="tab == 'Loan Request'" @click="confirmDialog = true"/>
                  <q-btn color="teal" icon="money" label="RELEASE CASH ADVANCE" class="q-mt-md full-width" @click="confirmDialog = true" v-else-if="tab == 'Approved Loans'"/>   
                  <div v-else></div>                 
                </q-item>
                <q-item>
                  <q-btn flat icon="close" label="close" color="grey-10" @click="drawer = !drawer, selected = {}" class="full-width" />
                </q-item>

                
            </q-list>


            
        </q-drawer>  

        <!-- Dialogs -->
        <q-dialog v-model="confirmDialog" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <q-avatar icon="warning" color="white" text-color="warning"/>
              <span class="q-ml-sm" v-if="tab == 'Loan Request'">Do you want to approve this cash advance request ?</span>
              <span class="q-ml-sm" v-else>Do you confirm this <b>CASH RELEASE</b> for this loan ?
              <br> This transaction cannot be undone.
              </span>
            </q-card-section>
            <q-card-section class="q-mt-none q-pt-none">

              <q-list bordered>
                <q-item class="q-pa-md">
                    <q-item-section avatar>
                    <q-avatar color="grey" class="text-white">
                        {{returnSelectRow.avatar}}
                    </q-avatar>
                    </q-item-section>
                    <q-item-section>
                    
                    <div class="text-weight-bold">{{returnSelectRow.firstname}} {{returnSelectRow.lastname}}</div>
                    <div class="text-caption text-uppercase">{{returnSelectRow.designation}}</div>
                    </q-item-section>
                </q-item>
                <q-item dense="" v-show="tab != 'Cash Loans'">
                  <q-item-section>
                    <q-item-label caption lines="2">Advances Balance</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>₱ {{returnSelectRow.cashAdvanceBalance}}</q-item-label>
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

                <q-item dense="" v-show="tab != 'Cash Loans'">
                  <q-item-section>
                    <q-item-label caption lines="2">Reason</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label  caption lines="2">{{returnSelectRow.reason}}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item dense="" v-show="tab != 'Cash Loans'" class="q-mb-sm">
                  <q-item-section>
                    <q-item-label caption lines="2">Daily Charge</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>₱ {{returnSelectRow.dailyCharge}} <span class="text-caption">/ trip</span> </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item dense="" v-show="tab != 'Cash Loans'" class="q-mb-sm">
                  <q-item-section>
                    <q-item-label caption lines="2">Estimated Days to Pay</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>{{returnSelectRow.estimatedDays}} <span class="text-caption">days</span> </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item dense="" v-show="tab != 'Cash Loans'" class="q-mb-sm">
                  <q-item-section>
                    <q-item-label caption lines="2">Amount to Pay<br>Request Amount + {{InterestRates.amount * 2}}% Interest Rates</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>₱ {{returnSelectRow.toPayAmount}}</q-item-label>
                  </q-item-section>
                </q-item>

              </q-list>

              <div class="text-overline q-mt-md" v-show="getMemberActiveLoans.length > 0">
                Member has {{getMemberActiveLoans.length}} active loans.
              </div>
              <q-list class="full-width" v-show="getMemberActiveLoans.length > 0">

                <q-item>
                  <q-item-section avatar>
                    <q-icon color="teal" name="check_circle" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption lines="3">
                      Tracking# ABCDEFGHIIJ
                      <br>
                      ₱ 2000 / ₱ 30 (per trip)
                      <br>
                      Paid 16 out 18 trips last month
                    </q-item-label>

                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption lines="2">
                      Estimated <b>67 days</b>
                      <br> to pay
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-card-actions align="center" vertical >
              <q-btn flat label="Approve Loan Request" color="teal " v-close-popup @click="approveCashAdvance" class="full-width" v-if="tab == 'Loan Request'"/>             
              <q-btn flat label="Deny Request" color="red " v-close-popup @click="rejectLoanRequest" class="full-width" v-if="tab == 'Loan Request'"/>  
              <q-btn label="Release Cash Advance" color="teal" icon="money" v-close-popup @click="releaseCashAdvance" class="full-width" v-else/>  
              <q-btn flat label="Close Dialog" color="grey" v-close-popup class="full-width" />
            </q-card-actions>
          </q-card>
        </q-dialog>

       </q-page>
    </div>
</template>
<script>
import { firebaseDb, firebaseSto, firefirestore, Auth2 } from 'boot/firebase';
import { date, QDialog } from 'quasar'
import axios from 'axios'
export default {
    data(){
        return{
            confirmDialog: false,
            MemberData: [],
            Transactions: [],
            WithdrawalApplications: [],
            LoanApplications: [],
            drawer: false,
            selected: {},
            tab: 'Loan Request',
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
                { name: 'trackingNo',required: true,label: 'Tracking No#',align: 'left',field: 'trackID',sortable: true},
                { name: 'designation', align: 'center', label: 'Designation', field: 'designation', sortable: true },
                { name: 'lastname', align: 'center', label: 'Last name', field: 'lastname', sortable: true },
                { name: 'firstname', align: 'center', label: 'First name', field: 'firstname', sortable: true },
                { name: 'request', align: 'center', label: 'Request Amount', field: 'requestAmount', sortable: true, typeData: 'money' },
                { name: 'date', align: 'center', label: 'Date Approved', field: 'dateApproved', sortable: true},
            ],
            rejectColumns: [
                { name: 'memberid', required: true, label: 'MemberID', align: 'left', field: 'memberid', sortable: true },
                { name: 'designation', align: 'center', label: 'Designation', field: 'designation', sortable: true },
                { name: 'lastname', align: 'center', label: 'Last name', field: 'lastname', sortable: true },
                { name: 'firstname', align: 'center', label: 'First name', field: 'firstname', sortable: true },
                { name: 'request', align: 'center', label: 'Request Amount', field: 'requestAmount', sortable: true, typeData: 'money' },
                { name: 'RejectReason', align: 'center', label: 'Reason for Rejection', field: 'RejectReason', sortable: true},
                { name: 'date', align: 'center', label: 'Date Rejected', field: 'dateRejected', sortable: true},
            ],
            cashReleasedColumns: [
                { name: 'memberid', required: true, label: 'MemberID', align: 'left', field: 'memberid', sortable: true },
                { name: 'trackingNo',required: true,label: 'Tracking No#',align: 'left',field: 'trackingNo',sortable: true},
                { name: 'designation', align: 'center', label: 'Designation', field: 'designation', sortable: true },
                { name: 'lastname', align: 'center', label: 'Last name', field: 'lastname', sortable: true },
                { name: 'firstname', align: 'center', label: 'First name', field: 'firstname', sortable: true },
                { name: 'request', align: 'center', label: 'Released Amount', field: 'requestAmount', sortable: true, typeData: 'money' },
                { name: 'currentBalance', align: 'center', label: 'Current Balance', field: 'currentBalance', sortable: true, typeData: 'money' },
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
        CashReleaseTrackers: firebaseDb.collection('CashReleaseTrackers'),
        InterestRates: firebaseDb.collection('FixedPayments').doc('InterestRates')
      }
    },
    computed:{
      returnDataofTable(){
        try {
          if(this.tab == 'Loan Request'){
            let filter = this.LoanApplications.filter(a=>{return a.Status == 'onprocess'})
            return this.returnMapping(filter)
          } else if(this.tab == 'Approved Loans'){
            let approved = this.LoanApplications.filter(a=>{return a.Status == 'approved'})
            return this.returnMapping(approved)
          } else if(this.tab == 'Rejected Loans'){
            let rejects = this.LoanApplications.filter(a=>{return a.Status == 'rejected'})
            return this.returnMapping(rejects)
          } else {
            return this.returnActiveLoans
          }
        } catch (error) {
          return []
        }
      },
      returnColumnofTable(){
        try {
          if(this.tab == 'Loan Request'){
            return this.withdrawColumns
          } else if(this.tab == 'Approved Loans'){
            return this.approvedColumns
          } else if(this.tab == 'Rejected Loans'){  
            return this.rejectColumns
          } else {
            return this.cashReleasedColumns
          }
        } catch (error) {
          return []
        }
      },
      returnIconofTable(){
        try {
          if(this.tab == 'Loan Request'){
            return 'queue'
          } else if(this.tab == 'Approved Loans'){
            return 'check'
          } else if(this.tab == 'Rejected Loans'){  
            return 'cancel'
          } else {
            return 'autorenew'
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
            

            let sumLoans = this.$lodash.sumBy(this.getMemberData(id).activeLoans,a=>{
              return parseInt(a.requestAmount)})
            let balance = (this.getMemberData(id).ShareCapital / 2) - sumLoans

            return {
                  requestID: a['.key'],
                  loanData: a,
                  memberid: a.MemberID,
                  designation: this.getMemberData(id).Designation,
                  lastname: this.getMemberData(id).LastName,
                  firstname: this.getMemberData(id).FirstName,
                  requestAmount: parseInt(a.Amount),
                  date: date.formatDate(a.timestamp.toDate(),'MM-DD-YYYY'),
                  requestDate: date.formatDate(a.timestamp.toDate(),'MM-DD-YYYY'),
                  cashAdvanceBalance: balance, // minus un active loan request amount 
                  toPayAmount: a.toPayAmount,
                  status: a.Status,
                  balance: balance - parseInt(a.Amount),
                  reason: a.Reason,
                  dailyCharge: parseInt(a.DailyCharge),
                  activeLoans: this.getMemberData(id).activeLoans == undefined ? [] : this.getMemberData(id).activeLoans,
                  estimatedDays: a.EstimatedDays,
                  Phone: this.getMemberData(id).Phone    
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
            console.log(this.selected,'selectedrow')
            return this.selected
          }
        } catch (error) {
          return this.approvedSample[0]
        }
      },
      getMemberActiveLoans(){
        try {
          let activeLoans = this.getMemberData(this.returnSelectRow.memberid).activeLoans
          if(activeLoans == undefined) return []
          return activeLoans
        } catch (error) {
          return []
        }
      },
      returnActiveLoans(){
        try {
          let withLoans = this.MemberData.filter(a=> {return a.activeLoans !== undefined && a.activeLoans.length !== 0})

          let mapDisplay = []
          
          withLoans.forEach(q=>{
            q.activeLoans.forEach(w=>{
              console.log('loan data',w)
              let object = {
                memberid: q['.key'],
                trackingNo: w.CashReleaseTrackingID.toUpperCase(),
                designation: q.Designation,
                lastname: q.LastName,
                firstname: q.FirstName,
                requestAmount: parseInt(w.Amount),
                date: date.formatDate(new Date(w.dateReleased),'MM-DD-YYYY'),
                currentBalance: w.TotalBalance - w.paidAmount
              }

              mapDisplay.push(object)

            })
          })
          console.log(withLoans,'withLoans')
          console.log(mapDisplay,'active loans display')

          return mapDisplay
        } catch (error) {
          console.log(error,'returnActiveLoans')
          return []
        }
      }
    },
    methods:{
      returnMapping(req){
        try {
          console.log(req,'req')
          let map = req.map(a=>{
            let id = a.MemberID
            console.log(this.getMemberData(id),'member')
            

            let sumLoans = this.$lodash.sumBy(this.getMemberData(id).activeLoans,a=>{
              return parseInt(a.Amount)})
              console.log(sumLoans,'sumLoans')
            let balance = (this.getMemberData(id).ShareCapital / 2) - sumLoans

            return {
                  requestID: a['.key'],
                  loanData: a,
                  memberid: a.MemberID,
                  dateApproved: a.dateApproved != null ? date.formatDate(a.dateApproved.toDate(),'MM-DD-YYYY') : null,
                  trackID: a.CashReleaseTrackingID != null ? a.CashReleaseTrackingID.toUpperCase() : null,
                  RejectReason: a.RejectReason != null ? a.RejectReason : null,
                  dateRejected: a.dateRejected != null ? date.formatDate(a.dateRejected.toDate(),'MM-DD-YYYY') : null,
                  designation: this.getMemberData(id).Designation,
                  lastname: this.getMemberData(id).LastName,
                  firstname: this.getMemberData(id).FirstName,
                  requestAmount: parseInt(a.Amount),
                  date: date.formatDate(a.timestamp.toDate(),'MM-DD-YYYY'),
                  requestDate: date.formatDate(a.timestamp.toDate(),'MM-DD-YYYY'),
                  cashAdvanceBalance: balance, // minus un active loan request amount 
                  status: a.Status,
                  toPayAmount: a.toPayAmount,
                  balance: balance - parseInt(a.Amount),
                  reason: a.Reason,
                  dailyCharge: parseInt(a.DailyCharge),
                  activeLoans: this.getMemberData(id).activeLoans == undefined ? [] : this.getMemberData(id).activeLoans,
                  estimatedDays: a.EstimatedDays,
                  Phone: this.getMemberData(id).Phone    
            }
          })
          console.log(map,'loans')
          return map          
        } catch (error) {
          return []
        }
      },
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
      },
      approveCashAdvance(){
        let data = this.returnSelectRow
        console.log(data,'data')
        this.$q.dialog({
          title: 'Confirm Loan Approval',
          message: 'Would you like to approve this loan request?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          console.log('>>>> OK')
          //approve loan application => change status only
          firebaseDb.collection("LoanApplications").doc(data.requestID).update({Status: 'approved',dateApproved: firefirestore.FieldValue.serverTimestamp()})
          .then(()=>{
            console.log('update success! approved')
            firebaseDb.collection("CashReleaseTrackers").add({MemberID: data.memberid,requestAmount: data.requestAmount, loanAppID: data.requestID})
            .then((doc)=>{
              let trackID = doc.id.toString().slice(0,10)
              this.sendSMS(data.Phone,`Your P${data.requestAmount}.00 loan is approved! Use this Tracking# ${trackID.toUpperCase()} to get your cash advance. `)
              firebaseDb.collection("LoanApplications").doc(data.requestID).update({CashReleaseTrackingID: trackID})
              .then(()=>{
                this.selected = {}
                this.drawer = false
                this.$q.notify({
                  type: 'positive',
                  message: `Loan Application Approval Success`
                })  
              })
              .catch(error=>{
                console.log('update error',error)
              })
            })
            //send SMS that loan is approved
          })
          .catch(error=>{
            console.log(error,'error')
          })

        }).onCancel(() => {
          console.log('>>>> Cancel')
          this.confirmDialog = true
        })       

      },
      releaseCashAdvance(){
        let data = this.returnSelectRow
        console.log('row data',data)

        let releaseID = this.CashReleaseTrackers.filter(a=>{
          return data.requestID == a.loanAppID
        })[0]

        console.log(releaseID['.key'],'getId')
        const newday = new Date()
        let today = newday.getTime()
        console.log(today,'today')

        this.$q.dialog({
          title: `Confirm Cash Release`,
          message: `Do you confirm this ₱	${data.requestAmount}.00 CASH RELEASE (CASH ADVANCE) ?`,
          cancel: true,
          persistent: true
        }).onOk(() => {
          console.log('start update data')
          // update cashreleased tracker
          // update loan applications
          // update member data activeLoans and advances
          //sms loan details (Ex: Interest Rates will be add up after Every 22th of the month)
          

          firebaseDb.collection("CashReleaseTrackers").doc(releaseID['.key']).update({Status: 'released',dateReleased: today })
          .then(()=>{
            console.log('cash trackers update success')
            firebaseDb.collection("LoanApplications").doc(data.requestID).update({Status: 'released',dateReleased: today, requestID: data.requestID })
            .then(()=>{
              console.log('loan app update success')

              let apply = this.LoanApplications.filter(q=>{return q['.key'] == data.requestID})[0]
              let obj = {...apply}
              obj.paidAmount = 0
              obj.dateActivated = today
              delete obj['.key']
              console.log(obj,'obj')

              let array = data.activeLoans
              array.push(obj)

              let sum = this.$lodash.sumBy(array,a=>{return parseInt(a.toPayAmount)}) //updated since need interest agad

              firebaseDb.collection("MemberData").doc(data.memberid).update({activeLoans: array,Advances: sum})
              .then(()=>{
                console.log('memberdata update success')
                let day = date.formatDate(new Date,'Do')
                console.log(day,'day')
                this.sendSMS(data.Phone,`P${data.requestAmount}.00 cash loan is ACTIVE. 2% Interest will add to the balance every ${day} of the month after 2 months.`)
                this.selected = {}
                this.drawer = false    
                this.$q.notify({
                  type: 'positive',
                  message: `Cash Release Confirmation Success`
                })           
              }).catch(error=>{
                console.log('memberdata update error',error)
              })
            }).catch(error=>{
              console.log('loan application update error',error)
            })
          }).catch(error=>{
            console.log('tracker update error',error)
          })
        }).onCancel(() =>{
          console.log('>>>> Cancel')
          this.confirmDialog = true          
        })
      },
      rejectLoanRequest(){
        let data = this.returnSelectRow
        this.$q.dialog({
          title: 'Deny Request',
          message: 'What is the reason for denying the request ?',
          prompt: {
            model: '',
            type: 'text', // optional
          },
          cancel: true,
          persistent: true
        }).onOk(reason => {
          console.log('>>>> OK, received', reason)
          let reasonData = reason
          firebaseDb.collection("LoanApplications").doc(data.requestID).update({Status: 'rejected', RejectReason: reasonData, dateRejected: firefirestore.FieldValue.serverTimestamp()})
          .then(() =>{
              this.sendSMS(data.Phone,`Your P${data.requestAmount}.00 loan is rejected! For this reason: ${reasonData}.`)
              this.selected = {}
              this.drawer = false
              this.$q.notify({
                type: 'negative',
                message: `Loan Application Rejected.`
              })  
          })
          .catch(error=>{
            console.log(error,'error')
          })
        }).onCancel(() => {
          console.log('>>>> Cancel')
          this.confirmDialog = true
        })        
      },
      sendSMS(number,message){
        // this.$refs.stepper.next()
        let header= {
              'Access-Control-Allow-Origin': '*',
        }
        let apinumber = 2

        var data = 'number=' + number + '&' + 'message=' + message + '&' + 'apinumber=' + apinumber
        console.log(data)
        axios.post('https://toned-tabulation.000webhostapp.com/index.php', data)
        .then(response => {
          console.log(response)
        })
        .catch((error) => {
        console.log(error.response)
        })   
      }
    }
}
</script>
<style scoped>
.no-choice{
    opacity: 0.6;
}
</style>