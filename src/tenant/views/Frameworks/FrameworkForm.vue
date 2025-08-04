<template>
    <div>
        <b-row>
            <b-col md="3">
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
            <b-col md="3">
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
            <b-col md="3">
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
            <b-col md="3">
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
        </b-row>
        <b-card-actions title="Domains" action-collapse v-if="formType == 'Edit'">
            <div slot="additionalHeaderBtn">
                <b-button variant="primary" @click="addDomain">Add +</b-button>
            </div>
            <template v-for="(dItem,dIndex) in form.domains">
                <b-row class="align-items-center">
                    <b-col cols="11">
                        <b-form-group
                            label="Domain"
                        >
                            <x-tag-input :value="dItem" :resource="`/api/search/domains`"
                                         column="title" name="title" @input="onDomainUpdate($event, dIndex)"/>
                        </b-form-group>
                    </b-col>
                    <b-col cols="1">
                        <b-button variant="outline-danger" @click="onRemoveDomain(dIndex, dItem.id)">
                            <feather-icon icon="TrashIcon" size="16" />
                        </b-button>
                    </b-col>
                </b-row>
                <b-card-actions title="Controls" action-collapse collapsed class="controls-card">
                    <div slot="additionalHeaderBtn">
                        <b-button variant="primary" @click="addControl(dIndex)">Add +</b-button>
                    </div>
                    <template v-for="(cItem,cIndex) in dItem.controls">
                        <b-row class="align-items-center">
                            <b-col cols="11">
                                <b-form-group
                                    label="Control"
                                >
                                    <x-tag-input :value="cItem" :resource="`/api/search/controls`"
                                                 column="title" name="title" @input="onControlUpdate($event, dIndex, cIndex)"/>
                                </b-form-group>
                            </b-col>
                            <b-col cols="1">
                                <b-button variant="outline-danger" @click="onRemoveControl(dIndex, cIndex, cItem.id)">
                                    <feather-icon icon="TrashIcon" size="16" />
                                </b-button>
                            </b-col>
                        </b-row>
                        <b-card-actions title="Sub-Controls" action-collapse collapsed class="sub-controls-card">
                            <div slot="additionalHeaderBtn">
                                <b-button variant="primary" @click="addSubControl(dIndex, cIndex)">Add +</b-button>
                            </div>
                            <template v-for="(scItem,scIndex) in cItem.sub_controls">
                                <b-row class="align-items-center">
                                    <b-col cols="11">
                                        <b-form-group
                                            label="Sub-Control"
                                        >
                                            <x-tag-input :value="scItem" :resource="`/api/search/map_sub_controls`"
                                                         column="title" name="title" @input="onSubControlUpdate($event, dIndex, cIndex, scIndex)"/>
                                        </b-form-group>
                                    </b-col>
                                    <b-col cols="1">
                                        <b-button variant="outline-danger" @click="onRemoveSubControl(dIndex, cIndex, scIndex, scItem.id)">
                                            <feather-icon icon="TrashIcon" size="16" />
                                        </b-button>
                                    </b-col>
                                </b-row>
                            </template>
                        </b-card-actions>

                    </template>
                </b-card-actions>
            </template>
        </b-card-actions>
        <b-row class="d-flex flex-end">
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
                    @click="cancelForm"
                >
                    Cancel
                </b-button>
            </b-col>
        </b-row>

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
    import {destroy, get, post} from '@/libs/api'
    import Error from "@/components/Form/Error";
    import Ripple from "vue-ripple-directive";
    import flatPickr from 'vue-flatpickr-component';
    import XTagInput from "@/components/Form/TagInput";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";
    import BCardActions from "@core/components/b-card-actions/BCardActions";

    export default {
        name: "FrameworkForm",
        props: {
            formType: String,
            formId: Number
        },
        mixins: [form],
        components: {
            BCardActions,
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
        created() {
            let urls = {
                'Add': `/api/frameworks/create`,
                'Edit': `/api/frameworks/${this.formId}/edit`
            };
            const url = urls[this.formType];
            get(url).then((res) => {
                this.setData(res);
            })
        },

        methods: {
            setData(res) {
                Vue.set(this.$data, 'form', res.data.form);

                if (this.formType === 'Edit') {
                    this.store = `/api/frameworks/${this.formId}?_method=PUT`;
                    this.title = 'Edit';
                    this.message = 'Frameworks has been updated';
                }
                this.show = true
            },
            formSubmitted() {
                this.submit(this.form, (res) => {
                    this.success()
                    this.$emit('close');
                    // this.successfull(res)
                })
            },
            successfull(res) {
                this.$router.push(`${this.resource}`)
            },
            onFrameworkTypeUpdate(e) {
                Vue.set(this.$data.form, 'framework_type', e);
                Vue.set(this.$data.form, 'framework_type_id', e.id);
            },
            onCategoryUpdate(e) {
                Vue.set(this.$data.form, 'framework_category', e);
                Vue.set(this.$data.form, 'framework_category_id', e.id);
            },

            addDomain(){
                this.form.domains.push({
                    id: null,
                    framework_id: null,
                    title:null,
                    controls: []
                })
            },

            onDomainUpdate(e,index){
                this.form.domains[index]= e;
                Vue.set(this.$data.form.domains[index], 'framework_id', this.form.id);
                Vue.set(this.$data.form.domains[index], 'controls', []);
                this.$forceUpdate();
            },

            addControl(index){
                this.form.domains[index].controls.push({
                    id: null,
                    domain_id: null,
                    title:null,
                    sub_controls: []
                })
            },

            onControlUpdate(e,dIndex, index){
                this.form.domains[dIndex].controls[index]= e;
                Vue.set(this.$data.form.domains[dIndex].controls[index], 'framework_id', this.form.id);
                Vue.set(this.$data.form.domains[dIndex].controls[index], 'domain_id', this.form.domains[dIndex].id);
                Vue.set(this.$data.form.domains[dIndex].controls[index], 'sub_controls', []);
                this.$forceUpdate();
            },

            addSubControl(dIndex, cIndex){
                this.form.domains[dIndex].controls[cIndex].sub_controls.push({
                    id: null,
                    control_id: null,
                    title:null
                })
            },
            onSubControlUpdate(e,dIndex, cIndex, index){
                this.form.domains[dIndex].controls[cIndex].sub_controls[index]= e;
                Vue.set(this.$data.form.domains[dIndex].controls[cIndex].sub_controls[index], 'framework_id', this.form.id);
                Vue.set(this.$data.form.domains[dIndex].controls[cIndex].sub_controls[index], 'domain_id', this.form.domains[dIndex].id);
                Vue.set(this.$data.form.domains[dIndex].controls[cIndex].sub_controls[index], 'control_id', this.form.domains[dIndex].controls[cIndex].id);
                this.$forceUpdate();
            },

            onRemoveSubControl(dIndex, cIndex, index, id){
                if(id == null){
                    this.form.domains[dIndex].controls[cIndex].sub_controls.splice(index, 1);
                }else {
                    this.$swal({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#4267B2",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, Remove it!"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            post(`/api/remove_sub_control/${id}`, {}).then((res) => {
                                if (res.data.saved) {
                                    this.$swal({
                                        title: "Removed!",
                                        text: "Sub Control has been successfully Removed.",
                                        icon: "success"
                                    });
                                    this.form.domains[dIndex].controls[cIndex].sub_controls.splice(index, 1);
                                }
                            })
                        }
                    });
                }
            },

            onRemoveControl(dIndex, index, id){
                if(id == null){
                    this.form.domains[dIndex].controls.splice(index, 1);
                }else {
                    this.$swal({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#4267B2",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, Remove it!"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            post(`/api/remove_control/${id}`, {}).then((res) => {
                                if (res.data.saved) {
                                    this.$swal({
                                        title: "Removed!",
                                        text: "Control has been successfully Removed.",
                                        icon: "success"
                                    });
                                    this.form.domains[dIndex].controls.splice(index, 1);
                                }
                            })
                        }
                    });
                }
            },

            onRemoveDomain(index, id){
                if(id == null){
                    this.form.domains.splice(index, 1);
                }else{
                    this.$swal({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#4267B2",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, Remove it!"
                    }).then((result) => {
                        if(result.isConfirmed){
                            post(`/api/remove_domain/${id}`, {}).then((res) => {
                                if (res.data.saved) {
                                    this.$swal({
                                        title: "Removed!",
                                        text: "Domain has been successfully Removed.",
                                        icon: "success"
                                    });
                                    this.form.domains.splice(index, 1);
                                }
                            })
                        }
                    });
                }
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
            },
            cancelForm(){
                this.$emit('cancel');
            }
        },

    }
</script>

<style scoped>
</style>
<style lang="scss">
    @import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
<style lang="scss">
    .controls-card{
        .card {
            background-color: #d6d9e4 !important;
        }
    }

    .sub-controls-card{
        .card {
            background-color: #bec1cc !important;
        }
    }
</style>
