import { createStore } from 'vuex'
import stations from './modules/stations'

export default createStore({
    modules: {
        stations,
    },
    strict: process.env.NODE_ENV !== 'production',
})