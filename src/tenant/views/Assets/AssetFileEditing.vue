<template>
    <div v-if="show" class="excel-file-editing">
        <b-row class="mb-1">
            <b-col cols="8" class="d-flex flex-row">
                <b-form-input class="width" v-model="columnHeader"/>
                <b-button variant="primary" class="float-right btn-sm ml-1" :disabled="this.columnHeader.length < 2"
                          @click="addColumn">Add Column
                </b-button>
            </b-col>
            <b-col cols="4">
                <b-button variant="primary" class="float-right" @click="save">Save</b-button>
                <b-button variant="primary" class="float-right mr-1" @click="addRecord">Add Record</b-button>
                <b-button variant="primary" class="float-right mr-1" :disabled="this.selectedIndex == null"
                          @click="deleteRow">Remove Row
                </b-button>
            </b-col>
        </b-row>
        <vue-excel-editor v-model="jsonData" width="100%" height="400px" allow-add-col
                          ref="grid" @select="selectedRow" no-paging
        >
            <template v-for="(item,index) in fields">
                <vue-excel-column :field="item.name" :label="item.label" :readonly="item.readonly" />
            </template>
        </vue-excel-editor>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {
        BCard,
        BRow,
        BCol,
        BButton,
        BModal,
        BFormInput,
        BFormGroup
    } from 'bootstrap-vue'
    import {get, post} from "@/libs/api";
    import ToastificationContent from "@core/components/toastification/ToastificationContent";

    export default {
        name: "AssetFileEditing",
        components: {
            BCard,
            BRow,
            BCol,
            BButton,
            BModal,
            BFormInput,
            BFormGroup
        },
        created(){
            get(`/api/assets/${this.$route.params.id}/file_edit`).then((res)=>{
                this.jsonData = res.data.model.file_data ?? [];
                this.fields = res.data.model.fields ?? [];
                this.show = true;
            })
        },
        data() {
            return {
                selectedIndex: null,
                columnHeader: '',
                jsonData:null,
                fields: null,
                show: false,
            }
        },
        methods: {
            addRecord() {
                const fields = this.$refs.grid.fields;
                const obj = {};
                for (var i=0;i<fields.length;i++){
                    if(fields[i]['name'].toLowerCase() == 'tag'){
                        obj[fields[i]['name']] = 'untag';
                    }else{
                        obj[fields[i]['name']] = '';
                    }

                }
                // Call this to new record
                this.$refs.grid.newRecord(obj)
            },
            selectedRow(e, selected) {
                if (selected) {
                    this.selectedIndex = e[0]
                } else {
                    this.selectedIndex = null
                }
            },
            deleteRow() {
                if(this.jsonData[this.selectedIndex]['tag'] == 'untag'){
                    this.$refs.grid.deleteRecord(this.selectedIndex)
                    this.selectedIndex = null
                }else{
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                            title: 'Error',
                            icon: 'BellIcon',
                            text:  'Asset cannot be removed',
                            variant:'danger'
                        },
                    })
                }


            },
            addColumn() {
                let pos = this.$refs.grid.fields.length
                let colDef = {
                    name: this.columnHeader,
                    label: this.columnHeader,
                    type: 'string',
                    width: '100px',

                    validate: null,
                    change: null,
                    link: null,
                    sort: null,

                    keyField: false,
                    sticky: false,
                    // tabStop: true,
                    allowKeys: null,
                    mandatory: false,
                    lengthLimit: 0,

                    autocomplete: this.$refs.grid.autocomplete,
                    textTransform: null,
                    initStyle: 'left',
                    invisible: false,
                    readonly: this.$refs.grid.autocomplete,
                    pos: pos,
                    options: null,
                    summary: null,
                    toValue: t => t,
                    toText: t => t,
                    register: null
                }
                this.$refs.grid.newColumn(colDef, pos)

                this.columnHeader = '';
            },
            save(){
                let form = {
                    file_data : this.jsonData,
                    fields: this.$refs.grid.fields
                }
                post(`/api/assets/${this.$route.params.id}/file_edit`,form).then((res) => {
                    if(res.data.saved){
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Success',
                                icon: 'BellIcon',
                                text:  'Asset File Updated Successfully',
                                variant:'success'
                            },
                        })
                    }

                })
            }
        }
    }
</script>

<style lang="scss">
    .excel-file-editing {
        .vue-excel-editor{
            .component-content{
                .footer{
                    margin-left: 0px !important;
                    .h-scroll{
                        background-color: #2830467d !important;
                    }
                    :last-child{
                        display: none !important;
                    }
                }

                .v-scroll{
                    .v-scroll-button{
                        background-color: #2830467d !important;
                    }
                }
            }
        }
    }

</style>
