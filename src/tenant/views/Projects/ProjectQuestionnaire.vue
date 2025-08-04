<template>
    <div v-if="showData">
        <template v-for="(item,index) in questionnaires">
            <b-card-actions :title="item.tag.desc" action-collapse class="questionnaire-tag">
                <template v-for="(operation, oIndex) in item.operations">
                    <b-row class="align-items-center">
                        <b-col md="2">
                            <h5>Operation ID</h5>
                            <b-card-text>{{operation.operation_id}}</b-card-text>
                            <h5>Reference Code</h5>
                            <b-card-text>{{operation.sub_control.reference_code}}</b-card-text>
                        </b-col>
                        <b-col md="9">
                            <b-form-group :label="operation.sub_control.desc">
                                <b-form-textarea v-model="operation.notes"/>
                            </b-form-group>
                        </b-col>
                        <b-col md="1">
                            <b-button type="submit" variant="primary" @click="submitQuestionnaire(operation)">Save
                            </b-button>
                        </b-col>
                    </b-row>
                    <hr v-if="oIndex < (item.operations.length-1)"/>
                </template>
            </b-card-actions>
            <!--            <b-row>-->
            <!--                <b-col cols="12">-->
            <!--                    <b-card-text>Q: <strong>{{item.tag.desc}}</strong></b-card-text>-->
            <!--                </b-col>-->
            <!--            </b-row>-->
            <!--            -->
            <!--            <hr />-->
        </template>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {BRow, BCol, BCardText, BFormGroup, BFormTextarea, BButton} from 'bootstrap-vue'

    import {get, post} from "@/libs/api";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";
    import BCardActions from "@core/components/b-card-actions/BCardActions";

    export default {
        name: "ProjectQuestionnaire",
        components: {
            BCardActions,
            BRow, BCol, BCardText, BFormGroup, BFormTextarea, BButton
        },
        props: {
            project: Number
        },
        data() {
            return {
                questionnaires: [],
                showData: false,
            }
        },
        created() {
            get(`/api/project_questionnaires?project_id=${this.project}`).then((res) => {
                Vue.set(this.$data, 'questionnaires', res.data.data);
                this.showData = true
            })
        },
        methods: {
            submitQuestionnaire(item) {
                let form = {
                    id: item.id,
                    notes: item.notes
                }
                post('/api/project_questionnaires', form).then((res) => {
                    if (res.data.saved) {
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text: 'Questionnaire Updated',
                                variant: 'success'
                            },
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="scss">

    .questionnaire-tag {
        .card-content{
            .card-body {
                padding: 1.5rem !important;
            }
        }

        .card-header{
            background-color: whitesmoke !important;
        }
    }
</style>
