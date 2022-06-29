import { useEffect, useState } from "react";
import Slider from "react-slick";
import Loader from "react-loader-spinner";
import Cookies from "js-cookie";

import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS"
};
const ReactSlider = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [sliderImages, setSliderImages] = useState([]);

  useEffect(() => {
    getSliderImages();
  }, []);

  const getSliderImages = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const apiUrl = `https://apis.ccbp.in/restaurants-list/offers`;
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      },
      method: "GET"
    };
    const response = await fetch(apiUrl, options);
    if (response.ok) {
      const fetchedData = await response.json();
      const updatedData = fetchedData.offers.map((offer) => ({
        id: offer.id,
        imageUrl: offer.image_url
      }));
      setSliderImages(updatedData);
      setApiStatus(apiStatusConstants.success);
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const renderSliderListView = () => {
    const settings = {
      dots: true,
      autoplay: true,
      autoplaySpeed: 2000,
      arrows: false,
      infinite: true
    };

    return (
      <div className="image-container">
        <Slider {...settings}>
          {sliderImages.map((eachImage) => (
            <div key={eachImage.id}>
              <img
                className="slider-image"
                src={eachImage.imageUrl}
                alt="offer"
              />
            </div>
          ))}
        </Slider>
      </div>
    );
  };

  const renderFailureView = () => (
    <div className="slider-error-view-container">
      <h1 className="slider-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
    </div>
  );

  const renderLoadingView = () => (
    <div testid="restaurants-offers-loader" className="slider-loader-container">
      <Loader type="Oval" color="#F7931E" height="50" width="50" />
    </div>
  );

  const renderAllImages = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderSliderListView();
      case apiStatusConstants.failure:
        return renderFailureView();
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      default:
        return null;
    }
  };

  return <div className="slider-image-container">{renderAllImages()}</div>;
};

export default ReactSlider;
