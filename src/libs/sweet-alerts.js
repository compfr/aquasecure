import Vue from 'vue'
import VueSweetalert2 from 'vue-sweetalert2'

import 'sweetalert2/dist/sweetalert2.min.css';

const options = {
    confirmButtonColor: '#4267B2',
    cancelButtonColor: '#ff7674',
    color: '#fff',
    background: '#ffffff'
 };


Vue.use(VueSweetalert2,options)
