<template>
    <div v-if="show">
        <b-card :title="$route.meta.mode && $route.meta.mode === 'edit' ? 'Edit Framework' : 'Add New Framework'">
            <b-row>
                <b-col md="12">
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
                <b-col md="4">
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
                <b-col md="4">
                    <div class="position-top-0 position-right-0 position-absolute px-1" @click="addNewFrameworkType">
                        <small>Add New</small>
                    </div>
                    <b-form-group
                        label="Framework Type"
                    >
                        <x-tag-input :value="form.framework_type" :resource="`/api/search/framework_types`"
                                     column="title" name="title" @input="onFrameworkTypeUpdate"/>
                        <error :error="error.framework_type_id"/>
                    </b-form-group>
                </b-col>
                <b-col md="4">
                    <div class="position-top-0 position-right-0 position-absolute px-1" @click="addNewCategory">
                        <small>Add New</small>
                    </div>
                    <b-form-group
                        label="Category"
                    >
                        <x-tag-input :value="form.framework_category" :resource="`/api/search/framework_categories`"
                                     column="title" name="title" @input="onCategoryUpdate"/>
                        <error :error="error.framework_category_id"/>
                    </b-form-group>
                </b-col>
                <b-col md="6">
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
                        label="Domains"
                    >
                        <x-tag-input :positionRelative="true" :removable="true" keyIndex="domain_id"
                                     :multiple="true" :value="form.domains" relation="domain"
                                     :resource="`/api/search/domains`" column="title" name="title"
                                     @input="onDomainsUpdate">
                        </x-tag-input>
                        <error :error="error.domains"/>
                    </b-form-group>
                </b-col>
                <b-col cols="12">
                    <b-form-group
                        label="Controls"
                    >
                        <x-tag-input :positionRelative="true" :removable="true" keyIndex="control_id"
                                     :multiple="true" :value="form.controls" relation="control"
                                     :resource="`/api/search/controls`" column="title" name="title"
                                     @input="onControlsUpdate">
                        </x-tag-input>
                        <error :error="error.controls"/>
                    </b-form-group>
                </b-col>
                <b-col cols="12">
                    <b-form-group
                        label="Sub-Controls"
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
                        :to="{path:'/frameworks'}"
                    >
                        Cancel
                    </b-button>
                </b-col>
            </b-row>
        </b-card>
        <b-modal
            v-model="frameworkTypeModal"
            id="modal-framework-type"
            title="Add New Framework Type"
            ok-title="Submit"
            cancel-variant="outline-secondary"
            @hidden="resetFrameworkTypeModal"
            @ok="submitFrameworkType">

            <b-form-group
                label="Title"
            >
                <b-form-input
                    placeholder="Title"
                    v-model="frameworkTypeForm.title"
                />
                <error :error="frameworkTypeError.title"/>
            </b-form-group>
        </b-modal>

        <b-modal
            v-model="categoryModal"
            id="modal-category"
            title="Add New Category"
            ok-title="Submit"
            cancel-variant="outline-secondary"
            @hidden="resetCategoryModal"
            @ok="submitCategory">

            <b-form-group
                label="Title"
            >
                <b-form-input
                    placeholder="Title"
                    v-model="categoryForm.title"
                />
                <error :error="categoryError.title"/>
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
        BFormCheckboxGroup,
        BButton,
        BFormTextarea, BModal, VBModal
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
            'add': `/api/frameworks/create`,
            'edit': `/api/frameworks/${to.params.id}/edit`
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
            BButton, BFormTextarea, flatPickr, BModal
        },
        directives: {
            'b-modal': VBModal,
            Ripple
        },
        data() {
            return {
                show: false,
                resource: '/frameworks',
                store: '/api/frameworks',
                method: 'POST',
                title: 'Add',
                message: 'New Framework Added',
                permissions: [],
                frameworkTypeModal: false,
                frameworkTypeForm: {
                    title: null
                },
                frameworkTypeError: {},
                categoryModal: false,
                categoryForm: {
                    title: null
                },
                categoryError: {}
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
                    this.store = `/api/frameworks/${this.$route.params.id}?_method=PUT`;
                    this.title = 'Edit';
                    this.message = 'Frameworks has been updated';
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
            onDomainsUpdate(e) {
                Vue.set(this.$data.form, 'domains', e);
            },
            onControlsUpdate(e) {
                Vue.set(this.$data.form, 'controls', e);
            },
            onSubControlsUpdate(e) {
                Vue.set(this.$data.form, 'sub_controls', e);
            },
            onFrameworkTypeUpdate(e) {
                Vue.set(this.$data.form, 'framework_type', e);
                Vue.set(this.$data.form, 'framework_type_id', e.id);
            },
            onCategoryUpdate(e) {
                Vue.set(this.$data.form, 'framework_category', e);
                Vue.set(this.$data.form, 'framework_category_id', e.id);
            },
            addNewFrameworkType() {
                Vue.set(this.$data, 'frameworkTypeModal', true)
            },
            submitFrameworkType(bvModalEvt) {
                bvModalEvt.preventDefault()
                post('/api/framework_types', this.frameworkTypeForm).then(res => {
                    if (res.data.saved) {
                        this.resetFrameworkTypeModal()
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text: 'Framework Type Added',
                                variant: 'success'
                            },
                        })
                        Vue.set(this.$data, 'frameworkTypeModal', false)
                    }
                }).catch(error => {
                    if (error.response.status === 422) {
                        this.frameworkTypeError = error.response.data.errors
                    }
                })

            },
            resetFrameworkTypeModal() {
                this.frameworkTypeForm = {
                    title: null
                }
            },

            addNewCategory() {
                Vue.set(this.$data, 'categoryModal', true)
            },
            submitCategory(bvModalEvt) {
                bvModalEvt.preventDefault()
                post('/api/framework_categories', this.categoryForm).then(res => {
                    if (res.data.saved) {
                        this.resetCategoryModal()
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text: 'Category Type Added',
                                variant: 'success'
                            },
                        })
                        Vue.set(this.$data, 'categoryModal', false)
                    }
                }).catch(error => {
                    if (error.response.status === 422) {
                        this.categoryError = error.response.data.errors
                    }
                })

            },
            resetCategoryModal() {
                this.categoryForm = {
                    title: null
                }
            }
        },
    }
</script>

<style scoped>

</style>
<style lang="scss">
    @import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
