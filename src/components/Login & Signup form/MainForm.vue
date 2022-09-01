<!-- eslint-disable max-len -->
<template lang="pug">
div(class="signup d-flex flex-column justify-content-center w-75 m-auto")
  div(class="d-flex flex-column justify-content-center align-items-center mb-5")
    div(style="max-width: 300px"): img(src="../../assets/signup.png" class="img-fluid")
    h3(class="fw-bold fs-1" v-text="HeadText")
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
            class="form-control form-control-lg fs-5"
            autofocus
          )
          label(for="usernameInputFloat") Username
        div(v-if="v$.username.$error", class="p-1 text-danger")
          | {{ v$.username.$errors[0].$message }}
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
                class="form-control form-control-lg fs-5"
              )
              label(for="passwordInputFloat") Password
            button(class="input-group-text", @click="togglePass")
              fa-icon(
                :icon="showPass ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
              )
          div(v-if="v$.password.$error", class="p-1 text-danger" )
            | {{ v$.password.$errors[0].$message }}
      div(v-if="toggleSignup")
        div(class="mx-auto w-75")
          div(class="form-floating")
            input(
              v-model.trim="email"
              type="email",
              name="email",
              placeholder="E-Mail",
              id="emailInputFloat",
              class="form-control form-control-lg fs-5"
            )
            label(for="emailInputFloat") E-Mail
          div(v-if="v$.email.$error", class="p-1 text-danger")
            | {{ v$.email.$errors[0].$message }}

    div(class="row mb-3")
      div(class="d-grid mt-3")
        button(
          type="submit",
          class="btn btn-secondary btn-lg w-50 mx-auto",
          @click="handleForm()"
        ) Submit

      div(v-if="!toggleSignup", class="text-center mt-4 fs-5")
        p(class="user-select-none")
          |  Don't have an account? #[a(class="redirect-link", @click="redirect('signup')") Signup]

      div(v-if="toggleSignup", class="text-center mt-4 fs-5")
        p(class="user-select-none")
          | Already have an account? #[a(class="redirect-link", @click="redirect('login')") Login]

    //- Login form alert
    main-alert(
      :toggleSuccess="loginStatus.success",
      :toggleFail="loginStatus.fail",
      :text="loginStatus.success ? 'Login Successful!' : 'User not found!'"
    )

    //- Sign up form alert
    main-alert(
      :toggleSuccess="signupStatus.success",
      :toggleFail="signupStatus.fail",
      :text="signupStatus.success ? 'Signed up successfully!' : 'Whoops, something went wrong, try again!'"
    )

    //- Duplicated data alert
    main-alert(
      :toggleFail="signupStatus.duplicated",
      :text="signupStatus.dupText"
    )

  main-loader(v-if="loginStatus.loginStatus")
</template>

<script>
import axios from 'axios';
import useValidate from '@vuelidate/core';
import {
  required, helpers, email, minLength, maxLength,
} from '@vuelidate/validators';
import MainLoader from '../Others/MainLoader.vue';

export default {
  name: 'MainForm',

  props: {
    toggleSignup: { type: Boolean, default: false },
    HeadText: String,
  },

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
      loginStatus: {
        success: false,
        fail: false,
      },
      signupStatus: {
        success: false,
        fail: false,
        duplicated: false,
        dupText: '',
      },
    };
  },

  validations() {
    return {
      username: {
        required: helpers.withMessage('This field cannot be empty!', required),
        minLength: minLength(3),
        maxLength: maxLength(20),
      },
      password: {
        required: helpers.withMessage('This field cannot be empty!', required),
        minLength: minLength(5),
        maxLength: maxLength(25),
      },
      email: this.toggleSignup ? { required, email } : '',
    };
  },

  methods: {
    togglePass() {
      this.showPass = !this.showPass;
      this.typePass = this.typePass === 'password' ? 'text' : 'password';
    },
    redirect(_name) {
      if (!this.toggleSignup) this.$router.push({ name: _name });
      else this.$router.push({ name: _name });
    },
    async handleForm() {
      // Activate validation rules
      this.v$.$validate();

      if (!this.v$.$error) {
        // If signup form
        if (this.toggleSignup) {
          // Check if username already exists
          await axios.get(`
            http://localhost:3000/users?username=${this.username}
          `).then((response) => {
            // If found
            if (response.status === 200 && response.data.length) {
              // Set duplicated flag
              this.signupStatus.duplicated = true;
              this.signupStatus.dupText = 'This username already exists!';
            }
          });

          // Check if email already exists
          await axios.get(`
            http://localhost:3000/users?email=${this.email}
          `).then((response) => {
            // If found
            if (response.status === 200 && response.data.length) {
              // Set duplicated flag
              this.signupStatus.duplicated = true;
              this.signupStatus.dupText = 'This E-Mail already exists!';
            }
          });

          // If input data doesn't already exist
          if (!this.signupStatus.duplicated) {
            console.log('Form is successfully validated!');

            // Add the user to the database (i.e db.json file)
            const result = await axios.post('http://localhost:3000/users', {
              username: this.username,
              password: this.password,
              email: this.email,
            });

            // Check if the user is added
            if (result.status === 201) {
              // Save user data into the local storage (Note: not a safe way!)
              localStorage.setItem('user-info', JSON.stringify(result.data));

              // Set signup status (Success status)
              this.signupStatus.success = true;

              // reset signup status & redirect user to home page
              setTimeout(() => {
                this.signupStatus.success = false;
                this.redirect('home');
              }, 1500);
            } else {
              // Set signup status (Fail status)
              this.signupStatus.fail = true;

              // Reset signup status to default
              setTimeout(() => {
                this.signupStatus.fail = false;
              }, 2000);
            }
          } else { // If form is not validated
            console.warn(new Error('Failed to validate form!'));
          }
        } else { // If login form
          // Check if user is registered in the database
          await axios.get(
            `http://localhost:3000/users?${this.username}&password=${this.password}`,
          ).then((resp) => {
            // If user is found
            if (resp.status === 200 && resp.data.length) {
              // Set login status (Success status)
              this.loginStatus.success = true;

              // Reset login status & Redirect user to home page after a 1.5s delay
              setTimeout(() => {
                this.loginStatus.success = false;

                // Save user data to local storage (Note: this is not a safe way!)
                localStorage.setItem('user-info', JSON.stringify(resp.data[0]));

                // redirect user to home page
                this.redirect('home');
              }, 1500);
            } else {
              // Set login status (Fail status)
              this.loginStatus.fail = true;

              // Reset login status after 3s
              setTimeout(() => {
                this.loginStatus.fail = false;
              }, 2000);
            }
          });
        }
      } else { // If form isn't validated
        console.log('Form validation failed!');
      }
    },
  },

  mounted() {
    // If user already signed in, redirect user to home page
    if (localStorage.getItem('user-info')) this.redirect('home');
  },
};
</script>

<style lang="scss" scoped>
.signup {
  min-height: 100vh;
}

.redirect-link {
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: rgba(163, 119, 62, .4);
  }
}
</style>
