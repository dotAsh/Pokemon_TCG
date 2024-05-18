
/*
import React, { useState } from "react";
import { BookProps } from "../components/models/practice";
export const Book: React.FC<{bookProps: BookProps}> = ({ bookProps }) => {
  const { author, title, imageUrl, price, genre, numberOfPages, publicationDate } = bookProps;
  const [hideInfo, setHideInfo] = useState<boolean>(true);
  const [v, setV] = useState<string>("");
  
  const handleClick = ()=>{
    if(hideInfo){
      setV( "invisible");
    }else{
      setV( "visible");
    }
    setHideInfo(!hideInfo);
  }
  return (
    <div className="bg-white shadow-lg rounded-lg ">
      <img className="w-full h-40 object-cover" src={imageUrl} alt="Book Image" />
     
      <div className={v}>
        <h1 className="text-xl font-semibold">{title}</h1>
        <h2 className="text-lg font-medium">{author}</h2>
        <p className="mt-2 text-gray-600">{genre}</p>
        <p className="mt-2">${price}</p>
        <p className="mt-2">{numberOfPages} pages</p>
        <p className="mt-2">Publication Date: {publicationDate}</p>
      </div>
      <button onClick={handleClick}> click me </button>
    </div>
  );
};

*/

import React, { useState } from "react";

import { BookProps } from "./models/practice";
import Image from 'next/image'

export const Book: React.FC<{ bookProps: BookProps }> = ({ bookProps  }) => {
  const { id, name, images, releaseDate } = bookProps; 
  const [hideInfo, setHideInfo] = useState<boolean>(true);
  const [v, setV] = useState<string>("");

  const handleClick = () => {
    if (hideInfo) {
      setV("invisible");
    } else {
      setV("visible");
    }
    setHideInfo(!hideInfo);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg">
      
      <img className="w-full h-40 " src={images.logo} alt="Book Image" />
     
      <div className={v}>
        <h1 className="text-xl font-semibold">{name}</h1>
        <h2 className="text-lg font-medium">{id}</h2>
        <p className="mt-2">Release Date: {releaseDate}</p>
      </div>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};

export default Book;

