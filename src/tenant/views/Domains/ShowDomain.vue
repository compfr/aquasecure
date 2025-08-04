<template>
    <div v-if="show">
        <b-card>
            <b-row>
                <b-col md="12" class="mb-2">
                    <h5>Frameworks</h5>
                    <template v-if="model.framework">
                        <b-badge class="mr-1">
                            {{model.framework.title}}
                        </b-badge>
                    </template>
                    <template v-else>
                        <b-badge>No Framework</b-badge>
                    </template>
                </b-col>
                <b-col md="8" class="mb-2">
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
                        <b-badge class="mr-1 mb-1" v-for="(item, index) in  model.controls" :key="`control-${index}`">
                            {{item.title}}
                        </b-badge>
                    </template>
                    <template v-else>
                        <b-badge>No Control</b-badge>
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
    name: "ShowDomain",
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
        get(`/api/domains/${this.formId}`).then((res) => {
            Vue.set(this.$data, 'model', res.data.model);
            this.show = true
        });
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        cancelForm(){
            this.$emit('cancel');
        }
    }
}
</script>

<style scoped>

</style>
