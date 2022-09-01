<!-- eslint-disable -->
<template lang="pug">
header-comp(v-if="currentRouteName")
.container: router-view
footer-comp
</template>

<script>
import HeaderComp from './components/Header/HeaderComp.vue';
import FooterComp from './components/Footer/FooterComp.vue';

export default {
  name: 'MainApp',

  components: {
    HeaderComp,
    FooterComp,
  },

  computed: {
    currentRouteName() {
      if (
        this.$route.name === 'login'
        || this.$route.name === 'signup'
        || this.$route.name === 'error'
      ) return false;

      return true;
    },
  },
};
</script>
