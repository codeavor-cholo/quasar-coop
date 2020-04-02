<template>
<div>
    <div class="q-pa-md">
        <q-card class="my-card">
            <q-card-section>
                <div class="text-h3 text-teal-4">Services</div>
            </q-card-section>
            <q-separator/>
            <q-card-section class="line-height">
                <q-img
                    src="../../statics/icons/Jeeps.jpg"
                    class="service-image height: 200px; width: 200px;"
                    color="teal"
                    spinner-color="teal"
                    spinner-size="82px"
                >
                   
                </q-img>
            <br><br>
             <div class="q-pa-md">
    <div class="q-gutter-y-lg" style="max-width: 30000px">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-teal-4"
          active-color="teal"
          indicator-color="teal"
          align="justify"
          narrow-indicator
        >
          <q-tab name="membership" label="Membership" />
          <q-tab name="savingsdeposit" label="Savings and Deposit" />
          <q-tab name="loans" label="Loans" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="membership">
            <div class="text-h3 text-teal-4 q-mb-md">Members</div>
            <q-separator/>
            <div class="q-mt-md">
              <div class="text-h5 text-teal-9">The following can be members of New Gsis Cooperative.</div>
                <div class="q-pa-sm q-ml-md">
                <template>
                    <div class="text-h6 text-teal-4"><q-icon class="q-mr-xs" color="teal" name="mdi-check-circle" />Drivers</div>
                    <div class="text-h6 text-teal-4"><q-icon class="q-mr-xs" color="teal" name="mdi-check-circle" />Operators</div>
                    <div class="text-h6 text-teal-4"><q-icon class="q-mr-xs" color="teal" name="mdi-check-circle" />Anyone who owns or drives a Jeep</div>
                </template>
                </div>
             </div>
             <div class="q-mt-md">
              <div class="text-h5 text-teal-9">Basic Membership Requirements.</div>
                <div class="q-pa-sm q-ml-md">
                <template>
                    <div class="text-h6 text-teal-4"><q-icon class="q-mr-xs" color="teal" name="mdi-check-circle" />Filled-out Pre-Registration Form</div>
                    <div class="text-h6 text-teal-4"><q-icon class="q-mr-xs" color="teal" name="mdi-check-circle" />Filled-out Membership Application Form</div>
                    <div class="text-h6 text-teal-4"><q-icon class="q-mr-xs" color="teal" name="mdi-check-circle" />Two (2) valid IDs and latest ID picture</div>
                </template>
                </div>
             </div>
                 <div class="q-mt-md">
              <div class="text-h5 text-teal-9">Privileges.</div>
                <div class="q-pa-sm q-ml-md">
                <template>
                    <div class="text-h6 text-teal-4"><q-icon class="q-mr-xs" color="teal" name="mdi-check-circle" />ACCESS TO AFFORDABLE PRODUCTS AND SERVICES <br>
                        - As a member, you have access to competitive financial and relevant services to support your socio-economic needs.</div>
                    <div class="text-h6 text-teal-4"><q-icon class="q-mr-xs" color="teal" name="mdi-check-circle" />LOAN INSURANCE <br>
                        - Your loan availment is covered by the insurance. In case of death, payment of outstanding balance will be shouldered by the insurance provider</div>
                    <div class="text-h6 text-teal-4"><q-icon class="q-mr-xs" color="teal" name="mdi-check-circle" />PATRONAGE REFUND <br>
                        - If loaning, you are entitled for patronage refund (Rebates in cash and gifts every December)</div>
                    <div class="text-h6 text-teal-4"><q-icon class="q-mr-xs" color="teal" name="mdi-check-circle" />LICENSE BENEFIT <br>
                        - As a you're paying the fees consistently, you will recieve a ₱700.00 license renewal money.</div>
                </template>
                </div>
             </div>
          </q-tab-panel>

          <q-tab-panel name="savingsdeposit">
           <div class="text-h3 text-teal q-mb-lg">Savings and Deposit</div>
            <q-separator/>
            <br>
                 <q-img
                    src="../../statics/icons/Savings-Deposit.jpg"
                    class="service-image height: 200px; width: 200px;"
                    color="teal"
                    spinner-color="teal"
                    spinner-size="82px"
                  />
                    <div class="text-h6 text-teal-4 q-mb-md text-italic q-pa-md">Our Savings account products provide you utmost convenience in safe keeping and growing your funds. Save for the future and enjoy your earnings.</div>
                 <q-separator/>
                  <div class="text-h3 text-teal q-ma-md">Time</div>
                     <q-separator/>
                     <br>
                      <q-img
                        src="../../statics/icons/TimeDeposit.png"
                        class="time-deposit height: 100px; width: 100px;"
                        color="teal"
                        spinner-color="teal"
                        spinner-size="82px"
                      />
                        <div class="text-h6 text-teal-4 q-mb-md text-italic q-pa-md">In our Time Deposit, you can save your money for a period of time. Our high yield account is a great way to start an investment.</div>
          </q-tab-panel>

          <q-tab-panel name="loans">
            <div class="text-h3 text-teal q-mb-md">Loans</div>
            <q-separator  />
             <br>
               <q-img
                    src="../../statics/icons/Loans.jpg"
                    class="time-deposit height: 100px; width: 100px;"
                    color="teal"
                    spinner-color="teal"
                    spinner-size="82px"
                  />
                  <div class="text-h6 text-teal-4 q-ma-md">
                    New Gsis Cooperative offers the most affordable loan packages. 
                    In order to provide speedy financial assistance 
                    to its members not only for their day to day needs, New Gsis Cooperative ensures that excellent 
                    and efficient Service is rendered to all.  New Gsis Cooperative wishes to uplift the lives of its
                     members and to empower them to dream bigger, to build home for their family, drive 
                     their own dream car and to send their kids to schools.
                  </div>
                  <q-separator />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
            <!-- <div class="q-mb-md">
                <div class="text-h5 text-teal-9">The following can be members of New Gsis Cooperative.</div>
                <div class="q-pa-sm q-ml-md">
                    
                <template>
                    <div class="text-h6 text-teal-4"><q-icon class="q-mr-xs" color="teal" name="mdi-check-circle" />Drivers</div>
                    <div class="text-h6 text-teal-4"><q-icon class="q-mr-xs" color="teal" name="mdi-check-circle" />Operators</div>
                </template>
                </div>
            </div>
              <div class="text-h5 text-teal-9">What are the Requirements?</div>
              <template>
                <div class="q-pa-sm q-ml-md">
                  <div class="text-h6 text-teal-4"><q-icon class="q-mr-xs" color="teal" name="mdi-check-circle" />Drivers License</div>
                  <div class="text-h6 text-teal-4"><q-icon class="q-mr-xs" color="teal" name="mdi-check-circle" />Operators</div>
                </div>
              </template> -->
            <br><br>

            </q-card-section>
        </q-card>
    </div>
</div>
</template>  
<script>
export default {
    data() {
        return {
             tab: 'membership'
        }
    },
}
</script>
<style scoped>
.line-height {
    line-height: 20px;
}
.service-image{
     height: 800px; 
}
.time-deposit{
  height: 800px;
}
</style>