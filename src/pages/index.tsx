import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState('')
  const [searchHistory, setSearchHistory] = useState([]);

  // Load search history from local storage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory).reverse()); // Reverse the order
    }
  }, []);

  // Save search history to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const getWeather = async () => {
    const api_key = '19bd078652db450398e21707231909';
    const api_url = 'http://api.weatherapi.com/v1/current.json?key=' + api_key + '&q=' + location;

    if (location) {
      try {
        const result = await fetch(api_url)
        const data = await result.json()
        if (data) {
          const api_data = {
            country: data.location.country,
            city: data.location.name,
            temp: data.current.temp_f,
            humidity: data.current.humidity,
            wind: data.current.wind_mph,
            gust: data.current.gust_mph,
            visibility: data.current.vis_miles,
            condition: data.current.condition.text,
            img: data.current.condition.icon
          }

          // Update search history with the new search
          setSearchHistory([api_data.city, ...searchHistory]);

          // Update weather data with the new weather information
          setWeatherData([api_data, ...weatherData]);

        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <>
      <nav className='flex items-center justify-center py-4 bg-gray-100 w-full m-0 opacity-90'>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0  flex items-center pl-3 pointer-events-none'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /> <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" /> </svg></div>
          <input className='block bg-slate-700 text-white rounded-lg opacity-70 pl-10 p-2'
            type="text"
            id='location'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder='location (ex: New York)' />
        </div>

        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold m-2 p-2.5 rounded-lg' id='search' onClick={getWeather}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16"> <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" /> </svg>
          <span className='sr-only'>GO</span>
        </button>
      </nav>

      <h2 className='text-lg font-semibold m-4 text-center text-white text-2xl' style={{ fontSize: '24px' }}>
        Last Searches:
      </h2>
      <div className='flex flex-wrap justify-center'>
        {searchHistory.map((city, index) => (
          <div className='w-full max-w-xs m-4' key={index}>
            <div className='bg-white shadow-lg rounded-3xl px-8 pt-6 pb-8 mb-4 opacity-80'>
              <div className='text-center text-2xl p-2'>{city}</div>
              {weatherData[index] && (
                <>
                  <div className='flex justify-center'>
                    <div className='flow-root'>
                      <div className='float-left'>
                        <img src={weatherData[index].img} width='80' height='80' alt='Condition' />
                      </div>
                      <div className='float-left text-6xl degrees'>{weatherData[index].temp}</div>
                    </div>
                  </div>
                  <div className='text-center text-gray-600'>{weatherData[index].condition}</div>
                  <div className='flow-root p-2'>
                    <div className='float-left text-gray-600'>Humidity: {weatherData[index].humidity}%</div>
                    <div className='float-right text-gray-600'>Wind: {weatherData[index].wind}mph</div>
                    <div className='float-left text-gray-600'>Visibility: {weatherData[index].visibility}mi</div>
                    <div className='float-right text-gray-600'>Gust: {weatherData[index].gust}mph</div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

    </>
  )
}
