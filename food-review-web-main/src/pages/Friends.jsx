import React from "react"
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from '../Header';
import '../index.css';
import '../App.css';
import { useState, useEffect } from "react";
import SwipeableViews from 'react-swipeable-views';
import filterImg from '../images/Icon awesome-filter.png';
import searchImg from '../images/Icon awesome-search.png';
import backImg from '../images/Back button.png';
import axios from 'axios';
import Result from "./Result";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import fullStar from '../images/Icon awesome-star.png';
import halfStar from '../images/half star restaurant.png';


const Friends = () => {
    const [accountId, setAccount_id] = useState("");
    let { account_id } = useParams();
    const [account, setAccountData] = useState([]);
    const [restaurantName, setRestaurantName] = useState("");
    const navigate = useNavigate();
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
    useEffect(() => {
        axios.get("http://localhost:8800/login").then((response) => {
            if (response.data.loggedIn === true) {
                const userData = response.data.user[0];
                setAccount_id(userData.account_id);   
              
          }else{
            navigate("/login")
          }
        });
      }, []);
    useEffect(() => {
        axios.get(`http://localhost:8800/Liked/${account_id}`)
        .then(response => {
            setAccountData(response.data);
          })
          .catch(error => {
            console.error(error);
          });
      }, [account_id])
      const getStars = (rating) => {
        
        let star = Math.floor(rating);
        let half = rating % 1 >= 0.5 ? 1 : 0;
        return [...Array(star)].map((_, i) => <img src={fullStar} alt="full star"/>)
          .concat([...Array(half)].map((_, i) => <img src={halfStar} alt="half star"/>))
    }
    
    return(
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
                <span style={{color: "black"}}>Liked</span>
                <Link to="/randomizer" style={{color: "white"}}><span>Randomizer</span></Link>
                <Link to="/trending" style={{color: "white"}}><span>Trending</span></Link>
            </div>
        </div>
        <Link to="/" ><img className="backImg" src={backImg} alt="Back Icon" style={{marginLeft:"10px"}}/></Link>
        {account.restaurantData ? (
            <div>
            {account.restaurantData.map ((restaurant, index) => (
            <div key={index}>
                <Link to={{
            pathname: `/restaurant/${restaurant.restaurant_id}`,
            state: {restaurant}
        }}>
                    {restaurant.restaurantPic && 
        <img 
        src= {require(`../images/RestaurantPic/${restaurant.restaurantPic }`)}
         alt="Picture of Restaurant"
         className="left-section"
         style={
            {
                height:"220px",
                width:"350px",
                objectFit:"cover",
                marginTop:"40px",
                marginLeft:"40px",
                borderRadius:"25px"
                
        }}
         />} </Link> 
         <div className="right-section">
                    <h1 style={{color:"white", fontWeight:"bold", fontSize:"36px"}}>{restaurant.restaurantName}</h1>
                    <div style={{color:"#E0CA73",fontWeight:"bold",fontSize:"26px"}}>{restaurant.rating}{getStars(restaurant.rating)}</div>
                    <div className={`category-container1 ${restaurant.category1 ? '' : 'hidden'}`} style={{marginLeft:"-5px"}}>
                                    <h2 class="category-text">{restaurant.category1}</h2>
                                </div>
                                <div className={`category-container2 ${restaurant.category2 ? '' : 'hidden'}`} style={{marginLeft:"180px"}}>
                                    <h2 class="category-text">{restaurant.category2}</h2>
                                </div>
                    
        
                </div>
            </div>
            ))}
            </div>
        ):(
            <p>Loading...</p>
          )}
        
    </div>
    )}

export default Friends