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
                <q-icon size="26px" name="people" />Drivers
              </div>
              <q-separator color="white" />
              <div class="text-subtitle2">
                Active
                <h6 class="q-pa-none q-ma-none text-center shadow-21">69</h6>
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
                <q-icon size="26px" name="people" />Drivers
              </div>
              <q-separator color="white" />
              <div class="text-subtitle2">
                Inactive
                <h6 class="q-pa-none q-ma-none text-center shadow-21">69</h6>
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
                <q-icon size="26px" name="people" />Drivers
              </div>
              <q-separator color="white" />
              <div class="text-subtitle2">
                Payed
                <h6 class="q-pa-none q-ma-none text-center shadow-21">69</h6>
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
                <q-icon size="26px" name="people" />Drivers
              </div>
              <q-separator color="white" />
              <div class="text-subtitle2">
                Unpaid
                <h6 class="q-pa-none q-ma-none text-center shadow-21">69</h6>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
        <div class="q-pa-lg">
              <apexchart max-width="600" height="500" type="bar" :options="charts" :series="bars"></apexchart>
        </div>
      </div>

       <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 q-mt-xl q-pt-xl">
          <div class="q-pa-lg">
                <apexchart max-width="800" height="800" type="donut" :options="donuts" :series="payments"></apexchart>
          </div>
      </div>

       <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12
        q-mt-xl q-pt-xl">
          <div class="q-pa-lg">
             <apexchart max-width="500" type="line" :options="lines" :series="slantings"></apexchart>
          </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  data() {
    return {
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
            
            labels: ['Management Fee', 'Share Capital', 'Savings Deposit', 'Advances']
         }, 
         payments: [100, 55, 13, 33],
        //Line Graph
        lines:{
               xaxis: {
              categories: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]
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
  }
};
</script>
<style scoped>
</style>
