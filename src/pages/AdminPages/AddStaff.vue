<template>
    <div>
      
       <q-separator />
       <div class="q-pa-md">
       <q-card class="q-pa-md">
         <q-card-section>
             <div class="text-uppercase text-h3 text-teal">Office Staff</div>
             <q-separator />
             <div class="row">

               <div class="col-lg-12"> 
                   <div class="q-pa-md">       
                        <q-input outlined color="teal-4" v-model="email" label="Email" />
                   </div>
                </div>

                <div class="col-lg-12"> 
                   <div class="q-pa-md">       
                        <q-input v-model="password" outlined color="teal-4" :type="isPwd ? 'password' : 'text'" label="Password">
                            <template v-slot:append>
                            <q-icon
                                :name="isPwd ? 'visibility_off' : 'visibility'"
                                class="cursor-pointer"
                                @click="isPwd = !isPwd"
                            />
                            </template>
                        </q-input>
                   </div>
                </div>

                <div class="col-lg-12 q-mb-xl"> 
                   <div class="q-pa-md">       
                        <q-select v-model="roling" outlined color="teal-4" :options="roles" label="Role" />
                   </div>
                </div>

                <div class="absolute-bottom-right q-mr-md"> 
                   <div class="q-pa-md">       
                         <q-btn @click="registerButtonPressed()" class="text-teal-4" icon-right="check" label="Register Staff" color="white" />
                   </div>
                </div>

             </div>
          </q-card-section>
       </q-card>
       </div>
    </div>
</template>
<script>
import  firebase from "@firebase/app";
export default {
    data() {
        return {
            roles: [ 'Admin', 'Collector'],
            email: '',
            password: '',
            isPwd: true,
            roling: '',
        }
    },
    created() {
        firebase.auth().onAuthStateChanged(userAuth => {
            if (userAuth) {
                firebase
                    .auth()
                    .currentUser.getIdTokenResult()
                    .then(tokenResult => {
                        console.log(tokenResult.claims);
                    });
            }
        });
      },
      methods: {
        async registerButtonPressed() {
            try {
                var {
                    user
                } = await firebase
                    .auth()
                    .createUserWithEmailAndPassword(this.email, this.password);

                // signout
                firebase
                    .auth()
                    .signOut()
                    // .then(user => {
                    //     this.$router.push("/login");
                    // });
            } catch (error) {
                console.log(error.message);
            }
        }
      },
}
</script>
<style scoped>
    
</style>