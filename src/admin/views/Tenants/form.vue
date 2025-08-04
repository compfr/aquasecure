<template>
    <div v-if="show">
        <b-card :title="$route.meta.mode === 'edit' ? 'Edit Tenant' : 'Add New Tenant'">
            <b-row>
                <b-col md="6">
                    <b-form-group label="Company Name">
                        <b-form-input placeholder="Company Name" v-model="form.company_name" />
                        <error :error="error.company_name" />
                    </b-form-group>
                </b-col>

                <b-col md="6" v-if="$route.meta.mode === 'edit'">
                    <b-form-group label="Domain">
                        <b-form-input readonly placeholder="Domain" v-model="form.domains[0].domain" />
                    </b-form-group>
                </b-col>

                <b-col md="6" v-else>
                    <b-form-group label="Domain">
                        <b-form-input placeholder="Domain" v-model="form.domain_name" />
                        <error :error="error.domain_name" />
                    </b-form-group>
                </b-col>

                <b-col md="6">
                    <b-form-group label="Name">
                        <b-form-input placeholder="Name" v-model="form.name" />
                        <error :error="error.name" />
                    </b-form-group>
                </b-col>

                <b-col md="6">
                    <b-form-group label="Email">
                        <b-form-input placeholder="Email" v-model="form.email" />
                        <error :error="error.email" />
                    </b-form-group>
                </b-col>
            </b-row>

            <b-row>
                <b-col md="12">
                    <b-card title="Permissions">
                        <b-form-checkbox-group
                            v-model="form.permissions"
                            :options="permissions"
                            value-field="name"
                            text-field="label"
                            class="demo-inline-spacing"
                        />
                    </b-card>
                </b-col>
            </b-row>

            <b-form-group label="Frameworks">
                <b-form-checkbox-group
                    v-model="selectedFrameworks"
                    class="demo-inline-spacing"
                    name="frameworks">
                    <b-form-checkbox
                        v-for="fw in frameworks"
                        :key="fw.id"
                        :value="fw.id">
                        {{ fw.title || fw.name || 'Unnamed Framework' }}
                    </b-form-checkbox>
                </b-form-checkbox-group>
            </b-form-group>

            <b-row>
                <b-col>
                    <b-button type="submit" variant="primary" class="mr-1" @click="formSubmitted">
                        Submit
                    </b-button>
                    <b-button
                        v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                        type="reset"
                        variant="outline-secondary"
                        :to="{ path: '/tenants' }"
                    >
                        Cancel
                    </b-button>
                </b-col>
            </b-row>
        </b-card>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {
        BCard,
        BRow,
        BCol,
        BFormInput,
        BFormGroup,
        BFormCheckboxGroup,
        BFormCheckbox,
        BButton,
        BFormTextarea
    } from 'bootstrap-vue'
    import { form } from "@/libs/mixins"
    import { get } from '@/libs/api'
    import Error from "@/components/Form/Error"
    import Ripple from "vue-ripple-directive"
    import flatPickr from 'vue-flatpickr-component'
    import XTagInput from "@/components/Form/TagInput"

    function initialize(to) {
        const urls = {
            add: to.query.tenant_request_id
                ? `/api/tenants/create?tenant_request_id=${to.query.tenant_request_id}`
                : `/api/tenants/create`,
            edit: `/api/tenants/${to.params.id}/edit`
        };
        return urls[to.meta.mode] || urls.add;
    }

    export default {
        mixins: [form],
        components: {
            XTagInput,
            Error,
            BCard,
            BRow,
            BCol,
            BFormInput,
            BFormGroup,
            BFormCheckboxGroup,
            BFormCheckbox,
            BButton,
            BFormTextarea,
            flatPickr
        },
        directives: {
            Ripple
        },
        data() {
            return {
                show: false,
                resource: '/tenants',
                store: '/api/tenants',
                method: 'POST',
                title: 'Add',
                message: 'New Tenant Added',
                frameworks: [],
                selectedFrameworks: [],
                permissions: [
                    { name: 'GRC', label: 'GRC (Governance, Risk, and Compliance)' },
                    { name: 'Security Operation', label: 'Security Operation' },
                    { name: 'Risk Management', label: 'Risk Management' },
                    { name: 'Asset Management', label: 'Asset Management' },
                    { name: 'Service Operation', label: 'Service Operation' },
                ]
            };
        },
        watch: {
            '$route'(to, from) {
                // This watches for changes in the route
                const initUrl = initialize(to);
                Promise.all([
                    get(initUrl),
                    get('/api/frameworks?per_page=all')
                ]).then(([res, frameworkRes]) => {
                    this.setData(res);
                    this.frameworks = frameworkRes.data.data.data || [];
                });
            }
        },
        beforeRouteEnter(to, from, next) {
            console.log('beforeRouteEnter called'); // Add this line
            const initUrl = initialize(to);
            console.log('initUrl:', initUrl); // Confirm it's returning the right URL
            Promise.all([
                get(initUrl),
                get('/api/frameworks?per_page=all')
            ]).then(([res, frameworkRes]) => {
                next(vm => {
                    console.log('setting data'); // Add this
                    vm.setData(res);
                    vm.frameworks = frameworkRes.data.data.data || [];
                });
            });
        },
        beforeRouteUpdate(to, from, next) {
            Promise.all([
                console.log('beforeRouteUpdate called'),
                get(initialize(to)),
                get('/api/frameworks?per_page=all')
            ]).then(([res, frameworkRes]) => {
                this.setData(res);
                this.frameworks = frameworkRes.data.data.data || [];
                next();
            });
        },
        methods: {
            setData(res) {
                Vue.set(this.$data, 'form', res.data.form);

                if (this.$route.meta.mode === 'edit') {
                    this.store = `/api/tenants/${this.$route.params.id}`;
                    this.method = 'PUT';
                }

                // Populate selectedFrameworks from form.framework_ids
                this.selectedFrameworks = res.data.form.framework_ids || [];
                console.log("AAA");
                console.log(this.selectedFrameworks);
                this.show = true;
                console.log("Show is set to true");
            },
            formSubmitted() {
                this.form.frameworks = this.selectedFrameworks;
                console.log("BBB");
                console.log(this.selectedFrameworks);
                this.submit(this.form, res => {
                    this.success();
                    this.successfull(res);
                });
            },
            successfull() {
                this.$router.push(`${this.resource}`);
            }
        }
    }
</script>

<style scoped></style>
<style lang="scss">
    @import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
