import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BrandMainPage from "../components/BrandMainPage";
import SideMenu from "../components/SideMenu";
import "./Brand.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
function Brand() {
  const navigate = useNavigate();
  const { figmaName } = useParams();
  const [subDomain, setsubDomain] = useState(null);
  const [brandDatas, setBrandDatas] = useState(null);

  const [brandImages, setBrandImages] = useState(null);

  const getBrand = async () => {
    //console.log("get braaaaand", figmaName);
    try {
      const brandData = await axios.get(
        `${BACKEND_URL}/api/brand/${subDomain}`,
        {}
      );
      setBrandDatas(brandData.data.elements[0]);
      setBrandImages(brandData.data.images[0]);
      console.log("les designs", brandData.data);
    } catch (error) {
      navigate("/notfound");
      console.log("error ici", error);
    }
  };

  useEffect(() => {
    const hostname = window.location.hostname;
    console.log("Le hostname", hostname);
    if (hostname === "frame-work.app") {
      navigate("/designs");
      return;
    }
    if (hostname != "localhost") {
      const parts = hostname.split(".");
      if (parts.length > 1 && parts[0] !== "www") {
        console.log("coucou", parts[0]);
        setsubDomain(parts[0]);
      }
    } else if (figmaName) {
      console.log("the is a figmaename", figmaName);
      setsubDomain(figmaName);
    } else {
      console.log("Rien trouve donc défaut");
      navigate("/designs");
    }
  }, []);

  useEffect(() => {
    if (subDomain) {
      getBrand();
    }
  }, [subDomain]);

  useEffect(() => {
    if (brandDatas) {
      const container = document.querySelector(".container");
      const topBarHeight = document.querySelector("header").offsetHeight;
      const sidebar = document.querySelector(".left");
      const padding = sidebar ? `${topBarHeight}px` : "0";
      container.style.paddingTop = padding;
    }
  }, [brandDatas]);

  if (!brandDatas) {
    return <p> loading...</p>;
  }

  return (
    <div className="container">
      <p>{subDomain}</p>
      <div className="content">
        <div className="left">
          <SideMenu brandData={brandDatas}></SideMenu>
        </div>
        <div className="right">
          <BrandMainPage
            brandData={brandDatas}
            brandImages={brandImages}
          ></BrandMainPage>
        </div>
      </div>
    </div>
  );
}

export default Brand;
