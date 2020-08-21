<template>
  <div>
    <h6 class="q-ma-none q-pl-md q-pt-md text-teal">Dashboard</h6>
    <q-separator />
    <div class="row">
      <div class="col-xs-12 col-md-3 col-sm-6">
        <div class="q-pa-lg">
          <q-card class="my-card bg-blue text-white">
            <q-card-section>
              <div class="text-h6">
                <q-icon size="26px" name="people" /> Members
              </div>
              <q-separator color="white" />
              <div class="text-subtitle2">
                Active
                <h6 class="q-pa-none q-ma-none text-center shadow-21">{{returnActiveLength}}</h6>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="col-xs-12 col-md-3 col-sm-6">
        <div class="q-pa-lg">
          <q-card class="my-card bg-red-14 text-white">
            <q-card-section>
              <div class="text-h6">
                <q-icon size="26px" name="people" /> Members
              </div>
              <q-separator color="white" />
              <div class="text-subtitle2">
                Inactive
                <h6 class="q-pa-none q-ma-none text-center shadow-21">{{returnInactiveLength}}</h6>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="col-xs-12 col-md-3 col-sm-6">
        <div class="q-pa-lg">
          <q-card class="my-card bg-green text-white">
            <q-card-section>
              <div class="text-h6">
                <q-icon size="26px" name="money" /> Today's Collections
              </div>
              <q-separator color="white" />
              <div class="text-subtitle2">
                {{$moment(new Date()).format('LL')}}
                <h6 class="q-pa-none q-ma-none text-center shadow-21">{{returnDailyCollections | currency}}</h6>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="col-xs-12 col-md-3 col-sm-6">
        <div class="q-pa-lg">
          <q-card class="my-card bg-warning text-white">
            <q-card-section>
              <div class="text-h6">
                <q-icon size="26px" name="account_balance" /> Bank Remittance
              </div>
              <q-separator color="white" />
              <div class="text-subtitle2">
                {{$moment(new Date()).format('MMMM YYYY')}}
                <h6 class="q-pa-none q-ma-none text-center shadow-21">{{returnRemittance | currency}}</h6>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>


       <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 q-mt-xl q-pt-xl">
          <div class="q-pa-lg">
              <div class="text-h6 q-mb-lg text-center">Overall Collections Breakdown</div>
                <apexchart max-width="800" height="800" type="donut" :options="donuts" :series="OverallCollections"></apexchart>
          </div>
      </div>

       <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12
        q-mt-xl q-pt-xl">
          <div class="q-pa-lg">
            <div class="text-h6 q-mb-lg text-center">Monthly Collections Breakdown</div>
             <apexchart max-width="500" type="line" :options="lines" :series="returnSlantings"></apexchart>
          </div>
      </div>
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12
        bg-teal-3">
          <div class="q-pa-xl">
            <div class="text-h6 q-mb-lg text-center text-white text-weight-bold">Top 50 Share of Stocks</div>
            <q-table
                class="q-pa-xl"
                :data="returnShareHolders"
                :columns="columns"
                row-key=".key"
                :separator="false"
                flat
                :pagination.sync="initialPagination"
                :filter="filter"
            >     
                <template v-slot:body="props">
                    <q-tr :props="props"  :class="props.row == selected ? 'bg-teal-1 text-weight-bold text-teal' : ''">
                    <q-td v-for="col in props.cols.filter(col => col.name !== 'Actions')" :key="col.name" >
                        <span v-if="col.typeOf !== 'money'" class="">{{ col.value }}</span>
                        <span v-else>{{ col.value | currency }}</span>
                    </q-td>
                    <!-- <q-td key="Actions" class="noPrint">
                        <q-btn color="teal" icon="receipt" label="view receipt" @click="viewGo(props.row)" flat/>
                    </q-td> -->
                    </q-tr>
                </template> 
            </q-table>       
          </div>
      </div>
    </div>

  </div>
