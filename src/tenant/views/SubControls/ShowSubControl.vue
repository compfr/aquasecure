<template>
    <div v-if="show">
        <b-card>
            <b-row>
                <b-col md="12" class="mb-2">
                    <h5>Control</h5>
                    <template v-if="model.control">
                        <b-badge>
                            {{model.control.title}}
                        </b-badge>
                    </template>
                    <template v-else>
                        <b-badge>No Controls</b-badge>
                    </template>
                </b-col>
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
    name: "ShowSubControl",
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
        get(`/api/sub_controls/${this.formId}`).then((res) => {
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
