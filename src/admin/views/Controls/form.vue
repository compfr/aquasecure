<template>
    <div v-if="show">
        <b-card :title="$route.meta.mode && $route.meta.mode === 'edit' ? 'Edit Control' : 'Add New Control'">
            <b-row>
                <b-col cols="12">
                    <div class="position-top-0 position-right-0 position-absolute px-1" @click="addNewDomain">
                        <small>Add New</small>
                    </div>
                    <b-form-group
                        label="Domains"
                    >
                        <x-tag-input :positionRelative="true" :removable="true" keyIndex="framework_domain_id"
                                     :addition-indexs="['domain_id', 'framework_id']"
                                     :multiple="true" :value="form.domains" relation="framework_domain"
                                     :resource="`/api/search/framework_domains`" column="title" name="title"
                                     @input="onDomainsUpdate">
                        </x-tag-input>
                        <error :error="error.domains"/>
                    </b-form-group>
                </b-col>

                <b-col md="6">
                    <b-form-group
                        label="Name"
                    >
                        <b-form-input
                            placeholder="Name"
                            v-model="form.name"
                        />
                        <error :error="error.name"/>
                    </b-form-group>
                </b-col>

                <b-col md="6">
                    <b-form-group
                        label="Reference Code"
                    >
                        <b-form-input
                            placeholder="Reference Code"
                            v-model="form.reference_code"
                        />
                        <error :error="error.reference_code"/>
                    </b-form-group>
                </b-col>
                <b-col md="12">
                    <b-form-group
                        label="Description"
                    >
                        <b-form-textarea
                            v-model="form.desc"
                        />
                        <error :error="error.desc"/>
                    </b-form-group>
                </b-col>

                <b-col cols="12">
                    <div class="position-top-0 position-right-0 position-absolute px-1" @click="addNewSubControl">
                        <small>Add New</small>
                    </div>
                    <b-form-group
                        label="Sub Controls"
                    >
                        <x-tag-input :positionRelative="true" :removable="true" keyIndex="sub_control_id"
                                     :multiple="true" :value="form.sub_controls" relation="sub_control"
                                     :resource="`/api/search/sub_controls`" column="title" name="title"
                                     @input="onSubControlsUpdate">
                        </x-tag-input>
                        <error :error="error.sub_controls"/>
                    </b-form-group>
                </b-col>

            </b-row>
            <b-row>
                <b-col>
                    <b-button

                        type="submit"
                        variant="primary"
                        class="mr-1"
                        @click="formSubmitted"
                    >
                        Submit
                    </b-button>
                    <b-button
                        v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                        type="reset"
                        variant="outline-secondary"
                        @click="goBack"

                    >
                        Cancel
                    </b-button>
                </b-col>
            </b-row>
        </b-card>
        <b-modal
            v-model="formSubControlModal"
            id="modal-framework-type"
            title="Add New Sub-Control"
            ok-title="Submit"
            size="lg"
            cancel-variant="outline-secondary"
            @hidden="resetModalData"
            @ok="submitSubControl">
            <b-row>
                <b-col md="6">
                    <b-form-group
                        label="Name"
                    >
                        <b-form-input
                            placeholder="Name"
                            v-model="modalForm.name"
                        />
                        <error :error="modalError.name"/>
                    </b-form-group>
                </b-col>
                <b-col md="6">
                    <b-form-group
                        label="Reference Code"
                    >
                        <b-form-input
                            placeholder="Reference Code"
                            v-model="modalForm.reference_code"
                        />
                        <error :error="modalError.reference_code"/>
                    </b-form-group>
                </b-col>
                <b-col md="12">
                    <b-form-group
                        label="Description"
                    >
                        <b-form-textarea
                            v-model="modalForm.desc"
                        />
                        <error :error="modalError.desc"/>
                    </b-form-group>
                </b-col>
            </b-row>
        </b-modal>
        <b-modal
            v-model="formDomainModal"
            id="modal-framework-type"
            title="Add New Sub-Control"
            ok-title="Submit"
            size="lg"
            cancel-variant="outline-secondary"
            @hidden="resetModalData"
            @ok="submitDomain">
            <b-row>
                <b-col md="6">
                    <b-form-group
                        label="Name"
                    >
                        <b-form-input
                            placeholder="Name"
                            v-model="modalForm.name"
                        />
                        <error :error="modalError.name"/>
                    </b-form-group>
                </b-col>
                <b-col md="6">
                    <b-form-group
                        label="Reference Code"
                    >
                        <b-form-input
                            placeholder="Reference Code"
                            v-model="modalForm.reference_code"
                        />
                        <error :error="modalError.reference_code"/>
                    </b-form-group>
                </b-col>
                <b-col md="12">
                    <b-form-group
                        label="Description"
                    >
                        <b-form-textarea
                            v-model="modalForm.desc"
                        />
                        <error :error="modalError.desc"/>
                    </b-form-group>
                </b-col>
            </b-row>
        </b-modal>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {
        BCard,
        BCardText,
        BLink,
        BRow,
        BCol,
        BFormInput,
        BFormGroup,
        BFormCheckboxGroup,
        BButton,
        BFormTextarea,
        BFormSelect
    } from 'bootstrap-vue'
    import {form} from "@/libs/mixins";
    import {get, post} from '@/libs/api'
    import Error from "@/components/Form/Error";
    import Ripple from "vue-ripple-directive";
    import flatPickr from 'vue-flatpickr-component';
    import XTagInput from "@/components/Form/TagInput";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";

    function initialize(to) {
        let urls = {
            'add': `/api/controls/create`,
            'edit': `/api/controls/${to.params.id}/edit`
        };
        return (urls[to.meta.mode] || urls['add'])
    }

    export default {
        mixins: [form],
        components: {
            XTagInput,
            Error,
            BCard,
            BCardText,
            BLink,
            BRow,
            BCol,
            BFormInput,
            BFormGroup,
            BFormCheckboxGroup,
            BButton,
            BFormTextarea,
            BFormSelect,
            flatPickr
        },
        directives: {
            Ripple
        },
        data() {
            return {
                show: false,
                resource: '/mappings?tab=controls',
                store: '/api/controls',
                method: 'POST',
                title: 'Add',
                message: 'New Control Added',
                formSubControlModal: false,
                formDomainModal: false,
                modalForm: {
                    name: null,
                    reference_code: null,
                    desc: null
                },
                modalError: {},
            }
        },

        beforeRouteEnter(to, from, next) {
            get(initialize(to))
                .then((res) => {
                    next(vm => vm.setData(res))
                })
        },
        beforeRouteUpdate(to, from, next) {
            get(initialize(to))
                .then((res) => {
                    this.setData(res);
                    next()
                })
        },


        methods: {
            setData(res) {
                Vue.set(this.$data, 'form', res.data.form);

                if (this.$route.meta.mode === 'edit') {
                    this.store = `/api/controls/${this.$route.params.id}?_method=PUT`;
                    this.title = 'Edit';
                    this.message = 'Controls has been updated';
                }
                this.show = true
            },
            formSubmitted() {
                this.submit(this.form, (res) => {
                    this.success()
                    this.successfull(res)
                })
            },
            successfull(res) {
                this.$router.push(`${this.resource}`)
            },
            onFrameworksUpdate(e) {
                Vue.set(this.$data.form, 'frameworks', e);
            },
            onPolicyUpdate(e) {
                Vue.set(this.$data.form, 'policies', e);
            },
            onDomainsUpdate(e) {
                Vue.set(this.$data.form, 'domains', e);
            },
            onSubControlsUpdate(e) {
                Vue.set(this.$data.form, 'sub_controls', e);
            },
            resetModalData() {
                this.modalForm = {
                    name: null,
                    reference_code: null,
                    desc: null
                }
            },
            addNewSubControl() {
                Vue.set(this.$data, 'formSubControlModal', true)
            },
            submitSubControl(bvModalEvt) {
                bvModalEvt.preventDefault()
                post('/api/sub_controls', this.modalForm).then(res => {
                    if (res.data.saved) {
                        this.resetModalData()
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text: 'Sub-Control Added',
                                variant: 'success'
                            },
                        })
                        Vue.set(this.$data, 'formSubControlModal', false)
                    }
                }).catch(error => {
                    if (error.response.status === 422) {
                        this.modalError = error.response.data.errors
                    }
                })

            },
            addNewDomain() {
                Vue.set(this.$data, 'formDomainModal', true)
            },
            submitDomain(bvModalEvt) {
                bvModalEvt.preventDefault()
                post('/api/domains', this.modalForm).then(res => {
                    if (res.data.saved) {
                        this.resetModalData()
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text: 'Domain Added',
                                variant: 'success'
                            },
                        })
                        Vue.set(this.$data, 'formDomainModal', false)
                    }
                }).catch(error => {
                    if (error.response.status === 422) {
                        this.modalError = error.response.data.errors
                    }
                })

            },
            goBack(){
                this.$router.go(-1);
            },

        },
    }
</script>

<style scoped>

</style>
<style lang="scss">
    @import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
