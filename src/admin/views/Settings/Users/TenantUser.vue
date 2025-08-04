<template>
    <div>
        <b-card>
            <b-row>
                <b-col>
                    <h3>Tenant Users</h3>
                </b-col>
            </b-row>
            <panel ref="panel" :url-api="urlApi" :columns="columns" :resource="resource">

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
        name: "TenantUser",
        mixins: [form],
        data() {
            return {
                model: null,
                urlApi: "/api/tenant-users",
                resource: "/tenant-users",
                columns: [
                    {
                        label: 'Name',
                        field: 'name',
                    },
                    {
                        label: 'Roles',
                        field: 'name',
                        displayText: 'roles',
                        multiple: true
                    },
                    {
                        label: 'Tenant',
                        field: 'name',
                        displayText: 'tenant',
                    },
                    {
                        label: 'Created At',
                        field: 'created_at',
                        format: 'formatDate'
                    },
                ],
            }
        },
        methods: {},
    }
</script>

<style scoped>

</style>
