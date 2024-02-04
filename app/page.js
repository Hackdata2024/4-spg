"use client";
import { useState, useEffect } from "react";
import { useDeviceOrientation } from "./deviceOrientationHook";
import Image from "next/image";

import SelectDestination from "@/components/SelectDestination/SelectDestination";

import {getDistance, getRhumbLineBearing, getGreatCircleBearing, isPointWithinRadius} from "geolib";

import arrowDarkSvg from "../public/arrow-dark.svg";
import Compass from "@/components/Compass/Compass";
import { Card, CardBody, Spinner } from "@nextui-org/react";

export default function Home() {
  const [destination, setDestination] = useState(null);
  const [path, setPath] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [distance, setDistance] = useState(null);
  const [nextWaypoint, setNextWaypoint] = useState(null);
  const [nextWaypointHeading, setNextWaypointHeading] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [compassToggled, setCompassToggled] = useState(false);
  const [orientation, requestAccess, revokeAccess, orientationError] = useDeviceOrientation();
  const [reachedDestination, setReachedDestination] = useState(false);
  const [hasFetchedPathData, setHasFetchedPathData] = useState(false);
  const [inWaypoint, setInWaypoint] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const changeDestination = (destination) => {
    if (!compassToggled) {
      // requestAccess();
      setCompassToggled(true); 
    }
    setDestination(destination);
    setIsLoading(true);
    (async () => {
      try {
        console.log(destination);
        console.log(latitude);
        console.log(longitude);
        const response = await fetch(
          "https://meshnav.azurewebsites.net/api/path-api/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude,
              longitude,
              target: destination.name,
              type: 'coordinates',
            }),
          },
        );

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json()
        console.log("hello");
        console.log(data);
        setPath(data);
        setNextWaypoint(data[0]);
        setHasFetchedPathData(true);
      } catch (error) {
        console.log("error")
        setError(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition((position) => {
        console.log(latitude);
        console.log(longitude);
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        if (latitude && longitude && path) {
          setDistance(getDistance(
            { latitude: latitude, longitude: longitude },
            {
              latitude: nextWaypoint.latitude,
              longitude: nextWaypoint.longitude,
            }
          ));

          if (isPointWithinRadius(
              { latitude: latitude, longitude: longitude },
              {
                latitude: nextWaypoint.latitude,
                longitude: nextWaypoint.longitude,
              },
              5
          )) {
            // Remove the first element from responseData
            setPath(path.slice(1));
            setInWaypoint(true);

            // Update currentWaypoint if more waypoints exist
            if (path.length > 0) {
              setNextWaypoint(path[0]);
            } else {
              // Destination reached
              setReachedDestination(true);
            }
          }
          else{
            setInWaypoint(false);
          }

        }
      },
        (error) => alert(JSON.stringify(error)),
        { enableHighAccuracy: true, distanceFilter: 1 }
      );

      // Cleanup code
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      const error = new Error("Geolocation API is not supported in this browser");
      setError(error);
    }
  }, [latitude, longitude, path]);

  useEffect(() => {
    if (nextWaypoint) {
      const heading = getRhumbLineBearing(
          {latitude: latitude, longitude: longitude},
          {latitude: nextWaypoint.latitude, longitude: nextWaypoint.longitude}
      );
      setNextWaypointHeading(heading);
    }
  }, [latitude, longitude, nextWaypoint])

  useEffect(() => {
    const mobileMediaQuery = window.matchMedia('(max-width: 767px)'); // Adjust the breakpoint as needed

    const handleMobileChange = (event) => {
      setIsMobile(event.matches);
    };

    mobileMediaQuery.addEventListener('change', handleMobileChange);
    setIsMobile(mobileMediaQuery.matches);

    return () => {
      mobileMediaQuery.removeEventListener('change', handleMobileChange);
    };
  }, [])

  return (
    <div className="app h-screen flex flex-col justify-center items-center">
      {!isMobile ? (
        <div>
          <Card>
            <CardBody className="flex flex-col p-10">
              <div className="flex flex-col justify-center items-center">
                <Spinner color="secondary" labelColor="secondary" size="lg" className="mt-2"/>
                <p className="text-2xl mt-8">Please use on a mobile device.</p>
              </div>
            </CardBody>
          </Card>
        </div>
      ) : !(latitude && longitude) ? (
        <div>
          <Card>
            <CardBody className="flex flex-col p-10">
              <div className="flex flex-col justify-center items-center">
                <Spinner color="secondary" labelColor="secondary" size="lg" className="mt-2"/>
                <p className="text-2xl mt-8">fetching your location</p>
              </div>
            </CardBody>
          </Card>
        </div>
      ) : ( isLoading ? (
        <div className="flex flex-col justify-center items-center">
          <Card>
            <CardBody className="flex flex-col p-10">
              <div className="flex flex-col justify-center items-center">
                <Spinner color="secondary" labelColor="secondary" size="lg" className="mt-2"/>
                <p className="text-2xl mt-8">fetching shortest path</p>
              </div>
            </CardBody>
          </Card>
        </div>
        ) : (
          <div className="full-paint">
            <div className="flex justify-center">
              <h1 className="text-5xl pb-6">mesh.nav</h1>
            </div>
            <SelectDestination setDestination={changeDestination}/>
            <div className="navigator flex flex-col justify-center items-center">
              <Card>
                <CardBody className="flex flex-col justify-center items-center w-unit-7xl h-unit-8xl">
                  <Compass
                    northReset={((orientation && orientation.alpha)??360) - 360}
                    waypointHeading={nextWaypointHeading}
                    testOffset={0}
                    />
                <p className="text-4xl">{(distance===0)?"-":`${distance??0} m`}</p>
                </CardBody>

              </Card>
            </div>
          </div>
        ))}
    </div>
  )

}