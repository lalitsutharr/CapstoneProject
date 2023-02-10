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
import { useRef } from "react";
import backImg from '../images/Back button.png';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { section } from 'react-router-dom'
import Result from "./Result";
import { useParams } from 'react-router-dom';




const Login = () => {
axios.defaults.withCredentials = true
let { account_id } = useParams();
const [accountId, setAccountId] = useState("");
const userRef = useRef();
const errRef = useRef();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loginStatus, setLoginStatus] = useState("");
const navigate = useNavigate();
const [success, setSuccess] = useState('false');
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


const handleLogin = async (e) => {
    e.preventDefault();
    const data = {
        email: email,
        password: password,
    }
    try{
        await axios.post("http://localhost:8800/login", data)
        window.location.reload(false);
        
    }catch(err){
        console.log(err)
    }
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
                <span style={{color: "black"}}>Account</span>
                <Link to= {{
    pathname: `/Liked/${account_id}`}} style={{color: "white"}}><span>Liked</span></Link>
                <Link to="/randomizer" style={{color: "white"}}><span>Randomizer</span></Link>
                <Link to="/trending" style={{color: "white"}}><span>Trending</span></Link>
            </div>
        </div>
        <Link to="/" ><img className="backImg" src={backImg} alt="Back Icon" style={{marginLeft:"10px"}}/></Link>
        <div style={{textAlign: "center", color:"white", fontSize:"32px", marginTop:"-90px"}}><h1>MakanView</h1></div>
        

        <div>
        <div className="input-container" style={{textAlign:"center"}}>
  <label htmlFor="email" style={{color:"#E0CA73", marginLeft:"-370px"}}>Email</label>
  <input type="text" id="email" name="email" placeholder="Email Adress" onChange={(e) => {setEmail(e.target.value)}} style={{backgroundColor:"#313131", width:"480px", height:"50px", borderRadius:"20px", caretColor:"#E0CA73",marginTop:"-30px"}}/>

</div>

<div className="input-container" style={{textAlign:"center"}}>
  <label htmlFor="password" style={{color:"#E0CA73", marginLeft:"-350px"}}>Password</label>
  <input type="password" id="password" name="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}}  style={{backgroundColor:"#313131",width:"480px", height:"50px", borderRadius:"20px", caretColor:"#E0CA73",marginTop:"-30px"}}/>
</div>
</div>
<div><Link to="/register" style={{color:"white", marginLeft:"748px", marginTop:"10px"}}><span>New user? Sign Up!</span></Link></div>
<button onClick={handleLogin} style={{backgroundColor:"#313131", color:"#E0CA73", width:"200px", height: "50px", marginLeft:"540px", marginTop:"15px", borderRadius:"20px"}}>Sign In</button>
            </div>
      )}
    

export default Login