<template>
    <div class="q-pa-md">
        <q-card class="my-card" flat bordered>
        <!-- start toolbar -->
        <!-- <q-btn @click="test">test</q-btn> -->
        <q-card-actions >
          <div class="row justify-between full-width">
          <div class="col row justify-start">
          <q-btn color="teal"  flat icon="arrow_left" label="back" @click="$router.go(-1)" />
          </div>
          <div class="col row justify-end" v-show="returnStatus !== 'resigned'">
          <q-btn @click="inception = true; OrTid();" flat v-if="MemberData.MembershipFee">
            Membership Fee: {{ MemberData.MembershipFee }}
            </q-btn>

            <!-- start membership payment -->
            <div>
              <q-dialog v-model="inception">
                <q-card>
                  <q-card-section>
                    <div class="text-h6">Membership Fee Payment</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <div class="q-pa-md">
                      <q-input v-model="Payment.OrNo" label="OR No">
                        <template v-slot:before>
                        <q-icon name="mdi-human-handsup" />
                        </template>
                      </q-input>
                    </div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <div class="q-pa-md">
                      <q-input v-model="Payment.MembershipFee" label="Amount">
                        <template v-slot:before>
                        <q-icon name="mdi-human-handsup" />
                        </template>
                      </q-input>
                    </div>
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <div class="q-pa-md">
                      <q-input v-model="Payment.Total" label="Amount">
                        <template v-slot:before>
                        <q-icon name="mdi-human-handsup" />
                        </template>
                      </q-input>
                    </div>
                  </q-card-section>
                  <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Pay Fee" @click="PayFee" />
                    <q-btn flat label="Close" v-close-popup />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </div>
            <!-- end membership payment -->

            <q-btn flat round icon="event"/>
            <q-btn @click="contract = !contract" flat color="teal-4" v-show="!MemberData.isNewMember">
            Print Contract
            </q-btn>
            <q-btn flat color="teal-4" @click="qrdialog = !qrdialog; GenQr()" v-show="!MemberData.isNewMember">
            Print ID
            </q-btn>
            <!-- <q-btn flat color="teal-4" @click="bar = !bar; listDrivers();" v-if="MemberData.Designation == 'Operator'">
            Unit/s Details
            </q-btn> -->
            <!-- <q-btn flat color="teal-4" @click="bar = !bar; driverUnit();"  v-if="MemberData.Designation == 'Driver'">
            Jeepney
            </q-btn> -->


            <q-btn flat @click="upd = !upd, onUpdateMemberData()" color="teal-4" v-if="upd" >
            Update
            </q-btn>



            <q-btn flat @click="updateMemberData()" color="teal-4" label="Save" v-else />
            <q-btn flat @click="cancelUpdate()" color="teal-4" label="Cancel" v-if="!upd"/>

            <q-btn flat color="teal-4" @click="resignMember" v-show="!MemberData.isNewMember">
            Resign
            </q-btn>
            </div>
            </div>
        </q-card-actions>
        <!-- end toolbar -->

        <q-separator />

        <q-card-section class="row">
        <q-card-section class="col-md-4 col-sm-12 col-xs-12 q-pt-md">
          <q-banner :class="!MemberData.isNewMember ? 'bg-teal text-white':'bg-warning text-white'" >
            <div v-if="!MemberData.isNewMember"><q-icon name="check_circle" /> Membership fee is paid.</div>
            <div v-else><q-icon name="warning" /> Membership Fee is still unpaid.</div>
          </q-banner>
            <img
            style="height:200px; width:200px; border-radius: 50%;"
            class="rounded-borders"
            :src="MemberData.imageUrlPro"
            v-if="!loading"
            />
            <q-spinner
            color="primary"
            width='150'
            height='150'
            v-if="loading"
            />
          <q-btn @click="onFileClick1" v-if="!upd">Change Profile Picture</q-btn>
          <input type="file" accept="image/*" ref="fileInput1" @change="onFilePickedPro" v-show="false">


            <div class="text-h5 q-mt-sm q-ma-md">Member ID: {{ penRegId }}
                  <q-chip class="text-white" color="red" :label="returnStatus.toUpperCase()" v-if="returnStatus =='resigned'"/>
                  <q-chip class="text-white" color="teal" :label="returnStatus.toUpperCase()" v-else-if="returnStatus =='active'"/>
                  <q-chip class="text-white" color="warning" :label="returnStatus.toUpperCase()" v-else/>
            </div>
            <!-- <div class="text-h6 q-mt-sm q-ma-md"
            v-if="MemberData.Designation == 'Driver'">Operator: {{ MemberData.Operator.Name }}</div> -->
            <div class="q-pa-md">
              <q-input
              v-model="MemberData.FirstName"
              label="First Name"
              :readonly="upd"
              >
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>

            <div class="q-pa-md">
              <q-input v-model="MemberData.LastName" label="Last Name" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup"/>
                </template>
              </q-input>
            </div>

            <div class="q-pa-md">
              <q-select disable v-model="MemberData.Designation" :options="['Driver', 'Operator', 'Other']" label="Designation" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-select>
            </div>

            <div class="q-pa-md">
              <q-select v-model="MemberData.CivilStatus" label="Civil Status" :options="['Single', 'Married', 'Widow']" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-select>
            </div>
        </q-card-section>

        <q-card-section class="col-md-4 col-sm-12 col-xs-12 q-pt-md">
            <div class="q-pa-md">
              <q-input v-model="MemberData.BirthDate" label="BirthDate" stack-label type="date" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>

            <div class="q-pa-md">
              <q-input v-model="MemberData.BirthPlace" label="BirthPlace" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>

          <div class="q-pa-md">
              <q-input v-model="MemberData.Occupation" label="Occupation" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>

            <div class="q-pa-md">
              <q-input v-model="MemberData.EmployerCompany" label="Employer or Office" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>

            <div class="q-pa-md">
              <q-input v-model="MemberData.OtherIncome" label="Other Sources of Income" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>

            <div class="q-pa-md">
              <q-input v-model="MemberData.RelativeName" label="Nearest Relative" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>

            <div class="q-pa-md">
              <q-input v-model="MemberData.Relationship" label="Relationship" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>

            <div class="q-pa-md">
              <q-input v-model="MemberData.NoDependents" label="Number of Dependents" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>

        </q-card-section>

        <q-card-section class="col-md-4 col-sm-12 col-xs-12 q-pt-md">

          <div class="col-sm-4">
            <q-spinner
            color="primary"
            width='150'
            height='150'
            v-if="loading1"
            />
              <q-img
                class="rounded-borders"
                :src="MemberData.imageUrlLic"
                v-if="!loading1"
            />

          <q-btn @click="onFileClick2"  v-if="!upd">Change License Picture</q-btn>
          <input type="file" accept="image/*" ref="fileInput2" @change="onFilePickedLic" v-show="false">

          </div>

          <div class="col-sm-4">
              <div class="q-pa-md">
              <q-input v-model="MemberData.LicenseNo" label="License No." :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>
        </div>

        <div class="col-sm-4 col-sm-12 col-xs-12">
              <div class="q-pa-md">
              <q-input v-model="MemberData.LicenseExp" label="License Expiration" stack-label type="date" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>
        </div>

        <div class="q-pa-md">
              <q-input v-model="MemberData.Address" label="Adress" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>

            <div class="q-pa-md">
              <q-input v-model="MemberData.Phone" label="Phone" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div>


            <!-- <div class="q-pa-md">
              <q-input v-model="MemberData.Email" label="Email" :readonly="upd">
                <template v-slot:before>
                 <q-icon name="mdi-human-handsup" />
                </template>
              </q-input>
            </div> -->
        </q-card-section>
      </q-card-section>
    </q-card>
    <q-card class="my-card q-mt-md" flat bordered>
      <q-card-section class="row justify-between">
        <div class="text-h6">Jeepney & Units</div>
        <div v-if="MemberData.Designation == 'Driver'">
          <q-banner :class="MemberData.defaultUnit !== undefined  ? 'bg-teal text-white':'bg-warning text-white'" >
            <span v-if="MemberData.defaultUnit !== undefined"> <q-icon name="check_circle" /> {{MemberData.defaultUnit.PlateNumber}} is the default unit.</span>  
            <span v-else> <q-icon name="warning" /> There is no default unit yet. </span>
            <template v-slot:action>
              <q-btn flat color="white" label="Remove" v-if="MemberData.defaultUnit !== undefined" @click="removeDefaultUnit"/>
              <q-btn flat color="white" label="Update Default Unit" @click="updateDefaultUnit"/>
            </template>
          </q-banner>
        </div>
        <div v-else>
          <q-btn color="teal" outline  icon="add" label="add unit" @click="addUnitDialog = true" />
        </div>
      </q-card-section>
      <q-card-section v-show="MemberData.Designation !== 'Driver'">
        <q-item v-for="jeep in getJeeps(MemberData['.key'])" :key="jeep['.key']">
          <q-item-section top avatar>
            <q-avatar color="teal" text-color="white" icon="commute"/>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h6">{{jeep.PlateNumber}}</q-item-label>
            <q-item-label caption lines="10" v-if="getDefaultDrivers(jeep.PlateNumber).length > 0 ">
              <span v-for="driver in getDefaultDrivers(jeep.PlateNumber)" :key="driver">{{driver}}</span>
            </q-item-label>
            <q-item-label caption lines="10" v-else>
              No Default Driver
            </q-item-label>
          </q-item-section>
          <q-item-section side >
            <!-- <q-btn color="grey-10" flat icon="delete" label="delete" @click="onClick" /> -->
          </q-item-section>
        </q-item>
        <q-separator spaced inset v-show="getJeepsPending(MemberData['.key']).length > 0"/>
        <q-item v-for="jeep in getJeepsPending(MemberData['.key'])" :key="jeep['.key']">
          <q-item-section top avatar>
            <q-avatar color="warning" text-color="white" icon="warning"/>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h6">{{jeep.PlateNumber}}</q-item-label>
            <q-item-label caption lines="2" >
              Pending Application
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced inset v-show="getJeepsReject(MemberData['.key']).length > 0"/>
        <q-item v-for="jeep in getJeepsReject(MemberData['.key'])" :key="jeep['.key']">
          <q-item-section top avatar>
            <q-avatar color="red" text-color="white" icon="close"/>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h6">{{jeep.PlateNumber}}</q-item-label>
            <q-item-label caption lines="2" >
              {{jeep.rejectReason}}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>


    <q-card class="my-card q-mt-md" flat bordered>
      <q-card-section>
        <div class="text-h6">Account Summary</div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col">
             <div class="text-overline">Savings</div>
             <q-item class="q-px-md">
               <q-item-section top avatar>
                 <q-avatar color="teal" text-color="white" icon="payment" />
               </q-item-section>
               <q-item-section>
                 <q-item-label class="text-h6 text-teal">{{MemberData.SavingsDeposit | currency}}</q-item-label>
                 <q-item-label caption lines="2" v-if="getLastDateTransactions('savings',MemberData['.key']) !== null">Last Transaction: {{$moment(getLastDateTransactions('savings',MemberData['.key']).timestamp.toDate()).fromNow()}}</q-item-label>
               </q-item-section>
             </q-item>
          </div>
          <div class="col">
            <div class="text-overline">Cash Advances</div>
             <q-item class="q-px-md" v-for="(loan,i) in MemberData.activeLoans" :key="i">
               <q-item-section top avatar>
                 <q-avatar color="teal" text-color="white">
                   {{i+1}}
                 </q-avatar>
               </q-item-section>
               <q-item-section>
                 <q-item-label class="text-h6 text-teal">
                   <span v-if="loan.TotalBalance == undefined">{{loan.toPayAmount | currency}}</span>
                   <span v-else>{{loan.TotalBalance | currency}}</span>
                   
                   </q-item-label>
                 <q-item-label caption lines="2" v-if="getLastDateTransactions('loan',MemberData['.key'],loan) !== null">Last Transaction: {{$moment(getLastDateTransactions('loan',MemberData['.key'],loan).timestamp.toDate()).fromNow()}}
                  <br>#{{loan.CashReleaseTrackingID.toUpperCase()}}

                 </q-item-label>
               </q-item-section>
             </q-item>
          </div>
          <div class="col">
            <div class="text-overline">Billings</div>
             <q-item class="q-px-md" v-for="(bill,i) in getBillings(MemberData['.key'])" :key="i">
               <q-item-section top avatar>
                 <q-avatar color="teal" text-color="white" icon="list_alt" />
               </q-item-section>
               <q-item-section>
                 <q-item-label class="text-overline text-teal">
                   <span v-if="bill.QuotaBalance !== undefined">
                      {{bill.QuotaBalance | currency}}
                   </span>
                   <span v-else>
                      {{bill.BillingBalance | currency}}
                   </span>
                  </q-item-label>
                 <q-item-label caption lines="2">
                   <span v-if="bill.QuotaBalance !== undefined">
                      <b>{{bill.PlateNumber}}</b> - {{bill.BillingMonth}}
                   </span>
                   <span v-else>
                      <b>#{{bill.CashReleaseTrackingID.toUpperCase()}}</b> - {{bill.BillingDate}}
                   </span>
                 </q-item-label>
               </q-item-section>
             </q-item>            
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card class="my-card q-mt-md" flat bordered>
      <q-card-section class="row justify-between">
        <div class="text-h6">Latest Transactions</div>
        <q-input v-model="transactionFilter" filled color="teal" type="search" dense  label="Search" clearable="" style="width:250px;">
            <template v-slot:append>
            <q-icon name="search" />
            </template>
        </q-input>
      </q-card-section>
      <q-card-section>
        <q-table
          :data="getLatestTransactions"
          :columns="columns"
          row-key="name"
          flat
          :filter="transactionFilter"
          :pagination.sync="initialPagination"
        >
            <template v-slot:body="props">
                <q-tr :props="props"  :class="props.row == selected ? 'bg-teal-1 text-weight-bold text-teal' : ''">
                <q-td v-for="col in props.cols.filter(col => col.name !== 'Actions')" :key="col.name" >
                    <q-icon name="double_arrow" v-show="col.name == 'MemberID' && props.row == selected" />
                    <span v-if="col.typeOf == 'money'">
                      {{ col.value | currency }}
                    </span>
                    <span v-else>{{ col.value }}</span>
                </q-td>
                </q-tr>
            </template>  
        </q-table>

      </q-card-section>
    </q-card>


