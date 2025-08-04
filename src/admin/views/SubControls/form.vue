<template>
    <div v-if="show">
        <b-card :title="$route.meta.mode && $route.meta.mode === 'edit' ? 'Edit Sub-Control' : 'Add New Sub-Control'">
            <b-row>
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
                    <div class="position-top-0 position-right-0 position-absolute px-1" @click="addNewControl">
                        <small>Add New</small>
                    </div>
                    <b-form-group
                        label="Controls"
                    >
                        <x-tag-input :positionRelative="true" :removable="true" keyIndex="domain_control_id"
                                     :multiple="true" :value="form.controls" relation="domain_control"
                                     :addition-indexs="['domain_id', 'framework_id', 'control_id']"
                                     :resource="`/api/search/domain_controls`" column="title" name="title"
                                     @input="onControlsUpdate">
                        </x-tag-input>
                        <error :error="error.controls"/>
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
            v-model="formControlModal"
            id="modal-framework-type"
            title="Add New Control"
            ok-title="Submit"
            size="lg"
            cancel-variant="outline-secondary"
            @hidden="resetModalData"
            @ok="submitControl">
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
            'add': `/api/sub_controls/create`,
            'edit': `/api/sub_controls/${to.params.id}/edit`
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
                resource: '/mappings?tab=sub_controls',
                store: '/api/sub_controls',
                method: 'POST',
                title: 'Add',
                message: 'New Sub-Control Added',
                formControlModal: false,
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
                    this.store = `/api/sub_controls/${this.$route.params.id}?_method=PUT`;
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
            onControlsUpdate(e) {
                Vue.set(this.$data.form, 'controls', e);
            },
            addNewControl() {
                Vue.set(this.$data, 'formControlModal', true)
            },
            submitControl(bvModalEvt) {
                bvModalEvt.preventDefault()
                post('/api/controls', this.modalForm).then(res => {
                    if (res.data.saved) {
                        this.resetModalData()
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text: 'Control Added',
                                variant: 'success'
                            },
                        })
                        Vue.set(this.$data, 'formControlModal', false)
                    }
                }).catch(error => {
                    if (error.response.status === 422) {
                        this.modalError = error.response.data.errors
                    }
                })

            },
            resetModalData() {
                this.modalForm = {
                    name: null,
                    reference_code: null,
                    desc: null
                }
            },
            goBack(){
                this.$router.go(-1);
            }

        },
    }
</script>

<style scoped>

</style>
<style lang="scss">
    @import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
