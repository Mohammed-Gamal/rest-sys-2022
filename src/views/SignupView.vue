<template lang="pug">
MainForm(HeadText="Sign Up", toggle-signup)
</template>

<script>
import MainForm from '../components/Login & Signup form/MainForm.vue';

export default {
  name: 'SignupView',
  components: {
    MainForm,
  },
};
</script>
