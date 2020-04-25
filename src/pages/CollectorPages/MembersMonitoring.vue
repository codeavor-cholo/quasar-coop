<template>
<q-page>
  <div>
    <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4">Monitoring Members </h6>
    <q-tabs
       v-model="tab"
       dense
       class="text-white bg-teal"
       active-color="white"
       indicator-color="white"
       align="justify"
       narrow-indicator
     >
       <q-tab name="unpaidTab" label="Unpaid" />
       <q-tab name="paidTab" label="Paid" />
     </q-tabs>

     <q-separator />

     <q-tab-panels v-model="tab" animated>
       <q-tab-panel name="unpaidTab">
         <unpaid></unpaid>
       </q-tab-panel>

       <q-tab-panel name="paidTab">
         <paid></paid>
       </q-tab-panel>

     </q-tab-panels>


  </div>
</q-page>
</template>

<script>
import Unpaid from '../../components/Admin/Monitoring/UnpaidMembers.vue'
import Paid from '../../components/Admin/Monitoring/PaidMembers.vue'

export default {
  components: {
    Unpaid,
    Paid
  },
  data () {
    return {
      tab: 'unpaidTab'
    }
  }
}
</script>

<style lang="css" scoped>
</style>
