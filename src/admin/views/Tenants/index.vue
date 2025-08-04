<template>
    <div>
        <b-card>
            <b-row>
                <b-col>
                    <h3>Tenants</h3>
                </b-col>
                <b-col cols="6">
                    <b-button

                        type="submit"
                        variant="primary"
                        class="mr-1 mb-1 float-right"
                        :to="{name:'create-tenants'}"
                    >
                        Create
                    </b-button>
                </b-col>
            </b-row>
            <panel ref="panel" :url-api="urlApi" :columns="columns" :resource="resource">
                <div slot="expiry_date" slot-scope="props" class="text-nowrap">
                    <template v-if="props.item.domain_active == 0">
                        <span>{{props.item.updated_at | formatDateV2}}</span>
                    </template>
                    <template v-else>
                        <span>No Expiry</span>
                    </template>
                </div>
                <div slot="action" slot-scope="props" class="text-nowrap">

                    <b-button v-if="props.item.domain_active == 1"

                        type="submit"
                        size="sm"
                        variant="primary"
                        @click="impersonateTenant(props.item.id)"
                    >
                        Impersonate
                    </b-button>
                    <!--                    <feather-icon-->
                    <!--                        :id="`user-row-${props.item.id}-eye-icon`"-->
                    <!--                        icon="EyeIcon"-->
                    <!--                        class="cursor-pointer"-->
                    <!--                        size="16"-->
                    <!--                        @click="showTenant(props.item.id)"-->
                    <!--                    />-->

                    <feather-icon
                        :id="`user-row-${props.item.id}-edit-icon`"
                        icon="EditIcon"
                        class="cursor-pointer ml-1"
                        size="16"
                        @click="edit(props.item.id)"
                    />
                    <!--                    <b-tooltip-->
                    <!--                        :target="`user-row-${props.item.id}-edit-icon`"-->
                    <!--                        title="Edit Tenant"-->
                    <!--                        class="cursor-pointer"-->
                    <!--                    />-->

                    <feather-icon v-if="props.item.domain_active == 1"
                                  :id="`user-row-${props.item.id}-lock-icon`"
                                  icon="LockIcon"
                                  class="cursor-pointer ml-1"
                                  size="16"
                                  @click="lock(props.item.id)"
                    />
                    <feather-icon v-if="props.item.domain_active == 0"
                                  :id="`user-row-${props.item.id}-unlock-icon`"
                                  icon="UnlockIcon"
                                  class="cursor-pointer ml-1"
                                  size="16"
                                  @click="unlock(props.item.id)"
                    />

                    <feather-icon
                        :id="`user-row-${props.item.id}-delete-icon`"
                        icon="TrashIcon"
                        class="cursor-pointer ml-1"
                        size="16"
                        @click="deleteTenant(props.item.id)"
                    />
                </div>


            </panel>
        </b-card>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {BCard, BRow, BCol, BCardText, BLink, BButton, BTooltip, BModal, VBModal, BFormGroup} from 'bootstrap-vue'
    import Panel from "@/components/Table/Panel";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";
    import {get, post} from '@/libs/api.js'
    import Ripple from "vue-ripple-directive";
    import TagInput from "@/components/Form/TagInput";
    import {form} from "@/libs/mixins";
    import {destroy} from "@/libs/api";

    export default {
        components: {
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
                urlApi: "/api/tenants",
                resource: "/tenants",
                columns: [
                    {
                        label: 'ID',
                        field: 'id',
                    },
                    {
                        label: 'Company Name',
                        field: 'company_name',
                    },
                    {
                        label: 'Domain',
                        displayText: 'domains',
                        field: 'domain',
                        multiple: true
                    },
                    {
                        label: 'Name',
                        field: 'name',
                    },
                    {
                        label: 'Email',
                        field: 'email',
                    },
                    {
                        label: 'Expired',
                        field: 'expiry_date',
                        custom: true
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
                this.$router.push(`${this.resource}/${id}/edit`)
            },
            deleteTenant(id){
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
                        destroy(`/api/tenants/${id}`, {}).then((res) => {
                            if (res.data.saved) {
                                this.$swal({
                                    title: "Deleted!",
                                    text: "Tenant has been successfully Deleted.",
                                    icon: "success"
                                });
                                this.$refs.panel.update()
                            }
                        })
                    }
                });
            },
            impersonateTenant(id) {
                get(`/api/impersonate/${id}`).then((res) => {
                    if (res.data.success) {
                        window.open(res.data.url, '_blank');
                    }
                })
            },
            lock(id) {
                this.$swal({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#4267B2",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, Lock it!"
                }).then((result) => {
                    if (result.isConfirmed) {
                        post(`/api/change-status/${id}`).then((res) => {
                            if (res.data.saved) {
                                this.$swal({
                                    title: "Locked!",
                                    text: "Tenant has been successfully Locked.",
                                    icon: "success"
                                });
                                this.$refs.panel.update()
                            }
                        });
                    }
                });
            },
            unlock(id) {
                this.$swal({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#4267B2",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, Un-Lock it!"
                }).then((result) => {
                    if (result.isConfirmed) {
                        post(`/api/change-status/${id}`).then((res) => {
                            if (res.data.saved) {
                                this.$swal({
                                    title: "Un-Locked!",
                                    text: "Tenant has been successfully Un-Locked.",
                                    icon: "success"
                                });
                                this.$refs.panel.update()
                            }
                        });
                    }
                });
            }
        },
    }
</script>

<style scoped>

</style>
