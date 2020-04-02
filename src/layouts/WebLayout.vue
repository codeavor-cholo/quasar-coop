<template>
    <q-layout view="hHh Lpr lff" class="shadow-2 rounded-borders ">
      <div v-if="Loading">
        <q-spinner-ball  
        color="teal"
        size="200px"
        :thickness="5"
        class="fixed-center"
        />
      </div>
    <div v-else>
      <q-header elevated class="bg-teal">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu"
           :class="'lt-md'"
          />
          <q-toolbar-title class="text-h4 text-uppercase">
            <q-avatar size="69px">
              <img  src="../statics/icons/New-GSIS-Cooperative.png">
            </q-avatar>
            New GSIS Cooperative</q-toolbar-title>
            <div>
            </div>
            <q-btn flat dark 
            icon="home" 
            label="Home" 
            to="/home"
            :class="'gt-sm'"
            />
            <q-btn flat dark 
            icon="mdi-face" 
            label="Be a Member" 
            to="/preregister"
            :class="'gt-sm'"
            v-if="!userDetails.userId"
            />
            <q-btn flat dark 
            icon="account_balance" 
            label="Services" 
            to="/services"
            :class="'gt-sm'"
            />
            <q-btn flat dark 
            icon="info" 
            label="About Us" 
            to="/about"
            :class="'gt-sm'"
            />
            <q-btn flat dark 
            icon="lock" 
            label="Admin Dashboard" 
            to="/admin/dashboard"
            :class="'gt-sm'"
            v-if="userDetails.Designation == 'Admin'"
            />
            <q-btn flat dark 
            icon="lock" 
            label="Member Dashboard" 
            @click="loadPreReg(userDetails.MemberID)"
            :class="'gt-sm'"
            v-if="userDetails.Designation == 'Driver' || userDetails.Designation == 'Operator'"
            />
            <q-btn flat dark 
            icon="lock" 
            label="Log In" 
            :class="'gt-sm'"
            to="/login"
            v-if="!userDetails.userId"
            />
            <q-btn flat dark 
            icon="lock" 
            label="Logout" 
            :class="'gt-sm'"
            v-if="userDetails.userId"
            @click="logoutUser"
            />
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        :width="200"
        overlay
        bordered
        content-class="bg-grey-3"
        class="secondary"
        :class="'lt-md'"
      >
        <q-scroll-area fit style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
          <q-list>

            <q-item clickable
               v-ripple 
               to="/"
               >
                  <q-item-section avatar>
                    <q-icon name="home"/>
                  </q-item-section>
                  <q-item-section>
                    Home
                  </q-item-section>
               </q-item>

              <q-separator/>

               <q-item clickable
               v-ripple 
               to="/preregister"
               v-if="!userDetails.userId"
               >
                  <q-item-section avatar>
                    <q-icon name="face"/>
                  </q-item-section>
                  <q-item-section>
                    Be a Member
                  </q-item-section>
               </q-item>

               <q-item clickable
               v-ripple 
               to="/services"
               >
                  <q-item-section avatar>
                    <q-icon name="account_balance"/>
                  </q-item-section>
                  <q-item-section>
                    Services
                  </q-item-section>
               </q-item>

               <q-item clickable
               v-ripple 
               to="/about"
               >
                  <q-item-section avatar>
                    <q-icon name="info"/>
                  </q-item-section>
                  <q-item-section>
                    About Us
                  </q-item-section>
               </q-item>

            <q-item clickable
               v-ripple 
               to="/login"
               v-if="!userDetails.userId"
               >
                  <q-item-section avatar>
                    <q-icon name="lock"/>
                  </q-item-section>
                  <q-item-section>
                    Log In
                  </q-item-section>
               </q-item>
               <q-item clickable
               v-ripple 
               to="/admin/dashboard"
               v-if="userDetails.Designation == 'Admin'"
               >
                  <q-item-section avatar>
                    <q-icon name="lock"/>
                  </q-item-section>
                  <q-item-section>
                    Admin Dashboard
                  </q-item-section>
               </q-item>

               <q-item clickable
               v-ripple 
               @click="loadPreReg(userDetails.MemberID)"
               v-if="userDetails.Designation == 'Driver' || userDetails.Designation == 'Operator'"
               >
                  <q-item-section avatar>
                    <q-icon name="lock"/>
                  </q-item-section>
                  <q-item-section>
                    Member Dashboard
                  </q-item-section>
               </q-item>

               <q-item clickable
               v-ripple 
               @click="logoutUser"
               v-if="userDetails.userId"
               >
                  <q-item-section avatar>
                    <q-icon name="lock"/>
                  </q-item-section>
                  <q-item-section>
                    Log Out
                  </q-item-section>
               </q-item>

          </q-list>
        </q-scroll-area>
      </q-drawer>
      <q-page-container>
        <router-view/>
      </q-page-container>

      <q-footer elevated class="bg-teal">
        <q-toolbar>
          <q-toolbar-title>Footer</q-toolbar-title>
        </q-toolbar>
      </q-footer>
    </div>
    </q-layout>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'MyLayout',
  data () {
    return {
      drawer: false,
    }
  },
  computed: {
    ...mapState('store', ['userDetails']),
    ...mapGetters('store', ['Loading'])
  },
  methods: {
    ...mapActions('store', ['logoutUser']),
    loadPreReg(id) {
            this.$router.push('/member/dashboard/' + id)
        }
  }
}
</script>

<style>
.q-toolbar {height: 80px;}
</style>