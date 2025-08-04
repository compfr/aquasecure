<template>
    <div v-if="show">
        <b-tabs v-model="selectedTab" @input="updateRoute">
            <b-tab title="Add Discovery">
                <DiscoveryIndex v-if="selectedTab == 0"/>
            </b-tab>
            <b-tab title="Domain">
                <DomainDiscoveryIndex v-if="selectedTab == 1"/>
            </b-tab>
            <b-tab title="Net Block">
                <NetBlockDiscoveryIndex v-if="selectedTab == 2"/>
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
import DiscoveryIndex from "@/admin/views/Discovery/DiscoveryIndex.vue";
import DomainDiscoveryIndex from "@/admin/views/Discovery/DomainDiscoveryIndex.vue";
import NetBlockDiscoveryIndex from "@/admin/views/Discovery/NetBlockDiscoveryIndex";

export default {
    name: "Index",
    components: {
        NetBlockDiscoveryIndex,
        DomainDiscoveryIndex,
        DiscoveryIndex,
        TagMapping,
        MappingStructure,
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
            if (this.$route.query.tab == 'add_discovery') {
                this.selectedTab = 0;
            }
            if (this.$route.query.tab == 'domain') {
                this.selectedTab = 1;
            }
            if (this.$route.query.tab == 'net_block') {
                this.selectedTab = 2;
            }
        } else {
            this.selectedTab = 0;
            this.$router.push('/asm-discovery?tab=add_discovery')
        }
        this.show = true;
    },
    methods: {
        updateRoute(e) {
            if (e == 0) {
                this.$router.push('/asm-discovery?tab=add_discovery')
            }
            if (e == 1) {
                this.$router.push('/asm-discovery?tab=domain')
            }
            if (e == 2) {
                this.$router.push('/asm-discovery?tab=net_block')
            }
        }
    }
}
</script>

<style scoped>

</style>
