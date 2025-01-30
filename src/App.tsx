import React from "react";
import api from "./service/api";
const daysOfWeek = [
  { day: "Sunday", day_fc: "SUN" },
  { day: "Monday", day_fc: "MON" },
  { day: "Tuesday", day_fc: "TUE" },
  { day: "Wednesday", day_fc: "WED" },
  { day: "Thursday", day_fc: "THU" },
  { day: "Friday", day_fc: "FRI" },
  { day: "Saturday", day_fc: "SAT" },
];

const App: React.FC = () => {
  const [search, setSearch] = React.useState<string>("qom");
  const [country, setCountry] = React.useState<string>("Iran");
  const [weather, setWeather] = React.useState<object>({});
  const [sun, setSun] = React.useState<object>({});
  const [forecast, setForecast] = React.useState<object>({});
  const [time, setTime] = React.useState<string>("");
  const [date, setDate] = React.useState<string>("");
  const [days, setDays] = React.useState<{ day: string; day_fc: string }[]>([]);

  // Date & Time
  React.useEffect(() => {
    function updateClock() {
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const day = now.getDate().toString().padStart(2, "0");
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");

      setTime(`${hours}:${minutes}:${seconds}`);
      setDate(`${year}-${month}-${day}`);
    }

    updateClock();

    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Day of Week

  React.useEffect(() => {
    const todayIndex = new Date().getDay();

    const sortedDays = [
      ...daysOfWeek.slice(todayIndex),
      ...daysOfWeek.slice(0, todayIndex),
    ];

    setDays(sortedDays);
  }, []);

  // Starter api Weather
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("current.json", {
          params: {
            q: search,
            key: api.defaults.params.key,
          },
        });
        setWeather(response.data);
        setCountry(() => {
          return response.data.location?.country;
        });
        const response2 = await api.get("marine.json", {
          params: {
            q: search,
            key: api.defaults.params.key,
          },
        });
        setSun(response2.data);
        const response3 = await api.get("forecast.json", {
          params: {
            q: search,
            key: api.defaults.params.key,
            days: 7,
          },
        });
        setForecast(response3.data);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchData();
  }, []);

  // Search api Weather
  const handleKeyUp = async (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      try {
        const response = await api.get("current.json", {
          params: {
            q: search,
            key: api.defaults.params.key,
          },
        });
        setWeather(response.data);
        const response2 = await api.get("marine.json", {
          params: {
            q: search,
            key: api.defaults.params.key,
          },
        });
        setSun(response2.data);
        const response3 = await api.get("forecast.json", {
          params: {
            q: search,
            key: api.defaults.params.key,
            days: 7,
          },
        });
        setForecast(response3.data);
        console.log(response3.data);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [search]);

  return (
    <>
      <div className="bg-slate-950 p-5 h-dvh px-60">
        <div className="flex justify-between">
          <div className="flex items-center bg-slate-900 p-2 rounded-lg w-96">
            <img src="./img/Layer 2.svg" />
            <input
              id="search"
              type="search"
              placeholder="Search City..."
              className="text-white outline-hidden ml-2 pt-1"
              onChange={(e) => setSearch(e.target.value)}
              onKeyUp={handleKeyUp}
            />
          </div>
          <div className="flex items-center">
            <p className="text-white pt-1 mr-2">
              {weather.location?.name}, {weather.location?.country}
            </p>
            <img src="./img/pin.svg" />
          </div>
        </div>

        <div className=" pt-8">
          <div className="c">
            <div className="flex justify-between items-center">
              <h3 className="text-slate-100 text-2xl">Next 7day</h3>
              <h3 className="bg-slate-100 rounded-full px-3 pt-1">Forecast</h3>
            </div>
            <div className="grid grid-cols-8 gap-10 pt-5">
              <div className="col-span-2 bg-slate-400 rounded-3xl overflow-hidden">
                <div className="grid grid-cols-3 bg-slate-500 p-4 pb-3">
                  <p className="text-start">{days[0]?.day}</p>
                  <p className="text-center">{date}</p>
                  <p className="text-end">{time}</p>
                </div>
                <div className="flex justify-between items-center p-4 pb-0">
                  <div className="flex flex-col justify-between items-center">
                    <h2 className="text-2xl text-red-700">
                      {forecast.forecast?.forecastday[0]?.day.maxtemp_c}°C
                    </h2>
                    <h1 className="text-5xl">{weather.current?.temp_c}°C</h1>
                    <h2 className="text-2xl text-blue-700">
                      {forecast.forecast?.forecastday[0]?.day.mintemp_c}°C
                    </h2>
                  </div>
                  <div className="">
                    <p></p>
                    <img
                      className="w-32 h-32"
                      src={`./img/${weather.current?.condition?.text}.svg`}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 pt-0">
                  <div className="">
                    <div className="flex justify-start">
                      <p className="text-slate-600">Real Feel</p>
                      <p className="ml-1">{weather.current?.feelslike_c}°C</p>
                    </div>
                    <div className="flex justify-start">
                      <p className="text-slate-600">
                        Wind {weather.current?.wind_degree}°
                      </p>
                      <p className="ml-1">{weather.current?.wind_kph}km/h</p>
                    </div>
                    <div className="flex justify-start">
                      <p className="text-slate-600">Pressure</p>
                      <p className="ml-1">{weather.current?.pressure_mb}MB</p>
                    </div>
                    <div className="flex justify-start">
                      <p className="text-slate-600">Humidity</p>
                      <p className="ml-1">{weather.current?.humidity}%</p>
                    </div>
                  </div>

                  <div className="">
                    <div className="flex justify-start">
                      <p className="text-slate-600">Sunrise</p>
                      <p className="ml-1">
                        {sun.forecast?.forecastday[0]?.astro?.sunrise}
                      </p>
                    </div>
                    <div className="flex justify-start">
                      <p className="text-slate-600">Sunset</p>
                      <p className="ml-1">
                        {sun.forecast?.forecastday[0]?.astro?.sunset}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {days.slice(1).map((day, index) => (
                <div
                  key={index}
                  className="col-span-1 bg-slate-900 rounded-3xl overflow-hidden"
                >
                  <div className="border-b border-slate-700 p-4 pb-3 text-center">
                    <p className="text-slate-100">{day.day_fc}</p>
                  </div>
                  <div className="p-4 pb-0 text-center flex flex-col justify-center items-center gap-y-8">
                    <h1 className="text-2xl text-slate-100">
                      {forecast.forecast?.forecastday[index + 1]?.day.maxtemp_c}
                      °C
                    </h1>
                    <img
                      className="w-20 h-20"
                      src={`./img/${
                        forecast.forecast?.forecastday[index + 1]?.day.condition
                          ?.text
                      }.svg`}
                    />
                    <h1 className="text-2xl text-slate-100">
                      {forecast.forecast?.forecastday[index + 1]?.day.mintemp_c}
                      °C
                    </h1>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-10">
            <h3 className="text-slate-100 text-2xl">Temperature range</h3>
            <div className="flex justify-center items-end gap-8 h-96">
              {forecast.forecast?.forecastday.map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="flex flex-col items-center gap-1 h-60">
                    <div
                      className="w-2 rounded bg-red-500"
                      style={{
                        height:
                          Math.abs(day.day.maxtemp_c) < 10
                            ? `${Math.abs(day.day.maxtemp_c) * 10}px`
                            : `${Math.abs(day.day.maxtemp_c) * 2}px`,
                        marginBottom:
                          day.day.maxtemp_c < 0
                            ? `day.day.maxtemp_c * -10}px`
                            : `0`,
                      }}
                    ></div>
                    <div
                      className="w-2 rounded bg-blue-500"
                      style={{
                        height:
                          Math.abs(day.day.mintemp_c) < 10
                            ? `${Math.abs(day.day.mintemp_c) * 10}px`
                            : `${Math.abs(day.day.mintemp_c) * 2}px`,
                        marginBottom:
                          day.day.mintemp_c < 0
                            ? `day.day.mintemp_c * -10}px`
                            : `0`,
                      }}
                    ></div>
                  </div>
                  <p className="text-slate-100 mt-2">{days[index]?.day_fc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
