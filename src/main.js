import { createApp } from 'vue';

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

// Vue Prerequisites
import store from './store';
import router from './router';
import App from './App.vue';

// Normalize
import 'normalize.css';

// Bootstrap
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Sass
import './sass/main.scss';

// Alert Component
import MainAlert from './components/Others/MainAlert.vue';

library.add(fas, far, fab);

createApp(App)
  .use(store)
  .use(router)
  .component('fa-icon', FontAwesomeIcon)
  .component('main-alert', MainAlert)
  .mount('#app');
