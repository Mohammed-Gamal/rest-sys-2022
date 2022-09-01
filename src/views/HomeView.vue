<template lang="pug">
div(class="home")
  p(class="d-flex justify-content-end align-items-center mt-4 mb-5")
    a(
      href="#",
      class="d-flex justify-content-center align-content-center",
      @click.prevent="redirectProfile()",
      title="Edit Profile",
    )
      fa-icon(icon="circle-user", class="fs-4 me-2")
    | Welcome, #[span(class="fw-bold text-black-50 ms-1") {{  username  }}]

  show-locations(:data="allLocations")

main-loader(v-if="showLoader")
</template>

<script>
import axios from 'axios';
import MainLoader from '../components/Others/MainLoader.vue';
import ShowLocations from '../components/Restaurant Locations/ShowLocations.vue';

export default {
  name: 'HomeView',

  components: {
    MainLoader,
    ShowLocations,
  },

  data() {
    return {
      username: '',
      showLoader: false,
      allLocations: [],
    };
  },

  methods: {
    redirectProfile() {
      this.showLoader = true;

      setTimeout(() => {
        this.$router.push({ name: 'profile' });
        this.showLoader = false;
      }, 1000);
    },
  },

  async mounted() {
    const user = JSON.parse(localStorage.getItem('user-info'));

    if (user) {
      this.username = user.username;

      const result = await axios.get(`
        http://localhost:3000/locations?userId=${user.id}
      `);

      if (result.status === 200 && result.data.length) {
        this.allLocations = result.data;
      } else {
        console.error(new Error('No records were found!'));
      }
    } else this.$router.push({ name: 'login' });
  },
};
</script>
