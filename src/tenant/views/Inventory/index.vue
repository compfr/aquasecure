<template>
    <div v-if="show">
        <b-tabs v-model="selectedTab">
            <template v-for="(tab,index) in asset_types">
                <b-tab :title="tab.title">
                    <AssetInventory v-if="selectedTab == index" :asset_type_id="tab.id" />
                </b-tab>
            </template>
        </b-tabs>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {
        BCard,
        BRow,
        BCol, BTab, BTabs
    } from 'bootstrap-vue'
    import {get} from "@/libs/api";
    import AssetInventory from "@/tenant/views/Inventory/AssetInventory";

    export default {
        name: "Index",
        components: {
            AssetInventory,
            BCard,
            BRow,
            BCol,
            BTab,
            BTabs
        },
        data(){
            return {
                show: false,
                selectedTab: 0,
                asset_types: [],
            }
        },
        created(){
            get('/api/asset_types').then((res) => {
                Vue.set(this.$data, 'asset_types', res.data.data);
                this.show = true;
            });
        }
    }
</script>

<style scoped>

</style>
