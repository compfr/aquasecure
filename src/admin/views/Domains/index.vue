<template>
    <div>
        <b-card title="Search Domains">
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
                        @click="searchDomains"
                    >
                        Search
                    </b-button>
                </b-col>
            </b-row>
        </b-card>
        <b-card>
            <b-row>
                <b-col>
                    <h3>Domains</h3>
                </b-col>
                <b-col md="6">
<!--                    <b-button-->
<!--                         -->
<!--                        type="submit"-->
<!--                        variant="primary"-->
<!--                        class="mr-1 mb-1 float-right"-->
<!--                        :to="{name:'create-domains'}"-->
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
                    <feather-icon
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
                   backdrop-variant="dark" @hidden="resetDomainForm"
                   backdrop :title="`${formType} Domain`" right shadow width="50%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <DomainForm v-if="showFormSideBar" :form-type="formType" :form-id="selectedDomain" @cancel="closeSideBar" @close="saveCloseSideBar"/>
                    </div>
                </template>
            </div>
        </b-sidebar>

        <b-sidebar id="sidebar-backdrop-1"
                   backdrop-variant="dark" @hidden="resetShow"
                   backdrop :title="`Domain Detail`" right shadow width="50%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <ShowDomain v-if="showSideBar" :form-id="selectedDomain" />
                    </div>
                </template>
            </div>
        </b-sidebar>

        <b-modal
            v-model="importDomainsModal"
            id="modal-prevent-closing"
            title="Import Domains"
            ok-title="Save"
            cancel-variant="outline-secondary"
            @hidden="resetModal"
            @ok="handleOk">
            <b-form-group>
                <b-form-file
                    @input="handleFile"
                    placeholder="Choose a XLSX or CSV File"
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
    import DomainForm from "@/admin/views/Domains/DomainForm";
    import ShowDomain from "@/admin/views/Domains/ShowDomain.vue";

    export default {
        components: {
            ShowDomain,
            DomainForm,
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
        name: "DomainIndex",
        mixins: [form],
        data() {
            return {
                model: null,
                urlApi: "/api/domains",
                resource: "/domains",
                importDomainsModal: false,
                import_data: {},
                selectedDomain:null,
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
            searchDomains() {
                this.$refs.panel.reload();
            },
            handleOk(bvModalEvt) {
                // Prevent modal from closing
                bvModalEvt.preventDefault()
                // Trigger submit handler
                this.updateDomains()
            },
            resetModal() {
                this.import_data = {}
            },
            importDomains() {
                this.import_data = {}
                Vue.set(this.$data, 'importDomainsModal', true)
            },
            updateDomains() {
                post('/api/domains-import', objectToFormData(this.import_data)).then(res => {
                    if (res.data.saved) {
                        this.resetModal()
                        Vue.set(this.$data, 'importDomainsModal', false)
                        this.success();
                        this.$refs.panel.reload();
                        // this.reload()
                    }
                })
            },
            handleFile(e) {
                Vue.set(this.$data.import_data, 'file', e)
            },
            openSideBar(formType, id){
                this.formType = formType;
                this.selectedDomain = id
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showFormSideBar = true;
            },
            resetDomainForm(){
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
                this.selectedDomain = id
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
