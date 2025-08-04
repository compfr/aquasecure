<template>
    <div>
        <b-card>
            <b-row>
                <b-col>
                    <h3>Tenant Policies</h3>
                </b-col>
            </b-row>
            <panel ref="panel" :url-api="urlApi" :columns="columns">
                <div slot="action" slot-scope="props" class="text-nowrap">
                    <feather-icon
                        :id="`user-row-${props.item.id}-eye-icon`"
                        icon="EyeIcon"
                        class="cursor-pointer"
                        size="16"
                        @click="openShowSideBar(props.item.id, props.item.tenant.id)"
                    />

                </div>
            </panel>
        </b-card>


        <!--        for show-->

        <b-sidebar id="sidebar-backdrop-1"
                   backdrop-variant="dark" @hidden="resetShow"
                   backdrop :title="`Framework Detail`" right shadow width="75%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <ShowTenantPolicy v-if="detailSideBar" :tenant-id="selectedTenant" :form-id="selectedPolicy"
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
    import Ripple from "vue-ripple-directive";
    import TagInput from "@/components/Form/TagInput";
    import {form} from "@/libs/mixins";
    import ShowTenantPolicy from "@/admin/views/Policies/ShowTenantPolicy";

    export default {
        components: {
            ShowTenantPolicy,
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
        name: "PolicyTenant",
        mixins: [form],
        data() {
            return {
                model: null,
                urlApi: "/api/tenant_policies",
                selectedPolicy: null,
                selectedTenant: null,
                showSideBar: false,
                detailSideBar: false,
                formType: 'Create',
                columns: [
                    {
                        label: 'ID',
                        field: 'id',
                    },
                    {
                        label: 'Tenant',
                        displayText: 'tenant',
                        field: 'name'
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
            openShowSideBar(id,tenant_id) {
                this.selectedPolicy = id
                this.selectedTenant = tenant_id
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop-1')
                this.detailSideBar = true;
            },

            resetShow() {
                this.selectedPolicy = 0;
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
