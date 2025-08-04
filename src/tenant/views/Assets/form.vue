<template>
    <div v-if="show">
        <b-card :title="$route.meta.mode && $route.meta.mode === 'edit' ? 'Edit Asset' : 'Add New Asset'">
            <b-row>
                <b-col md="4" v-if="form.assets.length < 1">
                    <b-button

                        type="submit"
                        variant="primary"
                        class="mt-2"
                        @click="addAsset"
                    >
                        Add Assets
                    </b-button>
                </b-col>
                <b-col md="12">
                    <hr/>
                </b-col>
                <template v-if="form.assets.length > 0">
                    <b-col md="6">
                        <h3>Assets</h3>
                    </b-col>
                    <b-col md="6">
                        <b-button

                            type="submit"
                            variant="primary"
                            class="mr-1 float-right"
                            @click="addAsset"
                        >
                            Add New +
                        </b-button>
                    </b-col>
                    <template v-for="(item, index) in form.assets">
                        <b-col :key="index" col="12">
                            <b-row>
                                <b-col md="3">
                                    <b-form-group label="Name">
                                        <b-form-input placeholder="Name" v-model="item.name"/>
                                        <error :error="error[`assets.${index}.name`]"/>
                                    </b-form-group>
                                </b-col>
                                <b-col md="3">
                                    <b-form-group label="Value">
                                        <b-form-input placeholder="Value" v-model="item.value"/>
                                        <error :error="error[`assets.${index}.value`]"/>
                                    </b-form-group>
                                </b-col>
                                <b-col md="4">
                                    <div class="position-top-0 position-right-0 position-absolute px-1"
                                         @click="addNewAssetType">
                                        <small>Add New</small>
                                    </div>
                                    <b-form-group
                                        label="Asset Type"
                                    >
                                        <x-tag-input :value="item.asset_type"
                                                     :resource="`/api/search/asset_types`"
                                                     column="title" name="title"
                                                     @input="onAssetTypeUpdate($event,index)"/>
                                        <error :error="error.assetTypeError"/>
                                    </b-form-group>
                                </b-col>
                                <b-col md="2">
                                    <b-button

                                        type="submit"
                                        variant="outline-danger"
                                        class="mr-1 mt-2 float-right"
                                        @click="deleteAsset(index)"
                                    >
                                        <feather-icon icon="TrashIcon"/>
                                    </b-button>
                                </b-col>
                            </b-row>
                        </b-col>
                        <b-col md="12">
                            <hr/>
                        </b-col>
                    </template>
                </template>
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
                        :to="{ path: '/assets' }"
                    >
                        Cancel
                    </b-button>
                </b-col>
            </b-row>
        </b-card>

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
        BFormCheckbox,
        BButton,
        BFormTextarea,
        BFormSelect,
        BModal
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
            'add': `/api/assets/create`,
            'edit': `/api/assets/edit`
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
                assetTypeError: {}
            }
        },
        created() {
            get(initialize(this.$route)).then((res) => {
                this.setData(res);
            });
        },

        methods: {
            setData(res) {
                Vue.set(this.$data, 'form', res.data.form);

                if (this.$route.meta.mode === 'edit') {
                    // this.store = `/api/assets?_method=PUT`;
                    this.title = 'Edit';
                    this.message = 'Assets has been updated';
                }
                this.show = true
            },
            formSubmitted() {
                this.submit(this.form, (res) => {
                    this.success()
                    this.successfull(res)
                })
            },
            addAsset() {
                this.form.assets.push({
                    "name": null,
                    "value": null,
                    "assets_type": null
                });
            },
            deleteAsset(index) {
                this.form.assets.splice(index, 1)
            },
            successfull(res) {
                this.$router.push(`${this.resource}`)
            },
            addNewAssetType() {
                Vue.set(this.$data, 'assetTypeModal', true)
            },
            submitAssetType(bvModalEvt) {
                bvModalEvt.preventDefault()
                post('/api/assets-type', this.assetTypeForm).then(res => {
                    if (res.data.saved) {
                        this.resetAssetTypeModal()
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text: 'Asset Type Added',
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
            onAssetTypeUpdate(e, index) {
                Vue.set(this.$data.form.assets[index], 'asset_type', e);
                Vue.set(this.$data.form.assets[index], 'asset_type_id', e.id);
            },
        },
    }
</script>

<style scoped>

</style>
<style lang="scss">
    @import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
