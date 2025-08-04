<template>
    <div v-if="show">
        <b-row>
            <b-col cols="12">
                <template v-for="(framework, fIndex) in mappingData">
                    <b-card-actions :title="`F - ${framework.name}`" action-collapse collapsed class="framework-card">
                        <template v-for="(domain, dIndex) in framework.domains">
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
                                                <b-col md="5">
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
                                                <b-col md="1">
                                                    <feather-icon
                                                        :id="`control-subcontrol-${sub_control.id}-edit-icon`"
                                                        icon="EditIcon"
                                                        class="cursor-pointer"
                                                        size="16"
                                                        @click="editTags(sub_control)"
                                                    />
                                                    <b-tooltip
                                                        :target="`control-subcontrol-${sub_control.id}-edit-icon`"
                                                        title="Add Tags"
                                                        class="cursor-pointer"
                                                    />
                                                </b-col>
                                            </b-row>
                                        </template>
                                    </b-card-actions>
                                </template>
                            </b-card-actions>
                        </template>
                    </b-card-actions>
                </template>
            </b-col>
        </b-row>
        <b-modal
            v-model="addTagModal"
            id="modal-prevent-closing"
            title="Update Tags"
            ok-title="Save"
            cancel-variant="outline-secondary"
            @hidden="resetModal"
            @ok="handleOk">

            <b-form-group>
                <x-tag-input :positionRelative="true" keyIndex="tag_id" :removable="true"
                           :multiple="true" :value="sub_control_data.tags" relation="tag"
                           resource="/api/search/tags" column="name" name="name"
                           @input="onTagUpdate">
                </x-tag-input>
            </b-form-group>
        </b-modal>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {get, post} from "@/libs/api";
    import {BCard, BCardText, BLink, BRow, BCol, BBadge, BTooltip, BModal, VBModal, BFormGroup} from 'bootstrap-vue'
    import BCardActions from "@core/components/b-card-actions/BCardActions";
    import XTagInput from "@/components/Form/TagInput";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";

    export default {
        name: "MappingStructure",
        components: {
            XTagInput,
            BFormGroup,
            BModal,
            BCardActions,
            BCard,
            BCardText,
            BLink,
            BRow,
            BCol,
            BBadge, BTooltip
        },
        directives: {
            'b-modal': VBModal,
        },
        data() {
            return {
                mappingData: null,
                show: false,
                sub_control_data:{
                    tags: null
                },
                addTagModal:false,
            }
        },
        created() {
            get(`/api/view_mappings`).then((res) => {
                Vue.set(this.$data, 'mappingData', res.data.data);
                this.show = true
            });
        },
        methods: {
            editTags(data){
                this.sub_control_data = Object.assign({}, data);
                Vue.set(this.$data, 'addTagModal', true)
            },
            resetModal(){
                this.sub_control_data = {
                    tags : null
                }
            },
            handleOk(bvModalEvt) {
                bvModalEvt.preventDefault()
                this.updateTags()
            },
            updateTags() {
                post('/api/sub_control_update_tags', this.sub_control_data).then(res => {
                    if (res.data.saved) {
                        this.resetModal()
                        Vue.set(this.$data, 'addTagModal', false)
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text:  'Tags Updated Successfully',
                                variant:'success'
                            },
                        })
                    }
                })
            },
            onTagUpdate(e) {
                Vue.set(this.$data.sub_control_data, 'tags', e);
                for(var i=0; i<this.sub_control_data.tags.length;i++){
                    Vue.set(this.$data.sub_control_data.tags[i],'framework_id', this.sub_control_data.framework_id);
                }
            }
        }
    }
</script>

<style scoped>
    h6 {
        margin-left: 2rem !important;
    }
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

    .framework-card {
        .card-content {
            background-color: whitesmoke !important;
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

    /*body {*/
    /*    &.dark-layout {*/
    /*        .framework-card {*/
    /*            .card-content {*/
    /*                background-color: #161d31 !important;*/
    /*            }*/

    /*            .domain-card {*/
    /*                border-bottom: 1px solid !important;*/

    /*                .card-header {*/
    /*                    background-color: #161d31 !important;*/
    /*                }*/
    /*            }*/
    /*        }*/
    /*    }*/
    /*}*/
</style>
