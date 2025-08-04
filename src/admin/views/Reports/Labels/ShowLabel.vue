<template>
    <div v-if="show">
        <b-card>
            <b-row>
                <b-col md="6" class="mb-2">
                    <h5>Name</h5>
                    <b-card-text>{{model.name}}</b-card-text>
                </b-col>
                <b-col md="6" class="mb-2">
                    <h5>Api Type</h5>
                    <b-card-text>{{model.api_type.title}}</b-card-text>
                </b-col>
                <b-col md="12" class="mb-2">
                    <h5>Base Url / Port</h5>
                    <b-card-text>{{model.base_url}}:{{model.port}}</b-card-text>
                </b-col>
                <b-col md="6" class="mb-2">
                    <h5>Username</h5>
                    <b-card-text>{{model.username}}</b-card-text>
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
        BButton,
        BBadge
    } from 'bootstrap-vue'
    import {get} from '@/libs/api'
    export default {
        name: "ShowLabel",
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
            get(`/api/labels/${this.formId}`).then((res) => {
                Vue.set(this.$data, 'model', res.data.model);
                this.show = true
            });
        },
        methods: {
            goBack() {
                this.$router.go(-1);
            },
            cancelForm(){
                this.$emit('cancel');
            }
        }
    }
</script>


<style scoped>

</style>
