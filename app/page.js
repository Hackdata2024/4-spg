"use client";
import { useState, useEffect } from "react";
import { useDeviceOrientation } from "./deviceOrientationHook";
import Image from "next/image";

import SelectDestination from "@/components/SelectDestination/SelectDestination";

import {getDistance, getRhumbLineBearing, getGreatCircleBearing} from "geolib";

import arrowDarkSvg from "../public/arrow-dark.svg";
import Compass from "@/components/Compass/Compass";

export default function Home() {
  const [destination, setDestination] = useState(null);
  const [path, setPath] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [distance, setDistance] = useState(null);
  const [nextWaypoint, setNextWaypoint] = useState(null);
  const [nextWaypointHeading, setNextWaypointHeading] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [compassToggled, setCompassToggled] = useState(false);
  const [orientation, requestAccess, revokeAccess, orientationError] = useDeviceOrientation();
  const [reachedDestination, setReachedDestination] = useState(false);
  const [greatCircleBearing, setGreatCircleBearing] = useState(0);
  
  const changeDestination = (destination) => {
    if (!compassToggled) {
      requestAccess();
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
        setPath(data);
        setNextWaypoint(data[0]);
      } catch (error) {
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
            console.log(path)
        if (latitude && longitude && path) {
          console.log(path)
          const distance=getDistance(
              { latitude: latitude, longitude: longitude },
              {
                latitude: path[0].latitude,
                longitude: path[0].longitude,
                }
              )
              setDistance(distance);

          if (distance <= 5) {
            if (path.length > 1) {
              setPath(path.slice(1));
              setNextWaypoint(path[0]);
            } else {
              setReachedDestination(true);
              setNextWaypoint(null);
            }
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
    const greatCircleBearing = getGreatCircleBearing({
      latitude: latitude,
      longitude: longitude,
    }, {
      latitude: path[0].latitude,
      longitude: path[0].latitude,
    });
  }, [latitude, longitude, nextWaypoint])

  return (
    <div className="app min-h-screen flex flex-col justify-center items-center">
      <p>Current Coords - {latitude}, {longitude}</p>
      <p>{reachedDestination ? "Reached" : "Not Reached"}</p>
      {latitude && longitude && (<SelectDestination setDestination={changeDestination}/>)}
      {isLoading && <p>Loading Path...</p>}
      {!isLoading && !error && (
        <>
          <div className="diagnostics">
            Waypoints List- 
            {path.map((element, index) => (
                <p>{index}  | {element.latitude} | {element.longitude} | {element.wp_id}</p>
            ))}
            <p>Next Waypoint - {path[0].latitude} | {path[0].longitude} | {path[0].wp_id}</p>
            <p>Distance - {distance}</p>
            <p>Angle to next waypoint - {greatCircleBearing}</p>
            <p>180+Angle to next waypoint - {180+greatCircleBearing}</p>
            <p>alpha - {(orientation && orientation.alpha)}</p>
            <p>north - {((orientation && orientation.alpha)??360) - 360}</p>
          </div>
          <div className="compi">
            <Compass
              northReset={((orientation && orientation.alpha)??360) - 360}
              waypointHeading={greatCircleBearing}
              testOffset={0}
            />
          </div>
        </>
      )}
      {/* {!isLoading && !error && compass1}
      {!isLoading && !error && compass2} */}

    </div>
  )

}