import React, { useState, useEffect } from "react";
import "./App.css";


const Reloj = ({ ciudad, zonaHoraria, onEliminar }) => {
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    const intervalo = setInterval(() => {
      setHora(new Date());
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  const opciones = {
    timeZone: zonaHoraria,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  const horaFormateada = new Intl.DateTimeFormat("es-ES", opciones).format(hora);

  return (
    <div className="reloj">
      <h2>{ciudad}</h2>
      <p>{horaFormateada}</p>
      <button onClick={onEliminar}>Eliminar</button>
    </div>
  );
};


const FormularioAgregarCiudad = ({ agregarCiudad }) => {
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState("");

  const opcionesCiudades = [
    { ciudad: "New York", zonaHoraria: "America/New_York" },
    { ciudad: "Tokio", zonaHoraria: "Asia/Tokyo" },
    { ciudad: "Londres", zonaHoraria: "Europe/London" },
    { ciudad: "Sydney", zonaHoraria: "Australia/Sydney" },
    { ciudad: "Medellín", zonaHoraria: "America/Bogota" },
    { ciudad: "Berlín", zonaHoraria: "Europe/Berlin" },
    { ciudad: "Ciudad de México", zonaHoraria: "America/Mexico_City" },
  ];

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (ciudadSeleccionada) {
      const ciudadObj = opcionesCiudades.find((c) => c.ciudad === ciudadSeleccionada);
      agregarCiudad(ciudadObj.ciudad, ciudadObj.zonaHoraria);
      setCiudadSeleccionada(""); 
    }
  };

  return (
    <form onSubmit={manejarEnvio}>
      <select
        value={ciudadSeleccionada}
        onChange={(e) => setCiudadSeleccionada(e.target.value)}
      >
        <option value="" disabled>
          Selecciona una ciudad
        </option>
        {opcionesCiudades.map((ciudad, index) => (
          <option key={index} value={ciudad.ciudad}>
            {ciudad.ciudad}
          </option>
        ))}
      </select>
      <button type="submit">Añadir</button>
    </form>
  );
};


function App() {
  const obtenerCiudadesGuardadas = () => {
    const guardadas = localStorage.getItem("ciudades");
    return guardadas
      ? JSON.parse(guardadas)
      : [
          { ciudad: "New York", zonaHoraria: "America/New_York" },
          { ciudad: "Tokio", zonaHoraria: "Asia/Tokyo" },
          { ciudad: "Londres", zonaHoraria: "Europe/London" },
        ];
  };

  const [ciudades, setCiudades] = useState(obtenerCiudadesGuardadas);

  useEffect(() => {
    localStorage.setItem("ciudades", JSON.stringify(ciudades));
  }, [ciudades]);

  const agregarCiudad = (ciudad, zonaHoraria) => {
    setCiudades([...ciudades, { ciudad, zonaHoraria }]);
  };

  const eliminarCiudad = (ciudadAEliminar) => {
    const ciudadesActualizadas = ciudades.filter((ciudad) => ciudad.ciudad !== ciudadAEliminar);
    setCiudades(ciudadesActualizadas);
  };

  return (
    <div className="App">
      <h1>Reloj Mundial</h1>
      <div className="contenedor-relojes">
        {ciudades.map((ciudadObj, index) => (
          <Reloj
            key={index}
            ciudad={ciudadObj.ciudad}
            zonaHoraria={ciudadObj.zonaHoraria}
            onEliminar={() => eliminarCiudad(ciudadObj.ciudad)}
          />
        ))}
      </div>

  
      <FormularioAgregarCiudad agregarCiudad={agregarCiudad} />
    </div>
  );
}

export default App;