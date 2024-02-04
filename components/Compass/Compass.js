import Image from "next/image"
import arrowDarkSvg from "@/public/arrow-dark.svg"

export default function Compass({northReset, waypointHeading, testOffset}) {
  return (
    <div className="compass">
      <Image
        src={arrowDarkSvg}
        style={{transform: `rotate(${northReset + waypointHeading + testOffset}deg)`}}
      />
    </div>   
  )
}