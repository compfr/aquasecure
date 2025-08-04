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

                <b-col md="12" class="py-2">
                    <b-row class="mb-2">
                        <b-col cols="3"><strong>Frameworks: </strong></b-col>
                        <b-col cols="9">
                            <template
                                v-for="(framework, fIndex) in model.frameworks">
                                {{ framework.framework.name }} :
                                <template
                                    v-for="(subcontrol, sIndex) in framework.sub_controls">
                                    (SC)
                                    {{ subcontrol.sub_control.name }},
                                </template>
                                <template
                                    v-for="(control, cIndex) in framework.controls">
                                    (C) {{ control.control.title }},
                                </template>
                                <br/>
                            </template>

                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col cols="3"><strong>Policies: </strong></b-col>
                        <b-col cols="9">
                            <template
                                v-for="(policy, pIndex) in model.policies">
                                {{ policy.policy.name }} :
                                <template
                                    v-for="(subcontrol, sIndex) in policy.sub_controls">
                                    (SC)
                                    {{ subcontrol.sub_control.name }},
                                </template>
                                <br/>
                            </template>

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
        BBadge
    } from 'bootstrap-vue'
    import {get} from '@/libs/api'

    export default {
        name: "TagShow",
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
            get(`/api/questionnaire_tags/${this.formId}`).then((res) => {
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
