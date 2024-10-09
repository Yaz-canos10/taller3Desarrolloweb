import React, { useState, useEffect } from "react";
import "./App.css";

const Clock = ({ city, timezone, onDelete }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const options = {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const formattedTime = new Intl.DateTimeFormat("es-ES", options).format(time);

  return (
    <div className="clock">
      <h2>{city}</h2>
      <p>{formattedTime}</p>
      <button onClick={onDelete}>Eliminar</button>
    </div>
  );
};

const AddCityForm = ({ addCity }) => {
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [timezones, setTimezones] = useState([]);
  const api = "http://worldtimeapi.org/api/timezone"
  useEffect(() => {
    const fetchTimezones = async () => {
      try {
        const response = await fetch(api);
        const data = await response.json();
        setTimezones(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTimezones();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTimezone) {
      const cityName = selectedTimezone.split("/").pop().replace("_", " ");
      addCity(cityName, selectedTimezone);
      setSelectedTimezone("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={selectedTimezone}
        onChange={(e) => setSelectedTimezone(e.target.value)}
      >
        <option value="" disabled>
          Selecciona una zona horaria
        </option>
        {timezones.map((timezone, index) => (
          <option key={index} value={timezone}>
            {timezone}
          </option>
        ))}
      </select>
      <button type="submit">Añadir</button>
    </form>
  );
};

function App() {
  const getSavedCities = () => {
    const savedCities = localStorage.getItem("cities");
    return savedCities
      ? JSON.parse(savedCities)
      : [
        { city: "New York", timezone: "America/New_York" },
        { city: "Tokio", timezone: "Asia/Tokyo" },
        { city: "Londres", timezone: "Europe/London" },
      ];
  };

  const [cities, setCities] = useState(getSavedCities);

  useEffect(() => {
    localStorage.setItem("cities", JSON.stringify(cities));
  }, [cities]);

  const addCity = (city, timezone) => {
    setCities([...cities, { city, timezone }]);
  };

  const removeCity = (cityToRemove) => {
    setCities(cities.filter((city) => city.city !== cityToRemove));
  };

  return (
    <div className="App">
      <h1>Reloj Mundial</h1>
      <div className="clock-container">
        {cities.map((cityObj, index) => (
          <Clock
            key={index}
            city={cityObj.city}
            timezone={cityObj.timezone}
            onDelete={() => removeCity(cityObj.city)}
          />
        ))}
      </div>
      <AddCityForm addCity={addCity} />
    </div>
  );
}

export default App;
