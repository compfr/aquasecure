<template>
    <div v-if="show">
        <b-row>
            <template v-for="(item, index) in api_data">
                <b-col md="3">
                    <b-card>
                        <div class="d-flex flex-column align-items-center">
                            <b-img :src="item.logo" height="90" width="90" class="mb-2"/>
                            <h4 class="mb-1">{{item.title}}</h4>
                            <b-card-text class="text-center">{{item.description}}</b-card-text>
                        </div>
                        <div class="position-right-0 position-top-0 position-absolute m-1">
                            <feather-icon
                                size="15"
                                icon="EyeIcon"
                                @click="showLabels(item)"
                            />
                            <feather-icon
                                class="ml-1"
                                size="15"
                                icon="PlusIcon"
                                @click="addLabel(item)"
                            />
                        </div>
                    </b-card>
                </b-col>
            </template>
        </b-row>

        <b-sidebar id="sidebar-labels"
                   backdrop-variant="dark" @hidden="resetLabelShow"
                   backdrop :title="`List Labels`" right shadow width="50%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <ApiTypeLabelShow v-if="showLabelSideBar" :model="selectedApiType" />
                    </div>
                </template>
            </div>
        </b-sidebar>

        <b-sidebar id="sidebar-backdrop"
                   backdrop-variant="dark" @hidden="resetLabelForm"
                   backdrop :title="`Add Label`" right shadow width="50%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <FormLabel v-if="showFormSideBar" form-type="Add" :form-id="0" :api-type="selectedApiType"
                                   @cancel="closeSideBar" @close="saveCloseSideBar"/>
                    </div>
                </template>
            </div>
        </b-sidebar>

    </div>
</template>

<script>
    import Vue from 'vue'
    import {
        BCard,
        BRow,
        BCol,
        BImg,
        BButton,
        BCardText,
        BLink,
        BTooltip,
        BFormGroup,
        BFormInput, BBadge, BFormFile, BSidebar
    } from 'bootstrap-vue'
    import {get} from "@/libs/api";
    import ApiTypeLabelShow from "@/admin/views/API/ApiTypeLabelShow";
    import ApiTypeLabelForm from "@/admin/views/API/ApiTypeLabelForm";
    import FormLabel from "@/admin/views/Reports/Labels/FormLabel";

    export default {
        name: "IntegrationCard",
        components: {
            FormLabel,
            ApiTypeLabelForm,
            ApiTypeLabelShow,
            BCard,
            BRow,
            BCol,
            BImg,
            BButton,
            BCardText,
            BSidebar
        },
        data() {
            return {
                show: false,
                api_data: [],
                showLabelSideBar: false,
                selectedApiType: null,
                showFormSideBar: false
            }
        },
        created() {
            this.reload();
        },
        methods:{
            reload(){
                this.show = false;
                get('/api/get_api_types').then((res) => {
                    Vue.set(this.$data, 'api_data', res.data.data);
                    this.show = true;
                })
            },
            showLabels(data){
                this.selectedApiType = data
                this.$root.$emit('bv::toggle::collapse', 'sidebar-labels')
                this.showLabelSideBar = true;
            },
            resetLabelShow() {
                this.showLabelSideBar = false;
            },
            addLabel(data) {
                this.selectedApiType = data
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showFormSideBar = true;
            },
            resetLabelForm() {
                this.showFormSideBar = false;
            },
            closeSideBar(){
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showFormSideBar = false;
            },
            saveCloseSideBar(){
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
                this.showSideBar = false;
                this.reload();
            },
        }
    }
</script>

<style scoped>

</style>
