<template>
    <div v-if="show">
        <b-row>
            <b-col cols="12">
                <template v-for="(tagType, tIndex) in mappingData">
                    <b-card-actions :title="`${tagType.title}`" action-collapse collapsed class="tag-type-card">
                        <template v-for="(tagCategory, cIndex) in tagType.categories">
                            <b-card-actions :title="`${tagCategory.title}`" action-collapse collapsed
                                            class="no-margin-bottom category-card">
                                <template v-for="(item,index) in tagCategory.tags">
                                    <b-card-actions :title="item.name" action-collapse collapsed class="no-padding-bottom tag-card">
                                        <b-row class="d-flex justify-content-center py-1">
                                            <b-col md="8">
                                                <b-row>
                                                    <b-col md="12">
                                                        <b-row>
                                                            <b-col cols="2">
                                                                <strong>Detail: </strong>
                                                            </b-col>
                                                            <b-col cols="10">{{ item.detail }}</b-col>
                                                        </b-row>
                                                        <b-row>
                                                            <b-col cols="2">
                                                                <strong>Description: </strong>
                                                            </b-col>
                                                            <b-col cols="10">{{ item.desc }}</b-col>
                                                        </b-row>

                                                    </b-col>
                                                    <b-col md="12" class="py-2" v-if="item.tag_type_id != 1">
                                                        <b-row class="mb-1">
                                                            <b-col cols="2"><strong>Frameworks: </strong></b-col>
                                                            <b-col cols="10">
                                                                <template
                                                                    v-for="(framework, fIndex) in item.frameworks">
                                                                    {{ framework.framework.name }} :
                                                                    <template
                                                                        v-for="(subcontrol, sIndex) in framework.sub_controls">
                                                                        (SC)
                                                                        {{ subcontrol.sub_control.name }},
                                                                    </template>
                                                                    <template
                                                                        v-for="(control, cIndex) in framework.controls">
                                                                        (C) {{ control.control.title }},
                                                                    </template>
                                                                    <br/>
                                                                </template>

                                                            </b-col>
                                                        </b-row>
                                                        <b-row>
                                                            <b-col cols="2"><strong>Policies: </strong></b-col>
                                                            <b-col cols="10">
                                                                <template
                                                                    v-for="(policy, pIndex) in item.policies">
                                                                    {{ policy.policy.name }} :
                                                                    <template
                                                                        v-for="(subcontrol, sIndex) in policy.sub_controls">
                                                                        (SC)
                                                                        {{ subcontrol.sub_control.name }},
                                                                    </template>
                                                                    <br/>
                                                                </template>

                                                            </b-col>
                                                        </b-row>
                                                    </b-col>
                                                    <b-col md="12" class="py-2" v-if="item.tag_type_id == 1">
                                                        <h5>Documents</h5>
                                                        <b-row>
                                                            <b-col md="12" class="my-1" v-for="(dtem,dIndex) in item.documents" :key="index">
                                                                <b-card-text>{{dIndex+1}} . <b-link :href="`/attachment/${dtem.document}`" target="_blank">{{dtem.filename}}</b-link></b-card-text>
                                                            </b-col>
                                                        </b-row>
                                                    </b-col>
                                                </b-row>
                                            </b-col>
                                            <b-col md="1">
                                                <template v-if="item.tag_type_id != 1">
                                                    <feather-icon
                                                        :id="`tag-${item.id}-edit-icon`"
                                                        icon="EditIcon"
                                                        class="cursor-pointer"
                                                        size="16"
                                                        @click="edit(item.id)"
                                                    />
                                                    <b-tooltip
                                                        :target="`tag-${item.id}-edit-icon`"
                                                        title="Edit Tag"
                                                        class="cursor-pointer"
                                                    />
                                                </template>
                                                <template v-if="item.tag_type_id == 1">
                                                    <feather-icon
                                                        :id="`tag-${item.id}-edit-evi-icon`"
                                                        icon="EditIcon"
                                                        class="cursor-pointer"
                                                        size="16"
                                                        @click="editEvidence(item.id)"
                                                    />
                                                    <b-tooltip
                                                        :target="`tag-${item.id}-edit-evi-icon`"
                                                        title="Edit Tag"
                                                        class="cursor-pointer"
                                                    />
                                                </template>

                                            </b-col>
                                        </b-row>
                                    </b-card-actions>
                                </template>
                            </b-card-actions>
                        </template>
                    </b-card-actions>
                </template>

            </b-col>
        </b-row>
        <b-sidebar id="sidebar-backdrop"
                   backdrop-variant="dark" @hidden="resetTagForm"
                   backdrop :title="`${formType} Tag`" right shadow width="50%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <TagForm v-if="showSideBar" :form-type="formType" :form-id="selectedTag" @cancel="closeSideBar" @close="saveCloseSideBar"/>
                    </div>
                </template>
            </div>
        </b-sidebar>
        <b-sidebar id="sidebar-backdrop-evidence"
                   backdrop-variant="dark" @hidden="resetTagForm"
                   backdrop :title="`${formType} Tag`" right shadow width="50%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <EvidenceTagForm v-if="showSideBarEvidence" :form-type="formType" :form-id="selectedTag" tag_type="2" @cancel="closeSideBarEvidence" @close="saveCloseSideBarEvidence"/>
                    </div>
                </template>
            </div>
        </b-sidebar>
    </div>