</template>
<script>
import { date } from 'quasar'
import { firebaseAuth,firebaseApp,firebaseDb,firefirestore } from 'boot/firebase'
export default {
  data() {
    return {
      filter: '',
      initialPagination: {
          descending: false,
          page: 1,
          rowsPerPage:0
          // rowsNumber: xx if getting data from a server
      }, 
      columns: [
          { name: 'Rank', align: 'left', label: 'Rank', field: 'Rank', sortable: true },
          { name: 'MemberID', align: 'left', label: 'Member ID', field: 'MemberID', sortable: true },
          { name: 'Name', align: 'left', label: 'Name', field: 'Name', sortable: true },
          { name: 'TotalShares', align: 'left', label: 'Total Share of Stocks', field: 'Total', sortable: true, typeOf: 'money' },         
      ],
      charts:{
        xaxis: {
          categories: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]
        }
      },
      bars: [
        {
          name: 'Drivers',
          data: [100, 90, 89, 96, 96, 99, 91, 91]
        },
        {
          name: 'Operators',
          data: [50, 45, 69, 70, 78, 99, 91, 80]
        },
      ],
        donuts:{
            
            labels: ['Management Fee', 'Share Capital', 'Savings Deposit', 'Advances','Membership Fee']
         }, 
         payments: this.OverallCollections,
        //Line Graph
        lines:{
               xaxis: {
              categories: ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November']
              }
        },
        slantings:[
          {
            name: 'Drivers',
            data: [100, 90, 89, 96, 96, 99, 91, 91]
          },
          {
            name: 'Operators',
            data: [90, 80, 79, 56, 84, 80, 85, 91]
        },
        ],

    }
  },
  firestore () {
    return {
      DashboardUsers: firebaseDb.collection('DashboardUsers'),
      Transactions: firebaseDb.collection('Transactions'),
      WithdrawalApplications: firebaseDb.collection('WithdrawalApplications'),
      LoanApplications: firebaseDb.collection('LoanApplications'),
      PreRegPersonalData: firebaseDb.collection('PreRegPersonalData'),
      JeepneyData: firebaseDb.collection('JeepneyData'),
      MemberData: firebaseDb.collection('MemberData'),
      TopShares: firebaseDb.collection('MemberData').orderBy("ShareCapital", "desc").where("ShareCapital", ">", 0),
      ZMemberInactiveness: firebaseDb.collection('FixedPayments').doc('ZMemberInactiveness'),

    }
  }, 
  computed:{
      returnShareHolders(){
          try {
              console.log(this.TopShares,'ordered already')
              let i = 0
              this.TopShares.forEach(a=>{
                  i = i + 1
                  a.Rank = i
                  a.Name = `${a.FirstName} ${a.LastName}`
                  a.MemberID = a['.key']
                  a.Total = a.ShareCapital
              })
              return this.TopShares
          } catch (error) {
              console.log(error,'returnShareHolders')
              return []
          }
      },
    returnSlantings(){
      try {
        let months = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November']

        let slantings = []
        let filteredByMonths = []

        months.forEach(a=>{

          let data = []
          let filter = this.$lodash.filter(this.Transactions,b=>{
            return b.timestamp !== undefined && this.$moment(b.timestamp.toDate()).format('MMMM') == a
          })

          let ManagementFee = this.getSumOverAll('ManagementFee',filter)

          let MembershipFee = this.getSumOverAll('MembershipFee',filter)

          let AdvancesAmount = this.getSumOverAll('AdvancesAmount',filter)

          let SavingsDeposit = this.getSumOverAll('SavingsDeposit',filter)

          let ShareCapital = this.getSumOverAll('ShareCapital',filter)

          filteredByMonths.push({month: a,MF: ManagementFee,MemFee: MembershipFee,AA: AdvancesAmount !== undefined ? AdvancesAmount : 0,SD : SavingsDeposit, SC: ShareCapital})

        })  

        let MF = {
          name: 'ManagementFee',
          data: []
        }

        let MemFee = {
          name: 'MembershipFee',
          data: []
        }

        let AA = {
          name: 'AdvancesAmount',
          data: []
        }

        let SD = {
          name: 'SavingsDeposit',
          data: []
        }

        let SC = {
          name: 'ShareCapital',
          data: []
        }

        filteredByMonths.forEach(a=>{
          MF.data.push(a.MF)
          MemFee.data.push(a.MemFee)
          AA.data.push(a.AA)
          SD.data.push(a.SD)
          SC.data.push(a.SC)
        })

        return[MF,SC,SD,AA,MemFee]
      } catch (error) {
        console.log(error,'returnSlantings')
        return []
      }


    },
    returnActiveLength(){
      try {
        return this.MemberData.filter(a=>{
          if(this.checkIfActive(a['.key']) == 'active'){
            return a
          }
        }).length
      } catch (error) {
        console.log(error,'returnActiveLength')
        return 0
      }
    },
    returnInactiveLength(){
      try {
        return this.MemberData.filter(a=>{
          if(this.checkIfActive(a['.key']) == 'inactive'){
            return a
          }
        }).length
      } catch (error) {
        console.log(error,'returnActiveLength')
        return 0
      }
    },
    returnDailyCollections(){
      try {
        return this.$lodash.sumBy(this.Transactions.filter(a=>{
          return a.timestamp !== undefined && this.$moment(a.timestamp.toDate()).format('LL') == this.$moment(new Date()).format('LL')
        }),b=>{
          return parseFloat(b.Total)
        })
      } catch (error) {
        console.log(error,'returnDailyCollections')
        return 0
      }
    },
    returnRemittance(){
      try {
        return this.$lodash.sumBy(this.Transactions.filter(a=>{
          return a.timestamp !== undefined && this.$moment(a.timestamp.toDate()).format('MMMM YYYY') == this.$moment(new Date()).format('MMMM YYYY')
        }),b=>{
          return parseFloat(b.Total)
        })
      } catch (error) {
        console.log(error,'returnDailyCoreturnRemittancellections')
        return 0
      }
    },
    OverallCollections(){
      try {
        let ManagementFee = this.getSumOverAll('ManagementFee')
        console.log(ManagementFee,'MF')
        let MembershipFee = this.getSumOverAll('MembershipFee')
        console.log(MembershipFee,'MembershipFee')
        let AdvancesAmount = this.getSumOverAll('AdvancesAmount')
        console.log(AdvancesAmount,'AdvancesAmount')
        let SavingsDeposit = this.getSumOverAll('SavingsDeposit')
        console.log(SavingsDeposit,'SavingsDeposit')
        let OthersAmount = this.getSumOverAll('OthersAmount')
        console.log(OthersAmount,'OthersAmount')
        let ShareCapital = this.getSumOverAll('ShareCapital')
        console.log(ShareCapital,'ShareCapital')
        return [ManagementFee,ShareCapital,SavingsDeposit,AdvancesAmount,MembershipFee]
      } catch (error) {
        console.log(error,'error')
        return []
      }
    }
  },
  methods:{
    getSumOverAll(type,array = this.Transactions){
      return this.$lodash.sumBy(array,type)
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
  }  
};
</script>
<style scoped>
</style>
