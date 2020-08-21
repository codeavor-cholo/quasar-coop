<template>
    <q-page>
        <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4 noPrint">Reports <q-icon name="mdi-arrow-right-box" /> Top Share of Stocks
          <!-- <q-btn color="primary" icon="check" label="OK" @click="test" class="float-right q-mr-md" dense/> -->
        </h6>   
        <q-separator class="noPrint"/>     
        <div class="fit  table-cut">
        <div class="fit yesPrint">
            <div class="text-h6 row justify-between fit q-mb-md">
                <div>
                    
                    Top Share of Stocks
                    <div class="text-caption">Prepared By: {{returnLogged.FirstName}} {{returnLogged.LastName}}</div>
                </div>
            </div>
            <hr style="border-height:1px;border-color:#444444" class="full-width">
        </div>  
        <q-table
            class="q-pa-md"
            :data="returnShareHolders"
            :columns="columns"
            row-key=".key"
            flat
            :pagination.sync="initialPagination"
            :filter="filter"
        >
            <template v-slot:top>

                <div class="fit noPrint">
                    <q-btn color="grey-10" icon="print" label="print report" @click="printMe" class="float-right"/>
                    <!-- <q-btn-toggle
                    v-model="byButton"
                    toggle-color="teal"
                    :options="[
                        {label: 'Day', value: 'day'},
                        {label: 'Month', value: 'month'},
                        {label: 'Year', value: 'year'}
                    ]"
                    class="float-right q-mr-md"
                    /> -->
                    <q-input v-model="filter" filled color="teal" type="search" dense  label="Search" clearable="" style="width:250px;">
                        <template v-slot:append>
                        <q-icon name="search" />
                        </template>
                    </q-input>
                </div>
            </template>  
            <template v-slot:header="props">
                <q-tr :props="props">
                <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    :class="col.name == 'Actions' ? 'noPrint' : ''"
                >
                    {{ col.label }}
                </q-th>
                </q-tr>
            </template>
            <template v-slot:body="props">
                <q-tr :props="props"  :class="props.row == selected ? 'bg-teal-1 text-weight-bold text-teal' : ''">
                <q-td v-for="col in props.cols.filter(col => col.name !== 'Actions')" :key="col.name" >
                    <q-icon name="double_arrow" v-show="col.name == 'MemberID' && props.row == selected" />
                    <span v-if="col.typeOf !== 'money'">{{ col.value  }}</span><span v-else>{{ col.value | currency }}</span>
                </q-td>
                <!-- <q-td key="Actions" class="noPrint">
                    <q-btn color="teal" icon="receipt" label="view receipt" @click="viewGo(props.row)" flat/>
                </q-td> -->
                </q-tr>
            </template>  
        </q-table>  
        </div>    
    </q-page>
</template>
<script>
import { firebaseDb, firebaseSto, firefirestore, Auth2,firebaseAuth } from 'boot/firebase';
import { date } from 'quasar'
import Vue from "vue";
import money from 'v-money'
import { mapGetters, mapMutations } from 'vuex'

export default {
    data(){
        return {
            filter: '',
            initialPagination: {
                descending: false,
                page: 1,
                rowsPerPage:0
                // rowsNumber: xx if getting data from a server
            }, 
            columns: [
                { name: 'Rank', align: 'left', label: 'Rank', field: 'Rank', sortable: true },
                { name: 'MemberID', align: 'left', label: 'Member ID', field: 'MemberID', sortable: true },
                { name: 'Name', align: 'left', label: 'Name', field: 'Name', sortable: true },
                { name: 'TotalShares', align: 'left', label: 'Total Share of Stocks', field: 'Total', sortable: true, typeOf: 'money' },         
            ],
            tableData: []
        }
    },
    firestore () {
      return {
        MemberData: firebaseDb.collection('MemberData').orderBy("ShareCapital", "desc").where("ShareCapital", ">", 0),
        JeepneyData: firebaseDb.collection('JeepneyData'),
        Transactions: firebaseDb.collection('Transactions'),
        DashboardUsers: firebaseDb.collection('DashboardUsers'),
      }
    },
    computed:{
        returnShareHolders(){
            try {
                console.log(this.MemberData,'ordered already')
                let i = 0
                this.MemberData.forEach(a=>{
                    i = i + 1
                    a.Rank = i
                    a.Name = `${a.FirstName} ${a.LastName}`
                    a.MemberID = a['.key']
                    a.Total = a.ShareCapital
                })
                return this.MemberData
            } catch (error) {
                console.log(error,'returnShareHolders')
                return []
            }
        },
        returnLogged(){
            try {
                let user = firebaseAuth.currentUser
                let uid = user.uid

                return this.DashboardUsers.filter(a=>{
                    return a['.key'] == uid
                })[0]
            } catch (error) {
                return null
            }
        },
    },
    methods:{
        ...mapMutations('SubModule', {
            closeDrawer: 'setDrawerPrint'
        }),
        printMe(){
            this.closeDrawer()
            let self = this
            setTimeout(function(){ 
            window.print();
            }, 2000);
        },
    }
}
</script>
<style type = "text/css">
   .yesPrint {display:none;}
@media print {
   .noPrint {display:none;}
   .yesPrint {display:block;}

    ::-webkit-scrollbar {
        display: none;
    }

    .table-cut{
        page-break-after: always;
        margin: 0;
        padding: 0;
        height: 100%;
    }

    div .q-table__top{
        display: none;
    }

}

</style>