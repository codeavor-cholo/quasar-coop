<template>
  <div>
        <div class="bg-white" >
            <q-form
              id="printMe"
              class="q-gutter-md"
            >
              <p>&nbsp;</p>
              <h6 class="h6">APPLICATION FOR MEMBERSHIP</h6>
              <div class="q-px-md" id="printMe">
              <span style="padding-left: 150px;">I hereby apply for membership to the <strong>New GSIS Transport Service Cooperative.</strong></span> I agree to obey faithfully its rules and regulations as set down in its Articles of Cooperation and Bylaws, the decisions of the general membership meetings and those of the Board of Directors.
              </div>
              <div class="q-px-md" id="printMe">
                <br><span>I hereby pledge to:</span>
                <ol>
                <li>Attend and finish the prescribed membership education courses.</li>
                <li>Pay the membership fee of P 500.</li>
                <li>Participate in the following savings program:
                <ol style="list-style-type: lower-alpha;">
                <li>Subscribed fo at least 18 shares and pay for them either in lumpsum or installment, under the terms and conditions prescribed in the Membership Agreement.</li>
                <li>Contribute daily/weekly/bi-monthly/monthly atleast 2% of my salary into the share capital; and</li>
                <li>Contribute into the share capital at least 50% of the annual interest on capital and patronage refund due me.</li>
                </ol>
                </li>
                <li>Comply with the membership and subscription agreement. For your consideration, I hereby attach my information sheet.</li>

                </ol>
              </div>
                <br>
                <div class="row q-mb-xl q-px-md" id="printMe">
                  <div class="col justify-start full-width row">
                    <div>
                    <div class="text-title"><span style="text-decoration: underline;"><span>&nbsp;{{ datetoday }}&nbsp; </span><span> </span></span></div>
                    <div>Date</div>
                    <div class="q-mt-md"><span style="text-decoration: underline;"><span>&nbsp;</span><span>65-C Shorthorn St, Project 8, Quezon City</span></span></div>
                    <div>Place</div>
                    </div>
                  </div>
                  <div class="col justify-end full-width row">
                    <div>
                      <div style="float-right full-width"> .................................................</div>
                      <div style="float-right">Signature</div> 
                    </div>
                   
                  </div>
                </div>
                
                
                <hr>

                <div id="personaldata" class="q-px-md q-mt-lg">
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
              


          <div class="text-center q-pa-md noPrint">
            <q-btn icon="print" color="primary" @click="printMeForm">Print Form</q-btn>
          </div>

  </div>
  </div>
</template>
<script>
import Vue from 'vue'
// import Print from 'vue-print-nb'

// Vue.use(Print)

export default {
  props: {
    MemberData: {
      type: Object,
      required: true,
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
  },
  methods:{
    printMeForm(){
      window.print()
    }
  }
  
}
</script>
<style type = "text/css">
  @media print {
    #printMe {
      padding: 0px;
      margin: 0px;
      page-break-after: avoid;
    }
   .noPrint {display:none;}
   .yesPrint {display:block;}

    ::-webkit-scrollbar {
        display: none;
    }

  }
</style>