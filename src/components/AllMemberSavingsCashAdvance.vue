<template>
    <div class="my-card"  flat=""> 
        <q-item class="q-pa-md bg-grey-2">
            <q-item-section>
                <q-item-label class="text-h6 row justify-between">
                    <div>{{ model.label }}
                        <br>
                        <span v-if="type == 'Savings'">Savings Transactions</span>
                        <span v-else>Cash Advance Transactions</span>
                    </div>
                    <div>
                        {{ $moment().format('LL') }}
                    </div>
                </q-item-label>
            </q-item-section>
        </q-item>
        <q-separator />
        <q-table
            class="my-table"
            :data="data"
            :columns="columns"  
            :pagination.sync="pagination"
            row-key="memberid"
            flat
            hide-bottom=""
        >
        <template v-slot:body="props">
            <q-tr :props="props">
            <q-td v-for="col in props.cols.filter(col => col.name !== 'actions')" :key="col.name" :class="col.name == 'memberid' ? 'text-left' : 'text-center'">
                <q-icon name="double_arrow" v-show="col.name == 'memberid' && props.row == selected" />
                <span v-if="col.typeData == 'money'">{{'₱ ' + col.value}}</span>
                <span v-else-if="col.typeData == 'dateTime'">{{ $moment(col.value).format('LLLL')  }}</span>
                <span v-else :class="col.name == 'trackingNo' ? 'text-uppercase' : ''">{{ col.name == 'trackingNo' && col.value !== 'Walk-In Withdrawal' ? '#' + col.value  : col.value }}</span>
            </q-td>
            </q-tr>
        </template>
        </q-table>
        <!-- <div class="q-pa-md q-mb-md noPrint">
            <q-btn color="grey-10" icon="file_download" label="download report" class="full-width" @click="printMe"/>
        </div> -->
    </div>
</template>
<script>
export default {
    props: ['data','columns','model','type'],
    data(){
        return{
            printOn: false,
            pagination: {
              sortBy: 'savings',
              descending: true,
              page: 1,
              rowsPerPage: 0
              // rowsNumber: xx if getting data from a server
            },
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
<style scoped>
@media print {
   .noPrint {display:none;}
   .my-card {
       max-width: 100%; 
       width: 100%;
       height: 100%;
       margin: 0;
       padding: 0;
       overflow: hidden;
   }
   .my-table {
       max-width: 100%; 
       width: 100%;
       height: 100%;
       margin: 0;
       padding: 0;
       
   }
}

</style>
