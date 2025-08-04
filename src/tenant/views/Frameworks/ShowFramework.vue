<template>
    <div v-if="show">
        <b-card>
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
                <!--                <b-col md="12" class="mb-2">-->
                <!--                    <h5>Domains</h5>-->
                <!--                    <template v-if="model.domains.length > 0">-->
                <!--                        <b-badge class="mr-1 mb-1" v-for="(item, index) in  model.domains" :key="`domain-${item.id}`">-->
                <!--                            {{item.title}}-->
                <!--                        </b-badge>-->
                <!--                    </template>-->
                <!--                    <template v-else>-->
                <!--                        <b-badge>No Domain</b-badge>-->
                <!--                    </template>-->
                <!--                </b-col>-->
                <b-col cols="12">
                    <template v-for="(domain, dIndex) in model.domains">
                        <b-card-actions :title="`D - ${domain.title}`" action-collapse collapsed
                                        class="no-margin-bottom domain-card">
                            <template v-for="(control, cIndex) in domain.controls">
                                <b-card-actions :title="`C - ${control.title}`" collapsed action-collapse
                                                class="no-padding-bottom control-card">
                                    <template v-for="(sub_control, sIndex) in control.sub_controls">
                                        <b-row class="py-1">
                                            <b-col md="2">
                                                <strong>SC - </strong> {{sub_control.reference_code}}
                                            </b-col>
                                            <b-col md="6">
                                                {{sub_control.desc}}
                                            </b-col>
                                            <b-col md="4">
                                                <template v-if="sub_control.tags.length > 0">
                                                    <b-badge class="mr-1" v-for="(tag, index) in  sub_control.tags"
                                                             :key="`sub_control-tag-${tag.id}`">
                                                        {{tag.tag.name}}
                                                    </b-badge>
                                                </template>
                                            </b-col>
                                        </b-row>
                                    </template>
                                </b-card-actions>
                            </template>
                        </b-card-actions>
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
    import BCardActions from "@core/components/b-card-actions/BCardActions";

    export default {
        name: "ShowFramework",
        components: {
            BCardActions,
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
            get(`/api/frameworks/${this.formId}`).then((res) => {
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
<style lang="scss">
    .no-margin-bottom {
        .card {
            margin-bottom: 0px !important;
        }
    }

    .no-padding-bottom {
        .card {
            .card-body {
                padding-bottom: 0px !important;
            }
        }
    }

    .domain-card {
        border-bottom: 1px solid #ddd !important;

        .card-header {
            background-color: whitesmoke !important;
        }
    }

    .domain-card:last-child {
        border-bottom: none !important;
    }

    .domain-card {
        .card-content {
            background-color: aliceblue !important;
        }

        .control-card {
            .card-header {
                background-color: aliceblue !important;
            }
        }
    }

    .control-card {
        .card-content {
            background-color: rgb(221, 223, 223) !important;
        }
    }
</style>
