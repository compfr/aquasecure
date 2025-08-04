<template>
    <div v-if="show">
        <b-card :title="$route.meta.mode && $route.meta.mode === 'edit' ? 'Edit Policy' : 'Add New Policy'">
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
                        label="Reference Code"
                    >
                        <b-form-input
                            placeholder="Reference Code"
                            v-model="form.reference_code"
                        />
                        <error :error="error.reference_code"/>
                    </b-form-group>
                </b-col>
<!--                <b-col md="6">-->
<!--                    <div class="position-top-0 position-right-0 position-absolute px-1" @click="addNewPolicyCategory">-->
<!--                        <small>Add New</small>-->
<!--                    </div>-->
<!--                    <b-form-group-->
<!--                        label="Category"-->
<!--                    >-->
<!--                        <x-tag-input :value="form.policy_category" :resource="`/api/search/policy_categories`"-->
<!--                                     column="title" name="title" @input="onPolicyCategoryUpdate"/>-->
<!--                        <error :error="error.policy_category_id"/>-->
<!--                    </b-form-group>-->
<!--                </b-col>-->
                <b-col md="12">
                    <b-form-group
                        label="Description"
                    >
                        <b-form-textarea
                            v-model="form.desc"
                        />
                        <error :error="error.desc"/>
                    </b-form-group>
                </b-col>
                <b-col md="6">
                    <b-form-group
                        label="Policy Content"
                    >
                        <b-form-textarea
                            v-model="form.policy_content"
                        />
                        <error :error="error.policy_content"/>
                    </b-form-group>
                </b-col>
                <b-col md="6">
                    <b-form-group
                        label="Release Date"
                    >
                        <flat-pickr
                            v-model="form.release_date"
                            class="form-control"
                            :config="{ enableTime: false, noCalendar: false, dateFormat: 'Y-m-d',}"
                        />
                        <error :error="error.release_date"/>
                    </b-form-group>
                </b-col>
                <b-col cols="12">
                    <b-form-group
                        label="Sub Controls"
                    >
                        <x-tag-input :positionRelative="true" :removable="true" keyIndex="sub_control_id"
                                     :multiple="true" :value="form.sub_controls" relation="sub_control"
                                     :resource="`/api/search/sub_controls`" column="title" name="title"
                                     @input="onSubControlsUpdate">
                        </x-tag-input>
                        <error :error="error.sub_controls"/>
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
                        :to="{path:'/policies'}"
                    >
                        Cancel
                    </b-button>
                </b-col>
            </b-row>
        </b-card>
<!--        <b-modal-->
<!--            v-model="policyCategoryModal"-->
<!--            id="modal-policy-category"-->
<!--            title="Add New Policy Category"-->
<!--            ok-title="Submit"-->
<!--            cancel-variant="outline-secondary"-->
<!--            @hidden="resetPolicyCategoryModal"-->
<!--            @ok="submitPolicyCategory">-->

<!--            <b-form-group-->
<!--                label="Title"-->
<!--            >-->
<!--                <b-form-input-->
<!--                    placeholder="Title"-->
<!--                    v-model="policyCategoryForm.title"-->
<!--                />-->
<!--                <error :error="policyCategoryError.title"/>-->
<!--            </b-form-group>-->
<!--        </b-modal>-->
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
        BFormCheckboxGroup,
        BButton,
        BFormTextarea
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
            'add': `/api/policies/create`,
            'edit': `/api/policies/${to.params.id}/edit`
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
            BFormCheckboxGroup,
            BButton, BFormTextarea, flatPickr
        },
        directives: {
            Ripple
        },
        data() {
            return {
                show: false,
                resource: '/policies',
                store: '/api/policies',
                method: 'POST',
                title: 'Add',
                message: 'New Policy Added',
                permissions: [],
                // policyCategoryModal: false,
                // policyCategoryForm: {
                //     title: null
                // },
                // policyCategoryError: {},
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
                    this.store = `/api/policies/${this.$route.params.id}?_method=PUT`;
                    this.title = 'Edit';
                    this.message = 'Policies has been updated';
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
            onSubControlsUpdate(e) {
                Vue.set(this.$data.form, 'sub_controls', e);
            },

            // onPolicyCategoryUpdate(e) {
            //     Vue.set(this.$data.form, 'policy_category', e);
            //     Vue.set(this.$data.form, 'policy_category_id', e.id);
            // },
            //
            // addNewPolicyCategory() {
            //     Vue.set(this.$data, 'policyCategoryModal', true)
            // },
            //
            // submitPolicyCategory(bvModalEvt) {
            //     bvModalEvt.preventDefault()
            //     post('/api/policy_categories', this.policyCategoryForm).then(res => {
            //         if (res.data.saved) {
            //             this.resetPolicyCategoryModal()
            //             this.$toast({
            //                 component: ToastificationContent,
            //                 props: {
            //                     title: 'Success',
            //                     icon: 'BellIcon',
            //                     text: 'Policy Category Added',
            //                     variant: 'success'
            //                 },
            //             })
            //             Vue.set(this.$data, 'policyCategoryModal', false)
            //         }
            //     }).catch(error => {
            //         if (error.response.status === 422) {
            //             this.policyCategoryError = error.response.data.errors
            //         }
            //     })
            //
            // },
            //
            // resetPolicyCategoryModal() {
            //     this.policyCategoryForm = {
            //         title: null
            //     }
            // },

        },
    }
</script>

<style scoped>

</style>
<style lang="scss">
    @import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
