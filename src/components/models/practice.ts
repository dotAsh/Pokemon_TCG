
/*export interface BookProps {
  
     author: string;
     title: string;
     imageUrl: string;
     price: number;
     genre: string;
     numberOfPages: number;
     publicationDate: string;
   
 }*/

 export interface BookProps {
    id: string;
    name: string;
    images: { logo: string; symbol: string };
    releaseDate: string;
  }
 