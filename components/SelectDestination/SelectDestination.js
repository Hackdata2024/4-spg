import { useState, useEffect } from "react";
import axios from "axios";

export default function SelectDestination({ setDestination }) {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("https://meshnav.azurewebsites.net/nav/");
        setDestinations(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isLoading && !error) {
      const handleClick = () => {
        const selectedDestination = document.getElementById("select-destination").value;
        setDestination(destinations.find(element => element.id==selectedDestination));
      };

      const button = document.getElementById("submit-destination");
      button.addEventListener("click", handleClick);
    }
  }, [isLoading, error]);

  return (
    <div>
      {isLoading && <p>Loading destinations...</p>}
      {error && <p>Error fetching destinations: {error.message}</p>}
      {!isLoading && !error && (
        <div className="flex flex-col justify-center items-center">
          <select id="select-destination" className="rounded w-unit-4xl h-unit-l text-black text-center">
            {destinations.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <button id="submit-destination" className="bg-blue-700 hover:bg-blue-950 text-white font-bold py-2 px-4 rounded m-5">Navigate</button>
        </div>
      )}
    </div>
  );
}