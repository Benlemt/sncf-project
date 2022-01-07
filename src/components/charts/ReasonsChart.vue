<template>
  <div class="chart-container">
    <div class="container">
      <h2 class="title-component">Motifs de déplacement dans la gare</h2>
      <p class="description-component">Ce jeu de données est issu d'enquêtes non régulières réalisées dans différentes gares de France.</p>
      <canvas class="canvas" ref="reasonsChart" width="443" height="443"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default {
  name: "ReasonsChart",
  data() {
    return {
      ctx: null,
      chart: null,
      settings: null,
    }
  },
  props: {
    data: Object
  },
  watch: {
    'data': function () {
      const reasons = JSON.parse(JSON.stringify(this.data));

      if (this.chart !== null) {
        this.chart.destroy();
      }
      this.chart = new Chart(this.ctx, {
        type: 'doughnut',
        data: {
          labels: reasons.labels,
          datasets: [{
            label: '',
            data: reasons.data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.4)',
              'rgba(54, 162, 235, 0.4)',
              'rgba(255, 206, 86, 0.4)',
              'rgba(75, 192, 192, 0.4)',
              'rgba(153, 102, 255, 0.4)',
            ]
          }]
        },
        options: {
          plugins: {
            legend: {
              display: false
            }
          }
        },
        plugins: [ChartDataLabels]
      });
    }
  },
  mounted() {
    this.ctx = this.$refs.reasonsChart.getContext('2d');
  }
}
</script>

<style scoped>

</style>