<template>
    <div>
        <b-row>
            <b-col md="4">
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
                    label="Policy Content"
                >
                    <b-form-textarea
                        v-model="form.policy_content"
                    />
                    <error :error="error.policy_content"/>
                </b-form-group>
            </b-col>

        </b-row>
        <b-card-actions title="Sub-Controls" action-collapse collapsed class="sub-controls-card" v-if="formType == 'Edit'">
            <div slot="additionalHeaderBtn">
                <b-button variant="primary" @click="addSubControl()">Add +</b-button>
            </div>
            <template v-for="(scItem,scIndex) in form.sub_controls">
                <b-row class="align-items-center">
                    <b-col cols="11">
                        <b-form-group
                            label="Sub-Control"
                        >
                            <x-tag-input :value="scItem" :resource="`/api/search/map_sub_controls`"
                                         column="title" name="title" @input="onSubControlUpdate($event,scIndex)"/>
                        </b-form-group>
                    </b-col>
                    <b-col cols="1">
                        <b-button variant="outline-danger" @click="onRemoveSubControl(scIndex, scItem.id)">
                            <feather-icon icon="TrashIcon" size="16" />
                        </b-button>
                    </b-col>
                </b-row>
            </template>
        </b-card-actions>

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
                    @click="cancelForm"
                >
                    Cancel
                </b-button>
            </b-col>
        </b-row>
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
    import BCardActions from "@core/components/b-card-actions/BCardActions";

    export default {
        name: "PolicyForm",
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
                resource: '/policies',
                store: '/api/policies',
                method: 'POST',
                title: 'Add',
                message: 'New Policy Added',
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
        created() {

            let urls = {
                'Add': `/api/policies/create`,
                'Edit': `/api/policies/${this.formId}/edit`
            };
            const url = urls[this.formType];

            console.log(this.formType);

            get(url).then((res) => {
                this.setData(res);
            })
        },

        methods: {
            setData(res) {
                Vue.set(this.$data, 'form', res.data.form);

                if (this.formType === 'Edit') {
                    this.store = `/api/policies/${this.formId}?_method=PUT`;
                    this.title = 'Edit';
                    this.message = 'Policy has been updated';
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
            // successfull(res) {
            //     this.$router.push(`${this.resource}`)
            // },
            onSubControlsUpdate(e) {
                Vue.set(this.$data.form, 'sub_controls', e);
            },
            cancelForm(){
                this.$emit('cancel');
            },
            addSubControl(){
                this.form.sub_controls.push({
                    id: null,
                    policy_id: this.formId,
                    title:null
                })
            },
            onSubControlUpdate(e,index){
                this.form.sub_controls[index]= e;
                Vue.set(this.$data.form.sub_controls[index], 'policy_id', this.form.id);
                this.$forceUpdate();
            },

            onRemoveSubControl(index, id){
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
                        post(`/api/remove_sub_control/${id}`, {}).then((res) => {
                            if (res.data.saved) {
                                this.$swal({
                                    title: "Removed!",
                                    text: "Sub-Control has been successfully Removed.",
                                    icon: "success"
                                });
                                this.form.sub_controls.splice(index, 1);
                            }
                        })
                    }
                });
            },

        },

    }
</script>

<style scoped>
</style>
<style lang="scss">
    @import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
<style lang="scss">
    .sub-controls-card{
        .card {
            background-color: #bec1cc !important;
        }
    }
</style>
