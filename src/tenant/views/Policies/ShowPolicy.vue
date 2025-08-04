<template>
    <div v-if="show">
        <b-card>
            <b-row>
                <b-col md="6" class="mb-2">
                    <h5>Name</h5>
                    <b-card-text>{{model.name ?? 'N/A'}}</b-card-text>
                </b-col>
                <b-col md="6" class="mb-2">
                    <h5>Reference Code</h5>
                    <b-card-text>{{model.reference_code ?? 'N/A'}}</b-card-text>
                </b-col>

                <b-col md="12" class="mb-2">
                    <h5>Description</h5>
                    <b-card-text>{{model.desc ?? 'N/A'}}</b-card-text>
                </b-col>

                <b-col md="6" class="mb-2">
                    <h5>Policy Content</h5>
                    <b-card-text>{{model.policy_content ?? 'N/A'}}</b-card-text>
                </b-col>
                <b-col md="3" class="mb-2">
                    <h5>Release Date</h5>
                    <b-card-text>{{model.release_date | formatDate}}</b-card-text>
                </b-col>
                <b-col md="3" class="mb-2">
                    <h5>Status</h5>
                    <b-card-text>{{model.status == 1 ? 'Active' : 'De-active'}}</b-card-text>
                </b-col>
                <b-col cols="12">
                    <hr/>
                </b-col>
            </b-row>
            <b-row >
                <b-col md="12" class="mb-2">
                    <h5>Sub-Controls</h5>
                    <template v-if="model.sub_controls.length > 0">
                        <b-badge class="mr-1 mb-1" v-for="(item, index) in  model.sub_controls" :key="`sub_control-${item.id}`">
                            {{item.title}}
                        </b-badge>
                    </template>
                    <template v-else>
                        <b-badge>No Sub-Controls</b-badge>
                    </template>
                </b-col>
            </b-row>
        </b-card>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {
        BCard,
        BCardText,
        BRow,
        BCol,
        BButton,BBadge
    } from 'bootstrap-vue'
    import {get} from '@/libs/api'

    export default {
        name: "ShowPolicy",
        components: {
            BCard,
            BCardText,
            BRow,
            BCol,
            BButton,
            BBadge
        },
        props: {
            formId: Number
        },
        data() {
            return {
                show: false,
                model: null
            }
        },
        created() {
            get(`/api/policies/${this.formId}`).then((res) => {
                Vue.set(this.$data, 'model', res.data.model);
                this.show = true
            });
        },
        methods: {
            // toggleViewKey(index) {
            //     this.model.controls[index].toggle_key = !this.model.controls[index].toggle_key;
            // }
        }
    }
</script>

<style scoped>

</style>
