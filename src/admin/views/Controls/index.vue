<template>
    <div>
        <b-card title="Search Controls">
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
                    <h3>Controls</h3>
                </b-col>
                <b-col md="6">
                    <!--                    <b-button-->
                    <!--                         -->
                    <!--                        type="submit"-->
                    <!--                        variant="primary"-->
                    <!--                        class="mr-1 mb-1 float-right"-->
                    <!--                        :to="{name:'create-controls'}"-->
                    <!--                    >-->
                    <!--                        Create-->
                    <!--                    </b-button>-->
                    <b-button @click="openSideBar('Add', 0)" class="mr-1 float-right mb-1" variant="primary">
                        <feather-icon icon="PlusIcon" size="14"/>
                        Create
                    </b-button>
                    <b-button

                        type="submit"
                        variant="primary"
                        class="mr-1 mb-1 float-right"
                        @click="importControls"
                    >
                        Import
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
                    <feather-icon
                        :id="`user-row-${props.item.id}-edit-icon`"
                        icon="EditIcon"
                        class="cursor-pointer"
                        size="16"
                        @click="edit(props.item.id)"
                    />
                    <b-tooltip
                        :target="`user-row-${props.item.id}-edit-icon`"
                        title="Edit Control"
                        class="cursor-pointer"
                    />

                </div>
            </panel>
        </b-card>

        <!--        for create and edit-->

        <b-sidebar id="sidebar-backdrop"
                   backdrop-variant="dark" @hidden="resetControlForm"
                   backdrop :title="`${formType} Control`" right shadow width="50%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <ControlForm v-if="showFormSideBar" :form-type="formType" :form-id="selectedControl"
                                     @cancel="closeSideBar" @close="saveCloseSideBar"/>
                    </div>
                </template>
            </div>
        </b-sidebar>

        <b-sidebar id="sidebar-backdrop-1"
                   backdrop-variant="dark" @hidden="resetShow"
                   backdrop :title="`Control Detail`" right shadow width="50%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <ShowControl v-if="showSideBar" :form-id="selectedControl" />
                    </div>
                </template>
            </div>
        </b-sidebar>

        <b-modal
            v-model="importControlsModal"
            id="modal-prevent-closing"
            title="Import Controls"
            ok-title="Save"
            cancel-variant="outline-secondary"
            @hidden="resetModal"
            @ok="handleOk">
            <b-form-group>
                <b-form-file
                    @input="handleFile"
                    placeholder="Choose a XLSX or CSV File "
                    drop-placeholder="Drop file here..."
                />
            </b-form-group>
        </b-modal>
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
        BFormInput, BBadge, BFormFile, BSidebar
    } from 'bootstrap-vue'
    import Panel from "@/components/Table/Panel";
    import {get, post} from '@/libs/api.js'
    import Ripple from "vue-ripple-directive";
    import TagInput from "@/components/Form/TagInput";
    import {form} from "@/libs/mixins";
    import XTagInput from "@/components/Form/TagInput";
    import {objectToFormData} from "@/libs/helpers";
    import ControlForm from "@/admin/views/Controls/ControlForm";
    import ShowControl from "@/admin/views/Controls/ShowControl";

    export default {
        components: {
            ShowControl,
            ControlForm,
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
            BFormFile, BSidebar
        },
        directives: {
            'b-modal': VBModal,
            Ripple
        },
        name: "ControlIndex",
        mixins: [form],
        data() {
            return {
                model: null,
                urlApi: "/api/controls",
                resource: "/controls",
                importControlsModal: false,
                import_data: {},
                selectedControl: null,
                showFormSideBar: false,
                showSideBar: false,
                formType: 'Add',
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
            deleteControl(id) {
                console.log(id)
            },
            searchControls() {
                this.$refs.panel.reload();
            },
            onFrameworksUpdate(e) {
                Vue.set(this.$data.multiSelect, 'frameworks', e);
                Vue.set(this.$data.additionalParams, 'frameworks', []);
                for (var i = 0; i < this.multiSelect.frameworks.length; i++) {
                    this.additionalParams.frameworks.push(this.multiSelect.frameworks[i]["framework_id"]);
                }
            },
            handleOk(bvModalEvt) {
                // Prevent modal from closing
                bvModalEvt.preventDefault()
                // Trigger submit handler
                this.updateControls()
            },
            resetModal() {
                this.import_data = {}
            },
            importControls() {
                this.import_data = {}
                Vue.set(this.$data, 'importControlsModal', true)
            },
            updateControls() {
                post('/api/controls-import', objectToFormData(this.import_data)).then(res => {
                    if (res.data.saved) {
                        this.resetModal()
                        Vue.set(this.$data, 'importControlsModal', false)
                        this.success();
                        this.$refs.panel.reload();
                        // this.reload()
                    }
                })
            },
            handleFile(e) {
                Vue.set(this.$data.import_data, 'file', e)
            },
            openSideBar(formType, id) {
                this.formType = formType;
                this.selectedControl = id
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showFormSideBar = true;
            },
            resetControlForm() {
                this.showFormSideBar = false;
            },
            closeSideBar(){
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showSideBar = false;
            },
            saveCloseSideBar(){
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showSideBar = false;
                this.$refs.panel.update();
            },

            openShowSideBar(id) {
                this.selectedControl = id
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
