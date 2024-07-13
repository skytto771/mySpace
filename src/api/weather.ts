import request from '@/utils/request'

export const getWeather = (city: any) => {
  return request({
    url: 'https://restapi.amap.com/v3/weather/weatherInfo',
    method: 'GET',
    params: {
      city,
      key: '0138bbb56f1a48cffd54d72f939e9291'
    }
  })
}
