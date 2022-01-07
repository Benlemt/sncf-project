<template>
  <div class="chart-container">
    <div class="container">
      <h2 class="title-component">Fréquentation de la gare entre 2015 et 2020</h2>
      <p class="description-component">
        Ce jeu de données représente la fréquentation annuelle des voyageurs de 2015 à 2020. La baisse significative de
        2020 est dû au contexte sanitaire en France.
      </p>
      <div class="canvas-container">
        <canvas v-show="this.bar" ref="trafficChartBar" width="443" height="443"
                class="canvas"></canvas>
        <canvas v-show="this.bar === false" ref="trafficCharLine" width="443" height="443"
                class="canvas"></canvas>
        <div>
          <button class="switch-btn" @click="switchChart">Changer le type de graphique</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  name: "TrafficChart",
  data() {
    return {
      ctxBar: null,
      ctxLine: null,
      chartBar: null,
      chartLine: null,
      bar: true,
    }
  },
  props: {
    data: Object
  },
  watch: {
    'data': function () {
      this.resetChart();
    }
  },
  methods: {
    switchChart() {
      this.bar = !(this.bar);
    },
    resetChart() {
      this.destroyChart();
      this.chartBar = new Chart(this.ctxBar, {
        type: 'bar',
        data: {
          labels: ['2015', '2016', '2017', '2018', '2019', '2020'],
          datasets: [{
            label: 'Fréquentation annuelle de la gare',
            data: JSON.parse(JSON.stringify(this.data))[0],
            backgroundColor: [
              'rgba(54, 162, 235, 0.4)'
            ]
          }]
        },
        options: {
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
      this.chartLine = new Chart(this.ctxLine, {
        type: 'line',
        data: {
          labels: ['2015', '2016', '2017', '2018', '2019', '2020'],
          datasets: [{
            label: 'Fréquentation annuelle de la gare',
            data: JSON.parse(JSON.stringify(this.data))[0],
            borderColor: 'rgba(54, 162, 235, 0.4)',
          }]
        },
        options: {
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    },
    destroyChart() {
      if (this.chartBar !== null) {
        this.chartBar.destroy();
      }
      if (this.chartLine !== null) {
        this.chartLine.destroy();
      }
    }
  },
  mounted() {
    this.ctxBar = this.$refs.trafficChartBar.getContext('2d');
    this.ctxLine = this.$refs.trafficCharLine.getContext('2d');
  }
}
</script>

<style scoped>
.switch-btn {
  @apply block mx-auto text-sm mt-4;
}

.switch-btn:hover {
  @apply underline;
}
</style>