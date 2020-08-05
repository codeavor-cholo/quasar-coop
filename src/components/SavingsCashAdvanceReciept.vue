<template>
    <q-card class="my-card"  flat="">

        <q-item class="q-pa-md bg-grey-2 q-py-lg">
            <q-item-section>
                <q-item-label class="text-overline row justify-between">
                    <div>{{ data.MemberID }}
                        <br>
                        {{ data.MemberName }}
                    </div>
                    <div class="text-right text-uppercase">
                        #{{data.baseID}}
                    </div>
                </q-item-label>
                <q-item-label caption lines="2" class="text-right">{{ $moment(data.timestamp != '' ? data.timestamp.toDate() : '').format('LL') }}</q-item-label>
                <q-item-label overline class="text-teal text-right">{{data.baseTransaction}}</q-item-label>
            </q-item-section>
        </q-item>
        <q-separator />
        <q-item-label header class="q-px-lg q-mt-sm q-mb-sm">
            Transaction Breakdown
        </q-item-label>

        <div class="q-gutter-md">
        <q-item v-if="data.SavingsDeposit != 0" class="q-px-lg q-py-none" dense="">
            <q-item-section>
            <q-item-label>Savings Deposit</q-item-label>
            </q-item-section>
            <q-item-section side>
            <q-item-label > {{ data.SavingsDeposit | currency }} </q-item-label>
            </q-item-section>
        </q-item>
        <q-item v-if="data.baseAmount != 0" class="q-px-lg q-py-none q-mb-md" dense="">
            <q-item-section>
            <q-item-label>Withdraw Amount</q-item-label>
            </q-item-section>
            <q-item-section side>
            <q-item-label >- {{ data.baseAmount | currency }} </q-item-label>
            </q-item-section>
        </q-item>
        </div>

        <q-separator spaced/>
        <q-item class="q-px-lg q-mt-md" v-if="data.RemainingBalance != undefined">
            
            <q-item-section>
            <q-item-label class="text-weight-bold">Remaining Balance</q-item-label>
            </q-item-section>

            <q-item-section side>
            <q-item-label class="text-h6 text-teal text-weight-bold">{{ data.RemainingBalance | currency }}</q-item-label>
            </q-item-section>
        </q-item>

        <div class="q-pa-md q-mb-md noPrint">
            <q-btn color="grey-10" icon="file_download" label="download reciept" class="full-width" @click="printMe"/>
        </div>
    </q-card>
</template>
<script>
export default {
    props: ['data'],
    data(){
        return{
            printOn: false,
        }
    },
    methods: {
        test () {
            console.log(this.T)
        },
        printMe(){
            this.printOn = true
            window.print();
        }
    }
}
</script>
<style>
   /* .my-card {
       width:100%;
   }
@media print {
   .noPrint {display:none;}
   .my-card {
       width: 100%;
       height: 100%;
       margin: 0;
       
   }
} */

</style>