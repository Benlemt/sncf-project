<template>
  <div>
    <div class="container">
      <h2 class="title-component">Lieux de destinations</h2>
      <p class="description-component">
        Ce jeu de données présente la tarification des trajets en TER par origine-destination, ainsi que les abonnements
        mensuels.
      </p>
    </div>
    <table class="table-destination">
      <thead>
      <tr>
        <th class="destination">Destination</th>
        <th class="price">Prix</th>
        <th class="label">Tarif</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(dest, index) in data" :key="index">
        <td class="destination-text">{{ dest.destination }}</td>
        <td class="price-text">{{ dest.price }} &euro;</td>
        <td class="label-text">
          <span v-bind:class="getClass(dest.label_price)">
            {{ getLabel(dest.label_price) }}
          </span>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "Destinations",
  methods: {
    getLabel(label_price) {
      return label_price === 'Tarif normal' ? 'Normal' : 'Abonnement';
    },
    getClass(label_price) {
      return label_price === 'Tarif normal' ? 'label-normal' : 'label-sub';
    },
  },
  props: {
    data: Array,
  }
}
</script>

<style scoped>

.table-destination {
  @apply table-fixed w-full -mt-4 mb-4;
}

.table-destination thead {
  @apply bg-gray-50 border-b border-t border-gray-200;
}

.table-destination thead tr th {
  @apply text-left text-xs font-medium text-gray-500 uppercase;
}

.destination {
  @apply w-1/2 px-6 py-3;
}

.price,
.label {
  @apply w-1/4 px-6 py-3;
}

.destination-text,
.price-text {
  @apply px-6 py-3 text-sm text-gray-900;
}

.label-text {
  @apply text-xs px-6 py-3;
}

.label-normal {
  @apply font-semibold text-green-500;
}

.label-sub {
  @apply font-semibold text-purple-500;
}

</style>