<q-dialog v-model="addUnitDialog" persistent>
  <q-card class="" style="width:80vw;">
    <q-card-section class="row items-center">
      <div class="text-h6">Add Unit/Jeep</div>
    </q-card-section>
    <q-card-section>
      <div class="row text-grey-8">
        <div class="col">
          <div class="row">
            <div class="col q-pr-md">
              <q-input v-model="JeepneyDetails.PlateNumber" input-class="text-uppercase" type="text" outlined="" label="Enter Plate Number" color="teal"/>
              <q-input
                class="q-my-md"
                color="teal-4"
                type="file"
                outlined=""
                dense
                hint="Upload Jeepney ORCR"
                accept="image/*"
                @change="onFilePicked2"
                @onfocus="resetimginput2"
                v-if="uploadReady"
                ref="imginput2"
                >
                <template v-slot:prepend>
                  <q-icon name="attach_file"/>
                </template>
              </q-input>

              <img :src="imageUrl2" width='300' height='150' v-if="imageUrl2 !== null">
            </div>
            <div class="col-3 q-gutter-md">
                <q-btn color="primary" icon="add" label="ADD to list" @click="addJeep2List" />
                <q-btn color="grey-8" label="reset form" flat @click="resetJeepForm" />
            </div>


          </div>



          <q-separator spaced inset class="q-mt-lg"/>
          <span class="q-my-md text-overline q-mt-md">
            YOU HAVE <span class="text-teal">{{JeepneyList.length}}</span> JEEPNEY / UNITS ADDED: 
          </span>
          <q-list separator="">
            <q-item v-for="(jeep,i) in JeepneyList" :key="i">
              <q-item-section top thumbnail class="q-ml-none">
                <img :src="jeep.ORCRurl">
              </q-item-section>

              <q-item-section>
                <q-item-label caption>Plate No.#</q-item-label>
                <q-item-label class="text-weight-bold">{{jeep.PlateNumber}}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-btn color="grey" icon="delete" flat dense @click="onDelete(jeep,i)" />
              </q-item-section>
            </q-item> 
          </q-list>

        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Cancel" color="grey-8" v-close-popup @click="removeNewUnitDetails"/>
      <q-btn flat label="SEND FOR APPROVAL" icon-right="send" color="teal" @click="saveNewUnits" :disable="JeepneyList == 0"/>
    </q-card-actions>
  </q-card>
