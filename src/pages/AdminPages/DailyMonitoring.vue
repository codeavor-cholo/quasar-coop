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
       <q-tab name="paid" label="Paid" />
     </q-tabs>

     <q-separator />

     <q-tab-panels v-model="tab" animated>
       <q-tab-panel name="unpaidTab">
         <unpaid></unpaid>
       </q-tab-panel>

       <q-tab-panel name="paid">
         <div class="text-h6">Alarms</div>
         Lorem ipsum dolor sit amet consectetur adipisicing elit.
       </q-tab-panel>

     </q-tab-panels>


  </div>
</q-page>
</template>

<script>
import Unpaid from '../../components/Admin/Monitoring/UnpaidMembers.vue'

export default {
  components: {
    Unpaid
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
