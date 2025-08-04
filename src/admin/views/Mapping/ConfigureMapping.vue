<template>
    <div>
        <b-row class="mb-2">
            <b-col cols="6" class="framework-scroll">
                <div class="d-flex flex-row justify-content-between">
                    <b-form-group label="is Framework?" class="w-25">
                        <b-form-checkbox v-model="cloneIsFramework" switch/>
                    </b-form-group>
                    <b-form-group v-if="cloneIsFramework" class="w-75"
                                  label="Existing Framework">
                        <x-tag-input class="mb-2" :value="cloneFramework" @input="onCloneFrameworkUpdate"
                                     name="title" resource="/api/search/clone_frameworks"/>
                    </b-form-group>
                    <b-form-group v-else
                                  label="Existing Policy" class="w-75">
                        <x-tag-input class="mb-2" :value="clonePolicy" @input="onClonePolicyUpdate"
                                     name="title" resource="/api/search/clone_policies"/>
                    </b-form-group>
                </div>

                <div class="list-group" v-if="cloneFramework != null && cloneIsFramework">
                    <div class="list-group-item">{{cloneFramework.title}}</div>
                    <draggable class="list-group domain-group" :list="cloneFramework.domains" no-transition-on-drag
                               handle=".handle" :sort="false" :clone="cloneDomain" @change="log"
                               :group="{ name: 'domains', pull: 'clone', put: false }">
                        <div v-for="(domain, dIndex) in cloneFramework.domains" :key="`domain-${dIndex}`">
                            <div class="list-group-item domain-padding">
                                <span class="text">(D)</span>
                                <feather-icon icon="MenuIcon" class="handle"/>
                                <span class="text">{{ domain.title }} </span>
                            </div>
                            <draggable class="list-group control-group" :list="domain.controls" no-transition-on-drag
                                       handle=".handle" :sort="false" :clone="cloneControl"
                                       :group="{ name: 'controls', pull: 'clone', put: false }">
                                <div v-for="(control, cIndex) in domain.controls" :key="`control-${cIndex}`">
                                    <div class="list-group-item control-padding">
                                        <span class="text">(C)</span>
                                        <feather-icon icon="MenuIcon" class="handle"/>
                                        <span class="text">{{ control.title }} </span>
                                    </div>
                                    <draggable class="list-group sub-control-group" :list="control.sub_controls"
                                               handle=".handle" :sort="false" :clone="cloneSubControl"
                                               no-transition-on-drag
                                               :group="{ name: 'sub_controls', pull: 'clone', put: false }">
                                        <div v-for="(sub_control, scIndex) in control.sub_controls"
                                             class="list-group-item sub-control-padding"
                                             :key="`sub-control-${scIndex}`">
                                            <span class="text">(SC)</span>
                                            <feather-icon icon="MenuIcon" class="handle"/>
                                            <span :id="`clone-d-${dIndex}-c-${cIndex}-sc-${scIndex}`" class="text mr-1">{{ sub_control.name }} - {{sub_control.desc.length > 50 ? sub_control.desc.substring(0,49)+'...' : sub_control.desc }}</span>
                                            <b-tooltip
                                                :target="`clone-d-${dIndex}-c-${cIndex}-sc-${scIndex}`"
                                                :title="`${sub_control.name} - ${sub_control.desc}`"
                                                class="cursor-pointer"
                                            />
                                            <template v-if="sub_control.tags.length > 0">
                                                <b-badge class="mr-1" v-for="(tag, index) in  sub_control.tags"
                                                         :key="`sub_control-tag-${tag.id}`">
                                                    {{tag.tag.name}}
                                                </b-badge>
                                            </template>
                                        </div>
                                    </draggable>
                                </div>
                            </draggable>
                        </div>
                    </draggable>
                </div>
                <div class="list-group" v-if="clonePolicy != null && !cloneIsFramework">
                    <div class="list-group-item">{{clonePolicy.title}}</div>
                    <draggable class="list-group sub-control-group" :list="clonePolicy.sub_controls"
                               handle=".handle" :sort="false" :clone="cloneSubControl"
                               no-transition-on-drag
                               :group="{ name: 'sub_controls', pull: 'clone', put: false }">
                        <div v-for="(sub_control, scIndex) in clonePolicy.sub_controls"
                             class="list-group-item domain-padding"
                             :key="`sub-control-${scIndex}`">
                            <span class="text">(SC)</span>
                            <feather-icon icon="MenuIcon" class="handle"/>
                            <span :id="`clone-p-sc-${scIndex}`" class="text mr-1">{{ sub_control.name }} - {{sub_control.desc.length > 50 ? sub_control.desc.substring(0,49)+'...' : sub_control.desc }}</span>
                            <b-tooltip
                                :target="`clone-p-sc-${scIndex}`"
                                :title="`${sub_control.name} - ${sub_control.desc}`"
                                class="cursor-pointer"
                            />
                            <template v-if="sub_control.tags.length > 0">
                                <b-badge class="mr-1" v-for="(tag, index) in  sub_control.tags"
                                         :key="`sub_control-tag-${tag.id}`">
                                    {{tag.tag.name}}
                                </b-badge>
                            </template>
                        </div>
                    </draggable>
                </div>

            </b-col>
            <b-col cols="6" class="framework-scroll">
                <div class="d-flex flex-row justify-content-between">
                    <b-form-group label="is Framework?" class="w-25">
                        <b-form-checkbox v-model="dataIsFramework" switch/>
                    </b-form-group>
                    <b-form-group v-if="dataIsFramework"
                                  label="New Framework" class="w-75">
                        <b-input-group class="mb-2">
                            <x-tag-input class="tag-input-group" :value="dataFramework" @input="onDataFrameworkUpdate"
                                         name="title" resource="/api/search/clone_frameworks"/>
                            <template #append>
                                <b-button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                    @click="submitFramework"
                                >
                                    Submit
                                </b-button>
                            </template>
                        </b-input-group>
                    </b-form-group>
                    <b-form-group v-else
                                  label="New Policy" class="w-75">
                        <b-input-group class="mb-2">
                            <x-tag-input class="tag-input-group" :value="dataPolicy" @input="onDataPolicyUpdate"
                                         name="title" resource="/api/search/clone_policies"/>
                            <template #append>
                                <b-button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                    @click="submitPolicy"
                                >
                                    Submit
                                </b-button>
                            </template>
                        </b-input-group>
                    </b-form-group>
                </div>
                <div class="list-group data-framework mb-5" v-if="dataFramework != null && dataIsFramework">
                    <div class="list-group-item">{{dataFramework.title}}</div>
                    <draggable class="list-group" :list="dataFramework.domains" no-transition-on-drag
                               handle=".handle" group="domains" @change="log">
                        <div v-for="(domain, dIndex) in dataFramework.domains" :key="`clone-domain-${dIndex}`">
                            <div
                                class="list-group-item domain-padding d-flex flex-row align-items-center justify-content-between">
                                <div class="d-flex flex-row align-items-center">
                                    <span class="text">(D)</span>
                                    <feather-icon icon="MenuIcon" class="handle"/>
                                    <b-form-input class="w-25 mx-1" v-model="domain.reference_code"/>
                                    <span class="text">{{ domain.name }} </span>
                                </div>
                                <feather-icon v-if="!('id' in domain)" icon="XIcon" size="16"
                                              @click="removeDomain(dIndex)"/>
                            </div>
                            <draggable class="list-group" :list="domain.controls" @change="log" no-transition-on-drag
                                       handle=".handle" group="controls">
                                <div v-for="(control, cIndex) in domain.controls" :key="`clone-control-${cIndex}`">
                                    <div
                                        class="list-group-item control-padding d-flex flex-row align-items-center justify-content-between">
                                        <div class="d-flex flex-row align-items-center">
                                            <span class="text">(C)</span>
                                            <feather-icon icon="MenuIcon" class="handle"/>
                                            <b-form-input class="w-25 mx-1" v-model="control.reference_code"/>
                                            <span class="text">{{ control.name }} </span>
                                        </div>
                                        <feather-icon v-if="!('id' in control)" icon="XIcon" size="16"
                                                      @click="removeControl(dIndex,cIndex)"/>
                                    </div>
                                    <draggable class="list-group" :list="control.sub_controls"
                                               handle=".handle" no-transition-on-drag
                                               group="sub_controls">
                                        <div v-for="(sub_control, scIndex) in control.sub_controls"
                                             class="list-group-item sub-control-padding d-flex align-items-centers justify-content-between"
                                             :key="`clone-sub-control-${scIndex}`">
                                            <div class="d-flex flex-row align-items-center">
                                                <span class="text">(SC)</span>
                                                <feather-icon icon="MenuIcon" class="handle"/>
                                                <b-form-input class="w-25 mx-1" v-model="sub_control.reference_code"/>
                                                <span :id="`dataF-d-${dIndex}-c-${cIndex}-sc-${scIndex}`" class="text mr-1">{{sub_control.desc.length > 50 ? sub_control.desc.substring(0,49)+'...' : sub_control.desc }}</span>
                                                <b-tooltip
                                                    :target="`dataF-d-${dIndex}-c-${cIndex}-sc-${scIndex}`"
                                                    :title="`${sub_control.desc}`"
                                                    class="cursor-pointer"
                                                />
                                            </div>
                                            <feather-icon v-if="!('id' in sub_control)" icon="XIcon" size="16"
                                                          @click="removeSubControl(dIndex,cIndex,scIndex)"/>
                                        </div>
                                    </draggable>
                                </div>
                            </draggable>
                        </div>
                    </draggable>
                </div>
                <div class="list-group data-framework mb-5" v-if="dataPolicy != null && !dataIsFramework">
                    <div class="list-group-item">{{dataPolicy.title}}</div>
                    <draggable class="list-group" :list="dataPolicy.sub_controls"
                               handle=".handle" no-transition-on-drag
                               group="sub_controls">
                        <div v-for="(sub_control, scIndex) in dataPolicy.sub_controls"
                             class="list-group-item sub-control-padding d-flex align-items-centers justify-content-between"
                             :key="`clone-sub-control-${scIndex}`">
                            <div class="d-flex flex-row align-items-center">
                                <span class="text">(SC)</span>
                                <feather-icon icon="MenuIcon" class="handle"/>
                                <b-form-input class="w-25 mx-1" v-model="sub_control.reference_code"/>
                                <span :id="`dataP-sc-${scIndex}`" class="text mr-1">{{sub_control.desc.length > 50 ? sub_control.desc.substring(0,49)+'...' : sub_control.desc }}</span>
                                <b-tooltip
                                    :target="`dataP-sc-${scIndex}`"
                                    :title="`${sub_control.desc}`"
                                    class="cursor-pointer"
                                />
                            </div>
                            <feather-icon v-if="!('id' in sub_control)" icon="XIcon" size="16"
                                          @click="removePolicySubControl(scIndex)"/>
                        </div>
                    </draggable>
                </div>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    import {
        BRow,
        BCol, BFormInput, BFormGroup, BInputGroup, BButton, BFormCheckbox, BBadge, BTooltip
    } from 'bootstrap-vue'
    import XTagInput from "@/components/Form/TagInput";
    import Vue from 'vue'
    import {post} from "@/libs/api";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";
    import {form} from "@/libs/mixins";

    export default {
        name: "ConfigureMapping",
        components: {
            XTagInput,
            BRow,
            BCol,
            BFormInput,
            BFormGroup,
            BInputGroup,
            BButton,
            BFormCheckbox,
            BBadge,
            BTooltip,
            draggable
        },
        mixins: [form],
        data() {
            return {
                loading: false,
                cloneFramework: null,
                clonePolicy: null,
                cloneIsFramework: true,
                dataFramework: null,
                dataPolicy: null,
                dataIsFramework: true,
            };
        },
        methods: {
            log: function (evt) {
                console.log(evt);
            },
            dragoverLog: function (evt) {
                console.log('drag_over');
                console.log(evt);
            },
            onCloneFrameworkUpdate(e) {
                Vue.set(this.$data, 'cloneFramework', e)
                Vue.set(this.$data, 'clonePolicy', null)
            },
            onDataFrameworkUpdate(e) {
                Vue.set(this.$data, 'dataFramework', e)
                Vue.set(this.$data, 'dataPolicy', null)
            },
            onClonePolicyUpdate(e) {
                Vue.set(this.$data, 'clonePolicy', e)
                Vue.set(this.$data, 'cloneFramework', null)
            },
            onDataPolicyUpdate(e) {
                Vue.set(this.$data, 'dataPolicy', e)
                Vue.set(this.$data, 'dataFramework', null)
            },
            cloneDomain(e) {
                return {
                    controls: [],
                    desc: e.desc,
                    framework_id: null,
                    name: e.name,
                    reference_code: e.reference_code
                }
            },
            cloneControl(e) {
                return {
                    sub_controls: [],
                    desc: e.desc,
                    framework_id: null,
                    domain_id: null,
                    name: e.name,
                    reference_code: e.reference_code
                };
            },
            cloneSubControl(e) {
                return {
                    desc: e.desc,
                    framework_id: null,
                    domain_id: null,
                    control_id: null,
                    name: e.name,
                    reference_code: e.reference_code
                }
            },
            removeDomain(index) {
                this.dataFramework.domains.splice(index, 1);
            },
            removeControl(dIndex, index) {
                this.dataFramework.domains[dIndex].controls.splice(index, 1);
            },
            removeSubControl(dIndex, cIndex, index) {
                this.dataFramework.domains[dIndex].controls[cIndex].sub_controls.splice(index, 1);
            },
            removePolicySubControl(index) {
                this.dataPolicy.sub_controls.splice(index, 1);
            },
            submitFramework() {
                this.openLoading()
                post('/api/configure_framework', this.dataFramework).then((res) => {
                    if (res.data.saved) {
                        this.dataFramework = res.data.framework;
                        this.closeLoading()
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text: 'Framework Configured Successfully',
                                variant: 'success'
                            },
                        })
                    }
                });
            },

            submitPolicy() {
                this.openLoading()
                post('/api/configure_policy', this.dataPolicy).then((res) => {
                    if (res.data.saved) {
                        this.dataPolicy = res.data.policy;
                        this.closeLoading()
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text: 'Policy Configured Successfully',
                                variant: 'success'
                            },
                        })
                    }
                });
            }
        }
    }
</script>

<style lang="scss">
    .domain-padding {
        padding-left: 20px;
    }

    .control-padding {
        padding-left: 35px;
    }

    .sub-control-padding {
        padding-left: 50px;
    }

    .framework-scroll {
        height: 66vh !important;
        overflow-y: scroll;
    }

    .data-framework {
        .sortable-ghost {
            .control-group {
                display: none !important;
            }

            .sub-control-group {
                display: none !important;
            }
        }
    }

    .tag-input-group {
        width: 80%;
    }

</style>
