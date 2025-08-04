<template>
    <div v-if="show">
        <b-card>
            <b-row>
                <b-col>
                    <h3>Domain Detail</h3>
                </b-col>
                <b-col cols="6">
                    <b-button

                        type="submit"
                        variant="primary"
                        class="mr-1 mb-1 float-right"
                        @click="goBack"
                    >
                        Back
                    </b-button>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="4" class="mb-2">
                    <h5>Name</h5>
                    <b-card-text>{{model.name}}</b-card-text>
                </b-col>
                <b-col md="4" class="mb-2">
                    <h5>Reference Code</h5>
                    <b-card-text>{{model.reference_code}}</b-card-text>
                </b-col>
                <b-col md="12" class="mb-2">
                    <h5>Description</h5>
                    <b-card-text>{{model.desc}}</b-card-text>
                </b-col>
                <b-col md="12" class="mb-2">
                    <h5>Controls</h5>
                    <template v-if="model.controls.length > 0">
                        <b-badge class="mr-1" v-for="(item, index) in  model.controls" :key="`control-${item.id}`">
                            {{item.control.title}}
                        </b-badge>
                    </template>
                    <template v-else>
                        <b-badge>No Control</b-badge>
                    </template>
                </b-col>
                <b-col md="12" class="mb-2">
                    <h5>Frameworks</h5>
                    <template v-if="model.frameworks.length > 0">
                        <b-badge class="mr-1" v-for="(item, index) in  model.frameworks" :key="`framework-${item.id}`">
                            {{item.framework.title}}
                        </b-badge>
                    </template>
                    <template v-else>
                        <b-badge>No Framework</b-badge>
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
        BButton,
        BBadge
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
            get(`/api/domains/${this.$route.params.id}`).then((res) => {
                Vue.set(this.$data, 'model', res.data.model);
                this.show = true
            });
        },
        methods:{
            goBack(){
                this.$router.go(-1);
            }
        }
    }
</script>

<style scoped>

</style>
