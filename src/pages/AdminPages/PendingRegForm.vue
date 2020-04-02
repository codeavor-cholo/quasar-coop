<template>
<div class="q-pa-md">
   <div class="q-pa-md doc-container" id="printdiv">
      <div class="row  justify-center">
        <div 
          class="col-xs-12 col-sm-12 col-md-10 q-pa-md"
          >

          <q-card
          class="my-card text-white"
          inline
          >
              <q-card-section>
                <q-form
                @reset="onReset"
                class="q-gutter-md"
                >
                    <div>
                        <h4 class="row justify-center items-center" style="color: #26A69A;">Information Sheet</h4>

                        <strong class="row justify-center items-center" style="color: #26A69A;">
                            Personal Data
                        </strong>

                        <q-separator class= "q-mb-md q-pt-xs" color="secondary" inset hidden = 'true'/>
                        
                        <q-input standard v-model="PenReg.FirstName" label="First Name"
                        readonly
                        />
                        <q-input standard v-model="PenReg.LastName" label="Last Name"
                        readonly
                        />
                        <q-select v-model="PenReg.CivilStatus" 
                        label="Civil Status" 
                        readonly
                        />
                        <strong class="row justify-center items-center" style="color: #26A69A;">
                            Birth
                        </strong>
                        <q-separator class= "q-mb-md q-pt-xs" color="secondary" inset hidden = 'true'/>

                         <q-input standard v-model="PenReg.BirthDate" stack-label label="Birthdate"
                        type="date"
                        readonly
                        />
                        <q-input standard v-model="PenReg.BirthPlace" label="Birthplace"
                        readonly
                        />
                         <strong class="row justify-center items-center" style="color: #26A69A;">
                           Current Address
                        </strong>
                        <q-separator class= "q-mb-md q-pt-xs" color="secondary" inset hidden = 'true'/>
                        
                        <q-input standard v-model="PenReg.Address" label="Address"
                        readonly
                        />

                        <q-input standard v-model="PenReg.Phone" label="Phone"
                        readonly
                        />

                        <q-input standard v-model="PenReg.Email" label="Email"
                        readonly
                        />
                        <strong class="row justify-center items-center" style="color: #26A69A;">
                            Employment
                        </strong>
                        <q-separator class= "q-mb-md q-pt-xs" color="secondary" inset hidden = 'true'/>

                        <q-input standard v-model="PenReg.Occupation" label="Occupation"
                        readonly
                        />
                        <q-input standard v-model="PenReg.EmployerCompany" label="Employer/ Company"
                        readonly
                        />
                        <q-input standard v-model="PenReg.Salary" label="Salary"
                        type="number"
                        readonly
                        />
                        <q-input standard v-model="PenReg.OtherIncome" label="Other Sources of Income"
                        readonly
                        />
                        <strong class="row justify-center items-center" style="color: #26A69A;">
                            Family Background
                        </strong>
                        <q-separator class= "q-mb-md q-pt-xs" color="secondary" inset hidden = 'true'/>

                        <q-input standard v-model="PenReg.RelativeName" label="Nearest Relative"
                        readonly
                        />
                        <q-input standard v-model="PenReg.Relationship" label="Relationship"
                        readonly
                        />
                        <q-input standard v-model="PenReg.NoDependents" label="Number of Dependents"
                        readonly
                        type="number"
                        />
                        
                        <div v-if="PenReg.Designation == 'Driver'">
                          <strong class="row justify-center items-center" style="color: #26A69A;">
                            License Details
                          </strong>
                          <q-separator class= "q-mb-md q-pt-xs" color="secondary" inset hidden = 'true'/>

                          <img :src="PenReg.imageUrlLic" width='300' height='150'>

                        <q-input standard v-model="PenReg.LicenseNo" label="License Number"
                        readonly
                        />
                        <q-input standard stack-label v-model="PenReg.LicenseExp" label="License Expiration Date"
                        type="date"
                        readonly
                        />                    
                        </div> 
                    </div>
                </q-form>
              </q-card-section>
              <q-separator/>
              <div class="row justify-center">
                <q-btn 
                class="col q-ma-md" 
                color="teal-4" 
                label="Approve"
                @click="regMember(); loadPreReg(mid)"
                />
                <q-btn class="col q-ma-md" 
                @click="rejectMember"
                to="/admin/pendingreg/"
                color="teal-4" 
                label="Reject"/>
              </div>
          </q-card>
          
        </div>
      </div>    
    </div> 
</div>
</template> 

<script>
import { firebaseDb, firefirestore } from 'boot/firebase';
// import { mapActions } from 'vuex'

export default {
  data () {
    return {
       newMessage: '',
       PenReg: [],
       mid: ''
    }
  },
  props: ['penRegId'],
  firestore () {
    return {
        // Doc
        PenReg: firebaseDb.collection('PreRegPersonalData').doc(this.penRegId),
        MemberData: firebaseDb.collection('MemberData'),
        MemberID: firebaseDb.collection('Counter').doc("v65AIZI2jjNN2jlEv17N"),
    }
  },
  methods: {
    regMember(){
      this.mid = 'NGTSC'+ (this.MemberID.MemberID + 1)
      this.PenReg.timestamp = firefirestore.FieldValue.serverTimestamp()
      this.$firestore.MemberData.doc(this.mid).set(this.PenReg)

      const increment = firefirestore.FieldValue.increment(1)
      this.$firestore.MemberID.update({ MemberID: increment })

      this.$firestore.PenReg.delete()
    },
    rejectMember(){
      this.$firestore.PenReg.delete()
    },
    loadPreReg(id) {
            this.$router.push('/admin/profile/' + id)
    }
    // printDiv(divName){
		// 	const prtHtml = document.getElementById(divName).innerHTML;

    //   // Get all stylesheets HTML
    //   let stylesHtml = '';
    //   for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
    //     stylesHtml += node.outerHTML;
    //   }
    //   // Open the print window
    //   const WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');

    //   WinPrint.document.write(`<!DOCTYPE html>
    //   <html>
    //     <head>
    //       ${stylesHtml}
    //     </head>
    //     <body>
    //       ${prtHtml}
    //     </body>
    //   </html>`);

    //   WinPrint.document.close();
    //   WinPrint.focus();
    //   WinPrint.print();
    //   WinPrint.close();
		// }
  }
}
</script>
