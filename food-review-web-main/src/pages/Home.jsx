import React from "react"
import { Link } from 'react-router-dom';
import '../index.css';
import '../App.css';
import { useState, useEffect } from "react";
import filterImg from '../images/Icon awesome-filter.png';
import searchImg from '../images/Icon awesome-search.png';
import starImg from '../images/start for home.png';
import halfStarImg from '../images/half star home.png';
import axios from 'axios';
import Result from "./Result";
import { useParams } from 'react-router-dom';

const Home = () => {
    const [home, setHome] = useState({});
    const [restaurantName, setRestaurantName] = useState("");
    const [accountId, setAccount_id] = useState("");
    let { account_id } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.get(`http://localhost:8800/restaurantSearch/${restaurantName}` , restaurantName);
            window.location.href = `/result/${restaurantName}`;
            return <Result restaurantName={restaurantName} />
            
        } catch(err) {
            console.log(err);
        }
    }
    const getStars = (rating) => {
        
        let star = Math.floor(rating);
        let halfStar = rating % 1 >= 0.5 ? 1 : 0;
        return [...Array(star)].map((_, i) => <img src={starImg} alt="full star"/>)
          .concat([...Array(halfStar)].map((_, i) => <img src={halfStarImg} alt="half star"/>))
    }
    


    useEffect(() => {
        const fetchAllItems = async() => {
            try {
                const res = await axios.get("http://localhost:8800");
                setHome(res.data);
            } catch(err) {
                console.log(err);
            }
        }
        fetchAllItems();
    },[]);
    useEffect(() => {
        axios.get("http://localhost:8800/login").then((response) => {
            if (response.data.loggedIn === true) {
                const userData = response.data.user[0];
                setAccount_id(userData.account_id);   
              
          }
        });
      }, []);

    

    return(//${restaurant.restaurantPic}
        <div className="main-div bg-color">
        <header className="first-header">
            <nav>
                <Link to="/" style={{color: "white"}}>
                <span className='header-text'>MakanView</span>
                </Link>    
                <form className="search-bar" style={{top: "-100px"}} onSubmit={handleSubmit}>      
                <input type="text" placeholder="Search for Restaurants" defaultValue="" onChange={(e) => setRestaurantName(e.target.value)} style={{color: "#ADADAD", backgroundColor: "#202020", fontSize: "30px", marginLeft:"10px", marginTop:"10px", position: "absolute",width:"520px",height:"44px"}} />
                <img className="searchImg" src={searchImg} alt="Search Icon" />
                </form>  
                <Link to="/filter"><img className="filterImg" src={filterImg} alt="Filter Icon" style={{marginLeft:"1090px", top:"4px", position: "absolute", objectFit:"contain", objectPosition:"center",overflow:"hidden"}}/></Link>
            </nav> 
        </header>
        
        
        <div className="second-header">
            <div className="tabs">
                <Link to="/news" style={{color: "white"}}><span>News</span></Link>
                <Link to="/account" style={{color: "white"}}><span>Account</span></Link>
                <Link to= {{
    pathname: `/Liked/${account_id}`}} style={{color: "white"}}><span>Liked</span></Link>
                <Link to="/randomizer" style={{color: "white"}}><span>Randomizer</span></Link>
                <Link to="/trending" style={{color: "white"}}><span>Trending</span></Link>
            </div>
        </div>

        <h1 style={{color: "white", marginLeft:"20px", marginBottom:"-2px"}}>Reccomendations</h1>
        <div className ="Home" >
        {home.restaurantData ? (
            <div className="flex-container">
                {home.restaurantData.map((restaurant, index) => {
                    return <RestaurantCard
                     restaurant={restaurant}
                      key={index}
                    getStars={getStars}
                      />
                })}
            </div>
            
        ) : (

            <div>Loading...</div>
        )}
        
        <h1 style={{color: "white", marginLeft:"20px", marginBottom:"-2px", marginTop:"60px"}}>News</h1>
    </div>
    
    <div>
    {home.newsData ? (
        <div className="container">
            {home.newsData.map((news, index) => (
                <div key={index}>
                    {news.pictures && 
        <img className="left-section"
        src= {require(`../images/NewsPic/${news.pictures}`)}
         alt="Picture of News"
         style={
            {
                height:"300px",
                width:"400px",
                objectFit:"cover",
                marginTop:"20px",
                marginLeft:"20px"
        }}
         />}
                    <h2 style={{color: "#CBCBCB", fontSize: "30px", marginLeft: "20px"}}>{news.header}</h2>
                    <p style={{color: "#F4EDD0", marginLeft: "20px"}}>{news.news}</p>
                    <p style={{color: "#F4EDD0", marginLeft:"20px"}}>{news.datePosted}</p>
                    </div>
                
            ))}
        </div>
    ) : (
        <div>Loading...</div>
    )}
    </div>
    <h1 style={{color: "white", marginLeft:"20px", marginBottom:"-2px"}}>Trending</h1>
    <div className="container">
    {home.trendingData ? (
        <div>
            {home.trendingData.map((trending, index) => (
                <div key={index}>
                    {trending.picture && 
        <img 
        src= {require(`../images/TrendingPic/${trending.picture}`)}
         alt="Picture of News"
         style={
            {
                height:"300px",
                width:"500px",
                objectFit:"cover",
                marginTop:"20px",
                marginLeft:"20px"
                
        }}
         />}
                    <h2 style={{color: "#CBCBCB", fontSize: "30px", marginLeft: "20px"}}>{trending.header}</h2>
                    <p style={{color: "#F4EDD0", marginLeft: "20px"}}>{trending.trending}</p>
                    <p style={{color: "#F4EDD0", marginLeft: "20px"}}>{trending.datePosted}</p>
                </div>
            ))}
        </div>
    ) : (
        <div>Loading...</div>
    )}
    </div>
</div>
)}

function RestaurantCard(prop){
    const restaurant = prop.restaurant;
    console.log(restaurant)
    return(
        <Link to={{
            pathname: `/restaurant/${restaurant.restaurant_id}`,
            state: {restaurant}
        }}>
            
        <div className="restaurant-data" >
        <div className="mini-restaurant-data">
        {restaurant.restaurantPic && 
        <img 
        src= {require(`../images/RestaurantPic/${restaurant.restaurantPic }`)}
         alt="Picture of Restaurant"
         style={
            {
                height:"100%",
                width:"100%",
                objectFit:"cover"
        }}
         />}
        </div>
    
            <div className="Restaurant" style={{width: '250px'}}>
                <h2 style={{color: "black", marginTop: "110px", left:"140px",width:"330px", fontSize:"21px"}}>{restaurant.restaurantName}</h2>
                <div className="star-rating">
                    <div style={{color:"black",fontWeight:"bold",fontSize:"20px"}}>{restaurant.rating}</div>
        {prop.getStars(restaurant.rating)}
    </div>
                        
                
            </div>
            <h3 style={{color: "#313131", marginTop:"160px", marginRight:"30px"}}>{restaurant.priceRange}</h3>             
            
            
        </div>
        </Link>
    )
}

export default Home