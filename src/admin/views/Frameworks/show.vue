<template>
    <div v-if="show">
        <b-card>
            <b-row>
                <b-col>
                    <h3>Framework Detail</h3>
                </b-col>
                <b-col cols="6">
                    <b-button

                        type="submit"
                        variant="primary"
                        class="mr-1 mb-1 float-right"
                        :to="{name:'view-frameworks'}"
                    >
                        Back
                    </b-button>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="6" class="mb-2">
                    <h5>Name</h5>
                    <b-card-text>{{model.name}}</b-card-text>
                </b-col>
                <b-col md="6" class="mb-2">
                    <h5>Reference Code</h5>
                    <b-card-text>{{model.reference_code}}</b-card-text>
                </b-col>
                <b-col md="6" class="mb-2">
                    <h5>Framework Type</h5>
                    <b-card-text v-if="model.framework_type_id">{{model.framework_type.title}}</b-card-text>
                    <b-card-text v-else>No Framework Type</b-card-text>
                </b-col>
                <b-col md="6" class="mb-2">
                    <h5>Framework Category</h5>
                    <b-card-text v-if="model.framework_category_id">{{model.framework_category.title}}</b-card-text>
                    <b-card-text v-else>No Category</b-card-text>
                </b-col>
                <b-col md="6" class="mb-2">
                    <h5>Description</h5>
                    <b-card-text>{{model.desc}}</b-card-text>
                </b-col>
                <b-col md="3" class="mb-2">
                    <h5>Release Date</h5>
                    <b-card-text>{{model.release_date | formatDate}}</b-card-text>
                </b-col>
                <b-col md="3" class="mb-2">
                    <h5>Status</h5>
                    <b-card-text>{{model.status == 1 ? 'Active' : 'De-active'}}</b-card-text>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="12" class="mb-2">
                    <h5>Domains</h5>
                    <template v-if="model.domains.length > 0">
                        <b-badge class="mr-1 mb-1" v-for="(item, index) in  model.domains" :key="`domain-${item.id}`">
                            {{item.domain.title}}
                        </b-badge>
                    </template>
                    <template v-else>
                        <b-badge>No Domain</b-badge>
                    </template>
                </b-col>
                <b-col md="12" class="mb-2">
                    <h5>Direct Controls</h5>
                    <template v-if="model.controls.length > 0">
                        <b-badge class="mr-1" v-for="(item, index) in  model.controls" :key="`control-${item.id}`">
                            {{item.control.title}}
                        </b-badge>
                    </template>
                    <template v-else>
                        <b-badge>No Directly Linked Control</b-badge>
                    </template>
                </b-col>
                <b-col md="12" class="mb-2">
                    <h5>Direct Sub-Controls</h5>
                    <template v-if="model.sub_controls.length > 0">
                        <b-badge class="mr-1" v-for="(item, index) in  model.sub_controls" :key="`sub_control-${item.id}`">
                            {{item.sub_control.title}}
                        </b-badge>
                    </template>
                    <template v-else>
                        <b-badge>No Directly Linked Sub-Controls</b-badge>
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
        name: "show",
        components: {
            BCard,
            BCardText,
            BRow,
            BCol,
            BButton,
            BBadge
        },
        data() {
            return {
                show: false,
                model: null
            }
        },
        created() {
            get(`/api/frameworks/${this.$route.params.id}`).then((res) => {
                Vue.set(this.$data, 'model', res.data.model);
                this.show = true
            });
        },
        methods: {
            toggleViewKey(index) {
                this.model.controls[index].toggle_key = !this.model.controls[index].toggle_key;
            }
        }
    }
</script>

<style scoped>

</style>
