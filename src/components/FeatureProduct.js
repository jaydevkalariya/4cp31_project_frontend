import { useProductContext } from "../context/productcontex";
import styled from "styled-components";
import Product from "./Product";
import axios from 'axios';
import { URI } from '../App';
import {React,useState,useEffect} from 'react';


const FeatureProduct = () => {
  const { isLoading, featureProducts } = useProductContext();
  const [popularCakes, setPopularCakes] = useState();

  useEffect(() => {
    const fetchMonthlyReport = async () => {
      try {
        const response = await axios.get(`${URI}/orders/monthly-report/${new Date().getMonth()}/${new Date().getFullYear()}`);
        setPopularCakes(response.data.popularCakes);

      } catch (error) {
        console.error('Error fetching monthly report data:', error);
      }
    };

    fetchMonthlyReport();
  }, []);

  if (isLoading) {
    return <div> ......Loading </div>;
  }

  return (
    <Wrapper className="section">
      <div className="container" id="feature">
        <div className="common-heading">Our BestSelling cakes:</div>
        <div className="grid grid-three-column">
          {popularCakes?popularCakes.slice(0, 3).map((curElem) => {
            return <Product key={curElem.id} curElem={curElem} />;
          }):""}
        </div>
      </div>

    </Wrapper>
  );
};

const Wrapper = styled.section`
  padding: 9rem 0;
  background-color: ${({ theme }) => theme.colors.bg};

  .container {
    max-width: 120rem;
  }

  figure {
    width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    transition: all 0.5s linear;
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 0%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      transition: all 0.2s linear;
      cursor: pointer;
    }
    &:hover::after {
      width: 100%;
    }
    &:hover img {
      transform: scale(1.2);
    }
    img {
      max-width: 90%;
      margin-top: 1.5rem;
      height: 20rem;
      transition: all 0.2s linear;
    }

    .caption {
      position: absolute;
      top: 15%;
      right: 10%;
      text-transform: uppercase;
      background-color: ${({ theme }) => theme.colors.bg};
      color: black;
      padding: 0.8rem 2rem;
      font-size: 1.2rem;
      border-radius: 2rem;
      font-weight:bold;
    }
  }

  .card {
    background-color: #fff;
    border-radius: 1rem;

    .card-data {
      padding: 0 2rem;
    }

    .card-data-flex {
      margin: 2rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    h3 {
      color: ${({ theme }) => theme.colors.text};
      text-transform: capitalize;
      font-weight:bold;
    }

    .card-data--price {
      color: black;
      font-weight:bold;
    }

    .btn {
      margin: 2rem auto;
      background-color: rgb(0 0 0 / 0%);
      border: 0.1rem solid rgb(98 84 243);
      display: flex;
      justify-content: center;
      align-items: center;

      &:hover {
        background-color: rgb(98 84 243);
      }

      &:hover a {
        color: #fff;
      }
      a {
        color: rgb(98 84 243);
        font-size: 1.4rem;
      }
    }
  }
`;


export default FeatureProduct;