<template>
    <div>
        <b-card>
            <b-row>
                <b-col>
                    <h3>Frameworks</h3>
                </b-col>
                <b-col cols="6">
                    <b-button @click="openSideBar('Add', 0)" class="mr-1 float-right mb-1" variant="primary">
                        <feather-icon icon="PlusIcon" size="14" />
                        Create
                    </b-button>
                </b-col>
            </b-row>

            <panel
                ref="panel"
                :url-api="urlApi"
                :columns="columns"
                :resource="resource"
                :row-class="rowClass"
            >
                <div slot="action" slot-scope="props" class="text-nowrap">
                    <feather-icon
                        v-if="props.item.assigned"
                        :id="`user-row-${props.item.id}-eye-icon`"
                        icon="EyeIcon"
                        class="cursor-pointer"
                        size="16"
                        @click="openShowSideBar(props.item.id)"
                    />

                    <feather-icon
                        v-if="props.item.can_edit == 1 && props.item.assigned"
                        :id="`user-row-${props.item.id}-edit-icon`"
                        icon="EditIcon"
                        class="cursor-pointer"
                        size="16"
                        @click="edit(props.item.id)"
                    />
                </div>
            </panel>
        </b-card>

        <!-- Create / Edit Sidebar -->
        <b-sidebar
            id="sidebar-backdrop"
            backdrop
            backdrop-variant="dark"
            right
            shadow
            width="75%"
            :title="`${formType} Framework`"
            @hidden="resetFrameworkForm"
        >
            <div class="px-1 py-2">
                <FrameworkForm
                    v-if="showSideBar"
                    :form-type="formType"
                    :form-id="selectedFramework"
                    @cancel="closeSideBar"
                    @close="saveCloseSideBar"
                />
            </div>
        </b-sidebar>

        <!-- Show Sidebar -->
        <b-sidebar
            id="sidebar-backdrop-1"
            backdrop
            backdrop-variant="dark"
            right
            shadow
            width="50%"
            title="Framework Detail"
            @hidden="resetShow"
        >
            <div class="px-1 py-2">
                <ShowFramework
                    v-if="detailSideBar"
                    :form-id="selectedFramework"
                    @cancel="closeShowSideBar"
                    @close="closeShowSideBar"
                />
            </div>
        </b-sidebar>
    </div>
</template>

<script>
    import {
        BCard, BRow, BCol, BButton, BSidebar
    } from 'bootstrap-vue'
    import Panel from "@/components/Table/Panel";
    import FrameworkForm from "@/tenant/views/Frameworks/FrameworkForm";
    import ShowFramework from "@/tenant/views/Frameworks/ShowFramework";
    import {form} from "@/libs/mixins";

    export default {
        name: "Index",
        mixins: [form],
        components: {
            BCard,
            BRow,
            BCol,
            BButton,
            BSidebar,
            Panel,
            FrameworkForm,
            ShowFramework,
        },
        data() {
            return {
                urlApi: "/api/frameworks",
                resource: "/frameworks",
                selectedFramework: null,
                showSideBar: false,
                detailSideBar: false,
                formType: 'Create',
                columns: [
                    { label: 'ID', field: 'id' },
                    { label: 'Name', field: 'name' },
                    { label: 'Ref. Code', field: 'reference_code' },
                    { label: 'Framework Type', displayText: 'framework_type', field: 'title' },
                    { label: 'Release Date', field: 'release_date', format: 'formatDate' },
                    { label: 'Action', field: 'action', action: true }
                ]
            }
        },
        methods: {
            edit(id) {
                this.openSideBar('Edit', id);
            },
            openSideBar(formType, id) {
                this.formType = formType;
                this.selectedFramework = id;
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop');
                this.showSideBar = true;
            },
            resetFrameworkForm() {
                this.showSideBar = false;
            },
            closeSideBar() {
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop');
                this.showSideBar = false;
            },
            saveCloseSideBar() {
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop');
                this.showSideBar = false;
                this.$refs.panel.update();
            },
            openShowSideBar(id) {
                this.selectedFramework = id;
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop-1');
                this.detailSideBar = true;
            },
            resetShow() {
                this.selectedFramework = 0;
                this.detailSideBar = false;
            },
            closeShowSideBar() {
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop-1');
                this.detailSideBar = false;
            },
            rowClass(item) {
                return item.assigned === false ? 'row-disabled' : '';
            }
        }
    }
</script>

<style scoped>
    .row-disabled {
        background-color: #f5f5f5 !important;
        color: #aaa !important;
        pointer-events: none;
        opacity: 0.6;
    }
</style>
