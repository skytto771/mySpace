import axios from 'axios'

export const getWeather = (city: any) => {
  return axios.get(
    `https://restapi.amap.com/v3/weather/weatherInfo?key=${'0138bbb56f1a48cffd54d72f939e9291'}&city=${city}`
  )
}
export const getCityCode = (code: any) => {
  return axios.get(
    `https://restapi.amap.com/v3/config/district?keywords=${code}&subdistrict=2&key=${'0138bbb56f1a48cffd54d72f939e9291'}`
  )
}
