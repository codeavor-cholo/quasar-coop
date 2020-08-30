<template>
    <q-page class="flex flex-center bg-teal text-white">

        <div class="text-center" style="width:450px">
            <q-img
                src="statics/icons/New-GSIS-Cooperative.png"
                :ratio="1"
                style="width:200px"
            />
            <div v-if="login != true" class="q-pa-md">

                <span class="text-overline">Loading App Data ...</span>
                <br>
                <q-spinner-facebook
                color="white"
                size="4em"
                />
                
            </div>
            <q-slide-transition>
            <div v-show="login" :duration="300">
                <q-input v-model="email" :autofocus="true" @focus="$event.target.select()" ref="emailAdd" type="text" label="Account ID" standout="" color="white" class=" q-my-md" input-class="text-white"/>

                <q-input v-model="password" type="password" label="Password" standout="" color="white" class="q-mb-lg"/>

                <q-btn color="grey-10" label="LOGIN" @click="loginEmail" size="md"  style="width:200px"/>
            </div>
            </q-slide-transition>
        </div>

    </q-page>
</template>
<script>
import { firebaseAuth,firebaseApp,firebaseDb } from 'boot/firebase'
export default {
    data(){
        return {
            email:'superadmin',
            password: '123456',
            login: false,
        }
    },
    firestore () {
        return {
            // Collection  
            Users: firebaseDb.collection('DashboardUsers'),
        }
    },
    created(){
        setTimeout(()=>{
            this.login = true
        },5000)
    },
    methods:{
        loginEmail(){
            let emailAdd = `${this.email}@coopadmin.com`
            let self = this
            let firstLogin = false

            firebaseAuth.signInWithEmailAndPassword(emailAdd, this.password)
              .then(result => {
              // console.log(result, 'result')

            //   let user = result.user
            //   // console.log(user,'user')

            //   let findUser = this.Users.filter(a=>{
            //       return a.MemberID == `NGTSC${this.email}`
            //   })[0]

            //   if(findUser.updatePass == undefined || findUser.updatePass == null){
            //       firstLogin = true
            //   }

              firebaseAuth.setPersistence(this.$firebase.auth.Auth.Persistence.LOCAL)
                  .then(function() {
                    // console.log('setPersistence!')
                    // Existing and future Auth states are now persisted in the current
                    // session only. Closing the window would clear any existing state even
                    // if a user forgets to sign out.
                    // ...
                    // New sign-in will be persisted with session persistence.
                    return firebaseAuth.signInWithEmailAndPassword(emailAdd, self.password);
                  })
                  .catch(function(error) {
                    // Handle Errors here.
                    
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // console.log(errorMessage)
                  });
                    self.$router.push('/admin/dashboard')

              })
              .catch(err =>{
                // console.log(err, 'error')
                self.$q.dialog({
                    title: `${err.message}`,
                    type: 'negative',
                    color: 'negative',
                    textColor: 'white',
                    icon: 'warning',
                    ok: 'Ok',
                    
                }).onOk(()=>{
                    this.email = ''
                    this.password = ''
                })
                //this.isLoading = false
              })
        },
    }
}
</script>