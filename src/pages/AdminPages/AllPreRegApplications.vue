<template>
  <div>
    <h6 class="q-ma-none q-pl-md q-pt-md text-teal"> Members <q-icon name="mdi-arrow-right-box" /> All Member Applications </h6>
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
            <th class="text-left">Name of Applicant</th>
            <th class="text-left">Approver / Rejector</th>
             <th class="text-left">Status</th>
             <th class="text-left">Reject Reason</th>
            <th class="text-left">Date Processed</th>
            <th class="text-left"></th>
          </tr>
        </thead>


        <tbody>
          <tr v-for="(PendingReg, id) in returnRejectAndApproved" :key="id">
            <td class="text-left">{{ PendingReg.FirstName }} {{ PendingReg.LastName }}</td>
            <td class="text-left"> <span v-if="PendingReg.approvedBy !== undefined">{{PendingReg.approvedBy}}</span> <span v-else>{{PendingReg.rejectedBy}}</span> </td>
             <td class="text-left">
                <q-icon name="check_circle" size="md" v-if="PendingReg.approvedBy !== undefined" color="teal" />
                <q-icon name="cancel" size="md" v-else color="red" />
            </td>           
            <td class="text-left text-red text-weight-bold">
                <span v-if="PendingReg.approvedBy == undefined"> {{PendingReg.rejectReason}}</span>
            </td>
            <td class="text-left">
                <span v-if="PendingReg.approvedBy !== undefined">{{$moment(PendingReg.dateApproved.toDate()).format('LLLL')}}</span> <span v-else>{{$moment(PendingReg.dateRejected.toDate()).format('LLLL')}}</span>
            </td>
            <td>
                <q-btn flat 
                v-if="PendingReg.approvedBy !== undefined"
                color="secondary"
                class="full-width" 
                icon-right="mdi-arrow-right" 
                label="View Profile" 
                @click="loadProfile(PendingReg['.key'])"
                />
                <q-btn flat 
                v-else
                color="red"
                class="full-width" 
                icon-right="mdi-arrow-right" 
                label="View Application" 
                @click="loadPreReg(PendingReg['.key'])"
                />
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
            MemberData: firebaseDb.collection('MemberData'),
            RejectedApplications: firebaseDb.collection('RejectedApplications')
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
                    return a.MemberID !== null && a.MemberID !== undefined
                })
                console.log(filter,'filter')

                let order = this.$lodash.orderBy(filter,a=>{
                    console.log(a.timestamp)
                    return a.timestamp
                 },'desc')
                console.log(order,'order')
                return order
            } catch (error) {
                console.log(error)
                return []
            }
        },
        returnRejectAndApproved(){
            try {
                let concat = [...this.RejectedApplications,...this.MemberData]
                let order = this.$lodash.orderBy(concat,a=>{
                    a.baseTime = a.dateApproved == undefined ? a.dateRejected : a.dateApproved
                    // console.log(a.baseTime.toDate())
                    return a.baseTime
                 },'desc')
                 console.log(order,'order')
                return order
            } catch (error) {
                console.log(error,'returnRejectAndApproved')
                return []
            }
        }
    },
    methods: {
        loadPreReg(id) {
            this.$router.push('/admin/rejectedregform/' + id)
        },
        loadProfile(id) {
            this.$router.push('/admin/profile/' + id)
        },
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
        },
        turnTimeToSumthing(dateTime){
            return new Date(dateTime)
        }
        // loadPreReg(id) {
        //     this.$router.push('/admin/pendingregform/' + id)
        // }
    }
}
</script>