<template lang="pug">
div(class="parent d-flex flex-column justify-content-center align-items-center mt-3")
  img(src="../assets/not-found.jpg", class="w-75 mw-100 rounded")
  a(
    href="#",
    @click.prevent='goBack()',
    class="error-btn py-1 px-2 py-sm-2 px-sm-4 fs-4"
  ) Go Back
main-loader(v-if="toggleLoader")
</template>

<script>
import MainLoader from '../components/Others/MainLoader.vue';

export default {
  name: 'ErrorPage',

  data() {
    return {
      toggleLoader: false,
    };
  },

  methods: {
    goBack() {
      this.toggleLoader = true;

      if (JSON.parse(localStorage.getItem('user-info'))) {
        this.$router.push({ name: 'home' });
      } else {
        this.$router.push({ name: 'login' });
      }

      setTimeout(() => {
        this.toggleLoader = false;
      }, 200);
    },
  },
  components: { MainLoader },
};
</script>

<style lang="scss" scoped>
.parent {
  min-height: calc(100vh - 1rem);

  .error-btn {
    margin-top: 4rem;
    border-radius: 0.4rem;
    color: white;
    background-color: #ffbe00;
    animation: bounce2 2s ease infinite;

    @media (max-width: 540px) {
      font-size: initial !important;
    }

    &:hover {
      animation: none;
    }
  }
}
</style>
