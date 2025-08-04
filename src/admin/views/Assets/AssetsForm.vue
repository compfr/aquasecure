<template>
    <div>
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
                <div class="position-top-0 position-right-0 position-absolute px-1" @click="addNewAssetType">
                    <small>Add New</small>
                </div>
                <b-form-group
                    label="Asset Type"
                >
                    <x-tag-input :value="form.asset_type" :resource="`/api/search/asset_types`"
                                 column="title" name="title" @input="onAssetTypeUpdate"/>
                    <error :error="error.asset_type_id"/>
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
                    @click="cancelForm"
                >
                    Cancel
                </b-button>
            </b-col>
        </b-row>
        <b-modal
            v-model="assetTypeModal"
            id="modal-asset-type"
            title="Add New Asset Type"
            ok-title="Submit"
            cancel-variant="outline-secondary"
            @hidden="resetAssetTypeModal"
            @ok="submitAssetType">

            <b-form-group
                label="Title"
            >
                <b-form-input
                    placeholder="Title"
                    v-model="assetTypeForm.title"
                />
                <error :error="assetTypeError.title"/>
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
    import XTagInput from "@/components/Form/TagInput";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";

    export default {
        name: "AssetsForm",
        props: {
            formType: String,
            formId: Number
        },
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
            BButton, BFormTextarea, BModal
        },
        directives: {
            'b-modal': VBModal,
            Ripple
        },
        data() {
            return {
                show: false,
                resource: '/assets',
                store: '/api/assets',
                method: 'POST',
                title: 'Add',
                message: 'New Asset Added',
                permissions: [],
                assetTypeModal: false,
                assetTypeForm: {
                    title: null
                },
                assetTypeError: {},
            }
        },
        created() {

            let urls = {
                'Add': `/api/assets/create`,
                'Edit': `/api/assets/${this.formId}/edit`
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
                    this.store = `/api/assets/${this.formId}?_method=PUT`;
                    this.title = 'Edit';
                    this.message = 'Asset has been updated';
                }
                this.show = true
            },
            formSubmitted() {
                this.submit(this.form, (res) => {
                    this.success()
                    this.$emit('close');
                })
            },

            cancelForm(){
                this.$emit('cancel');
            },
            onAssetTypeUpdate(e) {
                Vue.set(this.$data.form, 'asset_type', e);
                Vue.set(this.$data.form, 'asset_type_id', e.id);
            },
            addNewAssetType() {
                Vue.set(this.$data, 'assetTypeModal', true)
            },
            submitAssetType(bvModalEvt) {
                bvModalEvt.preventDefault()
                post('/api/asset_types', this.assetTypeForm).then(res => {
                    if (res.data.saved) {
                        this.resetAssetTypeModal()
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text: 'Framework Type Added',
                                variant: 'success'
                            },
                        })
                        Vue.set(this.$data, 'assetTypeModal', false)
                    }
                }).catch(error => {
                    if (error.response.status === 422) {
                        this.assetTypeError = error.response.data.errors
                    }
                })

            },
            resetAssetTypeModal() {
                this.assetTypeForm = {
                    title: null
                }
            },
        },

    }
</script>

<style scoped>
</style>
