<template>
  <q-page>
    <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4">Daily Monitoring <q-icon name="mdi-arrow-right-box" /> {{returnToday}}
              <q-btn color="grey-10" class="float-right q-mr-md" flat dense="" icon="event" label="adjust date" @click="adjustDate = true" /> 
    </h6>
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
              <q-tab name="All" icon="people" label="All" />
              <q-tab name="No Show" icon="close" label="Unpaid" />
              <q-tab name="Unpaid" icon="warning" label="Pay Later" />
              <q-tab name="Paid" icon="money" label="Paid" />
            </q-tabs>
          </div>
        </template> 
          <template v-slot:after>    
                  <q-table
                      :data="getDataBaseOnFilter"
                      :columns="returnColumnofTable"  
                      :pagination.sync="pagination"
                      row-key="memberid"
                      flat
                      class="cursor-pointer"
                      :filter="filter"
                  >
                    <template v-slot:top>
                      <div class="row justify-between">
                        <div class="text-h6 text-weight-regular"><q-icon :name="returnIconofTable" /> {{returnTitle(tab)}} Members
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
                          
                          <div v-if="col.name == 'status'">
                            <q-icon color="teal" name="check_circle" v-if="col.value == 'Paid'" size="md"/>
                            <q-icon color="warning" name="warning" v-else-if="col.value == 'UnPaid'" size="md"/>
                            <q-icon color="grey-2" name="person" v-else size="md"/>
                          </div>
                          <div v-else>
                              {{ col.typeData == 'money' ? '₱ ' + col.value : col.value }}
                          </div>

                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>                  
          </template> 
        </q-splitter>

        <!-- drawer -->
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
          </q-item>

          <q-item v-show="returnSelectRow.jeepUnit !== undefined && checkIfThereIsUnit == true">
              <q-item-section avatar>
              <q-avatar :color="returnSelectRow.jeepUnit == 'NONE' ? 'warning' : 'teal'" class="text-white">
                  <q-icon name="commute" />
              </q-avatar>
              </q-item-section>
              <q-item-section>
              
              <div class="text-weight-bold" > <span v-if="returnSelectRow.jeepUnit !== 'NONE'">{{returnSelectRow.jeepUnit}} </span>
                <span v-else><q-icon name="warning" /> No Default Unit</span>
              </div>
              </q-item-section>
          </q-item>

          <div v-show="checkIfThereIsUnit == true">
          <!-- <q-item>
            <q-btn flat icon="error" label="report violation" color="red" @click="drawer = !drawer, selected = {}" class="full-width" />
          </q-item> -->
          <div v-show="returnShowOptions(returnSelectRow)">
          <q-item v-show="checkIfPaidForLaterToday == false && selected.StatusOfPaymentToday !== 'Paid'">
            <q-btn flat icon="warning" label="Pay Later" color="warning" @click="drawer = !drawer, payLater()" class="full-width"/>
          </q-item>

          <q-item v-show="selected.StatusOfPaymentToday !== 'Paid'">
            <q-btn flat icon="money" label="Pay Now" color="teal" @click="drawer = !drawer, payNow()" class="full-width" />
          </q-item>
          </div>
          </div>
          <q-item>
            <q-btn flat icon="close" label="close" color="grey-10" @click="drawer = !drawer, selected = {}" class="full-width" />
          </q-item>
        </q-list>

        </q-drawer>

        <!-- dialog -->
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




  </q-page>
</template>
<script>
import { date, QDialog } from 'quasar'
import axios from 'axios'
import { mapGetters, mapMutations } from 'vuex'
import { firebaseDb, firebaseSto, firefirestore, Auth2 } from 'boot/firebase';

