/*
import books from "../data/bookData.json";
import { Book } from "./Book";

export const BookList = () => {
  console.log(books);
  return (
    <div className="flex flex-wrap justify-center">
      <div className="w-full text-center mb-4">This is the book list</div>
      {books.map((book) => (
        <div key={book.author} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
          <Book bookProps={book} />
        </div>
      ))}
    </div>
  );
};*/



import React, { useState, useEffect } from "react";
import { getAllSets } from "@/service/pokemon.service";
import { Book } from "./Book";
import { BookProps } from "./models/practice";


export const BookList = () => {
  const [sets, setSets] = useState<BookProps[]>([]);

  useEffect(() => {
    getAllSets().then((allSets) => {
     
      setSets(allSets);
    });
  }, []);

  return (
    <div className="flex flex-wrap justify-center">
      <div className="w-full text-center">This is the book list</div>
      {sets.map((book) => (
        <div key={book.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
          <Book bookProps={book} />
        </div>
      ))}
    </div>
  );
};

export default BookList;
