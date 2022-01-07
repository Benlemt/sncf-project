import { createApp } from 'vue'
import App from './App.vue'
import './css/style.css'
import store from './store';

createApp(App)
    .use(store)
    .mount('#app')
