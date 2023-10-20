import {React,useEffect,useState} from "react";
import FeatureProduct from "./components/FeatureProduct";
import HeroSection from "./components/HeroSection";
import Services from "./components/Services";
import Trusted from "./components/Trusted";
import styled from 'styled-components';

const Home = () => {
  const data = {
    name: "Golden Live Cake shop",
  };

  return (
    <>
      <HeroSection myData={data} />
      <FeatureProduct />
      <Services />
      <Trusted />
    </>
  );
};

export default Home;


const Wrapper = styled.div`
background-color: #fff;
`;

