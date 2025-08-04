<template>
    <div>
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
                    label="Api Type"
                >
                    <x-tag-input :disabled="this.apiType != null ? true : false" :value="form.api_type" :resource="`/api/search/api_types`"
                                 column="title" name="title" @input="onApiTypeUpdate"/>
                    <error :error="error.api_type_id"/>
                </b-form-group>
            </b-col>
            <b-col md="8">
                <b-form-group
                    label="Base URL"
                >
                    <b-form-input
                        placeholder="Base URL"
                        v-model="form.base_url"
                    />
                    <error :error="error.base_url"/>
                </b-form-group>
            </b-col>
            <b-col md="4">
                <b-form-group
                    label="Port"
                >
                    <b-form-input
                        placeholder="Port"
                        v-model="form.port"
                    />
                    <error :error="error.port"/>
                </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-group
                    label="Username"
                >
                    <b-form-input
                        placeholder="Username"
                        v-model="form.username"
                    />
                    <error :error="error.username"/>
                </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-group
                    label="Password"
                >
                    <b-form-input
                        placeholder="Password"
                        v-model="form.password"
                    />
                    <error :error="error.password"/>
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
                    @click="cancelForm"
                >
                    Cancel
                </b-button>
            </b-col>
        </b-row>
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

    export default {
        name: "FormLabel",
        props: {
            formType: String,
            formId: Number,
            apiType: {
                type: Object,
                default : null
            }
        },
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
                store: '/api/labels',
                method: 'POST',
                title: 'Add',
                message: 'New Label Added',
            }
        },
        created() {

            let urls = {
                'Add': `/api/labels/create`,
                'Edit': `/api/labels/${this.formId}/edit`
            };
            const url = urls[this.formType];

            console.log(this.formType);

            get(url).then((res) => {
                this.setData(res);
            })
        },
        methods: {
            setData(res) {
                Vue.set(this.$data, 'form', res.data.form);

                if(this.apiType != null){
                    Vue.set(this.$data.form, 'api_type', this.apiType);
                    Vue.set(this.$data.form, 'api_type_id', this.apiType.id);
                }

                if (this.formType === 'Edit') {
                    this.store = `/api/labels/${this.formId}?_method=PUT`;
                    this.title = 'Edit';
                    this.message = 'Label has been updated';
                }
                this.show = true
            },
            formSubmitted() {
                this.submit(this.form, (res) => {
                    this.success()
                    this.$emit('close');

                    // this.successfull(res)
                })
            },
            onApiTypeUpdate(e){
                Vue.set(this.$data.form, 'api_type', e);
                Vue.set(this.$data.form, 'api_type_id', e.id);
            },
            successfull(res) {
                this.$router.push(`${this.resource}`)
            },
            cancelForm(){
                this.$emit('cancel');
            }
        },
    }
</script>

<style scoped>

</style>