</q-dialog>

<q-dialog v-model="bar">
  <q-card class="my-card" style="width: 700px; max-width: 80vw;">

    <q-bar>
      <q-space />
      <q-btn dense flat icon="close" v-close-popup>
      <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
      </q-btn>
    </q-bar>

    <div v-if="MemberData.Designation == 'Driver'">
      <q-card-section>
        <div class="text-h6">Jeepney & Operator</div>
      </q-card-section>

      <q-card-section class="row items-center q-pb-none">
        <div class="q-pa-md">
              <q-input v-model="drvOperator" label="Operator" readonly>
                <template v-slot:before>
                 <q-icon name="mdi-face" />
                </template>
              </q-input>
            </div>

            <div class="q-pa-md">
              <q-input v-model="MemberData.PlateNo" label="Plate No"
              @input="plateNoVerify()"
              :loading="loadingState"
              >
                <template v-slot:before>
                 <q-icon name="mdi-jeepney" />
                </template>
              </q-input>
            </div>
      </q-card-section>
    </div>

    <div v-if="MemberData.Designation == 'Operator'">
      <q-card-section>
        <div class="text-h6">Jeepney & Drivers</div>
      </q-card-section>

      <q-card-section class="row items-center q-pa-md" v-for="(data, id) in UnitsDriver" :key="id">
        <div class="full-width">
          <div class="q-pb-md">
              <q-input :value=id label="Plate No"
              outlined
              >
                <template v-slot:before>
                 <q-icon name="mdi-jeepney" />
                </template>
                 <q-btn flat icon="add" @click="addDriverDialog = !addDriverDialog">
                   <q-tooltip content-class="bg-white text-primary">Add Driver</q-tooltip>
                 </q-btn>
                 <q-btn flat icon="edit">
                   <q-tooltip content-class="bg-white text-primary">Update Plate No.</q-tooltip>
                 </q-btn>
                 <q-btn flat icon="cancel">
                   <q-tooltip content-class="bg-white text-primary">Delete</q-tooltip>
                 </q-btn>
              </q-input>
            </div>

        <div class="q-pa-md" v-if="addDriverDialog">
          <q-input v-model="Driver" label="Driver"
            @input="driverVerify()"
            :loading="loadingState"
            >
              <template v-slot:before>
                <q-icon name="mdi-face" />
              </template>
              <q-btn flat icon="save"></q-btn>
            </q-input>
        </div>

          <div v-for="(dat, i) in data" :key="i" class="q-pa-md">
            <q-input :value="dat.FirstName +' '+ dat.LastName" label="Driver"
              @input="driverVerify()"
              readonly
              >
                <template v-slot:before>
                 <q-icon name="mdi-face" />
                </template>
                 <q-btn flat icon="cancel"></q-btn>
              </q-input>
          </div>
        </div>
      </q-card-section>
    </div>
  </q-card>
</q-dialog>

<!-- <q-dialog v-model="addDriverDialog" persistent >
  <q-card class="my-card">
    <q-card-section class="row items-center q-pa-md">
      <div class="q-pa-md">
        <q-input v-model="Driver" label="Driver"
          @input="driverVerify()"
          :loading="loadingState"
          >
            <template v-slot:before>
              <q-icon name="mdi-face" />
            </template>
          </q-input>
        </div>
    </q-card-section>

    <q-card-actions>
        <q-btn flat color="secondary" class="col-5">
          Save
        </q-btn>
        <q-btn flat color="red" class="col-5">
          Cancel
        </q-btn>
      </q-card-actions>
  </q-card>
