<template>
  <q-page>
    <div>
      <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4">Savings <q-icon name="mdi-arrow-right-box" /> {{tab}}</h6>
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
                <q-tab name="Member Savings" icon="account_balance" label="Member Savings" />
                <q-tab name="Withdraw Requests" icon="payment" label="Withdraw Requests" />
                <q-tab name="Approved Requests" icon="check" label="Approved Requests" />
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
                    <q-item-label caption lines="2">Savings</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>₱ {{returnSelectRow.savings}}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item dense="" v-show="tab != 'Member Savings'">
                  <q-item-section>
                    <q-item-label caption lines="2">Request Amount</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>- ₱ {{returnSelectRow.requestAmount}}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator inset v-show="tab != 'Member Savings'"/>
                <q-item dense="" v-show="tab != 'Member Savings'">
                  <q-item-section>
                    <q-item-label caption lines="2">Remaining Balance</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>₱ {{returnSelectRow.balance}}</q-item-label>
                  </q-item-section>
                </q-item>                
                <q-item dense="" class="q-mt-md">
                  <q-item-section>
                    <q-item-label caption lines="2" v-if="tab == 'Withdraw Requests'">Date Requested</q-item-label>
                    <q-item-label caption lines="2" v-else-if="tab == 'Approved Requests'">Date Approved</q-item-label>
                    <q-item-label caption lines="2" v-else-if="tab == 'Cash Released'">Date Released</q-item-label>
                    <q-item-label caption lines="2" v-else>Last Transaction</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>{{returnSelectRow.date}}</q-item-label>
                  </q-item-section>
                </q-item>
                <div class="text-h6 q-pt-md q-px-md" v-show="tab == 'Member Savings'">Latest Transactions</div>
                <div v-for="(n,i) in getLatestTransationDate(returnSelectRow.memberid)" :key="i" v-show="tab == 'Member Savings'">
                <q-item clickable="" v-ripple class="cursor-pointer" to="/reciept">
                    <q-item-section>
                    <q-item-label>#{{n.TransactionID}}</q-item-label>
                    <q-item-label caption lines="2">₱ {{n.SavingsDeposit}}.00 (Savings Deposit)</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                    <q-item-label caption>{{n.showDate}}</q-item-label>
                    </q-item-section>
                </q-item>

                </div>
                <q-item>  
                  <q-btn color="teal" icon="check_circle" label="APPROVE WITHDRAWAL" class="q-mt-md full-width" v-if="tab == 'Withdraw Requests'" @click="approveWithdrawalSavings"/>
                  <q-btn color="teal" icon="money" label="RELEASE CASH" class="q-mt-md full-width" v-else-if="tab == 'Approved Requests'" @click="cashReleaseSavings"/>   
                  <div v-else></div>                 
                </q-item>
                <q-item>
                  <q-btn flat icon="close" label="close" color="grey-10" @click="drawer = !drawer, selected = {}" class="full-width" />
                </q-item>

                
            </q-list>
            
        </q-drawer>    
       
    </div>
    </q-page>
</template>
<script>
import { firebaseDb, firebaseSto, firefirestore, Auth2 } from 'boot/firebase';
import { date } from 'quasar'
import axios from 'axios'

