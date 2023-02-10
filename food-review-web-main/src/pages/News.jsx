
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
import Result from "./Result";
import { useParams } from 'react-router-dom';

import axios from 'axios';

const News = () => {
    const [news, setNews] = useState({});
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
    
    
    useEffect(() => {
        const fetchNewsData = async() => {
            try {
                const res = await axios.get("http://localhost:8800/news");
                setNews(res.data);
            } catch(err) {
                console.log(err);
            }
        }
        fetchNewsData();
    },[]);
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
                <Link to="/filter"><img className="filterImg" src={filterImg} alt="Filter Icon" style={{marginLeft:"1090px", top:"4px", position: "absolute", objectFit:"contain", objectPosition:"center",overflow:"hidden"}}/></Link>
            </nav> 
        </header>
        
        
        <div className="second-header">
            <div className="tabs">
            <span style={{color: "black"}}>News</span>
            <Link to="/account" style={{color: "white"}}><span>Account</span></Link>
            <Link to= {{
    pathname: `/Liked/${account_id}`}} style={{color: "white"}}><span>Liked</span></Link>
                <Link to="/randomizer" style={{color: "white"}}><span>Randomizer</span></Link>
                <Link to="/trending" style={{color: "white"}}><span>Trending</span></Link>
            </div>
        </div>
        <Link to="/" ><img className="backImg" src={backImg} alt="Back Icon" style={{marginLeft:"10px"}}/></Link>
        {news.newsData ? (
        <div className="group-container">
            {news.newsData.map((news, index) => (
          <div key={index}>
            {news.pictures && 
        <img 
        src= {require(`../images/NewsPic/${news.pictures}`)}
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
              <h2 style={{color: "#CBCBCB", fontSize: "30px", marginLeft: "20px"}}>{news.header}</h2>
                    <p style={{color: "#F4EDD0", marginLeft: "20px"}}>{news.news}</p>                   
                    <p style={{color: "#F4EDD0",marginLeft: "20px"}}>{news.datePosted}</p>
                
                </div>
            ))}
        </div>
    ) : (
            <p>Loading...</p>
        )}

</div>
);
    }





export default News