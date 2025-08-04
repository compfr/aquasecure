<template>
    <div v-if="show">
        <b-tabs v-model="selectedTab" @input="updateRoute">
            <b-tab title="Central Policies">
                <PolicyIndex v-if="selectedTab == 0" />
            </b-tab>
            <b-tab title="Tenant Policies">
                <PolicyTenant v-if="selectedTab == 1" />
            </b-tab>
        </b-tabs>
    </div>
</template>

<script>
    import {
        BCard,
        BCardText,
        BRow,
        BCol,
        BTab, BTabs
    } from 'bootstrap-vue'
    import PolicyIndex from "@/admin/views/Policies/index";
    import PolicyTenant from "@/admin/views/Policies/PolicyTenant";

    export default {
        name: "Index",
        components: {
            PolicyTenant,
            PolicyIndex,
            BCard,
            BCardText,
            BRow,
            BCol,
            BTab, BTabs
        },
        data() {
            return {
                selectedTab: 0,
                show: false
            }
        },
        created() {
            if (this.$route.query && this.$route.query.tab) {
                if (this.$route.query.tab == 'central') {
                    this.selectedTab = 0;
                }
                if (this.$route.query.tab == 'tenant') {
                    this.selectedTab = 1;
                }
            } else {
                this.selectedTab = 0;
                this.$router.push('/policies?tab=central')
            }
            this.show = true;
        },
        methods: {
            updateRoute(e) {
                if (e == 0) {
                    this.$router.push('/policies?tab=central')
                }
                if (e == 1) {
                    this.$router.push('/policies?tab=tenant')
                }
            }
        }
    }
</script>

<style scoped>

</style>
