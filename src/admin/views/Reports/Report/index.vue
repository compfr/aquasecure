<template>
    <div>
        <b-card title="Search Reports">
            <b-row>
                <b-col md="10">
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
                        @click="searchReports"
                    >
                        Search
                    </b-button>
                </b-col>
            </b-row>
        </b-card>
        <b-card>
            <b-row>
                <b-col>
                    <h3>Reports</h3>
                </b-col>
                <b-col md="6">
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
                    <!--                        title="Show Report"-->
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
<!--                        title="Edit Report"-->
<!--                        class="cursor-pointer"-->
<!--                    />-->

                </div>
            </panel>
        </b-card>

        <!--        for create and edit-->

        <b-sidebar id="sidebar-backdrop"
                   backdrop-variant="dark" @hidden="resetReportForm"
                   backdrop :title="`${formType} Report`" right shadow width="50%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <FormReport v-if="showFormSideBar" :form-type="formType" :form-id="selectedReport"
                                     @cancel="closeSideBar" @close="saveCloseSideBar"/>
                    </div>
                </template>
            </div>
        </b-sidebar>

        <b-sidebar id="sidebar-backdrop-1"
                   backdrop-variant="dark" @hidden="resetShow"
                   backdrop :title="`Report Detail`" right shadow width="75%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <ShowReport v-if="showSideBar" :form-id="selectedReport" />
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
        BFormInput, BBadge, BFormFile, BSidebar
    } from 'bootstrap-vue'
    import Panel from "@/components/Table/Panel";
    import Ripple from "vue-ripple-directive";
    import TagInput from "@/components/Form/TagInput";
    import {form} from "@/libs/mixins";
    import XTagInput from "@/components/Form/TagInput";
    import FormReport from "@/admin/views/Reports/Report/FormReport";
    import ShowReport from "@/admin/views/Reports/Report/ShowReport";

    export default {
        components: {
            ShowReport,
            FormReport,
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
        name: "ReportIndex",
        mixins: [form],
        data() {
            return {
                model: null,
                urlApi: "/api/reports",
                resource: "/reports",
                selectedReport: null,
                showFormSideBar: false,
                showSideBar: false,
                formType: 'Add',
                multiSelect: {
                    frameworks: []
                },
                additionalParams: {
                    q: ''
                },
                columns: [
                    {
                        label: 'ID',
                        field: 'ref_id',
                    },
                    {
                        label: 'Name',
                        field: 'name',
                    },
                    {
                        label: 'Label',
                        displayText: 'label',
                        field: 'name',
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
            deleteReport(id) {
                console.log(id)
            },
            searchReports() {
                this.$refs.panel.reload();
            },

            openSideBar(formType, id) {
                this.formType = formType;
                this.selectedReport = id
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showFormSideBar = true;
            },
            resetReportForm() {
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
                this.selectedReport = id
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
