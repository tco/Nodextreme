define([
    'jquery',
    'underscore',
    'backbone',
    'highcharts',
    'features/VisibleFeature',
    'features/featureContainer'
], function($, _, Backbone, Highcharts, VisibleFeature, FeatureContainer, undefined) {
    "use strict";

    // ColumnDiagram Feature
    // ------------------------------

    var ColumnDiagramFeature = VisibleFeature.extend({
        name: 'ColumnDiagramFeature',
        element: 'ranking-chart',
        teamCount: 0,

        globalEvents: {
            'ranking.update':   'update'
        },

        initialize: function() {
            this.loaded = $.Deferred();
            this.resolve(true);
        },

        asyncRender: function(teams, series) {

            if(!this.isRendered()) {
                this.setElement(this.join('#', this.element));
                this.setRendered(true);
                this.buildChart(this.element, teams, series);
            }
        },

        buildChart: function(renderTo, teams, series) {
            // Create the chart
            this.chart = new Highcharts.Chart({
                credits: {
                    enabled: false
                },
                chart: {
                    renderTo: renderTo,
                    type: 'column'
                },
                title: {
                    text: null
                },
                xAxis: {
                    categories: teams,
                    title: {
                        text: "Teams"
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: "Points"
                    }
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                tooltip: {
                    valueSuffix: " points"
                },
                series: series,
                navigation: {
                    buttonOptions: {
                        enabled: false
                    }
                }
            });

        },

        update: function(eventData) {
            var data = eventData.data.originalData.data,
                teams = ['Points', 'Failures'],
                series = _.map(data, function(t) {
                    return {
                        name: t.name,
                        data: [t.points, t.failures]
                    };
                });

            if(!this.isRendered()) {
                this.asyncRender(teams, series);
            } else {
                if(this.teamCount != data.length) {
                    this.teamCount = data.length;
                    this.chart.destroy();
                    this.setRendered(false);
                    this.asyncRender(teams, series);
                }
            }

            _.each(this.chart.series, function(s, i) {
                s.setData(series[i].data);
            });
        }
    });

    return ColumnDiagramFeature;

});
