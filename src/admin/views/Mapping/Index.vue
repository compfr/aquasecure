<template>
    <div v-if="show">
        <b-tabs v-model="selectedTab" @input="updateRoute">
            <b-tab title="Domains">
                <DomainIndex v-if="selectedTab == 0"/>
            </b-tab>
            <b-tab title="Controls">
                <ControlIndex v-if="selectedTab == 1"/>
            </b-tab>
            <b-tab title="Sub-Controls">
                <SubControlIndex v-if="selectedTab == 2"/>
            </b-tab>
            <b-tab title="Configure Mapping">
                <ConfigureMapping v-if="selectedTab == 3"/>
            </b-tab>
            <b-tab title="View Mapping">
                <MappingStructure v-if="selectedTab == 4"/>
            </b-tab>
            <b-tab title="Tag Mapping">
                <TagMapping v-if="selectedTab == 5"/>
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
    import SubControlIndex from "@/admin/views/SubControls/index";
    import ControlIndex from "@/admin/views/Controls/index";
    import DomainIndex from "@/admin/views/Domains/index";
    import MappingStructure from "@/admin/views/Mapping/MappingStructure";
    import TagMapping from "@/admin/views/Mapping/TagMapping";
    import ConfigureMapping from "@/admin/views/Mapping/ConfigureMapping";

    export default {
        name: "Index",
        components: {
            ConfigureMapping,
            TagMapping,
            MappingStructure,
            DomainIndex,
            ControlIndex,
            SubControlIndex,
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
                if (this.$route.query.tab == 'domains') {
                    this.selectedTab = 0;
                }
                if (this.$route.query.tab == 'controls') {
                    this.selectedTab = 1;
                }
                if (this.$route.query.tab == 'sub_controls') {
                    this.selectedTab = 2;
                }
                if (this.$route.query.tab == 'configure_mappings') {
                    this.selectedTab = 3;
                }
                if (this.$route.query.tab == 'view_mappings') {
                    this.selectedTab = 4;
                }
                if (this.$route.query.tab == 'view_tag_mappings') {
                    this.selectedTab = 5;
                }
            } else {
                this.selectedTab = 0;
                this.$router.push('/mappings?tab=domains')
            }
            this.show = true;
        },
        methods: {
            updateRoute(e) {
                if (e == 0) {
                    this.$router.push('/mappings?tab=domains')
                }
                if (e == 1) {
                    this.$router.push('/mappings?tab=controls')
                }
                if (e == 2) {
                    this.$router.push('/mappings?tab=sub_controls')
                }
                if (e == 3) {
                    this.$router.push('/mappings?tab=configure_mappings')
                }
                if (e == 4) {
                    this.$router.push('/mappings?tab=view_mappings')
                }
                if (e == 5) {
                    this.$router.push('/mappings?tab=view_tag_mappings')
                }
            }
        }
    }
</script>

<style scoped>

</style>
