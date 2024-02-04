import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardBody, Spinner, Select, SelectSection, SelectItem, Button } from "@nextui-org/react";

export default function SelectDestination({ setDestination }) {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("https://meshnav.azurewebsites.net/nav/");
        setDestinations(response.data);
        console.log(response.data);
        console.log(destinations);
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

        console.log(selectedDestination)
        setDestination(destinations.find(element => element.id==selectedDestination));
      };

      const button = document.getElementById("submit-destination");
      button.addEventListener("click", handleClick);
    }
  }, [isLoading, error]);

  return (
    <div className="select-destination">
      {isLoading && (
        <Card>
          <CardBody className="flex flex-col p-10">
            <div className="flex flex-col justify-center items-center">
              <Spinner color="secondary" labelColor="secondary" size="lg" className="mt-2"/>
              <p className="text-2xl mt-8">loading destination waypoints</p>
            </div>
          </CardBody>
        </Card>)}
      {!isLoading && !error && (
        <div className="flex flex-col items-center justify-center">
          <select id="select-destination"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-3 w-unit-5xl text-center"
          >
            {destinations.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <Button
            id="submit-destination"
            size="md"
            className="mb-8"
          >
            Navigate
          </Button>
        </div>)
      }
    </div>
  );
  (
    <div>
        {isLoading && <p>Loading destinations...</p>}
        {error && <p>Error fetching destinations: {error.message}</p>}
        {!isLoading && !error && (
          <div className="flex flex-col justify-center items-center">
            <select id="select-destination">
              {destinations.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <button id="submit-destination">Navigate</button>
          </div>
        )}
      </div>
  )
}