</q-dialog> -->

  <!-- Print ID Dialog -->
  <q-dialog v-model="qrdialog">
    <print-id 
    :MemberData="MemberData" 
    :penRegId="penRegId" 
    :qrvalue="qrvalue"
    ref="printIdRef"></print-id>
  </q-dialog>

  <!-- Print Contract Dialog -->
  <q-dialog v-model="contract" maximized="">
    <q-card style="width:80vw" flat>
      <q-card-section>
        <print-contract :MemberData="MemberData"></print-contract>
      </q-card-section>
    </q-card>
    <!-- <print-contract :MemberData="MemberData"></print-contract> -->
    
  </q-dialog>

  <q-dialog v-model="resignModule" persistent maximized="">
    <q-card style="width:80vw;height: 80vh;" flat class="q-py-md">
      <q-card-section class="row items-center q-py-none">
        <span class="text-h6 q-pa-none">Resignation > {{resignData.Name}}</span>
        <q-btn color="grey" flat icon="close" v-close-popup class="absolute-right"/>
      </q-card-section>
      <q-card-section class="q-pa-none">
        
        <q-stepper
          flat
          v-model="step"
          ref="stepper"
          color="teal"
          active-color="teal"
          animated
          v-if="isTransferAccount"
        >
          <q-step
            :name="1"
            title="Confirm Transfer"
            icon="payment"
            :done="step > 1"
          >
            <div class="q-py-md" v-if="transferMemberID == null">
              Select a account to transfer account's units & drivers.
            </div>
            <div class="q-py-md " v-else>
              You have selected <b>{{transferMemberID.label}}</b> to transfer this account's units & drivers.
              <br>Click <b>Continue</b> to confirm.
            </div>
            <q-select 
                style="width:450px;"
                v-model="transferMemberID" 
                :options="membersIdOpt" 
                :label="transferMemberID == null ? 'Search Operator': ''" 
                filled 
                input-debounce="0"
                use-input
                color="grey-10"
                use-chips
                clearable=""
                @new-value="createValue"
                @filter="filterFn"
                @input="changeMemberDetails"
                @clear="removeMemberDetails"
            >
                <template v-slot:selected-item="scope">
                    <q-chip
                        dense
                        :tabindex="scope.tabindex"
                        color="white"
                        text-color="secondary"
                        class="q-ma-none"
                    >
                        {{ scope.opt.label }}
                    </q-chip>
                </template>
            </q-select>  

          </q-step>
          <q-step
            :name="2"
            title="Checking for Balances"
            icon="payment"
            :done="step > 2"
          >
            <q-list>
              <q-item>
                <q-item-section avatar>
                <q-avatar color="teal" class="text-white">
                    {{resignData.Name.charAt(0)}}
                </q-avatar>
                </q-item-section>
                <q-item-section>
                
                <div class="text-weight-bold">{{resignData.Name}}</div>
                <div class="text-caption text-uppercase">{{resignData.Designation}}</div>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption lines="2">Savings Deposit</q-item-label>
                  <q-item-label class="text-h6">{{ resignData.Savings | currency }}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <!-- <q-icon name="star" color="yellow" /> -->
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption lines="2">Share of Stocks</q-item-label>
                  <q-item-label class="text-h6">{{ resignData.ShareOfStocks | currency }}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <!-- <q-icon name="star" color="yellow" /> -->
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption lines="2">Outstanding Balance</q-item-label>
                  <q-item-label class="text-h6 text-warning">- {{ resignData.OutstandingBalance | currency }}</q-item-label>
                </q-item-section>
                <q-item-section side class="bg-grey-1 q-pa-sm">
                  <q-item-label class="q-mr-md text-warning" caption v-for="n in resignData.Balances" :key="n"> {{n}} </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator spaced inset />
              <q-item v-show="resignData.CashToRelease !== 0">
                <q-item-section avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption lines="2">Cash to Release</q-item-label>
                  <q-item-label class="text-h6 text-primary">{{ resignData.CashToRelease | currency }}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <!-- <q-icon name="star" color="yellow" /> -->
                </q-item-section>
              </q-item> 
              <q-item v-show="resignData.BalanceToPay !== 0">
                <q-item-section avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption lines="2">Balance to Pay</q-item-label>
                  <q-item-label class="text-h6 text-red">{{ resignData.BalanceToPay | currency }}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <!-- <q-icon name="star" color="yellow" /> -->
                </q-item-section>
              </q-item>              
            </q-list>


          </q-step>
          <q-step
            :name="3"
            title="Confirm Resign"
            icon="check"
            :done="step > 3"
          >
            Confirming this will remove the member's access to all platforms.
            <div v-show="resignData.BalanceToPay > 0">
              You can still be a member again once you paid up all your outstanding balance.
              <q-item>
                <q-item-section>
                  <q-item-label caption lines="2">Outstanding Balance</q-item-label>
                  <q-item-label class="text-h6 text-red">{{ resignData.BalanceToPay | currency }}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <!-- <q-icon name="star" color="yellow" /> -->
                </q-item-section>
              </q-item>
              <q-banner class="bg-warning text-white q-my-md">
                Member can remember again but you should pay you outstanding balance first.
              </q-banner>              
            </div>
            Do you want to continue this action ? Click Finish to proceed.


          </q-step>
          <template v-slot:navigation>
            <q-stepper-navigation class="q-gutter-md">
              <q-btn v-if="step > 1 "  flat color="grey-10" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />

              <q-btn @click="step === 3 ? confirmResignation() : $refs.stepper.next()"  :disable="step == 1 && transferMemberID == null" color="teal" :label="step === 3 ?'Finish' : 'Continue'" />
            </q-stepper-navigation>
          </template>
        </q-stepper>

       <q-stepper
          flat
          v-model="step"
          ref="stepper"
          color="teal"
          active-color="teal"
          animated
          v-else
        >
          <q-step
            :name="1"
            title="Checking for Balances"
            icon="payment"
            :done="step > 1"
          >
            <q-list>
              <q-item>
                <q-item-section avatar>
                <q-avatar color="teal" class="text-white">
                    {{resignData.Name.charAt(0)}}
                </q-avatar>
                </q-item-section>
                <q-item-section>
                
                <div class="text-weight-bold">{{resignData.Name}}</div>
                <div class="text-caption text-uppercase">{{resignData.Designation}}</div>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption lines="2">Savings Deposit</q-item-label>
                  <q-item-label class="text-h6">{{ resignData.Savings | currency }}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <!-- <q-icon name="star" color="yellow" /> -->
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption lines="2">Share of Stocks</q-item-label>
                  <q-item-label class="text-h6">{{ resignData.ShareOfStocks | currency }}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <!-- <q-icon name="star" color="yellow" /> -->
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption lines="2">Outstanding Balance</q-item-label>
                  <q-item-label class="text-h6 text-warning">- {{ resignData.OutstandingBalance | currency }}</q-item-label>
                </q-item-section>
                <q-item-section side class="bg-grey-1 q-pa-sm">
                  <q-item-label class="q-mr-md text-warning" caption v-for="n in resignData.Balances" :key="n"> {{n}} </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator spaced inset />
              <q-item v-show="resignData.CashToRelease !== 0">
                <q-item-section avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption lines="2">Cash to Release</q-item-label>
                  <q-item-label class="text-h6 text-primary">{{ resignData.CashToRelease | currency }}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <!-- <q-icon name="star" color="yellow" /> -->
                </q-item-section>
              </q-item> 
              <q-item v-show="resignData.BalanceToPay !== 0">
                <q-item-section avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption lines="2">Balance to Pay</q-item-label>
                  <q-item-label class="text-h6 text-red">{{ resignData.BalanceToPay | currency }}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <!-- <q-icon name="star" color="yellow" /> -->
                </q-item-section>
              </q-item>              
            </q-list>


          </q-step>
          <q-step
            :name="2"
            title="Confirm Resign"
            icon="check"
            :done="step > 2"
          >
            Confirming this will remove the member's access to all platforms.
            <div v-show="resignData.BalanceToPay > 0">
              You can still be a member again once you paid up all your outstanding balance.
              <q-item>
                <q-item-section>
                  <q-item-label caption lines="2">Outstanding Balance</q-item-label>
                  <q-item-label class="text-h6 text-red">{{ resignData.BalanceToPay | currency }}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <!-- <q-icon name="star" color="yellow" /> -->
                </q-item-section>
              </q-item>
              <q-banner class="bg-warning text-white q-my-md">
                Member can remember again but you should pay you outstanding balance first.
              </q-banner>              
            </div>
            Do you want to continue this action ? Click Finish to proceed.


          </q-step>
          <template v-slot:navigation>
            <q-stepper-navigation class="q-gutter-md">
              <q-btn v-if="step > 1" flat color="grey-10" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />

              <q-btn @click="step === 2 ? confirmResignation() : $refs.stepper.next()" color="teal" :label="step === 2 ?'Finish' : 'Continue'" />
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>


  </div>
</template>

<script>
import Vue from 'vue'

import { firebaseDb, firebaseSto, firefirestore } from 'boot/firebase';
import VueQrcode from '@chenfengyuan/vue-qrcode'
import Swal from 'sweetalert2'
import { date, QDialog } from 'quasar'

import PrintContract from '../../components/Admin/Members/PrintContact.vue'
import PrintId from '../../components/Admin/Members/PrintID.vue'


Vue.component(VueQrcode.name, VueQrcode);

