<template>
  <div>
    <q-table
      title="Unpaid Memberssss"
      :data="nonoperatingdata"
      :columns="nonoperatings"
      row-key="nonoperatingdesignation"
    />
  </div>
</template>

<script>
export default {
  data(){
    return{
      // Start of Operating Units //
          nonoperatings: [
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
            { name: 'licenseplate', align: 'center', label: 'License Plate', field: 'licenseplate', sortable: true },
            { name: 'date', align: 'center', label: 'Date', field: 'date', sortable: true}
          ],
      nonoperatingdata:[
        {
          memberid: 'NGTSC2020001',
          designation: 'Operasdfsdfatosssr',
          lastname: 'Taylor',
          firstname: 'Swift',
          licenseplate: 'TAS-1989',
          date: '12-13-1989',
        },
        {
           memberid: 'NGTSC2020002',
          designation: 'Driver',
          lastname: 'Hathaway',
          firstname: 'Anne',
          licenseplate: 'ANN-1982',
          date: '11-12-1982',
        },
        {
           memberid: 'NGTSC2020003',
          designation: 'Driver',
          lastname: 'ABC',
          firstname: 'DEF',
          licenseplate: 'ANN-1982',
          date: '11-12-1982',
        },
        {
           memberid: 'NGTSC2020004',
          designation: 'Driver',
          lastname: 'QWE',
          firstname: 'ZXC',
          licenseplate: 'ANN-1982',
          date: '11-12-1982',
        },
        {
           memberid: 'NGTSC2020005',
          designation: 'Operator',
          lastname: 'James',
          firstname: 'Lebron',
          licenseplate: 'ANN-1982',
          date: '11-12-1982',
        },
        {
           memberid: 'NGTSC2020006',
          designation: 'Driver',
          lastname: 'De leon',
          firstname: 'Jane',
          licenseplate: 'ANN-1982',
          date: '11-12-1982',
        },
      ],
       // End of Operating Units //
       // Start of Non-Operating Units //
    //       nonoperatings: [
    //         {
    //           name: 'designation',
    //           required: true,
    //           label: 'Designation',
    //           align: 'left',
    //           field: row => row.designation,
    //           format: val => `${val}`,
    //           sortable: true
    //         },
    //         { name: 'lastname', align: 'center', label: 'Last name', field: 'lastname', sortable: true },
    //         { name: 'firstname', align: 'center', label: 'First name', field: 'firstname', sortable: true },
    //         { name: 'licenseplate', align: 'center', label: 'License Plate', field: 'licenseplate', sortable: true },
    //         { name: 'date', align: 'center', label: 'Date', field: 'date' }
    //       ],
    //   nonoperatingdata:[
    //     {
    //       designation: 'Operator',
    //       lastname: 'Taylor',
    //       firstname: 'Swift',
    //       licenseplate: 'TAS-1989',
    //       date: '12-13-1989',
    //     },
    //     {
    //       designation: 'Operator',
    //       lastname: 'Hathaway',
    //       firstname: 'Anne',
    //       licenseplate: 'ANN-1982',
    //       date: '11-12-1982',
    //     }
    //   ],
    //    // End of Non-Operating Units //
    //    // Start of Coding Units //
    //       codingoperatings: [
    //         {
    //           name: 'designation',
    //           required: true,
    //           label: 'Designation',
    //           align: 'left',
    //           field: row => row.designation,
    //           format: val => `${val}`,
    //           sortable: true
    //         },
    //         { name: 'lastname', align: 'center', label: 'Last name', field: 'lastname', sortable: true },
    //         { name: 'firstname', align: 'center', label: 'First name', field: 'firstname', sortable: true },
    //         { name: 'licenseplate', align: 'center', label: 'License Plate', field: 'licenseplate', sortable: true },
    //         { name: 'date', align: 'center', label: 'Date', field: 'date' }
    //       ],
    //   codingdata:[
    //     {
    //       designation: 'Operator',
    //       lastname: 'Taylor',
    //       firstname: 'Swift',
    //       licenseplate: 'TAS-1989',
    //       date: '12-13-1989',
    //     },
    //     {
    //       designation: 'Operator',
    //       lastname: 'Hathaway',
    //       firstname: 'Anne',
    //       licenseplate: 'ANN-1982',
    //       date: '11-12-1982',
    //     }
    //   ]
    //    // End of Coding Units //
   }
  }
}
</script>

<style lang="css" scoped>
</style>
