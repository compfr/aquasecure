<template>
    <div v-if="show">
        <b-card :title="$route.meta.mode && $route.meta.mode === 'edit' ? 'Edit OpenCase' : 'Add New OpenCase'">
            <b-row>
                <b-col md="6">
                    <b-form-group label="Task Type">
                        <x-tag-input :value="form.task_type" :resource="`/api/search/task_types`" column="title" name="title"
                            @input="onTaskTypeUpdate" />
                        <error :error="error.task_type_id" />
                    </b-form-group>
                </b-col>

                <b-col md="6">
                    <b-form-group label="Source">
                        <b-form-input placeholder="Source" v-model="form.source"/>
                        <error :error="error.source"/>
                    </b-form-group>
                </b-col>

                <b-col md="12">
                    <b-form-group label="Description">
                        <b-form-textarea v-model="form.description" />
                        <error :error="error.description" />
                    </b-form-group>
                </b-col>

                <b-col md="6">
                    <b-form-group label="Status">
                        <x-tag-input :value="form.operation_status" :resource="`/api/search/operation_status`" column="title" name="title"
                            @input="onStatusUpdate" />
                        <error :error="error.status_id" />
                    </b-form-group>
                </b-col>

                <b-col md="6">
                    <b-form-group label="Urgency">
                        <x-tag-input :value="form.operation_urgency" :resource="`/api/search/operation_urgency`" column="title" name="title"
                            @input="onUrgencyUpdate" />
                        <error :error="error.urgency_id" />
                    </b-form-group>
                </b-col>

                <b-col md="6">
                    <!-- <div class="position-top-0 position-right-0 position-absolute px-1" @click="addNewProjectOwner">
                        <small>Add New</small>
                    </div> -->
                    <b-form-group label="Owner">
                        <x-tag-input :value="form.owner" :resource="`/api/search/users`" column="title" name="name"
                            @input="onProjectOwnerUpdate" />
                        <error :error="error.owner_id" />
                    </b-form-group>
                </b-col>

                <b-col md="6">
                    <b-form-group label="Due Time">
                        <flat-pickr v-model="form.due_time" class="form-control"
                            :config="{ enableTime: true, noCalendar: false, dateFormat: 'Y-m-d H:i:ss', }" />
                        <error :error="error.due_time" />
                    </b-form-group>
                </b-col>

                <b-col md="12">
                    <b-form-group label="Comments">
                        <b-form-textarea v-model="form.comments" />
                        <error :error="error.comments" />
                    </b-form-group>
                </b-col>


                <!-- <b-col md="6">
                    <b-form-group label="Create Time">
                        <flat-pickr v-model="form.created_at" class="form-control"
                            :config="{ enableTime: false, noCalendar: false, dateFormat: 'Y-m-d H:i:s', }" />
                        <error :error="error.created_at" />
                    </b-form-group>
                </b-col> -->
            </b-row>
            <b-row>
                <b-col>
                    <b-button   type="submit" variant="primary" class="mr-1"
                        @click="formSubmitted">
                        Submit
                    </b-button>
                </b-col>
            </b-row>
        </b-card>


        <!-- <b-modal v-model="projectOwnerModal" id="modal-project-owner" title="Add New Project Owner" ok-title="Submit"
            cancel-variant="outline-secondary" @hidden="resetProjectOwnerModal" @ok="submitProjectOwner">

            <b-form-group label="Name">
                <b-form-input placeholder="Name" v-model="projectOwnerForm.name" />
                <error :error="projectOwnerError.name" />
            </b-form-group>

            <b-form-group label="Email">
                <b-form-input placeholder="Email" v-model="projectOwnerForm.email" />
                <error :error="projectOwnerError.email" />
            </b-form-group>

            <b-form-group label="Password">
                <b-form-input placeholder="Password" v-model="projectOwnerForm.password" />
                <error :error="projectOwnerError.password" />
            </b-form-group>

            <b-form-group label="Confirm Password">
                <b-form-input placeholder="Confirm Password" v-model="projectOwnerForm.password_confirmation" />
                <error :error="projectOwnerError.password_confirmation" />
            </b-form-group>
        </b-modal> -->
    </div>
