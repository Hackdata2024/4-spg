import Image from "next/image"
import arrowDarkSvg from "@/public/arrow-dark.svg"

export default function Compass({northReset, waypointHeading, testOffset}) {
  return (
    <div className="compass mt-6 mb-6 flex justify-center items-center">
      <Image
        width={150}
        src={arrowDarkSvg}
        style={{transform: `rotate(${northReset + waypointHeading + testOffset}deg)`}}
      />
    </div>   
  )
}