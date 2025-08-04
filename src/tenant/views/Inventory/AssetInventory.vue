<template>
    <div>
        <b-card>
            <b-row>
                <b-col cols="12">
                    <table class="table table-responsive">
                        <thead>
                        <template v-for="(cItem,cIndex) in column">
                            <th>{{cItem.toUpperCase()}}</th>
                        </template>
                        </thead>
                        <tbody>
                        <template v-for="(item, index) in inventory">
                            <tr>
                                <template v-for="(cItem, cIndex) in column">
                                    <td>{{item[cItem] ?? ''}}</td>
                                </template>
                            </tr>
                        </template>
                        </tbody>
                    </table>
                </b-col>
            </b-row>
        </b-card>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {
        BCard,
        BRow,
        BCol
    } from 'bootstrap-vue'
    import {get} from "@/libs/api";
    export default {
        name: "AssetInventory",
        components: {
            BCard,
            BRow,
            BCol
        },
        props:{
          asset_type_id: {
              type: Number
          }
        },
        data(){
            return {
                column:[],
                inventory:[]
            }
        },
        created(){
            get(`/api/get_inventory?asset_type_id=${this.asset_type_id}`).then((res)=>{
                Vue.set(this.$data,'column', res.data.columns)
                Vue.set(this.$data,'inventory', res.data.inventory)
            });
        },
    }
</script>

<style scoped>

</style>
