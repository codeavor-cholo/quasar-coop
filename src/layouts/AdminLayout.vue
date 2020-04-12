<template>
  <q-layout view="lHh Lpr lff">
    <q-header elevated class="bg-teal text-white">
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="left = !left" />

        <q-toolbar-title>
          <!-- <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
          </q-avatar> -->
          <small>Potchi</small>
          <q-space />
        </q-toolbar-title>
          <q-btn color="teal" class="text-white" icon="mdi-logout-variant" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" side="left" none>
      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 150px"
      >
        <div class="absolute-center bg-transparent">
          <q-avatar size="100px" class="q-mt-sm">
            <img
              src="https://i.pinimg.com/originals/02/23/25/022325055802a3b4af381fa65a8b42de.png"
            />
          </q-avatar>
          <div class="text-weight-bold">Grizzly Bear</div>
          <div>@wearebarebears</div>
        </div>
      </q-img>
      <q-scroll-area
        style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd"
      >
      <!-- Start of Sidebar Menu inside the Drawer -->
       <q-list separator bordered>
         <q-item
         to="/admin/dashboard"
         exact
         >
          <q-item-section avatar>
              <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section class="text-uppercase">Dashboard</q-item-section>
       </q-item>
          <!-- Start of Sidemenu Member -->
          <q-expansion-item
            expand-separator
            icon="people"
            label="MEMBERS"

            :content-inset-level=".6"
            >
                 <q-item
                    expand-separator
                    to="/admin/addmember"
                    exact
                    >
                    <q-item-section avatar>
                      <q-icon name="add_circle" />
                    </q-item-section>
                      <q-item-section class="text-uppercase">Add Member</q-item-section>
                  </q-item>
                    <q-item
                    expand-separator
                    to="/admin/allmember"
                    exact
                    >
                    <q-item-section avatar>
                      <q-icon name="list_alt" />
                    </q-item-section>
                      <q-item-section class="text-uppercase">All Members</q-item-section>
                  </q-item>
                   <q-item
                    expand-separator
                    to="/admin/pendingreg"
                    exact
                    >
                    <q-item-section avatar>
                      <q-icon name="mdi-timer" />
                    </q-item-section>
                      <q-item-section class="text-uppercase">Pending Registration</q-item-section>
                  </q-item>
           </q-expansion-item>
          <!-- End of Sidemenu Member -->
         <!-- Start of Payment Member -->
          <q-expansion-item
            expand-separator
            icon="payment"
            label="PAYMENT"
            :content-inset-level="0.5"
            >
                 <q-item
                    expand-separator
                   :content-inset-level="0.5"
                    to="/admin/addpayment"
                    exact
                    >
                  <q-item-section avatar>
                    <q-icon name="mdi-cash" />
                  </q-item-section>
                    <q-item-section class="text-uppercase">Add Payment</q-item-section>
                </q-item>
                <q-item
                    expand-separator
                   :content-inset-level="0.5"
                    to="/admin/allpayment"
                    exact
                    >
                  <q-item-section avatar>
                    <q-icon name="assessment" />
                  </q-item-section>
                    <q-item-section class="text-uppercase">Daily Collections</q-item-section>
                </q-item>
           </q-expansion-item>
            <!-- End of Payment Member -->
            <!-- Start of Tracking -->
            <q-expansion-item
              expand-separator
              icon="mdi-routes"
              label="Monitoring"
              :content-inset-level="0.5"
            >
               <q-item
                    expand-separator
                   :content-inset-level="0.5"
                    to="/admin/billings"
                    exact
                    >
                  <q-item-section avatar>
                    <q-icon name="mdi-jeepney" />
                  </q-item-section>
                  <q-item-section class="text-uppercase">MEMBERS</q-item-section>
                </q-item>
                <q-item
                     expand-separator
                    :content-inset-level="0.5"
                     to="/admin/monitoring"
                     exact
                     >
                   <q-item-section avatar>
                     <q-icon name="mdi-jeepney" />
                   </q-item-section>
                   <q-item-section class="text-uppercase">Daily Monitoring</q-item-section>
                 </q-item>
            </q-expansion-item>
            <!-- End of Tracking -->
            <q-expansion-item
              expanded-separator
              icon="mdi-credit-card"
              label="Withdrawals"
              :content-inset-level="0.5"
            >
              <q-item
                    expand-separator
                   :content-inset-level="0.5"
                    to="/admin/savings"
                    exact
                    >
                  <q-item-section avatar>
                    <q-icon name="mdi-bank" />
                  </q-item-section>
                    <q-item-section class="text-uppercase">Savings</q-item-section>
                </q-item>
                 <q-item
                    expand-separator
                   :content-inset-level="0.5"
                    to="/admin/loans"
                    exact
                    >
                  <q-item-section avatar>
                    <q-icon name="mdi-receipt" />
                  </q-item-section>
                    <q-item-section class="text-uppercase">Loan</q-item-section>
                </q-item>
            </q-expansion-item>
             <q-expansion-item
              expanded-separator
              icon="fas fa-user-circle"
              label="Manage"
              :content-inset-level="0.5"
            >
              <q-item
                    expand-separator
                   :content-inset-level="0.5"
                    to="/admin/addstaff"
                    exact
                    >
                  <q-item-section avatar>
                    <q-icon name="mdi-account" />
                  </q-item-section>
                    <q-item-section class="text-uppercase">Add Staff</q-item-section>
                </q-item>
            </q-expansion-item>
       </q-list>
      <!-- End of Sidebar Menu inside the Drawer -->
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer bordered class="bg-teal text-white">
      <q-toolbar>
        <q-toolbar-title>
          <!-- <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" /> -->
          &copy; NEW GSIS COOPERATIVE {{ new Date().getFullYear() }}
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: "Layout",

  data() {
    return {
      left: false
    };
  }
};
</script>
<style scoped>
.q-item.q-router-link--active, .q-item--active{
  color:teal;
  }
</style>
