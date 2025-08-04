<template>
    <div>
        <b-row class="match-height">
            <template v-for="(item,index) in data">
                <b-col
                    xl="3"
                    md="6"
                >
                    <count-card
                        :statistic="item.count"
                        :statistic-title="item.title"
                    />
                </b-col>
            </template>


<!--            <b-col-->
<!--                xl="3"-->
<!--                md="6"-->
<!--            >-->
<!--                <count-card-->
<!--                    :statistic="data.frameworks"-->
<!--                    statistic-title="Frameworks"-->
<!--                />-->
<!--            </b-col>-->

<!--            <b-col-->
<!--                xl="3"-->
<!--                md="6"-->
<!--            >-->
<!--                <count-card-->
<!--                    :statistic="data.policies"-->
<!--                    statistic-title="Policies"-->
<!--                />-->
<!--            </b-col>-->

<!--            <b-col-->
<!--                xl="3"-->
<!--                md="6"-->
<!--            >-->
<!--                <count-card-->
<!--                    :statistic="data.tenants"-->
<!--                    statistic-title="Tenants"-->
<!--                />-->
<!--            </b-col>-->
        </b-row>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {BCard, BCardText, BLink, BRow, BCol} from 'bootstrap-vue'
    import CountCard from "@core/components/statistics-cards/CountCard";
    import {get} from "@/libs/api";

    export default {
        components: {
            CountCard,
            BCard,
            BCardText,
            BLink,
            BRow,
            BCol
        },

        data() {
            return {
                data: []
            }
        },
        created() {
            get(`/api/show-stats`).then((res) => {
                Vue.set(this.$data, 'data', res.data.data);
                this.show = true
            });
        },
    }
</script>

<style>

</style>
