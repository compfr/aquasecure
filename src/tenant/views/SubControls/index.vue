<template>
    <div>
        <b-card title="Search Sub Controls">
            <b-row>
                <b-col md="6">
                    <b-form-group
                        label="Search"
                    >
                        <b-form-input
                            placeholder="Search"
                            v-model="additionalParams.q"
                        />
                    </b-form-group>
                </b-col>
                <b-col md="2">
                    <b-button

                        type="submit"
                        variant="primary"
                        class="mr-1 mt-2"
                        @click="searchControls"
                    >
                        Search
                    </b-button>
                </b-col>
            </b-row>
        </b-card>
        <b-card>
            <b-row>
                <b-col>
                    <h3>Sub Controls</h3>
                </b-col>
                <b-col md="6">
                    <!--                    <b-button-->
                    <!--                          -->
                    <!--                        type="submit"-->
                    <!--                        variant="primary"-->
                    <!--                        class="mr-1 mb-1 float-right"-->
                    <!--                        :to="{name:'create-sub_controls'}"-->
                    <!--                    >-->
                    <!--                        Create-->
                    <!--                    </b-button>-->
                    <b-button @click="openSideBar('Add', 0)" class="mr-1 float-right mb-1" variant="primary">
                        <feather-icon icon="PlusIcon" size="14"/>
                        Create
                    </b-button>
                </b-col>
            </b-row>
            <panel ref="panel" :url-api="urlApi" :columns="columns" :resource="resource"
                   :additional-params="additionalParams">
                <div slot="action" slot-scope="props" class="text-nowrap">
                    <feather-icon
                        :id="`user-row-${props.item.id}-eye-icon`"
                        icon="EyeIcon"
                        class="cursor-pointer"
                        size="16"
                        @click="openShowSideBar(props.item.id)"
                    />
                    <!--                    <b-tooltip-->
                    <!--                        :target="`user-row-${props.item.id}-eye-icon`"-->
                    <!--                        title="Show Control"-->
                    <!--                        class="cursor-pointer"-->
                    <!--                    />-->
                    <feather-icon v-if="props.item.can_edit == 1"
                        :id="`user-row-${props.item.id}-edit-icon`"
                        icon="EditIcon"
                        class="cursor-pointer"
                        size="16"
                        @click="edit(props.item.id)"
                    />
                    <!--                    <b-tooltip-->
                    <!--                        :target="`user-row-${props.item.id}-edit-icon`"-->
                    <!--                        title="Edit Control"-->
                    <!--                        class="cursor-pointer"-->
                    <!--                    />-->

                </div>
            </panel>
        </b-card>

        <b-sidebar id="sidebar-backdrop"
                   backdrop-variant="dark" @hidden="resetSubControlForm"
                   backdrop :title="`${formType} SubControl`" right shadow width="50%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <SubControlForm v-if="showFormSideBar" :form-type="formType" :form-id="selectedSubControl"
                                        @cancel="closeSideBar" @close="saveCloseSideBar"/>
                    </div>
                </template>
            </div>
        </b-sidebar>

        <b-sidebar id="sidebar-backdrop-1"
                   backdrop-variant="dark" @hidden="resetShow"
                   backdrop :title="`Sub-Control Detail`" right shadow width="50%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <ShowSubControl v-if="showSideBar" :form-id="selectedSubControl" />
                    </div>
                </template>
            </div>
        </b-sidebar>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {
        BCard,
        BRow,
        BCol,
        BCardText,
        BLink,
        BButton,
        BTooltip,
        BModal,
        VBModal,
        BFormGroup,
        BFormInput, BBadge, BFormFile
    } from 'bootstrap-vue'
    import Panel from "@/components/Table/Panel";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";
    import {get, post} from '@/libs/api.js'
    import Ripple from "vue-ripple-directive";
    import TagInput from "@/components/Form/TagInput";
    import {form} from "@/libs/mixins";
    import XTagInput from "@/components/Form/TagInput";
    import {objectToFormData} from "@/libs/helpers";
    import SubControlForm from "@/tenant/views/SubControls/SubControlForm";
    import ShowSubControl from "@/tenant/views/SubControls/ShowSubControl.vue";

    export default {
        components: {
            ShowSubControl,
            SubControlForm,
            XTagInput,
            BFormGroup,
            BFormInput,
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
            BBadge,
            BFormFile
        },
        directives: {
            'b-modal': VBModal,
            Ripple
        },
        name: "SubControlIndex",
        mixins: [form],
        data() {
            return {
                model: null,
                urlApi: "/api/sub_controls",
                resource: "/sub_controls",
                importControlsModal: false,
                import_data: {},
                selectedSubControl: null,
                showSideBar: false,
                showFormSideBar: false,
                formType: 'Create',
                multiSelect: {
                    frameworks: []
                },
                additionalParams: {
                    q: '',
                    frameworks: []
                },
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
                        label: 'Ref. Code',
                        field: 'reference_code',
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
            showControl(id) {
                this.$router.push(`${this.resource}/${id}`)
            },
            deleteControl(id) {
                console.log(id)
            },
            searchControls() {
                this.$refs.panel.reload();
            },
            handleOk(bvModalEvt) {
                // Prevent modal from closing
                bvModalEvt.preventDefault()
                // Trigger submit handler
                this.updateSubControls()
            },
            resetModal() {
                this.import_data = {}
            },
            importSubControls() {
                this.import_data = {}
                Vue.set(this.$data, 'importSubControlsModal', true)
            },
            updateSubControls() {
                post('/api/sub-controls-import', objectToFormData(this.import_data)).then(res => {
                    if (res.data.saved) {
                        this.resetModal()
                        Vue.set(this.$data, 'importSubControlsModal', false)
                        this.success();
                        this.$refs.panel.reload();
                        // this.reload()
                    }
                })
            },
            openSideBar(formType, id) {
                this.formType = formType;
                this.selectedSubControl = id
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showFormSideBar = true;
            },
            resetSubControlForm() {
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
                this.selectedSubControl = id
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
