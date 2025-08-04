<template>
    <div v-if="show">
        <b-card :title="$route.meta.mode && $route.meta.mode === 'edit' ? 'Edit Project' : 'Add New Project'">
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
                    <div class="position-top-0 position-right-0 position-absolute px-1" @click="addNewProjectOwner">
                        <small>Add New</small>
                    </div>
                    <b-form-group
                        label="Project Owners"
                    >
                        <x-tag-input :positionRelative="true" :removable="true" keyIndex="user_id"
                                     :multiple="true" :value="form.project_owners" relation="user"
                                     :resource="`/api/search/users`" column="title" name="name" @input="onProjectOwnerUpdate"/>
                        <error :error="error.project_owners"/>
                    </b-form-group>
                </b-col>
                <template v-if="$route.meta.mode === 'edit'">
                    <b-col cols="12">
                        <b-form-group label="Selected Frameworks">
                            <template v-if="form.frameworks.length > 0">
                                <b-badge class="mr-1" v-for="(item,index) in form.frameworks" :key="index">
                                    {{ item.framework.name }}
                                </b-badge>
                            </template>
                            <template v-else>
                                <b-badge>No Frameworks</b-badge>
                            </template>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12">
                        <b-form-group
                            label="Frameworks"
                        >
                            <x-tag-input :positionRelative="true" :removable="true" keyIndex="framework_id"
                                         :multiple="true" :value="form.edit_frameworks" relation="framework"
                                         :resource="`/api/search/frameworks?selected_frameworks=`+form.selected_framework_id" column="title" name="title"
                                         @input="onEditFrameworksUpdate">
                            </x-tag-input>
                            <error :error="error.frameworks"/>
                        </b-form-group>
                    </b-col>
                </template>
                <template v-else>
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
                </template>
                <template v-if="$route.meta.mode === 'edit'">
                    <b-col cols="12">
                        <b-form-group label="Selected Policy">
                            <template v-if="form.policies.length > 0">
                                <b-badge class="mr-1" v-for="(item,index) in form.policies" :key="index">
                                    {{ item.policy.name }}
                                </b-badge>
                            </template>
                            <template v-else>
                                <b-badge>No Policies</b-badge>
                            </template>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12">
                        <b-form-group
                            label="Policies"
                        >
                            <x-tag-input :positionRelative="true" :removable="true" keyIndex="policy_id"
                                         :multiple="true" :value="form.edit_policies" relation="policy"
                                         :resource="`/api/search/policies?selected_policies=`+form.selected_policy_id" column="title" name="title"
                                         @input="onEditPolicyUpdate">
                            </x-tag-input>
                            <error :error="error.policies"/>
                        </b-form-group>
                    </b-col>
                </template>
                <b-col cols="12" v-else>
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
            <b-row>
                <b-col>
                    <b-button

                        type="submit"
                        variant="primary"
                        class="mr-1"
                        @click="formSubmitted"
                    >
                        Submit
                    </b-button>
                    <b-button
                        v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                        type="reset"
                        variant="outline-secondary"
                        :to="{path:'/projects'}"
                    >
                        Cancel
                    </b-button>
                </b-col>
            </b-row>
        </b-card>
        <b-modal
            v-model="projectOwnerModal"
            id="modal-project-owner"
            title="Add New User"
            ok-title="Submit"
            cancel-variant="outline-secondary"
            @hidden="resetProjectOwnerModal"
            @ok="submitProjectOwner">

            <b-form-group
                label="Name"
            >
                <b-form-input
                    placeholder="Name"
                    v-model="projectOwnerForm.name"
                />
                <error :error="projectOwnerError.name"/>
            </b-form-group>

            <b-form-group
                label="Email"
            >
                <b-form-input
                    placeholder="Email"
                    v-model="projectOwnerForm.email"
                />
                <error :error="projectOwnerError.email"/>
            </b-form-group>

            <b-form-group
                label="Roles"
            >
                <x-tag-input :positionRelative="true" :removable="true" :multiple="true"
                             :value="projectOwnerForm.roles" keyIndex="id"
                             :resource="`/api/get_roles`" column="title" name="name"
                             @input="onRolesUpdate">
                </x-tag-input>
                <error :error="projectOwnerError.roles"/>
            </b-form-group>
        </b-modal>
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
        BModal,BBadge,
    } from 'bootstrap-vue'
    import {form} from "@/libs/mixins";
    import {get, post} from '@/libs/api'
    import Error from "@/components/Form/Error";
    import Ripple from "vue-ripple-directive";
    import flatPickr from 'vue-flatpickr-component';
    import XTagInput from "@/components/Form/TagInput";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";

    function initialize(to) {
        let urls = {
            'add': `/api/projects/create`,
            'edit': `/api/projects/${to.params.id}/edit`
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
            BModal,
            BBadge
        },
        directives: {
            Ripple
        },
        data() {
            return {
                show: false,
                resource: '/projects',
                store: '/api/projects',
                method: 'POST',
                title: 'Add',
                message: 'New Project Added',
                permissions: [],
                projectOwnerModal: false,
                projectOwnerForm: {
                    name: null,
                    email: null,
                    roles: []
                },
                projectOwnerError: {}
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
                    this.store = `/api/projects/${this.$route.params.id}?_method=PUT`;
                    this.title = 'Edit';
                    this.message = 'Projects has been updated';
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
            updateRecords() {
                Vue.set(this.$data.form, 'framework_id', null)
                Vue.set(this.$data.form, 'framework', null)
                Vue.set(this.$data.form, 'policy_id', null)
                Vue.set(this.$data.form, 'policy', null)
                Vue.set(this.$data.form, 'project_owner_id', null)
                Vue.set(this.$data.form, 'project_owner', null)
            },
            onFrameworksUpdate(e) {
                Vue.set(this.$data.form, 'frameworks', e);
            },
            onEditFrameworksUpdate(e) {
                Vue.set(this.$data.form, 'edit_frameworks', e);
            },
            onPolicyUpdate(e) {
                Vue.set(this.$data.form, 'policies', e);
            },
            onEditPolicyUpdate(e) {
                Vue.set(this.$data.form, 'edit_policies', e);
            },
            onProjectOwnerUpdate(e) {
                Vue.set(this.$data.form, 'project_owners', e)
            },
            addNewProjectOwner() {
                Vue.set(this.$data, 'projectOwnerModal', true)
            },
            onRolesUpdate(e) {
                Vue.set(this.$data.form, 'roles', e)
            },
            submitProjectOwner(bvModalEvt) {
                bvModalEvt.preventDefault()
                post('/api/add_users', this.projectOwnerForm).then(res => {
                    if (res.data.saved) {
                        this.resetProjectOwnerModal()
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text: 'User Added',
                                variant: 'success'
                            },
                        })
                        Vue.set(this.$data, 'projectOwnerModal', false)
                    }
                }).catch(error => {
                    if (error.response.status === 422) {
                        this.projectOwnerError = error.response.data.errors
                    }
                })
            },
            resetProjectOwnerModal() {
                this.projectOwnerForm = {
                    name: null,
                    email: null,
                    roles: []
                }
            },
        },
    }
</script>

<style scoped>

</style>
<style lang="scss">
    @import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
