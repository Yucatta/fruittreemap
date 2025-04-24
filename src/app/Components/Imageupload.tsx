import { userAgent } from "next/server";
import React, { useRef, useState } from "react";
import { useStyleRegistry } from "styled-jsx";

const Imageupload = () => {
  const [whichimage, setwhichimage] = useState(0);
  const inputref = useRef<HTMLInputElement | null>(null);
  const [currentfiles, setcurrentfiles] = useState<FileList | null>(null);
  function handlefiles(e: React.ChangeEvent<HTMLInputElement>) {
    // currentfiles.current = e.target.files;
    setcurrentfiles(e.target.files);
    setwhichimage(0);
  }
  return (
    <>
      <div className="fixed right-3 top-1/8 w-[calc(50vw-50vh*4/3)] flex flex-col items-center z-10   ">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            handlefiles(e);
          }}
          ref={inputref}
          className="hidden"
        ></input>
        <button className="bg-[rgb(67,67,67)] w-30 h-10 rounded-xl cursor-pointer ">
          ADD Image
        </button>
        <button
          className="bg-[rgb(67,67,67)] w-30 h-10 rounded-xl"
          onClick={() => {
            if (currentfiles) {
              if (whichimage < currentfiles.length - 1) {
                setwhichimage(whichimage + 1);
              }
              console.log("a");
            }
          }}
        >
          Next Image
        </button>
        <button
          className="bg-[rgb(67,67,67)] w-30 h-10 rounded-xl"
          onClick={() => {
            if (whichimage > 0) {
              setwhichimage(whichimage - 1);
            }
          }}
        >
          Previous Image
        </button>
      </div>

      <div className="flex justify-center items-center">
        {currentfiles?.[whichimage] ? (
          <img
            src={URL.createObjectURL(currentfiles[whichimage])}
            className="h-screen w-auto fixed top-0"
          ></img>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Imageupload;
