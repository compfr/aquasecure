<template>
    <div>
        <b-card>
            <b-row>
                <b-col>
                    <h3>Frameworks</h3>
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
                </div>
            </panel>
        </b-card>

        <!--        for create and edit-->

        <b-sidebar id="sidebar-backdrop"
                   backdrop-variant="dark" @hidden="resetFrameworkForm"
                   backdrop :title="`${formType} Framework`" right shadow width="75%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <FrameworkForm v-if="showSideBar" :form-type="formType" :form-id="selectedFramework"
                                       @cancel="closeSideBar" @close="saveCloseSideBar"/>
                    </div>
                </template>
            </div>
        </b-sidebar>

        <!--        for create and edit end-->


        <!--        for show-->

        <b-sidebar id="sidebar-backdrop-1"
                   backdrop-variant="dark" @hidden="resetShow"
                   backdrop :title="`Framework Detail`" right shadow width="75%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <ShowFramework v-if="detailSideBar" :form-id="selectedFramework"
                                       @cancel="closeShowSideBar" @close="closeShowSideBar"/>
                    </div>
                </template>
            </div>
        </b-sidebar>

        <!--        for show end-->
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
        BSidebar
    } from 'bootstrap-vue'
    import Panel from "@/components/Table/Panel";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";
    import {get, post} from '@/libs/api.js'
    import Ripple from "vue-ripple-directive";
    import TagInput from "@/components/Form/TagInput";
    import {form} from "@/libs/mixins";
    import FrameworkForm from "@/admin/views/Frameworks/FrameworkForm";
    import ShowFramework from "@/admin/views/Frameworks/ShowFramework";

    export default {
        components: {
            ShowFramework,
            FrameworkForm,
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
        name: "FrameworkIndex",
        mixins: [form],
        data() {
            return {
                model: null,
                urlApi: "/api/frameworks",
                resource: "/frameworks",
                selectedFramework: null,
                showSideBar: false,
                detailSideBar: false,
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
                        label: 'Ref. Code',
                        field: 'reference_code',
                    },
                    {
                        label: 'Framework Type',
                        displayText: 'framework_type',
                        field: 'title'
                    },
                    {
                        label: 'Release Date',
                        field: 'release_date',
                        format: 'formatDate'
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
            openSideBar(formType, id) {
                this.formType = formType;
                this.selectedFramework = id
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showSideBar = true;
            },
            resetFrameworkForm() {
                this.showSideBar = false;
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
                this.selectedFramework = id
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop-1')
                this.detailSideBar = true;
            },

            resetShow() {
                this.selectedFramework = 0;
                this.detailSideBar = false;
            },

            closeShowSideBar() {
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop-1')
                this.detailSideBar = false;
            }
        },
    }
</script>

<style scoped>

</style>
<!--
Lorep ipsum-->
