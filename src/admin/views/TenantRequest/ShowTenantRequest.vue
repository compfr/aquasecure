<template>
    <div v-if="show">
        <b-card>
            <b-row>
                <b-col md="6" class="mb-2">
                    <h5>Name</h5>
                    <b-card-text>{{model.full_name}}</b-card-text>
                </b-col>
                <b-col md="6" class="mb-2">
                    <h5>Domain Name</h5>
                    <b-card-text>{{model.domain_name}}</b-card-text>
                </b-col>
                <b-col md="6" class="mb-2">
                    <h5>Company Name</h5>
                    <b-card-text>{{model.company_name}}</b-card-text>
                </b-col>
                <b-col md="6" class="mb-2">
                    <h5>Phone Number</h5>
                    <b-card-text>{{model.phone_number}}</b-card-text>
                </b-col>
                <b-col md="6" class="mb-2">
                    <h5>Email</h5>
                    <b-card-text>{{model.email}}</b-card-text>
                </b-col>
            </b-row>
        </b-card>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {
        BCard,
        BCardText,
        BRow,
        BCol,
        BButton,BBadge
    } from 'bootstrap-vue'
    import {get} from '@/libs/api'

    export default {
        name: "ShowTenantRequest",
        components: {
            BCard,
            BCardText,
            BRow,
            BCol,
            BButton,
            BBadge
        },
        props: {
            formId: Number
        },
        data() {
            return {
                show: false,
                model: null
            }
        },
        created() {
            get(`/api/tenant-requests/${this.formId}`).then((res) => {
                Vue.set(this.$data, 'model', res.data.model);
                this.show = true
            });
        }
    }
</script>

<style scoped>

</style>
