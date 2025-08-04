<template>
    <div v-if="show">
        <b-tabs v-model="selectedTab" @input="updateRoute">
            <b-tab title="Central Frameworks">
                <FrameworkIndex v-if="selectedTab == 0" />
            </b-tab>
            <b-tab title="Tenant Frameworks">
                <FrameworkTenant v-if="selectedTab == 1" />
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
    import FrameworkIndex from "@/admin/views/Frameworks/index";
    import FrameworkTenant from "@/admin/views/Frameworks/FrameworkTenant";

    export default {
        name: "Index",
        components: {
            FrameworkTenant,
            FrameworkIndex,
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
                this.$router.push('/frameworks?tab=central')
            }
            this.show = true;
        },
        methods: {
            updateRoute(e) {
                if (e == 0) {
                    this.$router.push('/frameworks?tab=central')
                }
                if (e == 1) {
                    this.$router.push('/frameworks?tab=tenant')
                }
            }
        }
    }
</script>

<style scoped>

</style>
