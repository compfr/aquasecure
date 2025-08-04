<template>
    <div v-if="show">
        <b-card>
            <b-row>
                <b-col>
                    <h3>Assets Detail</h3>
                </b-col>
                <b-col cols="6">
                    <b-button

                        type="submit"
                        variant="primary"
                        class="mr-1 mb-1 float-right"
                        :to="{name:'view-assets'}"
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
                    <h5>Value</h5>
                    <b-card-text>{{model.value}}</b-card-text>
                </b-col>
                <b-col md="4" class="mb-2">
                    <h5>Value</h5>
                    <b-card-text>{{model.assets_type}}</b-card-text>
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
    } from 'bootstrap-vue'
    import {get} from '@/libs/api'

    export default {
        name: "show",
        components: {
            BCard,
            BCardText,
            BRow,
            BCol,
            BButton
        },
        data() {
            return {
                show: false,
                model: null
            }
        },
        created() {
            get(`/api/assets/${this.$route.params.id}`).then((res) => {
                Vue.set(this.$data, 'model', res.data.model);
                this.show = true
            });
        }
    }
</script>

<style scoped>

</style>
