<!-- eslint-disable no-multiple-empty-lines -->
<!-- eslint-disable max-len -->
<template lang="pug">

nav(class="navbar navbar-expand-lg bg-light")
  div(class="container-fluid")
    .logo(title="Pourhouse")
      a(href="/")
        img(class="img-fluid" src="../../assets/logo.png", alt="Pourhouse Restaurant")
    button(
      class="navbar-toggler ms-auto",
      type="button",
      data-bs-toggle="collapse",
      data-bs-target="#navbarSupportedContent",
      aria-controls="navbarSupportedContent",
      aria-expanded="false",
      aria-label="Toggle navigation"
    )
      fa-icon(icon="fa-bars", class="fs-3")

    div(class="collapse navbar-collapse", id="navbarSupportedContent")
      ul(class=`
        flex-fill
        navbar-nav
        justify-content-center
        justify-content-md-end
        align-items-center
        gap-lg-4
        me-auto
        mb-2
        mb-lg-0
        fs-5
      `)
        li(class="nav-item")
          router-link(class="nav-link", to="/", aria-current="page", exact) Home
        li(class="nav-item dropdown")
          a(
            class="nav-link dropdown-toggle",
            href="#",
            role="button",
            data-bs-toggle="dropdown",
            aria-expanded="false"
          ) Dropdown
          ul(class="dropdown-menu")
            li: a(class="dropdown-item" href="#") Link #1
            li: hr(class="dropdown-divider")
            li: a(class="dropdown-item" href="#") Link #2
            li: hr(class="dropdown-divider")
            li: a(class="dropdown-item" href="#") Link #3
        li(class="nav-item")
          router-link(class="nav-link", to="/about")  About
        li(class="nav-item")
          router-link(class="nav-link", to="/contact") Contact
        li(class="nav-item")
          a(class="nav-link", href="#", @click.prevent="handleLogout()")
            fa-icon(icon="fa-solid fa-arrow-right-to-bracket", class=" me-2 fs-6")
            | Logout

main-loader(v-if="showLoader")
</template>

<script>
import MainLoader from '../Others/MainLoader.vue';

export default {
  name: 'headerComp',

  components: {
    MainLoader,
  },

  data() {
    return {
      showLoader: false,
    };
  },

  methods: {
    handleLogout() {
      this.showLoader = true;

      setTimeout(() => {
        this.showLoader = false;

        localStorage.clear();
        this.$router.push({ name: 'login' });
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
$main-color: #a3773e;
$hover-color: rgba(163, 119, 62, .4);

.logo {
  max-width: 300px;

  @media (max-width: 415px) {
    max-width: 200px;
  }
}

nav {
  background-color: #212121 !important;

  a {
    color: $main-color;
    transition: 0.3s;

    &:hover {
      color: $hover-color;
    }
  }

  .navbar-toggler {
    &:focus {
      box-shadow: none !important;
    }

    svg {
      transition: 0.3s;
      color: $main-color;
    }

    &:hover svg {
      color: $hover-color !important;
    }
  }
}
</style>
