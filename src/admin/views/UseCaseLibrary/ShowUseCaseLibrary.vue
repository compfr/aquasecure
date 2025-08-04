<template>
    <div v-if="show">
        <b-card>
            <b-row>
                <b-col md="8" class="mb-2">
                    <h5>Name</h5>
                    <b-card-text>{{model.name}}</b-card-text>
                </b-col>
                <b-col md="4" class="mb-2">
                    <h5>Category</h5>
                    <b-card-text>{{model.category.title}}</b-card-text>
                </b-col>
                <b-col md="12" class="mb-2">
                    <h5>Description</h5>
                    <b-card-text>{{model.description ?? 'No Description'}}</b-card-text>
                </b-col>
                <b-col md="12" class="mb-2">
                    <h5>Narratives</h5>
                    <b-card-text>{{model.narratives ?? 'No Narratives'}}</b-card-text>
                </b-col>
                <b-col md="12" class="mb-2">
                    <h5>References</h5>
                    <b-card-text>{{model.references ?? 'No References'}}</b-card-text>
                </b-col>
            </b-row>
        </b-card>
        <b-card title="Queries">
            <template v-for="(item, index) in model.queries">
                <b-row>
                    <b-col md="3">
                        <div class="d-flex flex-column align-items-center">
                            <b-img :src="item.api_type.logo" height="50" width="50" class="mb-1"/>
                            <h5 class="mb-0">{{item.api_type.title}}</h5>
                        </div>
                    </b-col>
                    <b-col md="9">
                        <b-card-text>{{item.query}}</b-card-text>
                    </b-col>
                </b-row>
                <hr/>
            </template>
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
    BBadge, BImg
} from 'bootstrap-vue'
import {get} from '@/libs/api'
export default {
    name: "ShowUseCaseLibrary",
    components: {
        BCard,
        BCardText,
        BRow,
        BCol,
        BButton,
        BBadge, BImg
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
        get(`/api/use_case_libraries/${this.formId}`).then((res) => {
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
