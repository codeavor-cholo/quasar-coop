<template>
    <div>
      <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4">Loans </h6>
       <q-separator />
       <div class="q-pa-md">
        
         <q-card class="center">
           <q-card-section>
           <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                          <div class="q-pa-md">
                            <q-input disable outlined color="teal" v-model="transationid" label="Transaction ID" >
                              <template v-slot:append>
                                <q-icon name="mdi-account" />
                              </template>
                            </q-input>
                          </div>
                  </div>
                 <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                          <div class="q-pa-md">
                            <q-select outlined color="teal" :options="membersid" v-model="memberid" label="Members ID" >
                              <template v-slot:append>
                                <q-icon name="mdi-account" />
                              </template>
                            </q-select>
                          </div>
                  </div>

                  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                          <div class="q-pa-md">
                            <q-input outlined color="teal" v-model="membersname" label="Members name" >
                              <template v-slot:append>
                                <q-icon name="mdi-account" />
                              </template>
                            </q-input>
                          </div>
                  </div>

                       <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                          <div class="q-pa-md">
                            <q-input disable outlined color="teal" v-model="sharecapital" label="Total Share Capital" >
                              <template v-slot:append>
                                <q-icon name="mdi-account" />
                              </template>
                            </q-input>
                          </div>
                  </div>

                   <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                          <div class="q-pa-md">
                            <q-input disable outlined color="teal" v-model="savings" label="Total Savings" >
                              <template v-slot:append>
                                <q-icon name="mdi-account" />
                              </template>
                            </q-input>
                          </div>
                  </div>

                  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-mb-lg">
                          <div class="q-pa-md">
                            <q-input disable outlined color="teal" v-model="totalloanbalance" label="Total Loan Balance" >
                              <template v-slot:append>
                                <q-icon name="mdi-account" />
                              </template>
                            </q-input>
                          </div>
                  </div>

                  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                          <div class="q-pa-md">
                          </div>
                  </div>
                  <div class="absolute-bottom-right">
                          <div class="q-pa-md">
                             <q-btn class="text-teal-4 q-mr-md" icon="fas fa-money-check" label="Withdraw" color="white" @click="Withdraw"/>
                          </div>
                  </div>
           </div>
            </q-card-section>
         </q-card>
       </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
          transationid: '',
          membersid: '',
          membersid: ['NGTSC2020001','NGTSC2020002','NGTSC2020003','NGTSC2020004','NGTSC2020005','NGTSC2020006'],
          membersname: '',
          sharecapital: '',
          savings: '',
          totalloanbalance: '',
        }
    },
    methods: {
      Withdraw(){
         this.$q.dialog({
        title: 'Withdrawal Breakdown',
        message: '<h6> Total Share Capital: <h6><hr> <h6> Total Savings: <h6> <hr> <h6> Total Loan Balance: <h6> ',
      
        cancel: true,
        persistent: true,
        html: true
      }).onOk(() => {
        // console.log('>>>> OK')
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
      }
    },
}
</script>
<style scoped>
/* .q-field{
  width: 205px;
} */
</style>