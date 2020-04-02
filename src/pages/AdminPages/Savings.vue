<template>
    <div>
        <q-page>
      <h6 class="q-ma-none q-pl-md q-pt-md text-teal-4">Savings </h6>
       <q-separator />
     
       
              <div class="q-pa-lg">
                <q-table
                    title="Members Saving"
                    :data="savingdata"
                    :columns="savings"
                    row-key="nonoperatingdesignation"
                />
            </div>
    

       </q-page>
    </div>
</template>
<script>
export default {
    data(){
        return{
                 savings: [
            {
              name: 'memberid',
              required: true,
              label: 'MemberID',
              align: 'left',
              field: row => row.memberid,
              format: val => `${val}`,
              sortable: true
            },
            { name: 'designation', align: 'center', label: 'Designation', field: 'designation', sortable: true },
            { name: 'lastname', align: 'center', label: 'Last name', field: 'lastname', sortable: true },
            { name: 'firstname', align: 'center', label: 'First name', field: 'firstname', sortable: true },
            { name: 'savings', align: 'center', label: 'Savings', field: 'savings', sortable: true },
            { name: 'date', align: 'center', label: 'Date', field: 'date', sortable: true}
          ],
      savingdata:[
        {
          memberid: 'NGTSC2020001',
          designation: 'Operator',
          lastname: 'Bear',
          firstname: 'Grizzly',
          savings: '₱26000',
          date: '01-03-2020',
        },
        {
           memberid: 'NGTSC2020002',
          designation: 'Driver',
          lastname: 'Hathaway',
          firstname: 'Anne',
          savings: '₱6090',
          date: '01-06-2020',
        },
        {
           memberid: 'NGTSC2020003',
          designation: 'Driver',
          lastname: 'ABC',
          firstname: 'DEF',
          savings: '₱500',
          date: '01-13-2020',
        },
        {
           memberid: 'NGTSC2020004',
          designation: 'Driver',
          lastname: 'QWE',
          firstname: 'ZXC',
          savings: '₱1000',
          date: '01-20-2020',
        },
        {
          memberid: 'NGTSC2020005',
          designation: 'Operator',
          lastname: 'James',
          firstname: 'Lebron',
          savings: '₱512',
          date: '01-23-2020',
        },
        {
           memberid: 'NGTSC2020006',
          designation: 'Driver',
          lastname: 'De leon',
          firstname: 'Jane',
          savings: '₱960',
          date: '01-29-2020',
        },
      ],
        }
    }
}
</script>
<style scoped>
.no-choice{
    opacity: 0.6;
}
</style>