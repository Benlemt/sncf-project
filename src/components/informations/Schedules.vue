<template>
  <div class="schedules">
    <div class="schedules-container">
      <div class="container">
        <div v-if="isOpen === true || isOpen === false" class="today">
          <div v-if="isOpen">
            <div class="is-open">
              <p class="is-open-hour-open">Ouvert</p>
              <p class="is-open-hour-close">Ferme à {{ close }}</p>
            </div>
          </div>
          <div v-else>
            <div class="is-close">
              <p>Fermé</p>
              <p v-if="open !== 'Fermé'">Ouvre à {{ open }}</p>
            </div>
          </div>
          <div>
            <button @click="updateDisplaySchedules">
              <svg v-if="displaySchedules === false" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600"
                   fill="none"
                   viewBox="0 0 24 24"
                   stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
              <svg v-if="displaySchedules" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="schedules-container" v-show="displaySchedules">
      <div class="container">
        <ul class="schedules-list">
          <li v-for="(hours, schedule) in filteredSchedules" :key="schedule">
            <span v-bind:class="{'is-today': schedule == today}">{{ schedule }} :</span>
            {{ hours }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Schedules",
  props: {
    data: Object
  },
  data() {
    return {
      displaySchedules: false
    }
  },
  methods: {
    updateDisplaySchedules() {
      this.displaySchedules = !(this.displaySchedules);
    },
    getMinutesFromMidnight(str) {
      let time = str.split(':');
      return parseInt(time[0]) * 60 + parseInt(time[1]);
    }
  },
  computed: {
    // Return the day of the week (in french)
    today: function () {
      const day = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      return day[new Date().getDay()];
    },
    // Return today's schedules
    filteredSchedules: function () {
      return {
        'Lundi': this.data['Lundi'],
        'Mardi': this.data['Mardi'],
        'Mercredi': this.data['Mercredi'],
        'Jeudi': this.data['Jeudi'],
        'Vendredi': this.data['Vendredi'],
        'Samedi': this.data['Samedi'],
        'Dimanche': this.data['Dimanche'],
      }
    },
    // Return today's opening hours
    open: function () {
      if (Object.keys(this.data).length === 7) {
        return this.data[this.today] === 'Fermé' ? 'Fermé' : this.data[this.today].split('-')[0];
      }
      return null;
    },
    // Return today's closing times
    close: function () {
      if (Object.keys(this.data).length === 7) {
        return this.data[this.today] === 'Fermé' ? 'Fermé' : this.data[this.today].split('-')[1];
      }
      return null;
    },
    // Return true if is open, false if is close, null if schedules doesn't exist
    isOpen: function () {
      const strNow = new Date().getHours().toString() + ':' + new Date().getMinutes().toString();

      if (this.open !== null && this.open !== 'Fermé') {
        let minutesNow = this.getMinutesFromMidnight(strNow);
        let minutesOpen = this.getMinutesFromMidnight(this.open);
        let minutesClose = this.getMinutesFromMidnight(this.close);

        // When the closing time is at night
        if (minutesOpen > minutesClose) {
          minutesClose += this.getMinutesFromMidnight('24:00');
        }
        return ((minutesNow > minutesOpen) && (minutesNow < minutesClose));
      } else if (this.open === 'Fermé') {
        return false;
      }
      return null;
    },
  },
}
</script>

<style scoped>
.schedules-container {
  @apply border-b border-gray-100;
}

.schedules-container:nth-of-type(2) {
  @apply bg-gray-50;
}

.today {
  @apply flex justify-between;
}

.is-open,
.is-close {
  @apply flex;
}

.is-open-hour-open {
  @apply block w-16 font-bold text-green-500;
}

.is-open-hour-close {
  @apply text-gray-600 font-normal;
}

.is-close p:first-of-type {
  @apply block w-16 font-bold text-red-500;
}

.is-close p:nth-of-type(2) {
  @apply text-gray-600;
}

.schedules-list li {
  @apply h-8 flex text-gray-500;
}

.schedules-list li span {
  @apply w-28;
}

.is-today {
  @apply font-bold;
}

</style>