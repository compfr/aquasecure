<template>
    <div>
        <b-card>
            <b-row>
                <b-col>
                    <h3>Assets</h3>
                </b-col>
                <b-col cols="6">
                    <b-button @click="openSideBar('Add', 0)" class="mr-1 float-right mb-1" variant="primary">
                        <feather-icon icon="PlusIcon" size="14"/>
                        Create
                    </b-button>
                    <b-button
                        type="submit"
                        variant="primary"
                        class="mr-1 mb-1 float-right"
                        @click="importAssets"
                    >
                        Import Assets
                    </b-button>
                    <b-button

                        type="submit"
                        variant="primary"
                        class="mr-1 mb-1 float-right"
                        @click="updateAssetData"
                    >
                        Update Assets
                    </b-button>
                </b-col>
            </b-row>
            <panel ref="panel" :url-api="urlApi" :columns="columns" :resource="resource">
                <div slot="action" slot-scope="props" class="text-nowrap">
                    <!--                    <feather-icon-->
                    <!--                        :id="`user-row-${props.item.id}-eye-icon`"-->
                    <!--                        icon="EyeIcon"-->
                    <!--                        class="cursor-pointer"-->
                    <!--                        size="16"-->
                    <!--                        @click="openShowSideBar(props.item.id)"-->
                    <!--                    />-->
                    <feather-icon
                        :id="`user-row-${props.item.id}-edit-data-icon`"
                        icon="FileIcon"
                        class="cursor-pointer"
                        size="16"
                        @click="editData(props.item.id)"
                    />

                    <feather-icon v-if="props.item.projects.length < 1"
                                  :id="`user-row-${props.item.id}-delete-icon`"
                                  icon="TrashIcon"
                                  class="cursor-pointer"
                                  size="16"
                                  @click="deleteAsset(props.item.id)"
                    />

                    <!--                    <b-tooltip-->
                    <!--                        :target="`user-row-${props.item.id}-edit-icon`"-->
                    <!--                        title="Edit Asset"-->
                    <!--                        class="cursor-pointer"-->
                    <!--                    />-->
                </div>
            </panel>
        </b-card>

        <b-sidebar id="sidebar-backdrop"
                   backdrop-variant="dark" @hidden="resetFrameworkForm"
                   backdrop :title="`${formType} Assets`" right shadow width="50%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <AssetsForm v-if="showFormSideBar" :form-type="formType" :form-id="selectedAsset"
                                    @cancel="closeSideBar" @close="saveCloseSideBar"/>
                    </div>
                </template>
            </div>
        </b-sidebar>

        <b-sidebar id="sidebar-backdrop-1"
                   backdrop-variant="dark" @hidden="resetShow"
                   backdrop :title="`Assets Detail`" right shadow width="50%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <AssetsShow v-if="showSideBar" :form-id="selectedAsset"/>
                    </div>
                </template>
            </div>
        </b-sidebar>

        <b-modal
            v-model="importAssetModal"
            id="modal-prevent-closing"
            title="Import Assets"
            ok-title="Save"
            cancel-variant="outline-secondary"
            @hidden="resetImportModal"
            @ok="handleOk">

            <b-form-group label="Name">
                <b-form-input placeholder="Name" v-model="import_data.name"/>
                <error :error="import_data_error.name"/>
            </b-form-group>
            <b-form-group
                label="Asset Type"
            >
                <x-tag-input :value="import_data.asset_type" :resource="`/api/search/asset_types`"
                             column="title" name="title" @input="onAssetTypeUpdate"/>
                <error :error="import_data_error.asset_type_id"/>
            </b-form-group>
            <b-form-group label="File">
                <b-form-file
                    @input="handleFile"
                    placeholder="Choose a XLSX or CSV File "
                    drop-placeholder="Drop file here..."
                />
                <error :error="import_data_error.file"/>
            </b-form-group>
        </b-modal>

    </div>
</template>

