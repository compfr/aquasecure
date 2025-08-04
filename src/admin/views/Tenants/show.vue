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
                    <b-card-text>{{model.framework_type.title}}</b-card-text>
                </b-col>
                <b-col md="6" class="mb-2">
                    <h5>Category</h5>
                    <b-card-text>{{model.category == null ? 'No category' : model.category}}</b-card-text>
                </b-col>
                <b-col md="12" class="mb-2">
                    <h5>Description</h5>
                    <b-card-text>{{model.desc}}</b-card-text>
                </b-col>

                <b-col md="6" class="mb-2">
                    <h5>Policy Content</h5>
                    <b-card-text>{{model.policy_content}}</b-card-text>
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
                    <hr />
                </b-col>
            </b-row>
            <b-row v-if="model.controls.length > 0">
                <b-col cols="12">
                    <h3>Controls</h3>
                </b-col>
                <b-col cols="12">
                    <table class="table">
                        <thead class="thead-light">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Ref. Code</th>
                            <th scope="col">Desc</th>
                            <th scope="col">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        <template v-for="(item, index) in model.controls">
                            <tr :key="`control-${index}`">
                                <th scope="row">{{index+1}}</th>
                                <td>{{item.control.name}}</td>
                                <td>{{item.control.reference_code}}</td>
                                <td>{{item.control.desc}}</td>
                                <td>
                                    <feather-icon v-if="item.control.sub_controls.length > 0"
                                        :id="`user-row-${item.id}-eye-icon`"
                                        icon="EyeIcon"
                                        class="cursor-pointer"
                                        size="16"
                                        @click="toggleViewKey(index)"
                                    />
                                </td>
                            </tr>
                            <tr v-if="item.toggle_key">
                                <td colspan="5">
                                    <div class="mx-3">
                                        <b-row>
                                            <b-col cols="12">
                                                <h5>Sub Controls</h5>
                                            </b-col>
                                            <b-col cols="12">
                                                <table class="table">
                                                    <thead class="thead-dark">
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">Name</th>
                                                        <th scope="col">Ref. Code</th>
                                                        <th scope="col">Desc</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <template v-for="(sItem, sIndex) in item.control.sub_controls">
                                                        <tr :key="`sub_control-${sIndex}`">
                                                            <th scope="row">{{sIndex+1}}</th>
                                                            <td>{{sItem.name}}</td>
                                                            <td>{{sItem.reference_code}}</td>
                                                            <td>{{sItem.desc}}</td>
                                                        </tr>
                                                    </template>
                                                    </tbody>
                                                </table>
                                            </b-col>
                                        </b-row>
                                    </div>
                                </td>
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
        created(){
            get(`/api/frameworks/${this.$route.params.id}`).then((res)=>{
                Vue.set(this.$data,'model', res.data.model);
                this.show = true
            });
        },
        methods:{
            toggleViewKey(index){
                this.model.controls[index].toggle_key = !this.model.controls[index].toggle_key;
            }
        }
    }
</script>

<style scoped>

</style>
