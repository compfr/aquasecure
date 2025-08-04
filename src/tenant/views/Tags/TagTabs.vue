<template>
    <div v-if="show">
        <b-tabs v-model="selectedTab" @input="updateRoute">
            <template v-for="(item, index) in tag_types">
                <b-tab :title="item.title" :key="`tag-type-index`">
                    <GRCTags v-if="parseInt(selectedTab) === index" :tag-type-id="item.id"/>
                </b-tab>
            </template>
            <template #tabs-end>
                <b-nav-item href="#" role="presentation" @click="addTagType">Add Tag Type</b-nav-item>
            </template>
        </b-tabs>

        <b-modal
            v-model="tagTypeModal"
            id="modal-tag-type"
            title="Add New Tag Type"
            ok-title="Submit"
            cancel-variant="outline-secondary"
            @hidden="resetTagTypeModal"
            @ok="submitTagType">

            <b-form-group
                label="Title"
            >
                <b-form-input
                    placeholder="Title"
                    v-model="tagTypeForm.title"
                />
                <error :error="tagTypeError.title"/>
            </b-form-group>
        </b-modal>

    </div>
</template>

<script>
    import Vue from 'vue'
    import {
        BCard,
        BCardText,
        BRow,
        BCol,
        BTab, BTabs, BNavItem, BModal, BFormGroup, BFormInput
    } from 'bootstrap-vue'
    import GRCTags from "@/tenant/views/Tags/GRCTags";
    import Error from "@/components/Form/Error";
    import {get, post} from "@/libs/api";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";
    import {form} from "@/libs/mixins";

    export default {
        name: "TagTabs",
        components: {
            Error, GRCTags, BCard,
            BCardText, BRow, BNavItem, BCol, BTab,
            BTabs, BModal, BFormGroup, BFormInput
        },
        mixins: [form],
        data() {
            return {
                selectedTab: 0,
                show: false,
                tag_types: null,
                tagTypeModal: false,
                tagTypeForm: {
                    title: null
                },
                tagTypeError: {},
            }
        },
        created() {
            this.getTagTypes()
        },
        methods: {
            updateRoute(e) {
                this.$router.push(`/tags?tab=${this.tag_types[e]['slug']}`)
            },
            addTagType() {
                Vue.set(this.$data, 'tagTypeModal', true)
            },
            resetTagTypeModal() {
                this.tagTypeForm = {
                    title: null
                }
            },
            submitTagType(bvModalEvt) {
                bvModalEvt.preventDefault()
                post('/api/tag_types', this.tagTypeForm).then(res => {
                    if (res.data.saved) {
                        this.resetTagTypeModal()
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text: 'Tag Type Added',
                                variant: 'success'
                            },
                        })
                        Vue.set(this.$data, 'tagTypeModal', false)
                        this.resetTagTypeModal();
                        this.getTagTypes();
                    }
                }).catch(error => {
                    if (error.response.status === 422) {
                        this.tagTypeError = error.response.data.errors
                    }
                })

            },
            getTagTypes(){
                this.openLoading()
                this.show = false
                get('/api/tag_types').then((res)=>{
                    Vue.set(this.$data,'tag_types', res.data.data);
                    if (this.$route.query && this.$route.query.tab) {
                        this.selectedTab = this.tag_types.findIndex(tag_type => tag_type.slug === this.$route.query.tab);
                        if(this.selectedTab === -1){
                            this.selectedTab = 0;
                        }
                    } else {
                        this.selectedTab = 0;
                        this.$router.push('/tags?tab=grc')
                    }
                    this.show = true;
                    this.closeLoading()
                })
            }
        }
    }
</script>

<style scoped>

</style>