</template>

<script>
import {get} from "@/libs/api";
import Vue from 'vue'
import {BCard, BCardText, BLink, BRow, BCol, BBadge, BSidebar, BTooltip} from 'bootstrap-vue'
import BCardActions from "@core/components/b-card-actions/BCardActions";
import TagForm from "@/admin/views/Tags/TagForm";
import EvidenceTagForm from "@/admin/views/Evidences/form.vue";

export default {
    name: "TagMapping",
    components: {
        EvidenceTagForm,
        TagForm,
        BCardActions,
        BCard,
        BCardText,
        BLink,
        BRow,
        BCol,
        BBadge,
        BSidebar,
        BTooltip
    },
    data() {
        return {
            mappingData: null,
            show: false,
            selectedTag:null,
            showSideBar: false,
            showSideBarEvidence: false,
            formType: 'Edit',
        }
    },
    created() {
        this.reload();
    },
    methods:{
        reload(){
            this.show = false
            get('/api/view_tag_mappings').then((res) => {
                Vue.set(this.$data, 'mappingData', res.data.data);
                this.show = true
            });
        },
        edit(id) {
            this.openSideBar('Edit', id);
            // this.$router.push(`${this.resource}/${id}/edit`)
        },
        openSideBar(formType, id){
            this.formType = formType;
            this.selectedTag = id
            this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
            this.showSideBar = true;
        },
        editEvidence(id) {
            this.openSideBarEvidence('Edit', id);
            // this.$router.push(`${this.resource}/${id}/edit`)
        },
        openSideBarEvidence(formType, id){
            this.formType = formType;
            this.selectedTag = id
            this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop-evidence')
            this.showSideBarEvidence = true;
        },
        resetTagForm(){
            this.showSideBar = false;
            this.showSideBarEvidence = false
        },
        closeSideBar(){
            this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
            this.showSideBar = false;
        },
        saveCloseSideBar(){
            this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop')
            this.showSideBar = false;
            this.reload();
        },
        closeSideBarEvidence(){
            this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop-evidence')
            this.showSideBarEvidence = false;
        },
        saveCloseSideBarEvidence(){
            this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop-evidence')
            this.showSideBarEvidence = false;
            this.reload();
        }
    }
}
</script>

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

.tag-type-card {
    .card-content {
        background-color: whitesmoke !important;
    }

    .category-card {
        border-bottom: 1px solid #ddd !important;

        .card-header {
            background-color: whitesmoke !important;
        }
    }

    .category-card:last-child {
        border-bottom: none !important;
    }
}

.category-card {
    .card-content {
        background-color: aliceblue !important;
    }

    .tag-card {
        .card-header {
            background-color: aliceblue !important;
        }
    }
}

.tag-card {
    .card-content {
        background-color: rgb(221, 223, 223) !important;
    }
}
</style>
