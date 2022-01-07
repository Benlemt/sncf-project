<!-- Composent Sidebar -->
<template>
  <div class="sidebar">
    <header ref="header" class="sidebar-header">
      <div class="container">
        <form @submit.prevent>
          <div class="searchbar">
            <div class="searchbar-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input class="searchbar-input " ref="input" type="text" placeholder="Rechercher une gare" list="stations"
                   @change="onChange($event)">
            <datalist id="stations">
              <option v-for="station in stations" :key="station.uic">{{ station.name }}</option>
            </datalist>
          </div>
        </form>
      </div>
    </header>
    <aside v-if="first == false">
      <header class="station-infos">
        <div class="container">
          <h1 class="station-name">{{ current.name }}</h1>
          <div class="station-infos-flex">
            <h2 class="station-infos-region">{{ current.region }} {{ current.cp }}</h2>
            <h3 class="station-infos-uic"><span class="uic">UIC :</span> {{ current.uic }}</h3>
          </div>
        </div>
      </header>
      <section class="station-equipments">
        <div class="station-equipments-container">
          <Wifi :wifi="wifi"></Wifi>
          <Charger :charger="equipments.charger"></Charger>
          <Piano :piano="equipments.piano"></Piano>
        </div>
      </section>

      <div class="station-schedules">
        <Schedules v-show="display.schedules" :data="schedules"></Schedules>
      </div>

      <div
          v-if="display.traffic == false || display.cleanliness == false || display.reasons == false || display.destination == false">
        <div class="empty-dataset">
          <div class="container">
            <p>Donnée(s) manquante(s) : </p>
            <ul>
              <li v-if="display.traffic == false">Fréquentation de la gare</li>
              <li v-if="display.cleanliness == false">Évolution du contrôle de la propreté</li>
              <li v-if="display.reasons == false">Raisons de déplacement</li>
              <li v-if="display.destination == false">Destinations</li>
            </ul>
          </div>
        </div>
      </div>

      <TrafficChart v-show="display.traffic" :data="traffic"></TrafficChart>
      <CleanlinessChart v-show="display.cleanliness" :data="cleanliness"></CleanlinessChart>
      <ReasonsChart v-show="display.reasons" :data="reasons"></ReasonsChart>
      <Destinations v-show="display.destination" :data="destinations"></Destinations>
    </aside>
    <aside v-if="first">
      <div class="first-time-img">
        <img src="@/assets/empty.png" alt="">
      </div>
    </aside>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';
import TrafficChart from "@/components/charts/TrafficChart";
import CleanlinessChart from "@/components/charts/CleanlinessChart";
import ReasonsChart from "@/components/charts/ReasonsChart";
import Wifi from "@/components/equipments/Wifi";
import Charger from "@/components/equipments/Charger";
import Piano from "@/components/equipments/Piano";
import Schedules from "@/components/informations/Schedules";
import Destinations from "@/components/informations/Destinations";

export default {
  name: 'Sidebar',
  components: {
    Destinations,
    Schedules,
    TrafficChart,
    CleanlinessChart,
    ReasonsChart,
    Wifi,
    Charger,
    Piano
  },
  computed: {
    ...mapGetters('stations', {
      stations: 'stations',
      current: 'currentStation',
      cleanliness: 'cleanliness',
      traffic: 'traffic',
      reasons: 'reasons',
      wifi: 'wifi',
      equipments: 'equipments',
      display: 'display',
      schedules: 'schedules',
      destinations: 'destinations',
    })
  },
  data() {
    return {
      first: true // true when it is the first time the app is loaded
    }
  },
  methods: {
    // Called when user update the search input
    onChange(event) {
      if (event.target.value !== null && event.target.value !== '') {
        this.$store.dispatch('stations/updateCurrentStation', event.target.value);
      }
    },
    updateSidebar() {
      this.first = false;
      this.$store.dispatch('stations/getCleanliness');
      this.$store.dispatch('stations/getTraffic');
      this.$store.dispatch('stations/getWifi');
      this.$store.dispatch('stations/getEquipments');
      this.$store.dispatch('stations/getSchedules');
      this.$store.dispatch('stations/getReasons');
      this.$store.dispatch('stations/getDestination');
    }
  },
  watch: {
    // Check if the current station has changed
    current() {
      const currentName = JSON.parse(JSON.stringify(this.current));
      if (currentName.name !== undefined) {
        this.updateSidebar();
        this.$refs.input.value = currentName.name; // Update search input
        this.$refs.header.scrollIntoView(); // Scroll to top
      }
    }
  }
}
</script>

<style scoped>
.sidebar {
  @apply max-h-full overflow-y-auto relative;
}

.sidebar-header {
  @apply border-b border-gray-100;
}

/* SEARCHBAR */
.searchbar {
  @apply flex items-center
}

.searchbar-icon svg {
  @apply h-6 w-6 text-gray-700;
}

.searchbar-input {
  @apply appearance-none w-full py-2 px-3 text-gray-700 leading-tight;
}

.searchbar-input:focus {
  @apply outline-none;
}

/* STATION INFORMATION */
.station-infos {
  @apply border-b border-gray-100;
}

.station-infos-flex {
  @apply mt-2 flex justify-between;
}

.station-name {
  @apply text-2xl text-gray-900;
}

.station-infos-region,
.station-infos-uic {
  @apply text-gray-500;
}

.uic {
  @apply text-sm;
}

.station-equipments {
  @apply w-full border-b border-gray-100;
}

.station-equipments-container {
  @apply flex justify-between my-4;
}

/* FIRST TIME (APP DOESN'T START) */
.first-time-img {
  @apply absolute bottom-0;
}

.first-time-box p {
  @apply text-center text-gray-500 text-sm mt-4;
}

/* EMPTY DATASET */
.empty-dataset {
  @apply border-b border-gray-100;
}

.empty-dataset p {
  @apply text-gray-500 text-sm;
}

.empty-dataset ul {
  @apply list-disc;
}

.empty-dataset ul li {
  @apply text-gray-500 text-sm ml-4;
}


</style>