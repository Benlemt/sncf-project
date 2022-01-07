import {
    fetchStations,
    fetchCleanliness,
    fetchStationTraffic,
    fetchReasons,
    fetchWifi,
    fetchEquipments,
    fetchSchedules,
    fetchDestinations
} from "@/api/api";

const state = () => ({
    stations: [],
    currentStation: {},
    cleanliness: [],
    traffic: [],
    reasons: [],
    wifi: false,
    equipments: {
        piano: false,
        charger: false
    },
    display: {
        traffic: false,
        cleanliness: false,
        reasons: false,
        schedules: false,
        destination: false
    },
    schedules: {},
    destinations: [],
});

const getters = {
    stations: (state) => {
        return state.stations;
    },
    numberStation: (state) => {
        return state.stations.length;
    },
    cluster: (state) => {
        let clusters = {
            type: 'FeatureCollection',
            features: []
        };

        state.stations.forEach(station => {
            clusters.features.push({
                type: 'Feature',
                properties: {id: station.name},
                geometry: {
                    type: "Point",
                    coordinates: [station.long, station.lat]
                },
            });
        });

        return clusters;
    },
    currentStation: (state) => {
        return state.currentStation;
    },
    cleanliness: (state) => {
        return state.cleanliness;
    },
    traffic: (state) => {
        return state.traffic;
    },
    reasons: (state) => {
        return state.reasons;
    },
    wifi: (state) => {
        return state.wifi;
    },
    equipments: (state) => {
        return state.equipments;
    },
    display: (state) => {
        return state.display;
    },
    schedules: (state) => {
        return state.schedules;
    },
    destinations: (state) => {
        return state.destinations;
    }
}

const actions = {
    async createStations({commit}) {
        let rawStations = await fetchStations();
        let stations = [];

        rawStations = rawStations.filter((station) => {
            return station.fields.wgs_84;
        })

        rawStations.forEach(rawStation => {
            stations.push({
                lat: rawStation.fields.wgs_84[0],
                long: rawStation.fields.wgs_84[1],
                name: rawStation.fields.alias_libelle_noncontraint,
                label: rawStation.fields.gare_ut_libelle,
                cp: rawStation.fields.adresse_cp,
                uic: rawStation.fields.uic_code,
                region: rawStation.fields.departement_libellemin
            });
        });

        commit('setStations', stations);
    },
    async getCleanliness({commit, state}) {
        let rawCleanliness = await fetchCleanliness(state.currentStation.uic);
        let rate = [];
        let date = [];

        rawCleanliness.forEach(cleanliness => {

            rate.push(cleanliness.fields.taux_de_conformite);
            date.push(cleanliness.fields.mois);

        });

        commit('setCleanliness', {rate: rate.reverse(), date: date.reverse()});
        commit('setDisplayCleanliness', rate.length > 0);

    },
    async getTraffic({commit, state}) {
        let rawTraffic = await fetchStationTraffic(state.currentStation.name);
        let listTraffic = [];

        rawTraffic.forEach(traffic => {
            listTraffic.push([
                traffic.fields.total_voyageurs_2015,
                traffic.fields.total_voyageurs_2016,
                traffic.fields.total_voyageurs_2017,
                traffic.fields.total_voyageurs_2018,
                traffic.fields.total_voyageurs_2019,
                traffic.fields.total_voyageurs_2020,
            ]);
        });

        commit('setTraffic', listTraffic);
        commit('setDisplayTraffic', listTraffic.length > 0);
    },
    async getReasons({commit, state}) {
        let rawReasons = await fetchReasons(state.currentStation.name);
        let labels = [];
        let percents = [];

        rawReasons.forEach(reason => {
            labels.push(reason.fields.motif_du_deplacement);
            percents.push(reason.fields.pourcentage);
        });

        commit('setReasons', {labels: labels, data: percents});
        commit('setDisplayReasons', labels.length > 0);
    },
    async getWifi({commit, state}) {
        let wifi = await fetchWifi(state.currentStation.name);

        if (wifi.length === 0) {
            commit('setWifi', false);
        } else {
            commit('setWifi', wifi[0].fields.service_wifi === 'Oui');
        }
    },
    async getEquipments({commit, state}) {
        let equipments = await fetchEquipments(state.currentStation.name);

        if (equipments.length === 0) {
            commit('setPiano', false);
            commit('setCharger', false);
        } else {
            commit('setPiano', equipments[0].fields.piano >= 1);
            commit('setCharger', equipments[0].fields.power_station >= 1);
        }
    },
    async getSchedules({commit, state}) {
        let rawSchedules = await fetchSchedules(state.currentStation.name);
        let listSchedules = {}
        rawSchedules.forEach(schedules => {
            listSchedules[schedules.fields.jour] = schedules.fields.horaire_normal;
        });

        commit('setSchedules', listSchedules);
        commit('setDisplaySchedules', Object.keys(listSchedules).length === 7)
    },
    async getDestination({commit, state}) {
        let rawDestination = await fetchDestinations(state.currentStation.name);
        let listDestination = [];
        rawDestination.gforEach(destination => {

            listDestination.push({
                destination: destination.fields.destination,
                price: destination.fields.prix_eur,
                label_price: destination.fields.type_tarif,
            });
        });

        commit('setDestinations', listDestination);
        commit('setDisplayDestinations', listDestination.length > 0);
    },
    updateCurrentStation({commit, state}, newCurrentStationName) {
        const stations = JSON.parse(JSON.stringify(state.stations));
        const newCurrentStation = stations.find(st => st.name === newCurrentStationName);

        if (newCurrentStation !== undefined) {
            commit('setCurrentStation', newCurrentStation);
        }
    },
    selectRandomStation({commit, state}, random_number) {
        const stations = JSON.parse(JSON.stringify(state.stations));
        commit('setCurrentStation', stations[random_number]);
    }
}

const mutations = {
    setStations(state, stations) {
        state.stations = stations;
    },
    setCurrentStation(state, newCurrentStation) {
        state.currentStation = newCurrentStation;
    },
    setCleanliness(state, cleanliness) {
        state.cleanliness = cleanliness;
    },
    setTraffic(state, traffic) {
        state.traffic = traffic;
    },
    setReasons(state, reasons) {
        state.reasons = reasons;
    },
    setWifi(state, wifi) {
        state.wifi = wifi;
    },
    setPiano(state, piano) {
        state.equipments.piano = piano;
    },
    setCharger(state, charger) {
        state.equipments.charger = charger;
    },
    setDisplayTraffic(state, traffic) {
        state.display.traffic = traffic;
    },
    setDisplayCleanliness(state, cleanliness) {
        state.display.cleanliness = cleanliness;
    },
    setDisplayReasons(state, reasons) {
        state.display.reasons = reasons;
    },
    setDisplaySchedules(state, schedules) {
        state.display.schedules = schedules;
    },
    setSchedules(state, schedules) {
        state.schedules = schedules;
    },
    setDisplayDestinations(state, destination) {
        state.display.destination = destination;
    },
    setDestinations(state, destinations) {
        state.destinations = destinations;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}