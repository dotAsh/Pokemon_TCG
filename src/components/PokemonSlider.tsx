
import React from 'react';
import Slider from 'react-slick';
import styles from './PokemonSlider.module.css';
import Image from 'next/image'
const images = [
  "/images/slider_img1.jpg",
  "/images/slider_img2.jpg",
  "/images/slider_img3.jpg",
  
];

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3, 
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000, 
  pauseOnHover: false,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
};


function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} ${styles.customArrow} `}
      style={{ ...style, display: 'block', right: 20}}
      onClick={onClick}
    />
  );
}


function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} ${styles.customArrow} `}
      style={{ ...style, display: 'block', left: 20 }}
      onClick={onClick}
    />
  );
}

const PokemonSlider: React.FC = () => (
  <Slider {...settings}>
    {images.map((image, index) => (
      <div key={index} className={styles.slide}>
        <Image
          src={image}
          alt={`Pokemon ${index + 1}`}
          layout="responsive"
          width={900} 
          height={500} 
          className={styles.image}
        />
      </div>
    ))}
  </Slider>
);

export default PokemonSlider;