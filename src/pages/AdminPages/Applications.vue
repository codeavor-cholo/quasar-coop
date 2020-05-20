<template>
<q-page>
  <div>
    <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4">Withdrawal Applications</h6>
    <q-tabs
       v-model="tab"
       dense
       class="text-white bg-teal"
       active-color="white"
       indicator-color="white"
       align="justify"
       narrow-indicator
     >
       <q-tab name="savings" label="Savings" />
       <q-tab name="cashAdvance" label="Cash Advance" />
     </q-tabs>

     <q-separator />

     <q-tab-panels v-model="tab" animated>
       <q-tab-panel name="savings">
         <savings-applications></savings-applications>
       </q-tab-panel>

       <q-tab-panel name="cashAdvance">
         <!-- <paid></paid> -->
       </q-tab-panel>

     </q-tab-panels>


  </div>
</q-page>
</template>

<script>
import SavingsApplications from '../../components/Admin/Withdrawals/SavingsApplications.vue'
// import Paid from '../../components/Admin/Monitoring/PaidMembers.vue'

export default {
  components: {
    SavingsApplications,
    // Paid
  },
  data () {
    return {
      tab: 'savings'
    }
  }
}
</script>

<style lang="css" scoped>
</style>
