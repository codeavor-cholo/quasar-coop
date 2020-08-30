<template>
    <q-page>
        <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4">Payment Fee Maintenance</h6>
       <q-separator /> 
        <div class="row">
            <div class="col">
                <q-list class="q-pa-md">
                    <q-item-label header>Daily Payment</q-item-label>
                    <q-item>
                        <q-item-section>
                            <span class="text-weight-bold">Management Fee</span> (Operator)
                        </q-item-section>
                        <q-item-section side>
                            <div class="row q-gutter-md">
                                <q-input v-model="returnFixedPayments[2].amount" type="number" prefix="₱" filled dense readonly=""/>
                                <q-btn color="teal-6" icon="edit" flat @click="onClick('Management Fee (Operator)',returnFixedPayments[2].amount)" />
                            </div>
                        </q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section>
                            <span class="text-weight-bold">Management Fee</span> (Driver)
                        </q-item-section>
                        <q-item-section side>
                            <div class="row q-gutter-md">
                                <q-input v-model="returnFixedPayments[1].amount" type="number" prefix="₱" filled dense readonly=""/>
                                <q-btn color="teal-6" icon="edit" flat @click="onClick('Management Fee (Driver)',returnFixedPayments[1].amount)" />
                            </div>
                        </q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section>
                            <span class="text-weight-bold">Share of Stocks</span> (minimum fee)
                        </q-item-section>
                        <q-item-section side>
                            <div class="row q-gutter-md">
                                <q-input v-model="returnFixedPayments[4].amount" type="number" prefix="₱" filled dense readonly=""/>
                                <q-btn color="teal-6" icon="edit" flat @click="onClick('Share of Stocks',returnFixedPayments[4].amount)" />
                            </div>
                        </q-item-section>
                    </q-item> 
                    <br>
                    <q-item-label header>One-time Payment</q-item-label>
                    <q-item>
                        <q-item-section>
                            <span class="text-weight-bold">Membership Fee</span>
                        </q-item-section>
                        <q-item-section side>
                            <div class="row q-gutter-md">
                                <q-input v-model="returnFixedPayments[3].amount" type="number" prefix="₱" filled dense readonly=""/>
                                <q-btn color="teal-6" icon="edit" flat @click="onClick('Membership Fee',returnFixedPayments[3].amount)" />
                            </div>
                        </q-item-section>
                    </q-item> 
                    <br>
                    <q-item-label header>Cash Advance Related</q-item-label>
                    <q-item>
                        <q-item-section>
                            <span class="text-weight-bold">Interest Rates (per Month)</span>
                        </q-item-section>
                        <q-item-section side>
                            <div class="row q-gutter-md">
                                <q-input v-model="returnFixedPayments[0].amount" type="number" suffix="%" filled dense readonly=""/>
                                <q-btn color="teal-6" icon="edit" flat @click="onClick('Interest Rates',returnFixedPayments[0].amount)" />
                            </div>
                        </q-item-section>
                    </q-item> 
                    <q-item>
                        <q-item-section>
                            <span class="text-weight-bold">Share of Stocks (CA)</span> (minimum amount before cash advance)
                        </q-item-section>
                        <q-item-section side>
                            <div class="row q-gutter-md">
                                <q-input v-model="returnFixedPayments[5].amount" type="number" prefix="₱" filled dense readonly=""/>
                                <q-btn color="teal-6" icon="edit" flat @click="onClick('ShareOfStocksMin',returnFixedPayments[5].amount)" />
                            </div>
                        </q-item-section>
                    </q-item>                                        
                </q-list>
            </div>
            <div class="col">
                <q-list class="q-pa-md">
                    <q-item-label header>Others (Description & Amount)</q-item-label>
                    <q-item v-for="other in OtherPayments" :key="other['.key']">
                        <q-item-section>
                            <span class="text-weight-bold">{{other.description}}</span>
                        </q-item-section>
                        <q-item-section side>
                            <div class="row q-gutter-md">
                                <q-input v-model="other.amount" type="number" prefix="₱" filled dense readonly=""/>
                                <q-btn color="teal-6" icon="edit" flat @click="onClickOthers(other.description,other.amount,other['.key'])" dense/>
                                <q-btn color="grey-6" icon="delete" flat @click="onDelete(other['.key'],other.description)" dense=""/>
                            </div>
                        </q-item-section>
                    </q-item> 
                    <br> 
                    <q-item>
                        <q-btn color="primary" icon="add" label="add new" class="full-width" @click="addNewOthers"/>
                    </q-item>
                </q-list>

            </div>
        </div>

        <q-dialog v-model="dialog" persistent>
            <q-card style="width:350px;">
                <q-card-section class="q-gutter-md">
                    <div class="text-h6" v-if="othersNew == false">Edit {{description}}</div>
                    <div class="text-h6" v-else>New Payment (Others)</div>
                    <q-input v-model="description" type="text" label="Description" outlined="" :readonly="others == false"/>
                    <q-input v-model="amount" type="number" :prefix="description == 'Interest Rates' ? '' : '₱'"
                    :suffix="description == 'Interest Rates' ? '%' : ''" label="Amount" outlined=""/>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="grey-6" v-close-popup @click="onCancel"/>
                    <q-btn flat label="Save Changes" color="primary" v-close-popup v-if="othersNew == false" @click="saveChangeChoice"/>
                    <q-btn flat label="Add New Payment" color="primary" v-close-popup v-else @click="saveNewOthers"/>
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="deleteOthers" persistent>
            <q-card>
                <q-card-section class="row items-center">
                    <q-avatar icon="delete" color="red" text-color="white" />
                    <span class="q-ml-sm">Are you sure you want to delete <b>{{description}}</b>?</span>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="grey-6" v-close-popup @click="onCancel"/>
                    <q-btn flat label="Delete" color="red" v-close-popup @click="deleteOthersConfirm"/>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>