export default {
    data(){
        return{
            MemberData: [],
            Transactions: [],
            WithdrawalApplications: [],
            drawer: false,
            selected: {},
            tab: 'Member Savings',
            splitterModel: 20,
            filter: '',
            pagination: {
              sortBy: 'savings',
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
                { name: 'savings', align: 'center', label: 'Savings', field: 'savings', sortable: true, typeData: 'money' },
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
        WithdrawCashReleaseTrackers: firebaseDb.collection('WithdrawCashReleaseTrackers'),
      }
    },
    computed:{
      returnDataofTable(){
        try {
          if(this.tab == 'Member Savings'){
            return this.returnSavingsData
          } else if(this.tab == 'Withdraw Requests'){
            return this.returnWithdrawalRequestData
          } else if(this.tab == 'Approved Requests'){
            return this.returnCashReleaseData
          } else {
            return this.returnDoneCashReleaseData
          }
        } catch (error) {
          return []
        }
      },
      returnColumnofTable(){
        try {
          if(this.tab == 'Member Savings'){
            return this.savingsColumns
          } else if(this.tab == 'Withdraw Requests'){
            return this.withdrawColumns
          } else if(this.tab == 'Approved Requests'){
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
          if(this.tab == 'Member Savings'){
            return 'account_balance'
          } else if(this.tab == 'Withdraw Requests'){
            return 'payment'
          } else if(this.tab == 'Approved Requests'){
            return 'check'
          } else {
            return 'money'
          }
        } catch (error) {
          return 'check'
        }
      },
      returnSavingsData(){
        try {
          console.log(this.MemberData,'members')
          let map = this.MemberData.map(a=>{
            let latest = this.getLatestTransationDate(a['.key'])
            if(latest.length !== 0){
              return {
                memberid: a['.key'],
                designation: a.Designation,
                lastname: a.LastName,
                firstname: a.FirstName,
                savings: a.SavingsDeposit,
                date: date.formatDate(latest[0].dateCheck,'MM-DD-YYYY')
              }
            } else {
              return {
                memberid: a['.key'],
                designation: a.Designation,
                lastname: a.LastName,
                firstname: a.FirstName,
                savings: a.SavingsDeposit,
                date: 'none'
              }              
            }

          })

          console.log(map,'map')
          return map
        } catch (error) {
          return []
        }
      },
      returnWithdrawalRequestData(){
        try {
          let req = this.WithdrawalApplications.filter(b=>{return b.status == 'onprocess'})
          console.log(req,'req')
          let map = req.map(a=>{
            return {
                  withdrawAppID: a['.key'],
                  memberid: a.MemberID,
                  designation: a.Designation,
                  lastname: a.LastName,
                  firstname: a.FirstName,
                  requestAmount: parseFloat(a.Amount),
                  savings: a.SavingsDeposit,
                  balance: a.RemainingBalance,
                  date: date.formatDate(a.timestamp.toDate(),'MM-DD-YYYY') ,
                  Phone: this.getMemberData(a.MemberID).Phone               
            }
          })
          console.log(map,'withdraw')
          return map          
        } catch (error) {
          return []
        }
      },
      returnCashReleaseData(){
        try {
          let req = this.WithdrawalApplications.filter(b=>{return b.status == 'approved'})
          console.log(req,'req')
          let map = req.map(a=>{
            return {
                  withdrawAppID: a['.key'],
                  memberid: a.MemberID,
                  designation: a.Designation,
                  lastname: a.LastName,
                  firstname: a.FirstName,
                  requestAmount: parseFloat(a.Amount),
                  savings: a.SavingsDeposit,
                  balance: a.RemainingBalance,
                  date: date.formatDate(a.dateApproved.toDate(),'MM-DD-YYYY') ,
                  trackingNo: a.CashReleaseTrackingID.toUpperCase(),
                  Phone: this.getMemberData(a.MemberID).Phone               
            }
          })
          console.log(map,'withdraw')
          return map          
        } catch (error) {
          return []
        }
      },
      returnDoneCashReleaseData(){
        try {
          let req = this.WithdrawalApplications.filter(b=>{return b.status == 'released'})
          console.log(req,'req')
          let map = req.map(a=>{
            return {
                  withdrawAppID: a['.key'],
                  memberid: a.MemberID,
                  designation: a.Designation,
                  lastname: a.LastName,
                  firstname: a.FirstName,
                  requestAmount: parseFloat(a.Amount),
                  savings: a.SavingsDeposit,
                  balance: a.RemainingBalance,
                  date: date.formatDate(a.dateReleased,'MM-DD-YYYY') ,
                  trackingNo: a.CashReleaseTrackingID.toUpperCase(),
                  Phone: this.getMemberData(a.MemberID).Phone               
            }
          })
          console.log(map,'withdraw')
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
          return id == a.MemberID && a.SavingsDeposit != 0
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
      approveWithdrawalSavings(){
        let data = this.returnSelectRow
        this.$q.dialog({
          title: 'Confirm Withdraw Approval',
          message: 'Would you like to approve this withdrawal request?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          console.log('>>>> OK')
          console.log(data,'data')
          firebaseDb.collection("WithdrawalApplications").doc(data.withdrawAppID).update({status: 'approved',dateApproved: firefirestore.FieldValue.serverTimestamp()})
          .then(()=>{
            console.log('update success! approved')
            firebaseDb.collection("WithdrawCashReleaseTrackers").add({MemberID: data.memberid,requestAmount: data.requestAmount, withdrawAppID: data.withdrawAppID})
            .then((doc)=>{
              let trackID = doc.id.toString().slice(0,10)
              this.sendSMS(data.Phone,`Your P${data.requestAmount}.00 savings withdrawal is approved! Use this Tracking# ${trackID.toUpperCase()} to get your cash. `)
              firebaseDb.collection("WithdrawalApplications").doc(data.withdrawAppID).update({CashReleaseTrackingID: trackID})
              .then(()=>{
                this.selected = {}
                this.drawer = false
                this.$q.notify({
                  type: 'positive',
                  message: `Savings Withdrawal Application Approval Success`
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
        })        
      },
      cashReleaseSavings(){
        let data = this.returnSelectRow
        console.log(data,'data')
        let releaseID = this.WithdrawCashReleaseTrackers.filter(a=>{
          return data.withdrawAppID == a.withdrawAppID
        })[0]

        console.log(releaseID['.key'],'getId')
        const newday = new Date()
        let today = newday.getTime()
        console.log(today,'today')

        this.$q.dialog({
          title: `Confirm Cash Release`,
          message: `Do you confirm this ₱	${data.requestAmount}.00 Savings Withdrawal ?`,
          cancel: true,
          persistent: true
        }).onOk(() => {
          
          firebaseDb.collection("WithdrawCashReleaseTrackers").doc(releaseID['.key']).update({Status: 'released',dateReleased: today })
          .then(()=>{
            console.log('withdrwal cash trackers update success')
            firebaseDb.collection("WithdrawalApplications").doc(data.withdrawAppID).update({status: 'released',dateReleased: today, withdrawAppID: data.withdrawAppID })
            .then(()=>{
              console.log('withdrwal updated release')
              firebaseDb.collection("MemberData").doc(data.memberid).update({
                SavingsDeposit: firefirestore.FieldValue.increment(-Math.abs(data.requestAmount))
              }).then(()=>{
                console.log('member savings updated')
                let timeWithdraw = date.formatDate(new Date(), 'MM-DD-YYYY, HH:mm A')
                this.sendSMS(data.Phone,`P${data.requestAmount}.00 is withdrawed from your account on ${timeWithdraw}.`)
                this.selected = {}
                this.drawer = false    
                this.$q.notify({
                  type: 'positive',
                  message: `Withdraw Savings Cash Release Confirmation Success`
                })    
              }).catch(error=>{
                console.log('memberdata update error',error)
              })
            }).catch(error=>{
              console.log('savings application update error',error)
            })
          }).catch(error=>{
            console.log('tracker update error',error)
          })       
        })
      },
      getMemberData(id){
        try {
          return this.$lodash.filter(this.MemberData,a=>  {return a['.key'] == id} )[0]
        } catch (error) {
          return {}
        }
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
    } // end of methods
}
</script>
<style scoped>
.no-choice{
    opacity: 0.6;
}
</style>