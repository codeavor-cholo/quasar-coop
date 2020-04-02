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
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" behavior="mobile" side="left" none>
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
         to="/collector/dashboard"
         exact
         >
          <q-item-section avatar>
              <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section class="text-uppercase">Dashboard</q-item-section>
       </q-item>
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
                    to="/collector/addpayment"
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
                    to="/collector/dailycollections"
                    exact
                    >
                  <q-item-section avatar>
                    <q-icon name="assessment" />
                  </q-item-section>
                    <q-item-section class="text-uppercase">Daily Collections</q-item-section>
                </q-item>
           </q-expansion-item>
            <!-- End of Payment Member -->
            <q-expansion-item
            expand-separator
            icon="mdi-routes"
            label="MONITORING"
            :content-inset-level="0.5"
            >
                 <q-item
                    expand-separator 
                   :content-inset-level="0.5"
                    to="/collector/membersmonitor"
                    exact
                    >
                  <q-item-section avatar>
                    <q-icon name="mdi-jeepney" />
                  </q-item-section>
                    <q-item-section class="text-uppercase">Members</q-item-section>
                </q-item>

           </q-expansion-item>
              <q-item

                    to=""
                    exact
                    >
                  <q-item-section avatar>
                    <q-icon name="fas fa-info-circle" />
                  </q-item-section>
                    <q-item-section class="text-uppercase">Info</q-item-section>
                </q-item>

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
      // lists: [
      //   { icon: 'dashboard', text: 'Dashboard', route: '/' },
      //   { icon: 'people', text: 'Members', route: '/member' },
      //   { icon: 'receipt', text:'Payment', route: '' },
      //   { icon: 'credit_card', text: 'Credit', route: '' },
      //   { icon: 'assignment', text: 'Bulletin', route: '' },
      //   { icon: 'sentiment_satisfied_alt', text: 'Benefits', route: '' },
      //   { icon: 'folder', text: 'Reports', route: '' },
      //   { icon: 'account_tree', text: 'Add Users', route: '' }
      // ],
      // lists:[
      //   { icon: 'dashboard', text: 'Dashboard', route: '/' }
      // ],
      // paths:[
      //    { 
      //    icon: 'people', 
      //    text: 'Members',
      //    paths: [
      //        { icon: 'people', text: 'Add Member', route: '/member' }
      //    ],
      //    }
      //   ],
      left: true
    };
  }
};
</script>
<style scoped>
.q-item.q-router-link--active, .q-item--active{
  color:teal;
  }
</style>