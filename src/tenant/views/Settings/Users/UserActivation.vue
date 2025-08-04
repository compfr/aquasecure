<template>
    <div>
        <b-card>
            <b-row>
                <b-col>
                    <h3>Index</h3>
                </b-col>
            </b-row>
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
            </panel>
        </b-card>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {BCard, BRow, BCol, BCardText, BLink, BBadge, BTooltip, BModal, VBModal, BFormGroup} from 'bootstrap-vue'
    import Panel from "@/components/Table/Panel";
    import {get, post} from '@/libs/api.js'
    import {form} from "@/libs/mixins";

    export default {
        components: {
            BCard,
            BBadge,
            BCardText,
            BLink,
            BRow,
            BCol,
            BTooltip,
            Panel,
        },
        name: "UserActivation",
        mixins: [form],
        data() {
            return {
                model: null,
                urlApi: "/api/users",
                resource: "/users",
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
                        label: 'Email',
                        field: 'email',
                    },
                    {
                        label: 'Roles',
                        field: 'name',
                        displayText: 'roles',
                        multiple: true
                    },
                    {
                        label: 'Email Verified',
                        field: 'email_verify',
                        custom: true
                    },
                    {
                        label: 'Created At',
                        field: 'created_at',
                        format: 'formatDate'
                    },

                ],
            }
        },
        methods: {

        },
    }
</script>

<style scoped>

</style>
