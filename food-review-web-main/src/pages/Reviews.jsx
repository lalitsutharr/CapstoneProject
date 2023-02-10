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
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import Result from "./Result";



const Reviews = (props) => {  
    const { restaurant_id } = useParams();
    const [account_id, setAccount_id] = useState('');
    const [comments, setComments] = useState();
    const [datePosted, setDatePosted] = useState();
    const [restaurantRating, setRestaurantRating] = useState();
    const [restaurantName, setRestaurantName] = useState("");
    const navigate = useNavigate();

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
   
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.get(`http://localhost:8800/restaurantSearch/${restaurantName}` , restaurantName);
            window.location.href = `/result/${restaurantName}`;
            
            
        } catch(err) {
            console.log(err);
        }
    }

    const handleClick = async (e) =>{
        e.preventDefault()
        
        setDatePosted(e.target.value);
        
        
        const values = {
            restaurant_id: restaurant_id,
            account_id: account_id,
            comments: comments,
            datePosted: datePosted,
            restaurantRating: restaurantRating
        };
        try{
        await axios.post("http://localhost:8800/reviews", values);
        
        }catch(err){
            console.log(err);
        }
    }
return (

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
        <div style={{display: "flex", flexDirection: "column", alignItems: "start"}}>
        <h2 style={{color:"#E0CA73", fontSize:"30px"}}>How was your experience?</h2>
        
        
        <input type="text" placeholder='Write about your experience!' style={{width:"500px",height:"200px", borderRadius:"25px",marginLeft:"50px", marginTop:"10px"}} onChange={(e) => setComments(e.target.value)}/>
        <input
      type="date"
      min="2010-01-01"
      max="2023-12-31"
      value={datePosted}
      onChange={handleClick}
      style={{width:"120px",height:"20px", marginLeft:"50px"}}
    />
        <input type="text" placeholder='rating of your experience?'style={{width:"150px",height:"20px", borderRadius:"5px", marginLeft:"50px", marginTop:"10px"}} onChange={(e) => setRestaurantRating(e.target.value)}/>
        <button onClick={handleClick} stlye={{backgroundColor:"#313131", color:"#E0CA73", width:"100px", height:"30px", borderRadius:"20px", marginLeft:"50px"}}>Confirm</button>
        </div>
</div>
)}
    
export default Reviews