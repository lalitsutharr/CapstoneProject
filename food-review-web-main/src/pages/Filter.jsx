import React from "react"
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from '../Header';
import '../index.css';
import '../App.css';
import { useState, useEffect } from "react";
import SwipeableViews from 'react-swipeable-views';
import filterImg from '../images/for filter.png';
import searchImg from '../images/Icon awesome-search.png';
import backImg from '../images/Back button.png';
import axios from 'axios';

import { useParams } from 'react-router-dom';
import Result from "./Result";
import RestaurantFilter from "./RestaurantFilter";

const Filter = () => {
    const [accountId, setAccount_id] = useState("");
    let { account_id } = useParams();
    const [restaurantName, setRestaurantName] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [rating, setRating] = useState("");
    const [priceRange, setPriceRange] = useState("");

    const [] = useState("");

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
    const handleCategory = async (e) => {
        e.preventDefault();
        
        try {
            setCategory(e.target.value);
            await axios.get(`http://localhost:8800/restaurantCategory/${category}` , category);
            window.location.href = `/restaurantFilter/${category}`
            return <RestaurantFilter category= {category} />
        } catch(err){
            console.log(err);

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

                <Link to="/" style={{color: "white"}}><img className="filterImg" src={filterImg} alt="Filter Icon" style={{marginLeft:"1090px", top:"4px", position: "absolute", objectFit:"contain", objectPosition:"center",overflow:"hidden"}}/></Link>
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
        <div style={{width:"100px", marginTop:"50px", marginLeft:"50px"}} >
        <label for="location" style={{color:"white", fontSize:"30px"}} onChange={(e) => setLocation(e.target.value)}>Location:</label>
        <select name="location" id="location">
        <option value=""></option>
        <option value="Tampines Mall">Tampines Mall</option>
        <option value="Bedok Mall">Bedok Mall</option>
        <option value="Changi Airport">Changi Airport</option>
        <option value="VivoCity">VivoCity</option>
        </select></div>
        <div style={{width:"100px", marginTop:"-98px", marginLeft:"500px"}}>
        <label for="categories" style={{color:"white", fontSize:"30px"}}>Category</label>
        <select name="categories" id="categories">
        <option value=""></option>
        <option value="Halal" onChange={(e) => setCategory(e.target.value)}>Halal</option>
        <option value="Western" onChange={(e) => setCategory(e.target.value)}>Western</option>
        <option value="Chinese" onChange={(e) => setCategory(e.target.value)}>Chinese</option>
        <option value="Japanese" onChange={(e) => setCategory(e.target.value)}>Japanese</option>
        <option value="Malay" onChange={(e) => setCategory(e.target.value)}>Malay</option>
        </select></div>
        <div style={{width:"100px", marginTop:"100px" , marginLeft:"50px"}}>
        <label for="rating" style={{color:"white", fontSize:"30px"}}>Rating</label>
        <select name="rating" id="rating">
        <option value=""></option>
        <option value="0.0">0.0</option>
        <option value="0.5">0.5</option>
        <option value="1.0">1.0</option>
        <option value="1.5">1.5</option>
        <option value="2.0">2.0</option>
        <option value="2.5">2.5</option>
        <option value="3.0">3.0</option>
        <option value="3.5">3.5</option>
        <option value="4.0">4.0</option>
        <option value="4.5">4.5</option>
        <option value="5.0">5.0</option>
        </select></div>
        <div style={{width:"180px", marginTop:"-20px", marginLeft:"500px"}}>
        <label for="Price points" style={{color:"white", fontSize:"30px"}}>Price Range</label>
        <select name="Price Points" id="Price points">  
        <option value="$5">$5</option>
        <option value="$10">$10</option>
        <option value="$15">$15</option>
        <option value="$20">$20</option>
            </select></div>
        <button style={{width:"200px", height:"70px", backgroundColor:"#E0CA73", color:'white', borderRadius:"30px", fontSize:"28px", marginLeft:"1000px", marginTop:"260px"}} onClick= {handleCategory}>Confirm</button>
        

    
    </div>
    )}
export default Filter