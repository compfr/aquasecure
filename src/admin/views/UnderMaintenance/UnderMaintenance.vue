<template>
    <b-row class="d-flex">
        <b-col md="12" class="d-flex justify-content-center align-items-center mb-4">
            <b-img width="700" :src="require('@/assets/images/under-maintenance.png')"></b-img>
        </b-col>
        <b-col md="12" class="d-flex justify-content-center align-items-center flex-column">
            <h3 class="mb-2">Service Update in Progress</h3>
            <p>This page is currently undergoing maintenance to improve your experience. We'll be back shortly.
                Thank
                you for your patience!</p>
        </b-col>
    </b-row>
</template>

<script>
    import Vue from 'vue'
    import {
        BCard,
        BRow,
        BCol,
        BCardText,
        BImg
    } from 'bootstrap-vue'

    export default {
        name: "UnderMaintenance",
        components: {
            BCard,
            BCardText,
            BRow,
            BCol,
            BImg
        },
    }
</script>

<style scoped>
    h3 {
        /*font-family: SF Mono, Segoe UI Mono, Roboto Mono, Menlo, Courier, monospace;*/
        font-weight: bolder;
        font-size: 2rem;
    }

    p {
        /*font-family: "Roboto Mono";*/
        letter-spacing: 2px;
        font-size: 1.2rem;
    }
</style>