</template>

<script>
import Vue from 'vue'
import {
    BCard,
    BCardText,
    BLink,
    BRow,
    BCol,
    BFormInput,
    BFormGroup,
    BFormCheckbox,
    BButton,
    BFormTextarea,
    BFormSelect,
    BModal
} from 'bootstrap-vue'
import { form } from "@/libs/mixins";
import { get, post } from '@/libs/api'
import Error from "@/components/Form/Error";
import Ripple from "vue-ripple-directive";
import flatPickr from 'vue-flatpickr-component';
import XTagInput from "@/components/Form/TagInput";
import ToastificationContent from "@core/components/toastification/ToastificationContent";

function initialize(to) {
    let urls = {
        'add': `/api/open-case/create`,
        'edit': `/api/open-case/${to.params.id}/edit`
    };
    return (urls[to.meta.mode] || urls['add'])
}

export default {
    mixins: [form],
    components: {
        XTagInput,
        Error,
        BCard,
        BCardText,
        BLink,
        BRow,
        BCol,
        BFormInput,
        BFormGroup,
        BFormCheckbox,
        BButton,
        BFormTextarea,
        BFormSelect,
        flatPickr,
        BModal
    },
    directives: {
        Ripple
    },
    data() {
        return {
            selected: [],
            show: false,
            resource: '/my-assignment',
            store: '/api/open-case',
            method: 'POST',
            title: 'Add',
            message: 'New OpenCase Added',
            permissions: [],
            // projectOwnerModal: false,
            // projectOwnerForm: {
            //     name: null,
            //     email: null,
            //     password: null
            // },
            // projectOwnerError: {}
        }
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
    methods: {
        setData(res) {
            Vue.set(this.$data, 'form', res.data.form);

            if (this.$route.meta.mode === 'edit') {
                this.store = `/api/open-case/${this.$route.params.id}?_method=PUT`;
                this.title = 'Edit';
                this.message = 'OpenCase has been updated';
            }
            this.show = true
        },
        formSubmitted() {
            this.submit(this.form, (res) => {
                this.success()
                this.successfull(res)
            })
        },
        successfull(res) {
            this.$router.push(`${this.resource}`)
        },

        onProjectOwnerUpdate(e) {
            Vue.set(this.$data.form, 'owner_id', e.id)
            Vue.set(this.$data.form, 'owner', e)
        },
        onTaskTypeUpdate(e) {
            Vue.set(this.$data.form, 'task_type_id', e.id)
            Vue.set(this.$data.form, 'task_type', e)
        },
        onStatusUpdate(e) {
            Vue.set(this.$data.form, 'status_id', e.id)
            Vue.set(this.$data.form, 'operation_status', e)
        },
        onUrgencyUpdate(e) {
            Vue.set(this.$data.form, 'urgency_id', e.id)
            Vue.set(this.$data.form, 'operation_urgency', e)
        },
        // addNewProjectOwner() {
        //     Vue.set(this.$data, 'projectOwnerModal', true)
        // },
        // submitProjectOwner(bvModalEvt) {
        //     bvModalEvt.preventDefault()
        //     post('/api/project_owners', this.projectOwnerForm).then(res => {
        //         if (res.data.saved) {
        //             this.resetProjectOwnerModal()
        //             this.$toast({
        //                 component: ToastificationContent,
        //                 props: {
        //                     title: 'Success',
        //                     icon: 'BellIcon',
        //                     text: 'Project Owner Added',
        //                     variant: 'success'
        //                 },
        //             })
        //             Vue.set(this.$data, 'projectOwnerModal', false)
        //         }
        //     }).catch(error => {
        //         if (error.response.status === 422) {
        //             this.projectOwnerError = error.response.data.errors
        //         }
        //     })
        // },
        // resetProjectOwnerModal() {
        //     this.projectOwnerForm = {
        //         name: null,
        //         email: null,
        //         password: null
        //     }
        // },
    },
}
</script>

<style scoped></style>
<style lang="scss">
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