export default {
  components: {
    PrintContract,
    PrintId
  },
    data(){
        return{
          resignData:{
            Name: 'A',
            Designation: 'Operator',
            Savings: 0,
            ShareOfStocks: 0,
            OutstandingBalance: 0,
            CashToRelease: 0,
            BalanceToPay: 0,
            Balances: []
          },
          step: 1,
          resignModule: false,
          imageUrl2: null,
          JeepneyList: [],
          addUnitDialog: false,
          selected: {},
          transactionFilter: '',
          initialPagination: {
              descending: false,
              page: 1,
              rowsPerPage:10
              // rowsNumber: xx if getting data from a server
          },  
          columns: [
              { name: 'TransactionID', align: 'left', label: 'TransactionID#', field: 'TransactionID', sortable: true }, 
              { name: 'OrNo', align: 'left', label: 'OrNo#', field: 'OrNo', sortable: true },            
              { name: 'TransactionType', align: 'left', label: 'Transaction Type', field: 'TransactionType', sortable: true },
              { name: 'Total', align: 'left', label: 'Total', field: 'Total', sortable: true, typeOf: 'money' }, 
              { name: 'Date', align: 'left', label: 'Date', field: 'showDate', sortable: true, typeOf: 'date' },          
          ],
          addDriverDialog: false,
          loadingState: false,
          contract: false,
          inception: false,
          qrvalue: '',
          bar: false,
          qrdialog: false,
          upd: true,
          loading: false,
          loading1: false,
          datetodaydata: '',
          inception: false,
          Payment: {
            MemberID: this.penRegId,
            OrNo: '',
            TransactionID: '',
            MembershipFee: 500,
            Total: 500,
            timestamp: ''
          },
          Unit: {
            Operator: '',
            PlateNo: ''
          },
          Driver: '',
          UnitsDriver: {},
          drvOperator: '',
          verifyPlateNo: true,
          tempMemData: {},
          uploadReady: true,
          JeepneyDetails:{
            PlateNumber: '',
            ORCR: null
          },
          PlateNumber: '',
          transferMemberID: null,
          membersIdOpt: Object.freeze(this.membersIdOptions),
          isTransferAccount: false,
              
        }
    },
    props: ['penRegId'],
    firestore () {
      return {
          // Doc
          MemberData: firebaseDb.collection('MemberData').doc(this.penRegId),
          Members: firebaseDb.collection('MemberData'),
          DriverData: firebaseDb.collection('MemberData').where('Designation', '==', 'Driver'),
          Units: firebaseDb.collection('Units'),
          JeepneyData: firebaseDb.collection('JeepneyData'),
          Transactions: firebaseDb.collection('Transactions'),
          BillingTrackers: firebaseDb.collection('BillingTrackers'),
          PayLater: firebaseDb.collection('PayLater'),
          ZMemberInactiveness: firebaseDb.collection('FixedPayments').doc('ZMemberInactiveness')
          // Counter: firebaseDb.collection('Counter').doc("v65AIZI2jjNN2jlEv17N"),
      }
    },
    methods: {
      createValue (val, done) {
      // Calling done(var) when new-value-mode is not set or "add", or done(var, "add") adds "var" content to the model
      // and it resets the input textbox to empty string
      // ----
      // Calling done(var) when new-value-mode is "add-unique", or done(var, "add-unique") adds "var" content to the model
      // only if is not already set
      // and it resets the input textbox to empty string
      // ----
      // Calling done(var) when new-value-mode is "toggle", or done(var, "toggle") toggles the model with "var" content
      // (adds to model if not already in the model, removes from model if already has it)
      // and it resets the input textbox to empty string
      // ----
      // If "var" content is undefined/null, then it doesn't tampers with the model
      // and only resets the input textbox to empty string

      if (val.length > 2) {
          if (!this.membersIdOpt.includes(val)) {
          done(val, 'add-unique')
          }
      }
      },
      changeMemberDetails(val){
          console.log(val,'selected val')
      },  
      removeMemberDetails(){
          this.transferMemberID = null
      },
      filterFn (val, update) {
          update(() => {
              if (val === '') {
                  this.membersIdOpt = this.membersIdOptions
              }
              else {
                  const needle = val.toLowerCase()
                  this.membersIdOpt = this.membersIdOptions.filter(
                      v => v.value.toLowerCase().indexOf(needle) > -1
                  )
              }
          })
      },
      resignMember(){
        try {

          let id = this.penRegId
          let member = this.MemberData
          console.log(member,'member')
          this.resignData.ShareOfStocks = member.ShareCapital
          this.resignData.Savings = member.SavingsDeposit
          this.resignData.Name = `${member.FirstName} ${member.LastName}`



          this.resignData.Designation = member.Designation
          this.resignData.Balances = []

          let billingsLoan = this.$lodash.sumBy(this.$lodash.uniqBy(this.getBillings(id),'CashReleaseTrackingID'),'BillingBalance')
          console.log(billingsLoan,'billingsLoan')
          if(billingsLoan !== undefined && billingsLoan !== 0){
            this.resignData.Balances.push(`Loan Billings = ₱ ${billingsLoan}`)
          }

          let billingsQuota = this.$lodash.sumBy(this.$lodash.uniqBy(this.getBillings(id),'PlateNumber'),'QuotaBalance')
          console.log(billingsQuota,'billingsQuota')

          if(billingsQuota !== undefined && billingsQuota !== 0){
            this.resignData.Balances.push(`Quota Billings = ₱ ${billingsQuota}`)
          }

          let today = date.formatDate(new Date(),'M YYYY')
          console.log(today,'today')

          let paylater = this.$lodash.sumBy(this.PayLater.filter(a=>{
            return today == date.formatDate(a.timestamp.toDate(),'M YYYY') && a.memberID == id
          }),b=>{
            return parseFloat(b.amountToPayBilling)
          })

          if(paylater !== undefined && paylater !== 0){
            this.resignData.Balances.push(`Payables = ₱ ${paylater}`)
          }

          let getNoBillingLoans = []
          let baseLoans = this.getBillings(id).filter(a=>{
            return a.CashReleaseTrackingID !== undefined
          })

          if(member.activeLoans !== undefined){
            member.activeLoans.forEach(a=>{
              if(baseLoans.length !== 0){
                let index = this.$lodash.findIndex(baseLoans,x=>{
                  return x.CashReleaseTrackingID.toUpperCase() == a.CashReleaseTrackingID.toUpperCase()
                })

                if(index == -1 ){
                  getNoBillingLoans.push(a)
                }
              } else {
                getNoBillingLoans.push(a)
              }
            })
          }

          console.log(getNoBillingLoans,'get no billing loans')

          let advancesSum = this.$lodash.sumBy(getNoBillingLoans,a=>{
            return parseFloat(a.toPayAmount)
          })

          console.log(advancesSum,'advancesSum')

          if(advancesSum !== undefined && advancesSum !== 0){
            this.resignData.Balances.push(`Advances = ₱ ${advancesSum}`)
          }


          this.resignData.OutstandingBalance = ( billingsLoan !== undefined ? parseFloat(billingsLoan) : 0 ) + parseFloat(paylater) + ( billingsQuota !== undefined ? parseFloat(billingsQuota) : 0 ) + ( advancesSum !== undefined ? parseFloat(advancesSum) : 0 )
          if(parseFloat(member.ShareCapital) < this.resignData.OutstandingBalance){
            this.resignData.BalanceToPay = this.resignData.OutstandingBalance - (parseFloat(member.ShareCapital) + parseFloat(member.SavingsDeposit))
          } else {
            this.resignData.CashToRelease = (parseFloat(member.ShareCapital) + parseFloat(member.SavingsDeposit)) - this.resignData.OutstandingBalance
          }

          console.log(paylater,'paylater')

          if(member.Designation == 'Operator'){
            let drivers = this.Members.filter(a=> {
              return a.Designation == 'Driver' && a.Operator.MemberID == id
            })

            let resigned = drivers.filter(a=>{
              return a.resigned == true
            })

            if(drivers.length !== resigned.length){
              this.$q.dialog({
                title: `Drivers Still Active!`,
                message: 'This account is not allowed to resign. Would you like to transfer account?',
                persistent: true,
                ok: 'yes, transfer my account',
                cancel: true
              }).onOk(() => {
                this.resignModule = true
                this.isTransferAccount = true
              })            
            } else {
                this.resignModule = true
                this.isTransferAccount = true              
            } 
          } else {
            this.resignModule = true
            this.isTransferAccount = false
          }      


                    
        } catch (error) {
          console.log(error,'resign')
        }


      },
      confirmResignation(){
        this.$q.dialog({
          title: `Confirm Resignation`,
          message: 'Once confirm , this action cannot be undone. Member will officially resign from the coop and all necessary data transfer will be done.',
          persistent: true,
          cancel: true,
          ok: 'Yes, I Confirm this Resignation.'
        }).onOk(() => {
          this.resignModule = false
          this.$q.loading.show({
            message: 'Processing Member Resignation.'
          })        

          let member = {...this.MemberData}
          member.Advances = 0
          member.SavingsDeposit = 0
          member.ShareCapital = 0
          delete member['.key']
          delete member.activeLoans
          member.resigned = true
          member.dateResigned = firefirestore.FieldValue.serverTimestamp()
          
          member.resignBalance = this.resignData.BalanceToPay
          member.resignCashReleased = this.resignData.CashToRelease
          console.log(member,'member after resigned')

          let Payables = this.PayLater.filter(a=>{
            return a.memberID == this.penRegId
          })

          console.log(Payables,'payables')

          Payables.forEach(a=>{
            firebaseDb.collection('PayLater').doc(a['.key']).delete().then(function() {
                console.log("payables successfully deleted!");
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });            
          })

          let billings = this.getBillings(this.penRegId)
          console.log(billings,'billings')

          billings.forEach(a=>{
            firebaseDb.collection('BillingTrackers').doc(a['.key']).update({
                    paymentStatus: 'Full Payment'
            }).then(()=>{
              console.log('update success billing trackers')
            })            
          })

          firebaseDb.collection('MemberData').doc(this.penRegId).set(member)
          .then(()=>{
            console.log('update success')
          })

          this.$q.loading.show({
            message: 'Done resetting the member account and billings are paid.'
          })     


          if(this.isTransferAccount){
            this.transferDriverUnits()
          } else {
              this.$router.go(-1)
              this.$q.notify({
                color: 'teal',
                textColor: 'white',
                icon: 'check',
                message: "Resignation Done!",
                })
              this.$q.loading.hide()
          }
          
          



        })
      },
      transferDriverUnits(){
        try {
          this.$q.loading.show({
            message: 'Starting Transfer of Data to New Operator Account.'
          }) 
          let transfer = this.transferMemberID
          let TransferID = transfer.id
          let full = transfer.fullName
          let fn = transfer.FirstName
          let ln = transfer.LastName

          let newOperator = {
            FirstName: fn,
            FullName: full,
            LastName: ln,
            MemberID: TransferID
          }

          let drivers = this.Members.filter(a=> {
            return a.Designation == 'Driver' && a.Operator.MemberID == this.penRegId
          })        
          
          let jeepneys = this.JeepneyData.filter(a=>{
            return a.MemberID == this.penRegId
          })

          console.log(jeepneys,'jeeps')
          console.log(drivers,'drivers')

          drivers.forEach(a=>{
            firebaseDb.collection('MemberData').doc(a['.key']).update({
              Operator: newOperator
            }).then(()=>{
              console.log('done driver update' + a['.key'])
            })
          })

          jeepneys.forEach(a=>{
            firebaseDb.collection('JeepneyData').doc(a['.key']).update({
              MemberID: TransferID
            }).then(()=>{
              console.log('done jeep update' + a['.key'])
            })     
          })
          this.$q.loading.show({
            message: 'Transfer Done'
          }) 
          this.$q.notify({
            color: 'teal',
            textColor: 'white',
            icon: 'check',
            message: "Transfer Done!",
            })
          this.$router.go(-1)
          this.$q.notify({
            color: 'teal',
            textColor: 'white',
            icon: 'check',
            message: "Resignation Done!",
            })
          this.$q.loading.hide()
        } catch (error) {
          console.log(error,'transferDriverUnits error')
        }
      },
      removeNewUnitDetails(){
        this.JeepneyDetails.PlateNumber = ''
        this.JeepneyDetails.ORCR = null
        this.JeepneyList = []
        this.imageUrl2 = null
      },
      jeepAddUpload(){
          this.JeepneyList.forEach(a=>{
            const filename = a.ORCR.name
            const ext = filename.slice(filename.lastIndexOf('.'))
            let childurl = a.PlateNumber+'_'+this.MemberData['.key'] + ext
            return firebaseSto.ref('JeepUploads/' + childurl).put(a.ORCR)
            .then(snapshot => {
                return snapshot.ref.getDownloadURL();
            }).
            then(downloadURL => {
                console.log(`Successfully uploaded file and got download link - ${downloadURL}`);

                let toSave = {
                  PlateNumber: a.PlateNumber,
                  ORCR: downloadURL,
                  dateAdded: firefirestore.FieldValue.serverTimestamp(),
                  MemberID: this.MemberData['.key']
                }
                return firebaseDb.collection("JeepneyData").add(toSave);
            })
            .catch(error => {
                // Use to signal error if something goes wrong.
                console.log(`Failed to upload file and get link - ${error.message}`);
            })
          })
      },
      saveNewUnits(){
        console.log(this.JeepneyList,'newUnits')
        this.$q.dialog({
          title: `Save ${this.JeepneyList.length} New Units`,
          message: 'Would you like to saved these news units ?',
          persistent: true,
          cancel: true
        }).onOk(() => {
          this.$q.loading.show({
              message: '<h6>Some important <b>process</b> is in progress.<br/><span class="text-teal">Hang on...</span></h6>'
          })
          this.jeepAddUpload()
          this.$q.loading.hide()
          this.addUnitDialog = false
          this.$q.notify({
            color: 'teal',
            textColor: 'white',
            icon: 'check',
            message: "Adding Units for Approval Success",
            })
        })        
      },
      addJeep2List(){
        if(this.JeepneyDetails.PlateNumber == '' || this.JeepneyDetails.ORCR == null){
          this.$q.dialog({
            title: 'Incomplete UNIT Details!',
            message: 'Please fill up all details for your unit/jeep details',
            persistent: true
          })
        } else {
          this.JeepneyDetails.PlateNumber = this.JeepneyDetails.PlateNumber.toUpperCase()
          this.JeepneyList.push(this.JeepneyDetails)
          this.resetJeepForm()
          console.log(this.JeepneyList,'jeep list')
        }      
      },
      resetimginput2(){
        // this.imageUrl2 = null
        this.$refs.imginput2.resetValidation()
      },
      onFilePicked2(event){
        const files = event.target.files
        console.log(files,'files input')
        let filename = files[0].name
        if (filename.lastIndexOf('.') <= 0){
          return alter('Please add a valid file!')
        }
          const fileReader = new FileReader()
          fileReader.addEventListener('load', () => {
          this.imageUrl2 = fileReader.result
          this.JeepneyDetails.ORCRurl = fileReader.result
        })
        fileReader.readAsDataURL(files[0])
        this.JeepneyDetails.ORCR = files[0]
        console.log(this.JeepneyDetails.ORCR,'ORCR')
      },
      resetJeepForm(){
        this.JeepneyDetails = {
          ORCR: null,
          PlateNumber: ''
        }
        this.imageUrl2 = null
        this.uploadReady = false
        this.$nextTick(() => {
          this.uploadReady = true
        })
      },
      onDelete(jeep,i){
        console.log(jeep,i)
        this.JeepneyList.splice(i,1)
      },
      getDefaultDrivers(plate){
        try {
          let filter = this.Members.filter(a=>{
            return a.defaultUnit !== undefined && a.defaultUnit.PlateNumber == plate
          })
          
          let map = filter.map(a=>{
            return `${a['.key']} - ${a.FirstName} ${a.LastName}`
          })

          return map


        } catch (error) {
          console.log(error,'getDefaultDrivers')
          return null
        }

      },
      getJeeps(key){
        return this.JeepneyData.filter(a=>{
          return key == a.MemberID && a.Status == 'approved'
        })
      },
      getJeepsPending(key){
        return this.JeepneyData.filter(a=>{
          let base = a.Status !== 'approved' && a.Status !== 'rejected' ? 'pending' : a.Status
          // console.log(base,'base')
          a.Status = base         
            return key == a.MemberID && a.Status == 'pending'
        })
      },
      getJeepsReject(key){
        return this.JeepneyData.filter(a=>{
          return key == a.MemberID && a.Status == 'rejected'
        })
      },
      getBillings(key){
        

        console.log(this.$lodash.orderBy(this.BillingTrackers.filter(a=>{
          return a.MemberData['.key'] == key 
        }),b=>{
          return b.timestamp
        },'desc'),'getBillings')
        return this.$lodash.orderBy(this.BillingTrackers.filter(a=>{
          return a.MemberData['.key'] == key && a.paymentStatus !== 'Full Payment' && this.checkIfAvailableInActiveLoans(a.CashReleaseTrackingID)
        }),b=>{
          return b.timestamp
        },'desc')
      },
      checkIfAvailableInActiveLoans(loansid){
        if(loansid == undefined){
          return true
        }
        let member = this.MemberData
        let check = this.$lodash.findIndex(member.activeLoans,a=>{
          return a.CashReleaseTrackingID.toUpperCase() == loansid.toUpperCase() 
        })

        if(check > -1){
          return true
        } else {
          return false
        }
      },
      getLastDateTransactions(type,key,loan = null){
        try {
          let filter = this.Transactions.filter(a=>{
            if(type == 'savings'){
              return a.MemberID == key && a.SavingsDeposit !== 0
            } else {
              return a.MemberID == key && a.AdvancesAmount !== 0 && a.Advances !== undefined
            }
          })

          let order = null
          if(loan !== null){
            console.log(loan,'loan value')
            let cashID = loan.CashReleaseTrackingID
            let sameLoan = []
            filter.forEach(a=>{
              a.Advances.forEach(x=>{
                if(x.trackID == cashID){
                  console.log(x.trackID , cashID)
                  sameLoan.push(a)
                }
              })
            })
            order = this.$lodash.orderBy(sameLoan,a=>{
              return a.timestamp
            },'desc')[0]

            
            
          } else {
            order = this.$lodash.orderBy(filter,a=>{
              return a.timestamp
            },'desc')[0]
          }


        console.log(order.timestamp.toDate(),`${type}`)

          return order          
        } catch (error) {
          console.log(error,'getLastDateTransactions')
          return null
        }

      },
      test () {
        // this.bus.$emit('genQR')
        console.log(this)
      },
      driverVerify () {
        this.loadingState = true
        var drvname
        this.DriverData.forEach((e) => {
          drvname = e.FirstName + ' ' + e.LastName

          if(this.Driver == drvname){
              this.loadingState = false
          }
        })
      },
      plateNoVerify(){
        this.loadingState = true
        var plt = this.MemberData.PlateNo
        var MemberID= ''
        var vrf

        this.Units.forEach((e) => {
          // PlateNo = e['.key']
            if(plt == e.PlateNo){
              return vrf = true
            }
        })

        if(vrf == true){
          Swal.fire(
              {
                customClass: {
                  container: 'my-swal3',
                },
                title: 'Plate No Exists!!',
                text: 'success',
              }
            )
          this.verifyPlateNo = true
          this.loadingState = false
        }else{
          this.verifyPlateNo = false
        }
      },
      driverUnit(){
        var drvOp
        var drvOpnm
        var dd = this.$firestore.Members

        this.$firestore.Units.doc(this.MemberData.PlateNo)
        .get()
        .then((doc) => {
          drvOp = doc.data()
          })
          .then(()=>{
            dd.doc(drvOp.Operator)
            .get()
            .then((doc) => {
              drvOpnm = doc.data()
              })
              .then(()=>{
                this.drvOperator = drvOpnm.FirstName + ' ' +  drvOpnm.LastName
              })
          })
      },
      listDrivers(){

        var UnitDriver = {}
        var test = []
        var mb =this.$firestore.Members
        var set = this.$set
        var key

          this.MemberData.PlateNo.forEach(function(key, index){
            mb.where('PlateNo', '==' , key)
            .get()
            .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                //  UnitDriver[key] = doc.data()
                  // UnitDriver.push({
                  //   MemberID: doc.id,
                  //   data: doc.data()
                  // })
                  test.push(doc.data())
                })
                  set(UnitDriver, key , test)
                  test = []
             })
           })

          this.UnitsDriver = UnitDriver
          console.log('resolvec', this.UnitsDriver)
      },
      removedriver(id, key){
        Swal.fire({
          customClass: {
            container: 'my-swal'
          },
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
          if (result.value) {

            this.UnitsDriver.splice(key, 1);
            this.$firestore.Members.doc(id).update({
              PlateNo: ''
              })

            Swal.fire(
              {
                customClass: {
                  container: 'my-swal2',
                },
                title: 'Removed!',
                text: 'Driver has been removed.',
              }
            )
          }
        })

      },
      loadProfile(id) {
            this.bar = !this.bar
            this.$router.push('/admin/profile/' + id)
            window.location.reload();
      },
      GenQr(){
        if(this.MemberData.Designation == 'Driver'){
          this.qrvalue = this.MemberData['.key']
        }else{
          this.qrvalue = this.MemberData['.key']
        }

      },
      onUpdateMemberData () {
        this.tempMemData = this.MemberData
        let temp = this.$store.getters['subModules/getPlainValue'](this.MemberData)
        this.MemberData = temp
      },
      updateMemberData () {
        this.$firestore.MemberData.set(this.MemberData)
        .then(() => {
          this.upd = !this.upd
        })
      },
      cancelUpdate () {
        this.MemberData = this.tempMemData
        this.upd = !this.upd
      },
      //new code
      OrTid(){
        this.Payment.TransactionID = (this.Counter.TransactionID + 1)
        this.Payment.OrNo = (this.Counter.OrNo + 1)
      },
      PayFee(){
        this.Payment.timestamp = firefirestore.FieldValue.serverTimestamp()
        this.$firestore.Transactions.doc(this.datetodaydata).collection('Payment').add(this.Payment)

        this.$firestore.MemberData.update({
                MembershipFee: firefirestore.FieldValue.delete()
        })
      },
       //new code
      printDiv(divName){
        const prtHtml = document.getElementById(divName).innerHTML;
        // Get all stylesheets HTML
        let stylesHtml = '';
        for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
            stylesHtml += node.outerHTML;
        }
        // Open the print window
        const WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');

        WinPrint.document.write(`<!DOCTYPE html>
        <html>
            <head>
            ${stylesHtml}
            </head>
            <body>
            ${prtHtml}
            </body>
        </html>`);

        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
      },
      datetoday(){
        var myDate = new Date();
        var month = ('0' + (myDate.getMonth() + 1)).slice(-2);
        var date = ('0' + myDate.getDate()).slice(-2);
        var year = myDate.getFullYear();
        var formattedDate = year + '-' + month + '-' + date;
        this.datetodaydata = formattedDate;
        },
      onFileClick1(){
        this.$refs.fileInput1.click()
      },
      onFileClick2(){
        this.$refs.fileInput2.click()
      },
      onFilePickedPro(e){
        this.loading = true
        let file = e.target.files[0]
        var storageRef = firebaseSto.ref('mempic/'+ file.name)
        let uploadTask = storageRef.put(file)
        uploadTask.on('state_changed', (snapshot) => {

        },(error) => {

        }, () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.MemberData.imageUrlPro = downloadURL
            console.log('ProfilePro:', downloadURL)
          }).then(() => {
            this.loading = false
          })
        })
      },
      onFilePickedLic(e){
        this.loading1 = true
        let file = e.target.files[0]
        var storageRef = firebaseSto.ref('mempic/'+ file.name)
        let uploadTask = storageRef.put(file)
        uploadTask.on('state_changed', (snapshot) => {

        },(error) => {

        }, () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.MemberData.imageUrlLic = downloadURL
            console.log('ProfileLic:', downloadURL)
          }).then(() => {
            this.loading1 = false
          })
        })
      },
      checkIfIncludedInTransactions(Plate){
        
      },
      getUnitsOfOperator(operatorID){
        let filter = this.JeepneyData.filter(a=>{
            return a.MemberID == operatorID && a.Status == 'approved'
        })

        console.log('filter',filter)
        let map = filter.map(a=>{
            return {
                value: a.PlateNumber,
                label: a.PlateNumber,
                unitData: a
            }
        })
        console.log('jeep data',map)
        return map      
      },
      getUnitDetails(PlateNumber){
          return this.JeepneyData.filter(a=>{
              return a.PlateNumber == PlateNumber
          })[0]
      },
      removeDefaultUnit(){
        this.$q.dialog({
          title: `Remove Default Unit`,
          message: 'Would you like to remove the default unit ?',
          persistent: true,
          cancel: true
        }).onOk(() => {
            firebaseDb.collection('MemberData').doc(this.MemberData['.key']).update({
                defaultUnit: firefirestore.FieldValue.delete()
            }).then(()=>{
                this.$q.notify({
                    icon: 'info',
                    color: 'red',
                    message: 'Removed Default Unit Success'
                })  
            })          
        })
      },
      updateDefaultUnit(){
        let jeeps = this.getJeeps(this.MemberData.Operator.MemberID)
        console.log(jeeps,'jeeps')
        if(jeeps.length == 0){
          this.$q.dialog({
            title: `Operator has no units approved yet`,
            persistent: true,
          })
        } else {
          this.$q.dialog({
          title: 'Jeepney Plate Number',
          message: 'Choose a jeep / unit:',
          options: {
              type: 'radio',
              model: 'opt1',
              // inline: true
              items: this.getUnitsOfOperator(this.MemberData.Operator.MemberID)
          },
          cancel: true,
          persistent: true
          }).onOk(data => {
            console.log(data,'data')

            firebaseDb.collection('MemberData').doc(this.MemberData['.key']).update({
                defaultUnit: this.getUnitDetails(data)
            }).then(()=>{
                this.$q.notify({
                    icon: 'info',
                    color: 'positive',
                    message: 'Update Default Unit Success'
                })  
            })


          })          
        }
      
      }
 },
  mounted () {
    // this.addLine()
    this.datetoday()
  },
  computed: {
    returnStatus(){
      try {
        let member = this.MemberData
        let memberID = this.penRegId
        if(member.resigned == true){
          return 'resigned'
        } else {
          let today = new Date()
          let monthsBase = date.subtractFromDate(today, {month: this.ZMemberInactiveness.amount})

          let transactions = this.Transactions.filter(a=>{
            return a.MemberID == memberID && a.timestamp.toDate() >= monthsBase && a.timestamp.toDate() <= today
          })

          if(transactions.length == 0){
            console.log(memberID + ' ' + transactions.length+ 'payments',)
            return 'inactive'
          } else {
            console.log(memberID + ' ' + transactions.length+ 'payments',)
            return 'active'
          }          
        }

      } catch (error) {
        return 'inactive'  
      }
    },
    membersIdOptions () {
        let opt = this.Members.map(d => {
            let full = d.FirstName + ' ' + d.LastName
            let opID = ''
            if(d.Designation == 'Operator'){ opID = d['.key'] }
            else { 
                let op = {...d.Operator}
                opID = op.MemberID 
            }
            return {
                label: d['.key'] +' - '+full.toUpperCase() + ' ('+d.Designation+')',
                value: d['.key'] +' - '+full.toUpperCase() + ' ('+d.Designation+')',
                fullName: full,
                FirstName: d.FirstName,
                LastName: d.LastName,
                id: d['.key'],
                designation: d.Designation,
                OperatorID: opID,
                isNewMember: d.isNewMember
            }
        })
        console.log(opt,'opt')



        return opt.filter(a=>{
          return a.designation == 'Operator' && a.isNewMember == false && a.id !== this.penRegId
        })
        // Object.freeze(options)
    },
    getLatestTransactions(){
      try {
        return this.$lodash.orderBy(this.Transactions.filter(a=>{
          a.showDate = this.$moment(a.timestamp.toDate()).format('LLL')
          return this.MemberData['.key'] == a.MemberID
        }),b=>{
          return b.timestamp
        },'desc')
      } catch (error) {
        console.log(error,'getLatestTransactions')
        return []
      }
    }
    // Drivers(){
    //   console.log('ss', this.UnitsDriver)
    //   return this.UnitsDriver
    // }
  }
}
</script>

