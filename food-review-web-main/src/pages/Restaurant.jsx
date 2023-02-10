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
import fullStar from '../images/Icon awesome-star.png';
import halfStar from '../images/half star restaurant.png';
import profilePic from '../images/profilePic.jpg';
import like from '../images/Group 76.png';
import noLike from '../images/Group 77.png';
import Result from "./Result";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useParams } from 'react-router-dom';



function Restaurant(props) {
    const navigate = useNavigate();
    const { restaurant_id } = useParams();
    const [account_id, setAccount_id] = useState('');
    const [review_id, setReview_id] = useState("");
    const [restaurant, setRestaurantData] = useState({});
    const [review, setReview] = useState("");
    const [rating, setRating] = useState("");
    const [restaurantName, setRestaurantName] = useState("");
    const [showLike, setShowLike] = useState(false);
    const toggleLike = async () =>{
     setShowLike(!showLike);
     if (!account_id) {
        navigate("/login");
        return;
      }
     
     const values = {
        restaurant_id: restaurant_id,
        account_id: account_id,
     };
     try{
        if (showLike) {
            await axios.delete(`http://localhost:8800/Liked/${restaurant_id}/${account_id}`);
            window.location.reload(false);
          } else {
            await axios.post("http://localhost:8800/Liked", values);
          }
     }catch(err){
        console.log(err)
     }
    }

    useEffect(() => {
        axios.get("http://localhost:8800/login").then((response) => {
            if (response.data.loggedIn === true) {
                const userData = response.data.user[0];
                setAccount_id(userData.account_id);   
              
          }
        });
      }, []);
    

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
    const handleDelete = async (review_id) => { 
        try {
           await axios.delete(`http://localhost:8800/reviewsDelete/${review_id}`)
           window.location.reload(false);
        } catch (err) {
            console.log(err);
        }
    }

    
    useEffect(() => {
        const fetchRestaurant = async() => {
            try {
                const res = await axios.get(`http://localhost:8800/restaurant/${restaurant_id}`);
                setRestaurantData(res.data);
            } catch(err) {
                console.log(err);
            }
        }
        fetchRestaurant();
    },[restaurant_id]);
    useEffect(() => {
        axios.get("http://localhost:8800/login").then((response) => {
          if (response.data.loggedIn === true) {
            const userData = response.data.user[0];
            setAccount_id(userData.account_id);
          }
        });
      }, []);

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
                <Link to= {{
    pathname: `/Liked/${account_id}`}} style={{color: "white"}}><span>Liked</span></Link>
                <Link to="/randomizer" style={{color: "white"}}><span>Randomizer</span></Link>
                <Link to="/trending" style={{color: "white"}}><span>Trending</span></Link>
            </div>
        </div>
        {restaurant.restaurantData ? (
            <div>
               
        {restaurant.restaurantData.map((restaurant, index) => (
            <div key={index}>
                <div style={{position:"relative"}}>
                <div className="restaurant-name">{restaurant.restaurantName}<h2 style={{color: "white", fontSize:"30px", marginLeft:"720px", marginTop:"-50px"}}>{restaurant.likes}</h2></div>                 
                {showLike ? (
        <img src={like} alt="like" onClick={toggleLike} style={{marginLeft:"740px", marginTop:"-20px"}} />
      ) : (
        <img src={noLike} alt="no like" onClick={toggleLike} style={{marginLeft:"740px", marginTop:"-20px"}}/>
      ) }
                                <div className={`category-container1 ${restaurant.category1 ? '' : 'hidden'}`}>
                                    <h2 class="category-text">{restaurant.category1}</h2>
                                </div>
                                <div className={`category-container2 ${restaurant.category2 ? '' : 'hidden'}`}>
                                    <h2 class="category-text">{restaurant.category2}</h2>
                                </div>
                                </div>
                            <h2 style={{color: "#E0CA73", marginLeft:"48px", marginTop:"40px"}}>{restaurant.rating}{getStars(restaurant.rating)}<h2 style={{color: "#ADADAD", marginLeft:"260px", fontSize:"30px", marginTop:"-36px"}}>{restaurant.priceRange}</h2></h2>
                            
                                   

                               
                                <div style={{width:"100%", height:"400px", backgroundColor:"#3B3B3B"}}>
                                <div style={{height:"400px",width:"500px", alignSelf:"center"}}>
                                    
                {restaurant.restaurantPic && 
        <img 
        src= {require(`../images/RestaurantPic/${restaurant.restaurantPic }`)}
         alt="Picture of Restaurant"
         style={
            {
                height:"100%",
                width:"600px",
                objectFit:"cover",
                marginLeft:"290px"
        }}
         />}
         </div>
         </div>         
                                
                            </div>
                            
            ))}
            </div>
        ):(

            <div>Loading...</div>
        )}
            <h1 style={{color: "white", marginLeft: '36px', marginTop: '100px', fontWeight:"bold", fontSize:"30px"} }>Reviews
            <Link to={ `/reviews/${restaurant_id}`} ><div style={{color:"#E0CA73", marginLeft:"1000px",  borderRadius:"20px", textAlign:"center"}}>
                Add Review</div></Link>
                </h1>
                

            
                
                
                <div className="container" style={{width:"100%", overflow:"auto" , height:"360px"}}>
                {restaurant.reviewData ? (
                
                <div>  
                {restaurant.reviewData.map((reviews, index) => (
                <div key={index} style={{justifyContent:"start", display:"flex"}}>
                    <div className="left-section">
                    {reviews.profilePic && 
        <img 
        src= {require(`../images/profilePictures/${reviews.profilePic }`)}
         alt="Picture of Restaurant"
         style={
            {
                height:"100px",
                width:"100px",
                objectFit:"cover",
                marginTop:"10px",
                marginLeft:"50px"
        }}
         />}
                    </div>
                    <div className="right-section">
                    <h2 style={{color: "#CBCBCB", fontSize: "26px", marginLeft: "60px"}}>{reviews.username}</h2>             
                    <p style={{color:"#A7A7A7", marginLeft:"60px", fontSize:"22px"}}>{reviews.comments}</p>
                    <p style={{color: "#F4EDD0", marginLeft:"60px"}}>date of visit: {reviews.datePosted}</p>
                    <p style={{color: "#F4EDD0", marginLeft:"60px", fontSize:"26px", marginTop:"-10px"}}>rating: {reviews.restaurantRating}{getStars(reviews.restaurantRating)}</p>
                    </div>
                    {reviews.account_id === account_id ? (
                    <div>
                    <Link to={`/reviewsUpdate/${reviews.review_id}`} style={{width:"170px", height:"60px", backgroundColor:"#313131", color:"#E0CA73"}}>Update</Link>
                    <button onClick={() => handleDelete(reviews.review_id)} style={{width:"140px", height:"60px", backgroundColor:"#313131", color:"#E0CA73"}}>Delete</button>
                    </div>
                    ) : null}
                    </div>
                
                    
            ))}
            </div>
        
    ) : (
        <div>Loading...</div>
    )}
    
    </div>
    </div>
)}
    
export default Restaurant