<template>
  <div>
    <q-card>
      <q-card-section>
        <div class="bg-white" id="printMe">
            <q-form
              class="q-gutter-md"
            >
              <p>&nbsp;</p>
              <h6 class="h6">APPLICATION FOR MEMBERSHIP</h6>

              <span style="padding-left: 150px;">I hereby apply for membership to the <strong>New GSIS Transport Service Cooperative.</strong></span>
                <br><span style="text-align: left;">&nbsp;I agree to obey faithfully its rules and regulations as set down in its Articles of Cooperation and Bylaws, the decisions of the general membership meetings and those of the Board of Directors.</span>
                <br><span style="text-align: left; padding-left: 30px;">I hereby pledge to:</span>
                <ol>
                <li style="text-align: left; padding-left: 30px;">Attend and finish the prescribed membership education courses.</li>
                <li style="text-align: left; padding-left: 30px;">Pay the membership fee of P 500.</li>
                <li style="text-align: left; padding-left: 30px;">Participate in the following savings program:
                <ol style="list-style-type: lower-alpha;">
                <li style="text-align: left; padding-left: 30px;">Subscribed fo at least 18 shares and pay for them either in lumpsum or installment, under the terms and conditions prescribed in the Membership Agreement.</li>
                <li style="text-align: left; padding-left: 30px;">Contribute daily/weekly/bi-monthly/monthly atleast 2% of my salary into the share capital; and</li>
                <li style="text-align: left; padding-left: 30px;">Contribute into the share capital at least 50% of the annual interest on capital and patronage refund due me.</li>
                </ol>
                </li>
                <li style="text-align: left; padding-left: 30px;">Comply with the membership and subscription agreement. For your consideration, I hereby attach my information sheet.</li>
                </ol>
                <br><span style="float:right"> .................................................</span>
                <p style="float:right">Signature</p>

                <!-- <p style="padding-left: 90px;">&nbsp;Date</p> -->
                <p style="padding-left: 75px;"><span style="text-decoration: underline;"><span class="w8qArf">&nbsp; {{ datetoday }} </span><span class="LrzXr"> </span></span></p>
                <p style="padding-left: 100px;">Date</p>
                <p><span style="text-decoration: underline;"><span class="w8qArf">&nbsp;</span><span class="LrzXr">65-C Shorthorn St, Project 8, Quezon City</span></span></p>
                <p style="padding-left: 100px;">Place</p>

                <div id="personaldata">
                <strong>PERSONAL DATA</strong>
                  <br> <span style="float:left"> Name: {{ MemberData.FirstName }}  {{ MemberData.LastName }} </span>
                      <span style="float:right">Civil Status:  {{ MemberData.CivilStatus }} &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span>
                      <br><span style="float:left"> BirthPlace: {{ MemberData.BirthPlace }} </span>
                    <span style="float:right"> Date of birth:  {{ MemberData.BirthDate }} &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span>
                    <br><span style="float:left"> Present Address: {{ MemberData.Address }} </span>
                  <br><span style="float:left"> Occupation: {{ MemberData.Occupation }} </span>
                <br><span style="float:left"> Employer or office: {{ MemberData.EmployerCompany }} </span>
                <span style="float:right"> Salary:  {{ MemberData.Salary }} &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span>
                <br><span style="float:left"> Other sources of income: {{ MemberData.OtherIncome }} </span>
                <br><span style="float:left"> Nearest relative: {{ MemberData.RelativeName }} </span>
                <span style="float:right"> Relationship: {{ MemberData.Relationship }} &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span>
                <br><span style="float:left"> Number of Dependents: {{ MemberData.NoDependents }} </span>

                <p>&nbsp;</p>
                <h6 style="text-align: center;">EARN AND SAVE THE COOPERATIVE WAY</h6>
              </div>
              
              
            </q-form>
        </div>
        </q-card-section>
        <q-card-action align="right">
          <div class="text-center q-pa-md">
            <q-btn icon="print" color="primary" v-print="'#printMe'">Print Form</q-btn>
          </div>
          
        </q-card-action>
      </q-card>
  </div>
</template>
<script>
import Vue from 'vue'
import Print from 'vue-print-nb'

Vue.use(Print)

export default {
  props: {
    MemberData: {
      type: Object,
      required: true,
      default: () => {
        return {
          FirstName: '',
          CivilStatus: '',
          BirthPlace: '',
          BirthDate: '',
          Address: '',
          Occupation: '',
          Salary: '',
          OtherIncome: '',
          RelativeName: '',
          Relationship: '',
          NoDependents: ''
        }
      }
    }
  }, // end of props
  computed: {
    datetoday () {
      var myDate = new Date();
      var month = ('0' + (myDate.getMonth() + 1)).slice(-2);
      var date = ('0' + myDate.getDate()).slice(-2);
      var year = myDate.getFullYear();
      var formattedDate = year + '-' + month + '-' + date;
      return formattedDate;
    },
  }
  
}
</script>