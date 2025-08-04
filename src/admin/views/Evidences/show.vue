<template>
    <div v-if="show">
        <b-card>
            <b-row class="d-flex justify-content-center align-items-center py-1">
                <b-col md="4" class="mb-2">
                    <h5>Name</h5>
                    <b-card-text>{{model.name}}</b-card-text>
                </b-col>
                <b-col md="4" class="mb-2">
                    <h5>Category</h5>
                    <b-card-text>{{model.system_tag.title}}</b-card-text>
                </b-col>
                <b-col md="4" class="mb-2">
                    <h5>Type</h5>
                    <b-card-text>{{model.tag_type.title}}</b-card-text>
                </b-col>
                <b-col md="6" class="mb-2">
                    <h5>Detail</h5>
                    <b-card-text>{{model.detail}}</b-card-text>
                </b-col>
                <b-col md="6" class="mb-2">
                    <h5>Description</h5>
                    <b-card-text>{{model.desc}}</b-card-text>
                </b-col>
                <b-col md="12" class="mb-2">
                    <h5>Documents</h5>
                    <b-row>
                        <b-col md="12" class="my-1" v-for="(item,index) in model.documents" :key="index">
                            <b-card-text>{{index+1}} . <b-link :href="`/attachment/${item.document}`" target="_blank">{{item.filename}}</b-link></b-card-text>
                        </b-col>
                    </b-row>
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
        BBadge,
        BLink
    } from 'bootstrap-vue'
    import {get} from '@/libs/api'

    export default {
        name: "EvidenceTagShow",
        components: {
            BCard,
            BCardText,
            BRow,
            BCol,
            BButton,
            BBadge,
            BLink
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
            get(`/api/evidence_tags/${this.formId}`).then((res) => {
                Vue.set(this.$data, 'model', res.data.model);
                this.show = true
            });
        },
        methods: {
            goBack() {
                this.$router.go(-1);
            },
            cancelForm() {
                this.$emit('cancel');
            }
        }
    }
</script>

<style scoped>

</style>
