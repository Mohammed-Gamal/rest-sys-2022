<!-- eslint-disable max-len -->
<template lang="pug">
div(class="profile d-flex flex-column justify-content-center align-items-center w-75 m-auto")
  h3(class="text-center fw-bold fs-1 mb-4")
    fa-icon(icon="file-pen", class="me-3")
    | Edit Profile
  form(action="#" @submit.prevent novalidate)
    div(class="row mb-3 gap-3 gap-md-0")
      div(class="mb-3 mx-auto w-75")
        div(class="form-floating")
          input(
            v-model.trim="username",
            type="text",
            name="username",
            placeholder="Username",
            id="usernameInputFloat",
            class="form-control form-control-lg"
          )
          label(for="usernameInputFloat") Username
        div(v-if="v$.username.$error", class="p-1 text-danger")
          | {{  v$.username.$errors[0].$message  }}
      div(class="mx-auto w-75")
        div(class="mb-3")
          div(class="input-group")
            div(class="form-floating")
              input(
                v-model.trim="password"
                :type="typePass",
                name="password"
                placeholder="Password",
                id="passwordInputFloat",
                class="form-control form-control-lg"
              )
              label(for="passwordInputFloat") Password
            button(class="input-group-text", @click="togglePass")
              fa-icon(
                :icon="showPass ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
              )
          div(v-if="v$.password.$error", class="p-1 text-danger" )
            | {{  v$.password.$errors[0].$message  }}
      div(class="mx-auto w-75")
        div(class="form-floating")
          input(
            v-model="email"
            type="email",
            name="email",
            placeholder="E-Mail",
            id="emailInputFloat",
            class="form-control form-control-lg"
            disabled
          )
          label(for="emailInputFloat") E-Mail
      div(class="d-flex justify-content-center gap-4 mt-5")
        button(
          type="btn",
          class="btn btn-secondary btn-lg px-md-5",
          @click="resetAll()"
        ) Reset
        button(
          type="btn",
          class="btn btn-secondary btn-lg px-md-5",
          @click="redirect('home', 1200)"
        ) Cancel
      div(class="d-flex justify-content-center mt-3")
        button(
          type="submit",
          class="btn btn-secondary btn-lg w-50"
          @click="updateProfile()"
        ) Submit

    //- Alert
    main-alert(
      :toggleSuccess="updateStatus",
      :toggleFail="updateStatusErr",
      :text="updateStatus ? 'Profile is successfully updated!' : 'Something went wrong, try again!'"
    )

main-loader(v-if="showLoader")
</template>

<script>
import useValidate from '@vuelidate/core';
import {
  required, helpers, minLength, maxLength,
} from '@vuelidate/validators';
import axios from 'axios';
import MainLoader from '../components/Others/MainLoader.vue';

export default {
  name: 'ProfileView',

  components: {
    MainLoader,
  },

  data() {
    return {
      v$: useValidate(),
      username: '',
      password: '',
      email: '',
      typePass: 'password',
      showPass: false,
      showLoader: false,
      updateStatus: false,
      updateStatusErr: false,
    };
  },

  validations() {
    return {
      username: {
        required: helpers.withMessage('This field cannot be empty!', required),
        minLength: minLength(3),
        maxLength: maxLength(20),
      },
      password: { required, minLength: minLength(5), maxLength: maxLength(25) },
    };
  },

  methods: {
    togglePass() {
      this.showPass = !this.showPass;
      this.typePass = this.typePass === 'password' ? 'text' : 'password';
    },
    redirect(_name, duration) {
      this.showLoader = true;

      setTimeout(() => {
        this.showLoader = false;
        this.$router.push({ name: _name });
      }, duration);
    },
    resetAll() {
      this.username = JSON.parse(localStorage.getItem('user-info')).username;
      this.password = JSON.parse(localStorage.getItem('user-info')).password;
      this.email = JSON.parse(localStorage.getItem('user-info')).email;
      this.v$.$error = false;
    },
    async updateProfile() {
      // Activate validation rules
      this.v$.$validate();

      if (!this.v$.$error) {
        console.log('From is successfully validated!');

        // Get user id
        const userId = JSON.parse(localStorage.getItem('user-info')).id;

        // Update the database with the new user data
        const result = await axios.put(`http://localhost:3000/users/${userId}`, {
          username: this.username,
          password: this.password,
          email: this.email,
        });

        // If user data is updated
        if (result.status === 200) {
          // Update local storage based on the updated user data
          localStorage.setItem('user-info', JSON.stringify(result.data));

          // Show update status message
          this.updateStatus = true;

          setTimeout(() => {
            // hide the update status message
            this.updateStatus = false;

            // redirect user to home page
            this.redirect('home', 1200);
          }, 2000);
        } else { // If failed to update user data
          console.log('Failed to update user data!');

          // Show error message for user
          this.updateStatusErr = true;

          // Hide error message after 2s
          setTimeout(() => {
            this.updateStatusErr = false;
          }, 2000);
        }
      } else { // If form is not validated
        console.warn('Failed to validate form!');
      }
    },
  },

  mounted() {
    const user = localStorage.getItem('user-info');

    // If user is logged in
    if (user) {
      this.username = JSON.parse(localStorage.getItem('user-info')).username;
      this.password = JSON.parse(localStorage.getItem('user-info')).password;
      this.email = JSON.parse(localStorage.getItem('user-info')).email;
    } else {
      // if not logged in, redirect user to login page with 0s delay
      this.redirect('login', 0);
    }
  },
};
</script>

<style lang="scss" scoped>
.profile {
  min-height: calc(100vh - 130.24px);
}
</style>