<script>
    import Vue from 'vue';
    import {
        BCard,
        BFormInput,
        BFormFile,
        BRow,
        BCol,
        BCardText,
        BLink,
        BButton,
        BTooltip,
        BModal,
        VBModal,
        BFormGroup,
        BSidebar
    } from 'bootstrap-vue'
    import Panel from "@/components/Table/Panel";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";
    import {get, post} from '@/libs/api.js'
    import Ripple from "vue-ripple-directive";
    import TagInput from "@/components/Form/TagInput";
    import {form} from "@/libs/mixins";
    import AssetsForm from "@/tenant/views/Assets/AssetsForm";
    import AssetsShow from "@/tenant/views/Assets/AssetsShow";
    import {destroy} from "@/libs/api";
    import {objectToFormData} from "@/libs/helpers";
    import XTagInput from "@/components/Form/TagInput";
    import Error from "@/components/Form/Error";

    export default {
        components: {
            Error,
            XTagInput,
            AssetsShow,
            AssetsForm,
            BFormGroup,
            BFormInput,
            BFormFile,
            BModal,
            BCard,
            BCardText,
            BLink,
            BButton,
            BRow,
            BCol,
            BTooltip,
            Panel,
            TagInput,
            BSidebar
        },
        directives: {
            'b-modal': VBModal,
            Ripple
        },
        name: "Index",
        mixins: [form],
        data() {
            return {
                model: null,
                urlApi: "/api/assets",
                resource: "/assets",
                importAssetModal: false,
                import_data: {},
                import_data_error: {},
                selectedAsset: null,
                showSideBar: false,
                showFormSideBar: false,
                formType: 'Create',
                columns: [
                    {
                        label: 'ID',
                        field: 'id',
                    },
                    {
                        label: 'Name',
                        field: 'name',
                    },
                    {
                        label: 'Type',
                        field: 'title',
                        displayText: 'asset_type'
                    },
                    {
                        label: 'Projects',
                        field: 'name',
                        displayText: 'projects',
                        multiple: true
                    },
                    {
                        label: 'Action',
                        field: 'action',
                        action: true
                    }
                ],
            }
        },
        methods: {
            edit(id) {
                this.openSideBar('Edit', id);
                // this.$router.push(`${this.resource}/${id}/edit`)
            },
            editData(id) {
                // this.openSideBar('Edit', id);
                this.$router.push(`assets/${id}/file_edit`)
            },
            showAsset(id) {
                this.$router.push(`${this.resource}/${id}`)
            },
            deleteAsset(id) {
                this.$swal({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#4267B2",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, Delete it!"
                }).then((result) => {
                    if (result.isConfirmed) {
                        destroy(`/api/assets/${id}`, {}).then((res) => {
                            if (res.data.saved) {
                                this.$swal({
                                    title: "Deleted!",
                                    text: "Asset has been successfully Deleted.",
                                    icon: "success"
                                });
                                this.$refs.panel.update()
                            }
                        })
                    }
                });
            },
            onAssetTypeUpdate(e) {
                Vue.set(this.$data.import_data, 'asset_type', e);
                Vue.set(this.$data.import_data, 'asset_type_id', e.id);
            },
            handleOk(bvModalEvt) {
                // Prevent modal from closing
                bvModalEvt.preventDefault()
                // Trigger submit handler
                this.import_data_error = {};
                this.importAssetsData()
            },
            resetImportModal() {
                this.import_data_error = {};
                this.import_data = {}
            },
            handleFile(e) {
                Vue.set(this.$data.import_data, 'file', e)
            },
            importAssets() {
                this.import_data = {}
                this.importAssetModal = true
            },
            importAssetsData() {
                post('/api/assets-import', objectToFormData(this.import_data)).then(res => {
                    if (res.data.saved) {
                        this.resetImportModal()
                        Vue.set(this.$data, 'importAssetModal', false)
                        this.success();
                        this.$refs.panel.reload();
                        // this.reload()
                    }
                }).catch((error)=>{
                    if (error.response.status === 422) {
                        this.import_data_error = error.response.data.errors
                    }
                })
            },
            updateAssetData() {
                this.openLoading()
                get('/api/get_asset_data').then(res => {
                    if (res.data.saved) {
                        this.$refs.panel.reload();
                        this.closeLoading();
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text: 'Assets Updated Successfully',
                                variant: 'success'
                            },
                        })
                        // this.reload()
                    }
                })
            },

            openSideBar(formType, id) {
                this.formType = formType;
                this.selectedAsset = id
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showFormSideBar = true;
            },
            resetFrameworkForm() {
                this.showFormSideBar = false;
            },
            closeSideBar() {
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showFormSideBar = false;
            },
            saveCloseSideBar() {
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showFormSideBar = false;
                this.$refs.panel.update();
            },

            openShowSideBar(id) {
                this.selectedAsset = id
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop-1')
                this.showSideBar = true;
            },

            resetShow() {
                this.showSideBar = false;
            },
        },
    }
</script>

<style scoped>

</style>
