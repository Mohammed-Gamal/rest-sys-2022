<!-- eslint-disable max-len -->
<template lang="pug">
footer(class="mt-4 p-5 pb-0")
  div.mb-4
    h4(class="title text-center text-uppercase fw-bold m-0 mb-3") Pourhouse Restaurant
    p(class="text-center text-uppercase fs-6")
      | Good meals ⟡ Pleasant room #[br] Cocktails ⟡ Live music
    div(class="text-center")
      img(
        src="../../assets/footer01.png",
        alt="Footer Image",
        class="img-fluid w-50"
      )

  div(class=`
    social-links
    d-flex
    justify-content-center
    align-items-center
    mt-3
    mb-5
    fs-5
  `)
    a(href="#", target="_blank", class="d-flex justify-content-center align-items-center")
      fa-icon(:icon="['fab', 'fa-instagram']")
    a(href="#", target="_blank", class="d-flex justify-content-center align-items-center")
      fa-icon(:icon="['fab', 'fa-facebook-f']")
    a(href="#", target="_blank", class="d-flex justify-content-center align-items-center")
      fa-icon(icon="fa-envelope")

  div(class="row text-center mt-5 mb-4")
    div(class="col col-12 mb-5 col-sm-6 mb-sm-5 mb-md-0 col-md-3")
      h5(class="sub-title fw-bold m-0 mb-4") Location
      a(href="https://goo.gl/maps/eGmBwn5xX8cJA1G68", target="_blank") 162 water street #[br] gastown, vancouver, bc

    div(class="col col-12 mb-5 col-sm-6 mb-sm-5 mb-md-0 col-md-3")
      h5(class="sub-title fw-bold m-0 mb-4") Contact
      ul
        li: a(href="tel:+16045687022") 604-568-7022
        li: a(href="mailto:info@pourhouse.com") info@pourhouse.com

    div(class="col col-12 mb-5 col-sm-6 mb-md-0 col-md-3")
      h5(class="sub-title fw-bold m-0 mb-4") Media Inquiries
      ul
        li #[span.text-uppercase smc] Communications Inc.
        li: a(href="mailto:pr@pourhouse.com") pr@pourhouse.com

    div(class="col col-12 col-sm-6 mb-md-0 col-md-3")
      h5(class="sub-title fw-bold m-0 mb-4") Careers
      ul
        li pourhouse.com/careers
        li: a(href="mailto:careers@pourhouse.com") careers@pourhouse.com

  div(class="copyright mt-5 p-3 text-center")
    | Copyright &copy; #[span.year ]. All rights reserved
</template>

<script>
export default {
  name: 'FooterComp',
};
</script>

<style lang="scss" scoped>
footer {
  background-color: #212121;

  h4.title {
    color: #a92839;
  }

  .social-links > a {
    width: 40px;
    height: 40px;
  }

  .sub-title {
    position: relative;
    letter-spacing: 1px;

    &::after {
      content: '';
      width: 90%;
      height: 1px;
      position: absolute;
      bottom: -7px;
      left: 50%;
      transform: translateX(-50%);
      background-color: transparentize(#a3773e, 0.7);

      @media (max-width: 576px) {
        display: none;
      }
    }
  }

  .copyright {
    border-top: 1px solid transparentize(#a3773e, 0.7);
  }
}
</style>
