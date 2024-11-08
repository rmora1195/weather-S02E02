import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import {
	thunderstormSvg,
	drizzleSvg,
	rainSvg,
	snowSvg,
	atmosphereSvg,
	clearSvg,
	cloudSvg,
} from './assets/images';
import Loading from './components/Loading';

const Key = 'f4784fbc84ea157b599cca591457ccd3';
const url = `https://api.openweathermap.org/data/2.5/weather`;
const initialState = {
	latitude: 0,
	longitude: 0,
};

const conditionCodes = {
	thunderstorm: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
	drizzle: [300, 301, 302, 310, 311, 312, 313, 314, 321],
	rain: [500, 501, 502, 503, 504, 511, 520, 521, 522, 531],
	snow: [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],
	atmosphere: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
	clear: [800],
	clouds: [801, 802, 803, 804],
};

const icons = {
	thunderstorm: thunderstormSvg,
	drizzle: drizzleSvg,
	rain: rainSvg,
	snow: snowSvg,
	atmosphere: atmosphereSvg,
	clear: clearSvg,
	clouds: cloudSvg,
};

function App() {
	const [coords, setCoords] = useState(initialState);
	const [weather, setWeather] = useState({});
	const [city, setCity] = useState('');
	const [cityInput, setCityInput] = useState('');
	const [temperatureUnit, setTemperatureUnit] = useState('C');
	const [speedUnit, setSpeedUnit] = useState('m/s');
	const [isLoading, setIsLoading] = useState(true);

	const getIcon = (weatherId) => {
		const keys = Object.keys(conditionCodes);
		const iconName = keys.find((key) =>
			conditionCodes[key].includes(weatherId),
		);
		return icons[iconName];
	};

	useEffect(() => {
		const success = (position) => {
			const { latitude, longitude } = position.coords;
			setCoords({ latitude, longitude });
		};
		const error = async (error) => {
			console.log(
				'No aceptaste la geolocalización, obteniendo ubicación por IP',
			);
			try {
				const response = await axios.get('https://ipapi.co/json/');
				const { latitude, longitude } = response.data;
				setCoords({ latitude, longitude });
			} catch (error) {
				console.error('Error obteniendo la ubicación por IP', error);
			}
		};

		window.navigator.geolocation.getCurrentPosition(success, error);
	}, []);

	useEffect(() => {
		if (coords.latitude && coords.longitude && !city) {
			axios
				.get(
					`${url}?lat=${coords.latitude}&lon=${coords.longitude}&appid=${Key}`,
				)
				.then((res) => {
					const weatherData = res.data;

					setWeather({
						city: weatherData?.name,
						country: weatherData?.sys?.country,
						icon: getIcon(weatherData?.weather[0]?.id),
						main: weatherData?.weather[0]?.main,
						wind: weatherData?.wind?.speed,
						clouds: weatherData?.clouds?.all,
						pressure: weatherData?.main?.pressure,
						temperature: parseInt(weatherData?.main?.temp - 273.15),
						temperature_max: parseInt(weatherData?.main?.temp_max - 273.15),
						temperature_min: parseInt(weatherData?.main?.temp_min - 273.15),
						temperature_feels_like: parseInt(
							weatherData?.main?.feels_like - 273.15,
						),
						visibility: weatherData?.visibility,
						sunrise: weatherData?.sys?.sunrise,
						humidity: weatherData?.main?.humidity,
					});
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [coords, city]);

	useEffect(() => {
		if (city) {
			axios
				.get(`${url}?q=${city}&appid=${Key}`)
				.then((res) => {
					const weatherData = res.data;
					setWeather({
						city: weatherData?.name,
						country: weatherData?.sys?.country,
						icon: getIcon(weatherData?.weather[0]?.id),
						main: weatherData?.weather[0]?.main,
						wind: weatherData?.wind?.speed,
						clouds: weatherData?.clouds?.all,
						pressure: weatherData?.main?.pressure,
						temperature: parseInt(weatherData?.main?.temp - 273.15),
						temperature_max: parseInt(weatherData?.main?.temp_max - 273.15),
						temperature_min: parseInt(weatherData?.main?.temp_min - 273.15),
						temperature_feels_like: parseInt(
							weatherData?.main?.feels_like - 273.15,
						),
						visibility: weatherData?.visibility,
						sunrise: weatherData?.sys?.sunrise,
						humidity: weatherData?.main?.humidity,
					});
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [city]);

	const handleInputChange = (e) => {
		setCityInput(e.target.value);
	};

	const handleCitySubmit = () => {
		setCity(cityInput);
	};

	const toggleTemperatureUnit = () => {
		setTemperatureUnit((prevUnit) => (prevUnit === 'C' ? 'F' : 'C'));
	};

	const toggleSpeedUnit = () => {
		setSpeedUnit((prevUnit) => (prevUnit === 'm/s' ? 'km/h' : 'm/s'));
	};

	const convertTemperature = (tempC) =>
		temperatureUnit === 'C' ? tempC : parseInt((tempC * 9) / 5 + 32);

	const convertSpeed = (speedMs) =>
		speedUnit === 'm/s' ? speedMs : parseFloat((speedMs * 3.6).toFixed(1));

	// el loader
	useEffect(() => {
		const fakeDataFetch = () => {
			setTimeout(() => {
				setIsLoading(false);
			}, 3000); // Espera 3 segundos antes de marcar como "no cargando"
		};

		fakeDataFetch();
	}, [weather]);

	return isLoading ? (
		<Loading />
	) : (
		<div className="card">
			<div className="card__title box">
				<div className="title__country--and--search">
					<h2 className="card__title__city-country">
						{weather.city}, {weather.country}
					</h2>

					<div className="card__title__search-bar">
						<input
							type="text"
							value={cityInput}
							onChange={handleInputChange}
							placeholder="Enter city"
						/>
						<button className="btn" onClick={handleCitySubmit}>
							<i className="bx bx-search-alt"></i>
							{/* Search */}
						</button>
					</div>
				</div>
				<div className="card__title_icon">
					{weather.icon && (
						<img src={weather.icon} alt={weather.main} className="icon" />
					)}
				</div>
				<div className="card__title__temperature">
					<p className="card__title__temperature-now">
						{convertTemperature(weather.temperature)}°{temperatureUnit}
					</p>
					<p className="card__title__temperature-min">
						<span>Min:</span> {convertTemperature(weather.temperature_min)}°
						{temperatureUnit}
					</p>
					<p className="card__title__temperature-max">
						<span>Max:</span> {convertTemperature(weather.temperature_max)}°
						{temperatureUnit}
					</p>
					<p className="card__title__temperature-feels">
						Feels: <br /> {convertTemperature(weather.temperature_feels_like)}°
						{temperatureUnit}
					</p>
				</div>
			</div>
			<div className="card__settings box">
				<button
					className="card__settings__temperature-unit"
					onClick={toggleTemperatureUnit}
				>
					°{temperatureUnit === 'C' ? 'F' : 'C'}
				</button>
				<button
					className="card__settings__meassure-unit"
					onClick={toggleSpeedUnit}
				>
					{speedUnit === 'm/s' ? 'km/h' : 'm/s'}
				</button>
			</div>
			{/* AQUI AÑADI LOS SPAN PARA QUE FACILITE LEER LA INFO  */}
			<div className="card__dat box">
				<p className="card__wind-speed">
					<i className="bx bx-wind"></i>
					<b>WIND </b> <br />
					<span className="info-val">{convertSpeed(weather.wind)}</span>
					<span className="unit">{speedUnit}</span>
				</p>
				<p className="card__clouds">
					<i className="bx bx-cloud"></i> <b>CLOUDS </b> <br />
					<span className="info-val">{weather.clouds}</span>
					<span className="unit"> %</span>
				</p>
				<p className="card__pressure">
					<i className="bx bx-stopwatch"></i>
					<b>PRESSURE</b> <br />
					<span className="info-val">{weather.pressure}</span>
					<span className="unit">hPa</span>
				</p>
			</div>
			<div className="card__dat2 box">
				<p className="card__humidity">
					<i className="bx bx-water"></i>
					<b>HUMIDITY </b> <br />
					<span className="info-val"> {weather.humidity}</span>
					<span className="unit">%</span>
				</p>
				<p className="card__visibility">
					{' '}
					<i className="bx bxs-bullseye"></i>
					<b>VISIBILITY </b> <br />
					<span className="info-val">{weather.visibility}</span>
					<span className="unit">m</span>
				</p>
				<p className="card__sunrise">
					<i className="bx bx-sun"></i>
					<b>SUNRISE </b>
					<br />
					<span className="info-val">
						{new Date(weather.sunrise * 1000).toLocaleTimeString()}
					</span>
					<span className="unit">am</span>
				</p>
			</div>
		</div>
	);
}

export default App;
