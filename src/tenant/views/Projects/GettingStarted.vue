<template>
    <div>
        <form-wizard color="#7367F0" :title="null" :subtitle="null" shape="square" finish-button-text="Submit"
                     back-button-text="Previous" class="mb-3" @on-complete="formSubmitted">

            <!-- Project Details -->
            <tab-content title="Project Details">
                <b-row>
                    <b-col md="6">
                        <b-form-group
                            label="Name"
                        >
                            <b-form-input
                                placeholder="Name"
                                v-model="form.name"
                            />
                            <error :error="error.name"/>
                        </b-form-group>
                    </b-col>
                    <b-col md="6">
                        <b-form-group
                            label="Department"
                        >
                            <b-form-input
                                placeholder="Department"
                                v-model="form.department"
                            />
                            <error :error="error.department"/>
                        </b-form-group>
                    </b-col>

                    <b-col md="12">
                        <b-form-group
                            label="Description"
                        >
                            <b-form-textarea
                                v-model="form.description"
                            />
                            <error :error="error.description"/>
                        </b-form-group>
                    </b-col>
                    <b-col md="6">
                        <b-form-group
                            label="Due Date"
                        >
                            <flat-pickr
                                v-model="form.due_date"
                                class="form-control"
                                :config="{ enableTime: false, noCalendar: false, dateFormat: 'Y-m-d',}"
                            />
                            <error :error="error.due_date"/>
                        </b-form-group>
                    </b-col>
                    <b-col md="6">
                        <!--                        <div class="position-top-0 position-right-0 position-absolute px-1" @click="addNewProjectOwner">-->
                        <!--                            <small>Add New</small>-->
                        <!--                        </div>-->
                        <b-form-group
                            label="Project Owners"
                        >
                            <x-tag-input :positionRelative="true" :removable="true" keyIndex="user_id"
                                         :multiple="true" :value="form.project_owners" relation="user"
                                         :resource="`/api/search/users`" column="title" name="name" @input="onProjectOwnerUpdate"/>
                            <error :error="error.project_owners"/>
                        </b-form-group>
                    </b-col>
                </b-row>
            </tab-content>

            <!-- Frameworks / Policies -->
            <tab-content title="Frameworks / Policies" :before-change="validateFrameworks">
                <b-row>
                    <b-col cols="12">
                        <b-form-group
                            label="Frameworks"
                        >
                            <x-tag-input :positionRelative="true" :removable="true" keyIndex="framework_id"
                                         :multiple="true" :value="form.frameworks" relation="framework"
                                         :resource="`/api/search/frameworks`" column="title" name="title"
                                         @input="onFrameworksUpdate">
                            </x-tag-input>
                            <error :error="error.frameworks"/>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12">
                        <b-form-group
                            label="Policies"
                        >
                            <x-tag-input :positionRelative="true" :removable="true" keyIndex="policy_id"
                                         :multiple="true" :value="form.policies" relation="policy"
                                         :resource="`/api/search/policies`" column="title" name="title"
                                         @input="onPolicyUpdate">
                            </x-tag-input>
                            <error :error="error.policies"/>
                        </b-form-group>
                    </b-col>
                </b-row>
            </tab-content>

            <!-- sub controls  -->
            <tab-content title="Sub Controls">
                <b-row>
                    <b-col cols="12">
                        <table class="table table-hover">
                            <thead>
                            <tr>
                                <th>Ref. Code</th>
                                <th>Description</th>
                                <th>Is Applicable?</th>
                            </tr>
                            </thead>
                            <tbody>

                                <template v-for="(item,index) in form.tasks">
                                    <tr>
                                        <td>{{item.ref_code}}</td>
                                        <td>{{item.description}}</td>
                                        <td>
                                            <b-form-checkbox
                                                :id="`applicable-${index}`"
                                                v-model="item.applicable"
                                                :name="`applicable-${index}`"
                                                :value="1"
                                                :unchecked-value="0"
                                            >
                                            </b-form-checkbox>
                                        </td>
                                    </tr>
                                </template>

                            </tbody>
                        </table>
                    </b-col>
                </b-row>
            </tab-content>

            <!-- assets -->
            <tab-content title="Assets (Optional)">
                <b-row>
                </b-row>
            </tab-content>

        </form-wizard>
    </div>
</template>

<script>
    import {FormWizard, TabContent} from 'vue-form-wizard'
    import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
    import 'vue-form-wizard/dist/vue-form-wizard.min.css'
    import XTagInput from "@/components/Form/TagInput";
    import Error from '@/components/Form/Error'
    import flatPickr from 'vue-flatpickr-component';
    import {
        BRow,
        BCol,
        BFormCheckbox,
        BFormGroup,
        BFormInput,
        BFormTextarea,
        BFormInvalidFeedback,
    } from 'bootstrap-vue'
    import Vue from "vue";
    import {get, post} from "@/libs/api";
    import {form} from "@/libs/mixins";


    function initialize(to) {
        let urls = {
            'add': `/api/projects/create`,
        };
        return (urls['add'])
    }

    export default {
        mixins: [form],
        components: {
            Error,
            XTagInput,
            FormWizard,
            BFormCheckbox,
            TabContent,
            BRow,
            flatPickr,
            BCol,
            BFormGroup,
            BFormInput,
            BFormTextarea,
            BFormInvalidFeedback,
            ToastificationContent,
        },

        beforeRouteEnter(to, from, next) {
            get(initialize(to))
                .then((res) => {
                    next(vm => vm.setData(res))
                })
        },
        beforeRouteUpdate(to, from, next) {
            get(initialize(to))
                .then((res) => {
                    this.setData(res);
                    next()
                })
        },

        data() {
            return {
                store: '/api/getting_started_project',
                method: 'POST',
                title: 'Add',
                message: 'New Project Added',
            }
        },
        methods: {
            setData(res) {
                Vue.set(this.$data, 'form', res.data.form);
                this.show = true
            },
            // formSubmitted() {
            //     this.$toast({
            //         component: ToastificationContent,
            //         props: {
            //             title: 'Form Submitted',
            //             icon: 'EditIcon',
            //             variant: 'success',
            //         },
            //     })
            // },
            onFrameworksUpdate(e) {
                Vue.set(this.$data.form, 'frameworks', e);
            },
            onPolicyUpdate(e) {
                Vue.set(this.$data.form, 'policies', e);
            },
            onProjectOwnerUpdate(e) {
                Vue.set(this.$data.form, 'project_owners', e)
            },

            validateFrameworks(e) {
                return new Promise((resolve, reject) => {
                    if (this.form.frameworks.length > 0 || this.form.policies.length > 0) {
                        let data = {
                            frameworks : this.form.frameworks,
                            policies : this.form.policies,
                            project_owners: this.form.project_owners
                        }
                        post('/api/get-project-sub_controls', data).then((res) => {
                            Vue.set(this.$data.form, 'tasks', res.data.data);
                        });
                        resolve(true)
                    } else {
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Error',
                                icon: 'WarningIcon',
                                variant: 'danger',
                            },
                        })
                        reject()
                    }
                })
            },
            formSubmitted() {
                this.submit(this.form, (res) => {
                    this.success()
                    this.successfull(res)
                })
            },
            successfull(res) {
                this.$router.push(`/projects`)
            },
        },
    }
</script>
<style lang="scss">
    @import '~@core/scss/vue/libs/vue-wizard.scss';
    @import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
