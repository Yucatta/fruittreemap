"use client";
import Image from "next/image";
import MapandSubmit from "./Components/MapandSubmit";
import dynamic from "next/dynamic";
import Imageupload from "./Components/Imageupload";
const DynamicMap = dynamic(() => import("@/app/Components/MapandSubmit"), {
  ssr: false,
});
export default function Home() {
  return (
    <>
      <Imageupload></Imageupload>
      <DynamicMap></DynamicMap>
    </>
  );
}
