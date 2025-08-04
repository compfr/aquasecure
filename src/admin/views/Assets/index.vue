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
                </b-col>
            </b-row>
            <panel ref="panel" :url-api="urlApi" :columns="columns" :resource="resource">
                <div slot="action" slot-scope="props" class="text-nowrap">
                    <feather-icon
                        :id="`user-row-${props.item.id}-eye-icon`"
                        icon="EyeIcon"
                        class="cursor-pointer"
                        size="16"
                        @click="openShowSideBar(props.item.id)"
                    />

                    <feather-icon
                        :id="`user-row-${props.item.id}-edit-icon`"
                        icon="EditIcon"
                        class="cursor-pointer"
                        size="16"
                        @click="edit(props.item.id)"
                    />
                    <feather-icon
                        :id="`user-row-${props.item.id}-edit-data-icon`"
                        icon="FileIcon"
                        class="cursor-pointer"
                        size="16"
                        @click="editData(props.item.id)"
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
                        <AssetsShow v-if="showSideBar" :form-id="selectedAsset" />
                    </div>
                </template>
            </div>
        </b-sidebar>

    </div>
</template>

<script>
    import Vue from 'vue'
    import {BCard, BRow, BCol, BCardText, BLink, BButton, BTooltip,BModal,VBModal,BFormGroup, BSidebar} from 'bootstrap-vue'
    import Panel from "@/components/Table/Panel";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";
    import {get,post} from '@/libs/api.js'
    import Ripple from "vue-ripple-directive";
    import TagInput from "@/components/Form/TagInput";
    import {form} from "@/libs/mixins";
    import AssetsForm from "@/admin/views/Assets/AssetsForm";
    import AssetsShow from "@/admin/views/Assets/AssetsShow";

    export default {
        components: {
            AssetsShow,
            AssetsForm,
            BFormGroup,
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
        mixins:[form],
        data() {
            return {
                model: null,
                urlApi: "/api/assets",
                resource: "/assets",
                selectedAsset:null,
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
                        label: 'Action',
                        field: 'action',
                        action: true
                    }
                ],
            }
        },
        methods: {
            edit(id){
                this.openSideBar('Edit', id);
                // this.$router.push(`${this.resource}/${id}/edit`)
            },
            editData(id){
                // this.openSideBar('Edit', id);
                this.$router.push(`assets/${id}/file_edit`)
            },
            showAsset(id){
                this.$router.push(`${this.resource}/${id}`)
            },
            deleteAsset(id){
                console.log(id)
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
            closeSideBar(){
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showFormSideBar = false;
            },
            saveCloseSideBar(){
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
