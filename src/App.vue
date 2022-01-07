<template>
  <div class="app">
    <Sidebar id="sidebar"></Sidebar>
    <RandomStationBtn></RandomStationBtn>
    <Map id="map"></Map>
  </div>
</template>

<script>
import Map from "./components/Map";
import Sidebar from "./components/Sidebar"
import RandomStationBtn from "@/components/RandomStationBtn";

export default {
  name: 'App',
  components: {
    Map,
    Sidebar,
    RandomStationBtn
  },
  beforeCreate() {
    this.$store.dispatch('stations/createStations');
  }
}
</script>

<style scoped>
.app {
  @apply flex;
}

#sidebar {
  width: 480px;
  height: 100vh;
}

#map {
  width: calc(100% - 480px);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  #sidebar {
    width: 100%;
  }

  #map {
    display: none;
  }
}
</style>
