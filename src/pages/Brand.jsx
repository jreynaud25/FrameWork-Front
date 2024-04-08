import axios from "axios";
import React, { useEffect, useState } from "react";
import BrandMainPage from "../components/BrandMainPage";
import SideMenu from "../components/SideMenu";
import "./Brand.css";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function Brand() {
  const [subDomain, setsubDomain] = useState("");
  const [brandDatas, setBrandDatas] = useState(null);
  const getBrand = async () => {
    console.log("get braaaaand");
    try {
      const brandData = await axios.get(`${BACKEND_URL}/api/brand/all`, {});
      setBrandDatas(brandData.data[0]);
      console.log("les designs", brandData.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const hostname = window.location.hostname;
    console.log(hostname);
    const parts = hostname.split(".");
    if (parts.length > 1 && parts[0] !== "www") {
      console.log("coucou", parts[0]);
      setsubDomain(parts[0]);
    }

    getBrand();
  }, []);

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
          <BrandMainPage brandData={brandDatas}></BrandMainPage>
        </div>
      </div>
    </div>
  );
}

export default Brand;
