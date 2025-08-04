<template>
    <div>
        <b-card>
            <panel ref="panel" :url-api="urlApi" :columns="columns" :resource="resource">

                <div slot="email_verify" slot-scope="props" class="text-nowrap">
                    <template>
                        <b-badge variant="success" class="mr-1"
                                 v-if="props.item.email_verified == 1" :key="index">
                            Verified
                        </b-badge>
                        <b-badge variant="danger" class="mr-1"
                                 v-else :key="index">
                            Not Verified Yet
                        </b-badge>
                    </template>
                </div>

                <div slot="action" slot-scope="props" class="text-nowrap">

                    <div class="d-flex justify-content-center align-items-center">
                        <feather-icon :id="`user-row-${props.item.id}-eye-icon`" icon="EyeIcon" class="cursor-pointer"
                                      size="16" @click="openShowSideBar(props.item.id)"/>

                        <feather-icon :id="`user-row-${props.item.id}-delete-icon`" icon="TrashIcon" class="cursor-pointer"
                                      size="16" @click="deleteRequest(props.item.id)"/>

                        <b-button v-if="!props.item.tenant_created" size="sm"   variant="primary" class="ml-1" :to="{
                            name: 'create-tenants', query: {
                                tenant_request_id: props.item.id,
                            }
                        }">
                            Create
                        </b-button>
                    </div>
                </div>
            </panel>
        </b-card>

        <!--        for show-->

        <b-sidebar id="sidebar-backdrop-1" backdrop-variant="dark" @hidden="resetShow" backdrop
                   :title="`Tenant Request Detail`" right shadow width="50%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <ShowTenantRequest v-if="detailSideBar" :form-id="selectedTenantRequest"
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
        BBadge
    } from 'bootstrap-vue'
    import Panel from "@/components/Table/Panel";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";
    import {get, post} from '@/libs/api.js'
    import Ripple from "vue-ripple-directive";
    import TagInput from "@/components/Form/TagInput";
    import {form} from "@/libs/mixins";
    import ShowFramework from "@/admin/views/Frameworks/ShowFramework.vue";
    import ShowTenantRequest from "@/admin/views/TenantRequest/ShowTenantRequest.vue";
    import tenant_requests from '@/admin/router/tenant_requests';
    import {destroy} from "@/libs/api";

    export default {
        components: {
            ShowTenantRequest,
            ShowFramework,
            BFormGroup,
            BModal,
            BCard,
            BCardText,
            BLink,
            BButton,
            BRow,
            BBadge,
            BCol,
            BTooltip,
            Panel,
            TagInput
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
                selectedTenantRequest: null,
                showSideBar: false,
                detailSideBar: false,
                urlApi: "/api/tenant-requests",
                resource: "/tenant-requests",
                columns: [
                    {
                        label: 'ID',
                        field: 'id',
                    },
                    {
                        label: 'Name',
                        field: 'full_name',
                    },
                    {
                        label: 'Company Name',
                        field: 'company_name',
                    },
                    {
                        label: 'Phone Number',
                        field: 'phone_number',
                    },
                    {
                        label: 'Email',
                        field: 'email',
                    },
                    {
                        label: 'Domain',
                        field: 'domain_name',
                    },
                    {
                        label: 'Email Verified',
                        field: 'email_verify',
                        custom: true
                    },
                    {
                        label: 'Request Date',
                        field: 'created_at',
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
            openShowSideBar(id) {
                this.selectedTenantRequest = id
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop-1')
                this.detailSideBar = true;
            },

            resetShow() {
                this.selectedTenantRequest = 0;
                this.detailSideBar = false;
            },

            closeShowSideBar() {
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop-1')
                this.detailSideBar = false;
            },
            deleteRequest(id){
                this.$swal({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#4267B2",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, Delete it!"
                }).then((result) => {
                    if(result.isConfirmed){
                        destroy(`/api/tenant-requests/${id}`, {}).then((res) => {
                            if (res.data.saved) {
                                this.$swal({
                                    title: "Deleted!",
                                    text: "Tenant Request has been successfully Deleted.",
                                    icon: "success"
                                });
                                this.$refs.panel.update()
                            }
                        })
                    }
                });
            },
        },
    }
</script>

<style scoped></style>