function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}
export default {
  data(){
    return{
      tab: 'All',
      today: date.formatDate(new Date(),'MMMM DD, YYYY'),
      adjustDate:false,
      splitterModel: 20,
      filter: '',
      drawer: false,
      selected: {},
      pagination: {
        sortBy: 'status',
        descending: true,
        page: 1,
        rowsPerPage: 0
        // rowsNumber: xx if getting data from a server
      },
      ifAllPaid: false,
    }
  },
  firestore () {
    return {
      MemberData: firebaseDb.collection('MemberData'),    
      Transactions: firebaseDb.collection('Transactions'),   
      PayLater: firebaseDb.collection('PayLater'),
      JeepneyData: firebaseDb.collection('JeepneyData'),   
      ManagementFeeDriver: firebaseDb.collection('FixedPayments').doc('ManagementFeeDriver'),
      ManagementFeeOperator: firebaseDb.collection('FixedPayments').doc('ManagementFeeOperator'),
      ShareOfStocks: firebaseDb.collection('FixedPayments').doc('ShareOfStocks'),
      ZMemberInactiveness: firebaseDb.collection('FixedPayments').doc('ZMemberInactiveness'),   
    }
  },
  computed:{
    returnToday(){
      return date.formatDate(new Date(this.today),'MMMM DD, YYYY')
    },
    getDataBaseOnFilter(){
        try {

            let members = this.MemberData.filter(a=>{
                a.MemberID = a['.key']
                return a.isNewMember == false && a.resigned !== true
            })

            members.forEach(a=>{
                let today = date.formatDate(new Date(this.today),'MM/DD/YYYY')
                let filter = this.Transactions.filter(b=>{
                    return b.TransactionType !== 'Bills Payment' && b.ManagementFee !== undefined && b.ManagementFee !== 0 && b.MemberID == a['.key'] && today == date.formatDate(new Date(b.timestamp.toDate()),'MM/DD/YYYY')
                })

                console.log(filter,'filter')

                a.StatusOfPaymentToday = filter.length > 0 ? 'Paid' : 'NoShow'

                let later = this.PayLater.filter(c=>{
                    return c.memberID == a['.key'] && today == date.formatDate(new Date(c.timestamp.toDate()),'MM/DD/YYYY')
                })

                if(later.length > 0){
                    a.StatusOfPaymentToday = 'UnPaid'
                }

            })
            console.log(members,'members')
            if(this.tab == 'Unpaid'){
                return members.filter(a=>{
                    return a.StatusOfPaymentToday == 'UnPaid' && this.checkIfActive(a['.key']) == 'active'
                })
            } 
            else if(this.tab == 'Paid')
            {
                return members.filter(a=>{
                    return a.StatusOfPaymentToday == 'Paid' && this.checkIfActive(a['.key']) == 'active'
                })
            } 
            else if(this.tab == 'No Show'){
                return members.filter(a=>{
                    return a.StatusOfPaymentToday == 'NoShow' && this.checkIfActive(a['.key']) == 'active'
                })                   
            } else { 
                let filter = members.filter(a=>{
                  return this.checkIfActive(a['.key']) == 'active'
                })
                return this.$lodash.orderBy(filter,'StatusOfPaymentToday','desc')
            }

        } catch (error) {
            console.log(error,'getDataBaseOnFilter')
        }
    },
      returnColumnofTable(){
        try {
          let columns = [
            { name: 'memberid', required: true, label: 'MemberID', align: 'left', field: 'MemberID', sortable: true },
            { name: 'designation', align: 'center', label: 'Designation', field: 'Designation', sortable: true },
            { name: 'firstname', align: 'center', label: 'First name', field: 'FirstName', sortable: true },
            { name: 'lastname', align: 'center', label: 'Last name', field: 'LastName', sortable: true },
            { name: 'status', align: 'center', label: 'Status', field: 'StatusOfPaymentToday', sortable: true },        
          ]

          return columns
        } catch (error) {
          return []
        }
      }, 
      returnIconofTable(){
        try {
          if(this.tab == 'All'){
            return 'people'
          } else if(this.tab == 'No Show'){
            return 'close'
          } else if(this.tab == 'Unpaid'){  
            return 'warning'
          } else {
            return 'money'
          }
        } catch (error) {
          return 'check'
        }
      },  
    returnSelectRow(){
      try {
        console.log(this.selected,'selected')
        let selected = this.selected
        return {
          avatar: selected.FirstName.charAt(0),
          firstname: selected.FirstName,
          lastname: selected.LastName,
          designation: selected.Designation,
          memberid: selected['.key'],
          jeepUnit: selected.defaultUnit == undefined ? 'NONE' : selected.defaultUnit.PlateNumber
        }
      } catch (error) {
        console.log(error,'returnSelectedRow')
        return {
          avatar: '',
          firstname: '',
          lastname: '',
          designation: '',
          memberid: 0      
        }
      }
    },
    checkIfThereIsUnit(){
        let units = []
        if(this.selected.Designation == 'Driver'){
            units = this.getUnitsOfOperator(this.selected.Operator.MemberID)
        } else {
            units = this.getUnitsOfOperator(this.selected['.key'])
        }
        console.log(units,'units')
        if(units.length > 0){
            return true
        } else {
            return false
        }
    },
    checkIfPaidForLaterToday(){
      let id = this.returnSelectRow.memberid
      let plate = this.returnSelectRow.jeepUnit
      let today = date.formatDate(new Date(this.today),'MM-DD-YYYY')
      let payments = this.PayLater.filter(a=>{
        let payDate = date.formatDate(a.timestamp.toDate(),'MM-DD-YYYY')
        return a.memberID == id && a.plateNumber !== null && a.plateNumber !== undefined && today == payDate
      })

      console.log(payments,'payments')

      if(payments.length > 0){
        return true
      } else {
        return false
      }
    },
  },
  methods:{
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
    getUnitsOfOperator(operatorID){
      let filter = this.JeepneyData.filter(a=>{
          return a.MemberID == operatorID && a.Status == 'approved'
      })

      console.log('filter',filter)
      let map = filter.map(a=>{
          return {
              value: a.PlateNumber,
              label: a.PlateNumber,
              unitData: a
          }
      })
      console.log('jeep data',map)
      return map      
    },
    payNow(){
      let now = this.selected
      let jeep = now.defaultUnit == undefined ? 'NONE' : now.defaultUnit.PlateNumber
      this.$router.push(`/admin/addpaymentattendance/${now['.key']}&${jeep}`)
    },
    payLater(){
      //saves to pay later (as attendance)
      //send sms to notify that this will be added to the billing if unpaid within the day
      //what needs to be saved


      let payLater = {
          memberID: this.returnSelectRow.memberid,
          plateNumber: this.returnSelectRow.jeepUnit,
          ifPaidTodayMF: this.selected.Designation == 'Driver' ? this.ManagementFeeDriver.amount : this.ManagementFeeOperator.amount,
          ifPaidTodaySS: this.ShareOfStocks.amount,
          amountToPayBilling: this.selected.Designation == 'Driver' ? this.ManagementFeeDriver.amount : this.ManagementFeeOperator.amount,
          timestamp: firefirestore.FieldValue.serverTimestamp(),
      }

      let opsID = this.selected.Operator == undefined || this.selected.Operator == null ? '' : this.selected.Operator.MemberID

      let payLaterOperator = {
          memberID: opsID,
          plateNumber: this.returnSelectRow.jeepUnit,
          ifPaidTodayMF: this.ManagementFeeOperator.amount,
          ifPaidTodaySS: this.ShareOfStocks.amount,
          amountToPayBilling: this.ManagementFeeOperator.amount,
          timestamp: firefirestore.FieldValue.serverTimestamp(),        
      }

      if(this.returnSelectRow.jeepUnit == 'NONE' || this.returnSelectRow.jeepUnit == null){
          let units = null
          if(this.selected.Designation == 'Driver'){
              units = this.selected.Operator.MemberID
          } else {
              units = this.selected['.key']
          }
          this.$q.dialog({
          title: 'Jeepney Plate Number',
          message: 'Choose a jeep / unit:',
          options: {
              type: 'radio',
              model: 'opt1',
              // inline: true
              items: this.getUnitsOfOperator(units)
          },
          cancel: true,
          persistent: true
          }).onOk(data => {
          console.log('>>>> OK, received', data)
              payLater.plateNumber = data
              payLaterOperator.plateNumber = data
              this.payLaterSaving(payLater)
              if(this.selected.Designation == 'Driver'){
                this.payLaterSaving(payLaterOperator)
              }
            
          }).onCancel(() => {
          // console.log('>>>> Cancel')
          this.clickForAttendance = true
          }) 
      } else {
          if(this.selected.Designation == 'Driver'){
          if(this.ifAllPaid == false){
              // sama mo operator
              this.payLaterSaving(payLater)
              this.payLaterSaving(payLaterOperator)
          } else {
              // dont
              this.payLaterSaving(payLater)
          }
          } else {
          this.payLaterSaving(payLater)
          }
      }
    },
    payLaterSaving(data){
      firebaseDb.collection('PayLater').add(data)
      .then(() =>{
          this.sendSMS(data)
          this.$q.notify({
          icon: 'info',
          color: 'positive',
          message: 'Pay Later Data Saved!'
          })        
      })
    },
    sendSMS(paylater){
        let number = this.getMobileNumber(paylater.memberID)
        let TodayDate = date.formatDate(new Date(), 'YYYY-MM-DD hh:mm A')
        let header= {
                'Access-Control-Allow-Origin': '*',
        }
        let message = `You have P ${paylater.amountToPayBilling}.00 payable for today. If unpaid today, this will reflect in your monthly billing.`
        let apinumber = 4

        let data = 'number=' + number + '&' + 'message=' + message + '&' + 'apinumber=' + apinumber
        console.log(data,'data sent')

        const options = {
            method: 'POST',
            headers: { 'Access-Control-Allow-Origin': '*' },
            data: data,
            url: 'https://smsapisender.000webhostapp.com/index.php',
        }      

        axios.post('https://toned-tabulation.000webhostapp.com/index.php', data)
        .then(response => {
        console.log(response)
        })
        .catch((error) => {
        console.log(error.response)
        })            
    },
    getMobileNumber(id){
        try {
        return this.MemberData.filter(a=>{
            return a['.key'] == id
        })[0].Phone
        } catch (error) {
            console.log(error,'error getting number')
            return 0
        }
    },
    checkIfActive(memberID){
      let today = new Date()
      let monthsBase = date.subtractFromDate(today, {month: this.ZMemberInactiveness.amount})

      let transactions = this.Transactions.filter(a=>{
        return a.MemberID == memberID && a.timestamp.toDate() >= monthsBase && a.timestamp.toDate() <= today
      })


      if(transactions.length == 0){
        // console.log(memberID + ' ' + transactions.length+ 'payments',)
        return 'inactive'
      } else {
        // console.log(memberID + ' ' + transactions.length+ 'payments',)
        return 'active'
      }

    },
    returnTitle(tab){
      if(tab == 'No Show') return 'Unpaid'
      if(tab == 'Unpaid') return 'Pay Later'
      return tab
    },
    returnShowOptions(selected){
      if(selected.designation === 'Driver' && selected.jeepUnit === 'NONE') return false
      return true
    }


  }
}
</script>