<template>
    <div v-if="show">
        <b-card>
            <b-row>
                <b-col>
                    <h3>Tag Detail</h3>
                </b-col>
                <b-col cols="6">
                    <b-button

                        type="submit"
                        variant="primary"
                        class="mr-1 mb-1 float-right"
                        :to="{name:'view-tags'}"
                    >
                        Back
                    </b-button>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="4" class="mb-2">
                    <h5>Name</h5>
                    <b-card-text>{{model.title}}</b-card-text>
                </b-col>
                <b-col cols="12">
                    <hr/>
                </b-col>
            </b-row>
        </b-card>
        <b-row v-if="model.tags.length > 0">
            <b-col cols="12">
                <h3 class="mb-2">Tags</h3>
            </b-col>
            <b-col cols="12">
                <template v-for="(item,index) in model.tags">
                    <b-card-actions :title="item.name" action-collapse collapsed>
                        <b-row class="d-flex justify-content-center align-items-center">
                            <b-col md="8">
                                <b-row>
                                    <b-col md="12">
                                        <b-row>
                                            <b-col cols="2">
                                                <strong>Detail: </strong>
                                            </b-col>
                                            <b-col cols="10">{{item.detail}}</b-col>
                                        </b-row>
                                        <b-row>
                                            <b-col cols="2">
                                                <strong>Description: </strong>
                                            </b-col>
                                            <b-col cols="10">{{item.desc}}</b-col>
                                        </b-row>

                                    </b-col>
                                    <b-col md="12" class="py-2">
                                        <b-row>
                                            <b-col cols="2"><strong>Frameworks: </strong></b-col>
                                            <b-col cols="10">
                                                <template v-for="(framework, fIndex) in item.frameworks">
                                                    {{framework.framework.name}} :
                                                    <template
                                                        v-for="(subcontrol, sIndex) in framework.sub_controls">
                                                        (SC) {{subcontrol.sub_control.sub_control.name}},
                                                    </template>
                                                    <template
                                                        v-for="(control, cIndex) in framework.controls">
                                                        (C) {{control.control.control.title}},
                                                    </template>
                                                    <br/>
                                                </template>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-row>
                    </b-card-actions>
                </template>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {
        BCard,
        BCardText,
        BRow,
        BCol,
        BButton,
        BBadge
    } from 'bootstrap-vue'
    import {get} from '@/libs/api'
    import BCardActions from "@core/components/b-card-actions/BCardActions";

    export default {
        name: "show",
        components: {
            BCardActions,
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
            get(`/api/tags/${this.$route.params.id}`).then((res) => {
                Vue.set(this.$data, 'model', res.data.model);
                this.show = true
            });
        }
    }
</script>

<style scoped>

</style>
