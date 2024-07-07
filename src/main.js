import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'

import { Parse } from 'parse/dist/parse.min.js';
Parse.initialize('VsdRYay0mf7wNfzCKIWOq26xDWbdCyqaVEmk3sqo', 'duEX2RElwFAa5bHcBPpxLIpDpteQelbUjFnBeRFl');
Parse.serverURL = 'https://parseapi.back4app.com';

createApp(App).use(router).mount('#app')
