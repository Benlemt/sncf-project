<template>
  <div id="map"></div>
</template>

<script>

import mapboxgl from 'mapbox-gl';
import {mapGetters} from "vuex";

export default {
  name: 'Map',
  data() {
    return {
      token: "pk.eyJ1IjoiYmVuamFtaW5sbXQiLCJhIjoiY2t2Y2gzd2dlMmoyNzJyb2t1ZTF4cGZmMiJ9.3IYg-65OXLmbBDniI4DHiQ",
      map: null,
      marker: null,
    }
  },
  mounted() {
    mapboxgl.accessToken = this.token;

    // Generate the map
    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v10",
      center: [2.35, 48.85], // Paris
      zoom: 4.5,
    });
  },
  computed: {
    ...mapGetters('stations', {
          stations: 'cluster',
          current: 'currentStation'
        }
    )
  },
  watch: {
    // Check if the current station has changed
    current() {
      this.addPoint(this.current.lat, this.current.long);
      this.flyTo(this.current.lat, this.current.long);
    },
    // Check if the stations are loaded in memory
    stations() {
      this.createCluster();
    }
  },
  methods: {
    // Add point [lat, long] on the map
    addPoint(lat, long) {
      if (this.marker != null) {
        this.marker.remove();
      }
      this.marker = new mapboxgl.Marker().setLngLat([long, lat]).addTo(this.map);
    },
    // Fly to the point [lat, long]
    flyTo(lat, long) {
      this.map.flyTo({
        center: [long, lat],
        zoom: 12,
        bearing: 0,
        speed: 0.85,
        curve: 1,
        easing: (t) => t,
        essential: true
      });
    },
    // Create and display cluster (needed geojson)
    createCluster() {

      this.map.addSource('stations', {
        type: 'geojson',
        data: this.stations,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      this.map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'stations',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            5,
            '#51bbd6', // TODO : Maybe change color ?
            50,
            '#51bbd6' // TODO : Maybe change color ?
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        }
      });

      this.map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'stations',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['Arial Unicode MS Bold'],
          'text-size': 12
        }
      });

      this.map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'stations',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#51bbd6',
          'circle-radius': 8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });


      // inspect a cluster on click
      this.map.on('click', 'clusters', (e) => {
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        this.map.getSource('stations').getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
              if (err) return;

              this.map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom
              });
            }
        );
      });

      // inspect a unclustered-point
      this.map.on('click', 'unclustered-point', (e) => {
        this.$store.dispatch('stations/updateCurrentStation', e.features[0].properties.id);
      });

      this.map.on('mouseenter', 'clusters', () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });
      this.map.on('mouseleave', 'clusters', () => {
        this.map.getCanvas().style.cursor = '';
      });


    }
  }

}
</script>

<style scoped>
#map {
  height: 100vh;
}
</style>