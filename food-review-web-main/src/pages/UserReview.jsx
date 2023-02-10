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
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Result from "./Result";
import fullStar from '../images/Icon awesome-star.png';
import halfStar from '../images/half star restaurant.png';
import profilePic from '../images/profilePic.jpg';

const UserReview = () => {
    const navigate = useNavigate();
    const [accountId, setAccountId] = useState("");
    let { account_id } = useParams();
    const [account, setAccountData] = useState([]);
    const [restaurantName, setRestaurantName] = useState("");
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
    const fetchAccount = async() => {
        try {
            const res = await axios.get(`http://localhost:8800/account/${account_id}`);
            
            setAccountData(res.data);
        } catch(err) {
            console.log(err);
        }
    }
    fetchAccount();
},[account_id]);
const getStars = (rating) => {
        
    let star = Math.floor(rating);
    let half = rating % 1 >= 0.5 ? 1 : 0;
    return [...Array(star)].map((_, i) => <img src={fullStar} alt="full star"/>)
      .concat([...Array(half)].map((_, i) => <img src={halfStar} alt="half star"/>))
}
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
    pathname: `/Liked/${accountId}`}} style={{color: "white"}}><span>Liked</span></Link>
                <Link to="/randomizer" style={{color: "white"}}><span>Randomizer</span></Link>
                <Link to="/trending" style={{color: "white"}}><span>Trending</span></Link>
            </div>
        </div>
        
        {account.reviewData ? (
            <div>  
            {account.reviewData.map((reviews, index) => ( 
            <div key={index}>
                <div className="left-section">
                    <img src= {profilePic} style={{width:"100px", height:"100px", marginLeft:"30px", marginTop:"10px"}}></img>
                    </div>
                    <div className="right-section" style={{marginLeft:"60px", marginTop:"-66px"}}>
                    <h2 style={{color: "#CBCBCB", fontSize: "26px", marginLeft: "60px"}}>{reviews.username}</h2>             
                    <p style={{color:"#A7A7A7", marginLeft:"60px", fontSize:"22px"}}>{reviews.comments}</p>
                    <p style={{color: "#F4EDD0", marginLeft:"60px"}}>date of visit: {reviews.datePosted}</p>
                    <p style={{color: "#F4EDD0", marginLeft:"60px", fontSize:"26px", marginTop:"-10px"}}>rating: {reviews.restaurantRating}{getStars(reviews.restaurantRating)}</p>
                    </div>

                    <div style={{backgroundColor:"#3B3B3B", width:"100%", height:"500px"}}>
                    <Link to={{
            pathname: `/restaurant/${reviews.restaurant_id}`,
            
        }}>
                    {reviews.restaurantPic && 
        <img 
        src= {require(`../images/RestaurantPic/${reviews.restaurantPic }`)}
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
                    <h1 style={{color:"white", fontWeight:"bold", fontSize:"36px"}}>{reviews.restaurantName}</h1>
                    <div style={{color:"#E0CA73",fontWeight:"bold",fontSize:"26px"}}>{reviews.rating}{getStars(reviews.rating)}</div>
                    <div className={`category-container1 ${reviews.category1 ? '' : 'hidden'}`} style={{marginLeft:"-5px"}}>
                                    <h2 class="category-text">{reviews.category1}</h2>
                                </div>
                                <div className={`category-container2 ${reviews.category2 ? '' : 'hidden'}`} style={{marginLeft:"180px"}}>
                                    <h2 class="category-text">{reviews.category2}</h2>
                                </div>
                    
        
                </div> 
                    </div>
             </div> 
             ))}
             </div> 
        ): (
            <p>Loading...</p>
          )}
        
    </div>
    )}


export default UserReview