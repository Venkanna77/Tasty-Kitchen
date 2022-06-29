import { useState, useEffect } from "react";

import "./index.css";
import Cookies from "js-cookie";
import ReactSlider from "../ReactSlider";

const sortByOptions = [
  {
    id: 0,
    displayText: "Highest",
    value: "Highest"
  },
  {
    id: 2,
    displayText: "Lowest",
    value: "Lowest"
  }
];

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS"
};

const AllRestaurantSection = () => {
  const [restaurantList, setRestaurantList] = useState([]);
  const [activeOptionId, setActiveOptionId] = useState("lowest");
  const [currentPage, setCurrentPage] = useState(0);
  const [maxPages, setMaxPages] = useState(0);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  const getRestaurants = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const apiUrl = `https://apis.ccbp.in/restaurants-list?offset=${
      currentPage * 9
    }&limit=9&sort_by_rating=${activeOptionId}`;
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      },
      method: "GET"
    };
    const response = await fetch(apiUrl, options);
    if (response.ok) {
      const fetchedData = await response.json();
      console.log(fetchedData);
      const maxItems = fetchedData.total;
      const maxPages = (maxItems % 9) + 1;
      const updatedData = fetchedData.restaurants.map((restaurant) => ({
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        id: restaurant.id,
        imageUrl: restaurant.image_url,
        rating: restaurant.user_rating.rating,
        totalReviews: restaurant.user_rating.total_reviews,
        ratingColor: restaurant.user_rating.rating_color
      }));
      setApiStatus(apiStatusConstants.success);
      setMaxPages(maxPages);
      setRestaurantList(updatedData);
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const renderRestaurantListView = () => {};
  const renderFailureView = () => {};
  const renderLoadingView = () => {};

  const renderRestaurants = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderRestaurantListView();
      case apiStatusConstants.failure:
        return renderFailureView();
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      default:
        return null;
    }
  };

  return (
    <div>
      <ReactSlider />
      <div className="all-restaurant-responsive-container">
        {renderRestaurants()}
      </div>
    </div>
  );
};

export default AllRestaurantSection;
