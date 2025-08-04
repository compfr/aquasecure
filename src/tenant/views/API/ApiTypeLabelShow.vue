<template>
    <div>
        <b-card>
            <b-row>
                <b-col md="12" class="mb-2">
                    <h3>{{model.title}}</h3>
                </b-col>
                <b-col md="12" class="mb-2">
                    <b-card-text>{{model.description}}</b-card-text>
                </b-col>
            </b-row>
        </b-card>
        <b-card>
            <b-row>
                <b-col>
                    <table class="table table-striped">
                        <thead>
                            <th>Title</th>
                            <th>Base URL/ Port</th>
                            <th>Username</th>
                        </thead>
                        <tbody>
                        <template v-for="(item, index) in model.labels" >
                            <tr :key="`label-${index}`">
                                <td>{{item.name}}</td>
                                <td>{{item.base_url}}:{{item.port}}</td>
                                <td>{{item.username}}</td>
                            </tr>
                        </template>
                        <template v-if="model.labels.length == 0">
                            <tr>
                                <td class="text-center" colspan="3">No Labels Found</td>
                            </tr>
                        </template>
                        </tbody>
                    </table>
                </b-col>
            </b-row>
        </b-card>
    </div>
</template>

<script>
    import {
        BCard,
        BRow,
        BCol,
        BCardText,
    } from 'bootstrap-vue'

    export default {
        name: "ApiTypeLabelShow",
        components: {
            BCard,
            BRow,
            BCol,
            BCardText
        },
        props: {
            model: {
                type: Object
            }
        }
    }
</script>

<style scoped>

</style>
