<template>
    <div>
        <panel ref="panel" :no-pagination="true" :columns="columns"
               :url-api="`/api/project_tags?project_id=${project}&tag_type_id=${tag_type}`"
        >
            <div slot="action" slot-scope="props" class="text-nowrap">
                <feather-icon
                    :id="`user-row-${props.item.id}-eye-icon`"
                    icon="EyeIcon"
                    class="cursor-pointer"
                    size="16"
                    @click="openShowSideBar(props.item.tag_id)"
                />
            </div>
        </panel>

        <b-sidebar id="sidebar-backdrop-1"
                   backdrop-variant="dark" @hidden="resetShow"
                   backdrop :title="`Tag Detail`" right shadow width="50%">
            <div class="px-1 py-2">
                <template>
                    <div>
                        <TagShow v-if="showSideBar" :form-id="selectedTag"/>
                    </div>
                </template>
            </div>
        </b-sidebar>

    </div>
</template>

<script>
    import Panel from "@/components/Table/Panel";
    import {BSidebar} from 'bootstrap-vue'
    import TagShow from "@/admin/views/Tags/TagShow";

    export default {
        name: "ProjectTag",
        components: {TagShow, Panel, BSidebar},
        props: {
            tag_type: Number,
            project: Number
        },
        data() {
            return {
                selectedTag: 0,
                showSideBar: false,
                columns: [
                    {
                        label: 'ID',
                        field: 'id',
                    },
                    {
                        label: 'Tag',
                        displayText: 'tag',
                        field: 'name'
                    },
                    {
                        label: 'Ref. Code',
                        displayText: 'sub_control',
                        field: 'reference_code'
                    },
                    {
                        label: 'Framework',
                        displayText: 'framework',
                        field: 'name'
                    },
                    {
                        label: 'Policy',
                        displayText: 'policy',
                        field: 'name'
                    },
                    {
                        label: 'Action',
                        field: 'action',
                        action: true
                    }
                ],
            }
        },
        methods: {
            openShowSideBar(id) {
                this.selectedTag = id
                this.$root.$emit('bv::toggle::collapse', 'sidebar-backdrop-1')
                this.showSideBar = true;
            },
            resetShow() {
                this.showSideBar = false;
            },
        }
    }
</script>

<style scoped>

</style>
