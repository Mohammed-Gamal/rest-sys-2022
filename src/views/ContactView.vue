<template lang="pug">
div(class="d-flex flex-column justify-content-center align-items-center my-5")
  div(class="text-center")
    img(class="img-fluid", src="../assets/contact01.png", alt="Image")

  div(class="text-center my-4")
    h3(class="main-title text-uppercase fw-bold m-0 mb-2") Stay in touch
    p Sign up with your email address to receive news and updates.

  form
    .row
      div(class="mb-3")
          p(class="m-0 mb-1"): label(for="name") Name *

          div(class="row")
            div(class="col-12 col-md-6")
              input(type="text", name="firstName", id="name", class="form-control", required)
              p(class="label-text mt-1 ms-1") First Name

            div(class="col-12 col-md-6")
              input(type="text", name="lastName", class="form-control", required)
              p(class="label-text mt-1 ms-1") Last Name
      div
        p(class="m-0 mb-1"): label(for="name", class="d-block") Email *
        input(type="email", id="name", class="form-control", required)

      div(class="text-center my-4")
        button(type="submit", class="btn btn-secondary w-25") Submit

  div(class="text-center")
    img(class="img-fluid", src="../assets/contact02.png", alt="Image")
</template>

<script>
export default {
  name: 'ContactView',
};
</script>

<style lang="scss">
.main-title {
  color: #a92839;
  letter-spacing: 1.5px;
  font-family: Times, serif, 'Times New Roman';
}

.label-text {
  font-size: 0.8rem;
}
</style>
