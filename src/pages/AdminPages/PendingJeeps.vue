<template>
  <div>
    <h6 class="q-ma-none q-pl-md q-pt-md text-teal"> Members <q-icon name="mdi-arrow-right-box" /> Pending Unit/Jeep Applications 
    </h6>
    <q-separator />
    <div v-if="loading">
      <q-spinner-oval
        color="teal"
        size="200px"
        :thickness="5"
        class="fixed-center"
      />
    </div>
    <div v-if="!loading" class="col-xs-10 col-sm-10 col-md-8 q-pa-md">
      <q-markup-table separator="horizontal" flat bordered>
        <thead class="bg-teal">
          <tr class="text-h4 q-ml-md text-white">
            <th class="text-left">Plate Number</th>
            <th class="text-left">Operator ID</th>
             <th class="text-left">Status</th>
            <th class="text-left">ORCR</th>
            <th class="text-left"></th>
          </tr>
        </thead>


        <tbody>
          <tr v-for="(PendingReg, id) in returnJeepneyData" :key="id">
            <td class="text-left">{{ PendingReg.PlateNumber }}</td>
            <td class="text-left">{{ PendingReg.MemberID }}</td>
            <td class="text-left">
                <q-icon name="warning" size="md" v-if="PendingReg.Status == null" color="warning"/>
                <q-icon name="check_circle" size="md" v-if="PendingReg.Status == 'approved'" color="teal" />
                <q-icon name="cancel" size="md" v-if="PendingReg.Status == 'rejected'" color="red" />
            </td>
            <td class="text-left"><q-btn dense flat icon="visibility" label="view orcr" @click="onClickORCR(PendingReg.ORCR)" /></td>
            <td class="text-left">
                <div v-if="PendingReg.Status == null">
                    <q-btn flat label="REJECT UNIT" icon-right="cancel" @click="rejectUnit(PendingReg['.key'])"/>
                    <q-btn flat label="APPROVE UNIT" icon-right="check_circle" @click="approveUnit(PendingReg['.key'])" color="teal"/>
                </div>
                <div v-else-if="PendingReg.Status == 'rejected'" class="text-red text-weight-bold">
                    <q-icon name="cancel" class="q-mr-sm"/>{{PendingReg.rejectReason}}
                </div>
                <div v-else>
                    No actions available.
                </div>
            </td>
            <!-- <td class="text-left"><q-btn flat label="View Details" class="full-width" icon-right="mdi-arrow-right" @click="loadPreReg(id)"/></td> -->
          </tr>
        </tbody>

    </q-markup-table>
    </div>
    <q-dialog v-model="viewDialog" persistent>
        <q-card style="width:50vw">
            <q-card-section class="row items-center">
                <q-img
                    :src="selectedURL"
                    contain=""
                    :ratio="1"
                    spinner-color="primary"
                    spinner-size="82px"
                />
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat label="Close" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { firebaseDb, firebaseSto, firefirestore, Auth2 } from 'boot/firebase';

export default {
    data () {
        return{
          loading: false,
          JeepneyData: [],
          selectedURL: null,
          viewDialog: false,
        }
    },
    firestore () {
      return {
            JeepneyData: firebaseDb.collection('JeepneyData'),
            MemberData: firebaseDb.collection('MemberData')
        }
    },
    mounted () {
      // Binding Collections
    //   this.$bindAsArray("JeepneyData", firebaseDb.collection("JeepneyData"))
    //   .then((JeepneyData) => {
    //     console.log(JeepneyData,'JeepneyData')
    //     this.loading = false
    //   })
    },
    computed:{
        returnJeepneyData(){
            try {
                let filter = this.JeepneyData.filter(a=>{
                    if(a.MemberID !== null && a.MemberID !== undefined){
                        a.timestamp = this.getMemberTimeStamp(a.MemberID)
                    }
                    return a.MemberID !== null && a.MemberID !== undefined && a.dateAdded !== undefined
                })
                console.log(filter,'filter')

                let order = this.$lodash.orderBy(filter,a=>{
                    return a.dateAdded
                 },'desc')
                console.log(order,'order')
                return order
            } catch (error) {
                console.log(error)
                return []
            }
        }
    },
    methods: {

        isDate(value) {
            switch (typeof value) {
                case 'number':
                    return true;
                case 'string':
                    return !isNaN(Date.parse(value));
                case 'object':
                    if (value instanceof Date) {
                        return !isNaN(value.getTime());
                    }
                default:
                    return false;
            }
        },
        getMemberTimeStamp(id){
            let filter = this.MemberData.filter(a=>{
                return a['.key'] == id
            })[0]

            return filter.timestamp
        },
        onClickORCR(ORCR){
            this.selectedURL = ORCR
            this.viewDialog = true
        },
        approveUnit(id){
            console.log(id,'id')
            this.$q.dialog({
            title: 'Confirm Unit/Jeep Approval',
            message: 'Would you like to approve this unit/jeep application?',
            cancel: true,
            persistent: true
            }).onOk(() => {
                console.log('ok')
                firebaseDb.collection("JeepneyData").doc(id).update({
                    Status: 'approved',
                    dateApproved: firefirestore.FieldValue.serverTimestamp()
                })
            })            
        },
        rejectUnit(id){
            console.log(id,'id')
            this.$q.dialog({
            title: 'Confirm Unit/Jeep Rejection',
            message: 'Would you like to reject this unit/jeep application? If Yes, State your reason below.',
            cancel: true,
            persistent: true,
            prompt: {
                model: '',
                type: 'text', // optional
            },
            }).onOk(data => {
                console.log('ok',data)
                firebaseDb.collection("JeepneyData").doc(id).update({
                    Status: 'rejected',
                    dateRejected: firefirestore.FieldValue.serverTimestamp(),
                    rejectReason: data
                })
            })  
        }
        // loadPreReg(id) {
        //     this.$router.push('/admin/pendingregform/' + id)
        // }
    }
}
</script>