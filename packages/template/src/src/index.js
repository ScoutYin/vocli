import './assets/style/index.scss';
import '@wya/vc/lib/vc.min.css';
import { createApp } from 'vue';
import { setupConfig } from '@/config';
import { router, setupRouter } from './router';
import App from './app.vue';

const app = createApp(App);

setupConfig(app, { Router: router });
setupRouter(app);

app.mount('#app');

window.app = app;
