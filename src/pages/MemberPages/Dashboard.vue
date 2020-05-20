<template>
    <q-page padding>
        <!-- <div class="q-pa-md row items-start q-gutter-md"> -->
        <q-card class="my-card">
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">Total Share of Stocks</div>
                <div class="text-h5"> 14000 </div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
                <q-btn flat>View Transactions</q-btn>
            </q-card-actions>
            </q-card>

            <q-card class="my-card">
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">Capital Interest</div>
                <div class="text-h5"> 280 </div>
            </q-card-section>
            </q-card>

            <q-card class="my-card">
            <q-card-section class="bg-purple text-white">
                <div class="text-h6">Savings Deposit</div>
                <div class="text-h5">5000</div>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat>View Transactions</q-btn>
            </q-card-actions>
            </q-card>

            <q-card class="my-card">
            <q-card-section class="bg-teal text-white">
                <div class="text-h6">Loan Balance</div>
                <div class="text-subtitle2">0</div>
            </q-card-section>

            <q-card-actions vertical align="right">
                <q-btn flat>View Transactions</q-btn>
            </q-card-actions>
            </q-card>

            <q-card class="my-card">
            <q-card-section class="bg-grey-8 text-white">
                <div class="text-h6">Billing</div>
                <div class="text-h5">0</div>
            </q-card-section>

            <q-card-actions vertical align="right">
                <q-btn flat>View Records</q-btn>
            </q-card-actions>
            </q-card>
        <!-- </div> -->
    </q-page>
</template>

<script>
export default {
  data () {
    return {
      lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }
  },
  methods: {
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>