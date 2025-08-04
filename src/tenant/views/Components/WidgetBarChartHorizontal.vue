<template>
    <b-overlay :show="loadingData">
        <b-card-actions :title="title" no-actions>
            <vue-apex-charts v-if="show"
                type="bar"
                height="400"
                :options="barChart.chartOptions"
                :series="barChart.series"
            />
        </b-card-actions>
    </b-overlay>
</template>

<script>
    import Vue from 'vue'
    import {get, post} from "@/libs/api";
    import {
        BCard, BCardBody, BCardHeader, BCardTitle, BCardSubTitle, BBadge, BOverlay
    } from 'bootstrap-vue'
    import VueApexCharts from 'vue-apexcharts'
    import BCardActions from "@core/components/b-card-actions/BCardActions";

    export default {
        name: "WidgetBarChartHorizontal",
        components: {BCardActions, VueApexCharts, BCard, BCardBody, BCardHeader, BCardTitle, BCardSubTitle, BBadge, BOverlay},
        props: {
            report: Object,
            title: String,
            column_x: String,
            column_y: String
        },
        data() {
            return {
                eventData: null,
                loadingData: false,
                show: false,
                barChart: {
                    series: [
                        {
                            data: [],
                        },
                    ],
                    chartOptions: {
                        chart: {
                            toolbar: {
                                show: false,
                            },
                        },
                        plotOptions: {
                            bar: {
                                horizontal: true,
                                // barHeight: '30%',
                                endingShape: 'rounded',
                            },
                        },
                        grid: {
                            xaxis: {
                                lines: {
                                    show: false,
                                },
                            },
                        },
                        dataLabels: {
                            enabled: false,
                        },
                        xaxis: {
                            categories: [],
                        },
                        yaxis: {
                            // opposite: isRtl,
                        },
                    },
                },

            }
        },
        created() {
            if (this.report.label.api_type_id == 1) {
                this.splunkApi()
            }
        },
        methods: {
            splunkApi() {
                this.loadingData = true;
                post(`/api/get_splunk_api`, this.report).then((res) => {
                    // Vue.set(this.$data, 'eventData', res.data.events);
                    this.updateLineChart(res.data.events);
                    this.loadingData = false;
                }).catch((e) => {
                    this.loadingData = false;
                });
            },
            updateLineChart(events){
                for(var i=0;i<events.results.length;i++){
                    this.barChart.series[0].data.push(events.results[i][this.column_y])
                    this.barChart.chartOptions.xaxis.categories.push(events.results[i][this.column_x])
                }
                console.log(this.barChart.series[0].data);

                this.show = true;
            }
        }
    }
</script>

<style scoped>

</style>