<style>
    .my-swal {
        z-index: 300000;
      }

    .my-swal2 {
        z-index: 300000;
      }

    .my-swal3 {
        z-index: 300000;
      }

		.id-card-holder {
			width: 300px;
		    padding: 4px;
		    margin: 0 auto;
		    background-color:teal;
		    border-radius: 5px;
		    position: relative;
		}
		.id-card-holder:after {
		    content: '';
		    width: 7px;
		    display: block;
		    background-color:teal;
		    height: 100px;
		    position: absolute;
		    top: 105px;
		    border-radius: 0 5px 5px 0;
		}
		.id-card-holder:before {
		    content: '';
		    width: 7px;
		    display: block;
		    background-color:teal;
		    height: 100px;
		    position: absolute;
		    top: 105px;
		    left: 290px;
		    border-radius: 5px 0 0 5px;
		}
		.id-card {

			background-color: #fff;
			padding: 10px;
			border-radius: 10px;
			text-align: center;
			box-shadow: 0 0 1.5px 0px #b9b9b9;
		}
		.id-card img {
			margin: 0 auto;
		}
		.header img {
			width: 100px;
    		margin-top: 15px;
		}
		.photo img {
			width: 80px;
    		margin-top: 15px;
		}
		h2 {
			font-size: 15px;
			margin: 5px 0;
		}
		h3 {
			font-size: 12px;
			margin: 2.5px 0;
			font-weight: 300;
		}
		.qr-code img {
			width: 180px;
		}
		p {
			font-size: 5px;
			margin: 2px;
		}


  .h6 {
    text-align: center;
    text-decoration: overline underline;
  }

  .page {
    width: 21cm;
    min-height: 29.7cm;
    padding: 2cm;
    margin: 1cm auto;
    border: 1px #D3D3D3 solid;
    border-radius: 5px;
    background: white;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }

  @page {
    size: A4;
    margin: 0;
  }
  @media print {
    html, body {
      width: 210mm;
      height: 400mm;
    }
  }
</style>