</template>
<script>
import { firebaseDb, firebaseSto, firefirestore } from 'boot/firebase';
export default {
    data(){
        return {
            managementFeeOperator: 0,
            dialog: false,
            deleteOthers: false,
            description: 'Management Fee',
            amount: 0,
            others: false,
            othersNew: false,
            FixedPayments: [],
            OtherPayments: [],
            selectedID: '',
        }
    },
    firestore () {
        return {
            // Collection
            FixedPayments: firebaseDb.collection('FixedPayments'),
            OtherPayments: firebaseDb.collection('OtherPayments'),
        }
    },
    created(){

    },
    mounted(){

    },
    computed:{
        returnFixedPayments(){
            try {
                // console.log(this.FixedPayments,'fixed')
                return this.FixedPayments                
            } catch (error) {
                return []
            }
        }
    },
    methods:{
        onClick(desc,amount){
            this.dialog = true
            this.description = desc
            this.amount = amount
        },
        saveChangeChoice(){
            if(this.others == true){
                this.saveChangesOthers()
            } else {
                this.saveChangesFixed()
            }
        },
        saveChangesFixed(){
            let id = ''
            if(this.description == 'Management Fee (Operator)'){
                id = 'ManagementFeeOperator'
            } else if (this.description == 'Management Fee (Driver)') {
                id = 'ManagementFeeDriver'
            } else if (this.description == 'Share of Stocks') {
                id = 'ShareOfStocks'
            } else if (this.description == 'ShareOfStocksMin') {
                id = 'ShareOfStocksMin'
            } else if (this.description == 'Interest Rates') {
                id = 'InterestRates'    
            } else {
                id = 'MembershipFee'
            }

            let save = {
                description: this.description,
                amount: this.amount
            }

            this.$firestore.FixedPayments.doc(id).set(save)
            .then(()=>{
                this.onCancel()
                this.$q.notify({
                    color: 'teal-4',
                    textColor: 'white',
                    icon: 'check',
                    message: "Success Saving Changes in "+ save.description,
                    })               
            })

        },
        saveChangesOthers(){
            let edited = this.description
            this.$firestore.OtherPayments.doc(this.selectedID).set({description: this.description,amount: this.amount})
            .then(()=>{
                this.onCancel()
                this.$q.notify({
                    color: 'teal-4',
                    textColor: 'white',
                    icon: 'check',
                    message: "Success Saving Changes in "+ edited,
                    })               
            })            
        },
        onClickOthers(desc,amount,id){
            this.dialog = true
            this.description = desc
            this.amount = amount
            this.others = true
            this.selectedID = id
        },
        addNewOthers(){
            this.dialog = true
            this.description = ''
            this.amount = 0
            this.others = true
            this.othersNew = true
        },
        onCancel(){
            this.dialog = false
            this.deleteOthers = false
            this.description = 'Management Fee'
            this.amount = 0
            this.others = false
            this.othersNew = false    
            this.selectedID = ''        
        },
        onDelete(id,desc){
            this.deleteOthers = true
            this.description = desc
            this.selectedID = id            
        },
        saveNewOthers(){
            let save = {
                description: this.description,
                amount: this.amount
            }
            this.$firestore.OtherPayments.add(save)
            .then(()=>{
                this.onCancel()
                this.$q.notify({
                    color: 'teal-4',
                    textColor: 'white',
                    icon: 'check',
                    message: "Success Adding New Payment",
                    })               
            })
        },
        deleteOthersConfirm(){
            let deleted = this.description
            this.$firestore.OtherPayments.doc(this.selectedID).delete()
            .then(()=>{
                this.onCancel()
                this.$q.notify({
                    color: 'warning',
                    textColor: 'white',
                    icon: 'check_circle',
                    message: "Success Deleting "+deleted,
                    })               
            })            
        }
    }
}
</script>