import axios from "axios";

const BASE_URL = "https://data.sncf.com/api/records/1.0/search/?dataset=";

function fetchStations() {
    return axios
        .get(`${BASE_URL}referentiel-gares-voyageurs&q=&rows=2874`)
        .then((resp) => {
            return resp.data.records;
        });
}

function fetchCleanliness(uic) {
    return axios
        .get(`${BASE_URL}proprete-en-gare&q=&rows=10&sort=mois&facet=mois&facet=nom_gare&refine.uic=${encodeURIComponent(uic)}`)
        .then((resp) => {
            return resp.data.records;
        });
}

function fetchStationTraffic(name) {
    return axios
        .get(`${BASE_URL}frequentation-gares&q=&facet=nom_gare&facet=code_postal&refine.nom_gare=${encodeURIComponent(name)}`)
        .then((resp) => {
            return resp.data.records;
        })
}

function fetchReasons(name) {
    return axios
        .get(`${BASE_URL}motif-deplacement&q=&sort=gare_enquetee&facet=gare_enquetee&facet=motif_du_deplacement&refine.gare_enquetee=${encodeURIComponent(name)}`)
        .then((resp) => {
            return resp.data.records;
        });
}

function fetchWifi(name) {
    return axios
        .get(`${BASE_URL}gares-equipees-du-wifi&q=&sort=nom_de_la_gare&facet=nom_de_la_gare&facet=service_wifi&refine.nom_de_la_gare=${encodeURIComponent(name)}`)
        .then((resp) => {
            return resp.data.records;
        });
}

function fetchEquipments(name) {
    return axios
        .get(`${BASE_URL}gares-pianos&q=&sort=gare&facet=gare&refine.gare=${encodeURIComponent(name)}`)
        .then((resp) => {
            return resp.data.records;
        });
}

function fetchSchedules(name) {
    return axios
        .get(`${BASE_URL}horaires-des-gares1&refine.nom_normal=${encodeURIComponent(name)}`)
        .then((resp) => {
            return resp.data.records;
        });
}

function fetchDestinations(name) {
    name = name.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    name = name.toUpperCase();
    return axios
        .get(`${BASE_URL}tarifs-ter-par-od&refine.origine=${encodeURIComponent(name)}`)
        .then((resp) => {
            return resp.data.records;
        });
}

export {
    fetchStations,
    fetchCleanliness,
    fetchStationTraffic,
    fetchReasons,
    fetchWifi,
    fetchEquipments,
    fetchSchedules,
    fetchDestinations
}