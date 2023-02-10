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



const Account = (props) => {
    const navigate = useNavigate();
    const [accountId, setAccountId] = useState("");
    let { account_id } = useParams();
    const [account, setAccountData] = useState([]);
    const [restaurantName, setRestaurantName] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8800/login").then((response) => {
          if (response.data.loggedIn === true) {
            console.log(response)
            if (response.data.loggedIn === true) {
                const userData = response.data.user[0];
                setAccountId(userData.account_id);
                navigate(`/account/${userData.account_id}`)
              }
              
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
    
    
    
    axios.defaults.withCredentials = true

    useEffect(() => {
        axios.get("http://localhost:8800/login").then((response) => {
        if(response.data.loggedIn == false) {
           navigate("/login") 
        }
    })
       
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
                <span style={{color: "black"}}>Account</span>
                <Link to= {{
    pathname: `/Liked/${account_id}`}} style={{color: "white"}}><span>Liked</span></Link>
                <Link to="/randomizer" style={{color: "white"}}><span>Randomizer</span></Link>
                <Link to="/trending" style={{color: "white"}}><span>Trending</span></Link>
            </div>
        </div>

        <div>
        <Link to="/" ><img className="backImg" src={backImg} alt="Back Icon" style={{marginLeft:"10px"}}/></Link>
        </div>
        
        {account.accountData ? (
      <div>
        {account.accountData.map((account, index) => (
          <div key={index}>
            {account.profilePic && 
        <img 
        src= {require(`../images/profilePictures/${account.profilePic}`)}
         alt="Picture of Restaurant"
         style={
            {
                height:"160px",
                width:"160px",
                objectFit:"cover",
                marginLeft:"540px"
        }}
         />}
            
            <h2 style={{textAlign:"center", fontSize:"40px", color:"#E0CA73", marginRight:"40px", marginTop:"-10px"}}>{account.username}</h2>
            <Link to = {{pathname: `/edit/${account_id}`}} style={{color:"white"}}><h2 style={{FontSize:"24px", marginLeft:"580px", marginTop:"-10px"}}>Edit</h2></Link>
            <Link to = {{pathname: `/userReview/${account_id}`}} style={{color:"white"}}><h2 style={{FontSize:"24px", marginLeft:"580px", marginTop:"-10px"}}>Reviews</h2></Link>
            <div style={{width:"100%", height:"300px", backgroundColor:"#3B3B3B", marginTop:"-170px"}}></div>
            
          </div>
          
        ))}
      </div>
    ) : (
      <p>Loading...</p>
    )}
    
   
  </div>
  
);}


export default Account