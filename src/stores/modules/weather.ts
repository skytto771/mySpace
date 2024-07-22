import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useWeatherStore = defineStore(
  'weatherStore',
  () => {
    type weatherType = {
      adcode: string
      city: string
      humidity: string
      humidity_float: string
      province: string
      reporttime: string
      temperature: string
      temperature_float: string
      weather: string
      winddirection: string
      windpower: string
    }

    const weather = ref({})
    const currentCity = ref('440100')

    const renewWeather = (weatherData: weatherType) => {
      weather.value = weatherData
    }
    return { weather, currentCity, renewWeather }
  },
  {
    persist: true
  }
)
