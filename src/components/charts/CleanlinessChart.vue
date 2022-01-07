<template>
  <div class="chart-container">
    <div class="container">
      <h2 class="title-component">Taux de conformité de la propreté en gare</h2>
      <p class="description-component">
        L'obligation de résultat est fixée à 90%. Cela signifie que si le taux de conformité est en deça, alors il sera
        affiché en rouge. Nous avons fixé un seuil compris entre 90% et 95% indiqué en orange. Le reste est affiché en
        vert.
      </p>
      <canvas class="canvas" ref="cleanlinessChart" width="443" height="443"></canvas>
    </div>
  </div>
</template>

<script>

import Chart from "chart.js/auto";

export default {
  name: "CleanlinessChart",
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
      const cleanliness = JSON.parse(JSON.stringify(this.data));

      // Create custom color bar
      let colors = [];
      cleanliness.rate.forEach(item => {
        if (item < 90) {
          colors.push('rgba(255, 99, 132, 0.4)')
        } else if (item < 95) {
          colors.push('rgba(255, 159, 64, 0.4)')
        } else {
          colors.push('rgba(75, 192, 192, 0.4)')
        }
      })

      if (this.chart !== null) {
        this.chart.destroy();
      }

      this.chart = new Chart(this.ctx, {
        type: 'bar',
        data: {
          labels: cleanliness.date,
          datasets: [{
            label: 'Taux de conformité',
            data: cleanliness.rate,
            backgroundColor: colors
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
    }
  },
  mounted() {
    this.ctx = this.$refs.cleanlinessChart.getContext('2d');
  }
}
</script>

<style scoped>

</style>