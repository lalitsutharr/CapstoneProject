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
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from 'axios';
import { section } from 'react-router-dom'
import { useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Result from "./Result";





const USER_REGEX = /^[A-z][A-z0-9-_]{7,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const Register = () => {
    const [account_id, setAccount_id] = useState('');
    const navigate = useNavigate();
    const userRef = useRef();
    const errRef = useRef();
    const [restaurantName, setRestaurantName] = useState("");
    const [username, setUserName] = useState('');
    const [validUserName, setValidUserName] = useState('false');
    const [userFocus, setUserFocus] = useState('false');

    const [password, setPassword] = useState('');
    const [validPwd, setValidPwd] = useState('false');
    const [pwdFocus, setPwdFocus] = useState('false');

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState('false');
    const [matchFocus, setMatchFocus] = useState('false');

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState('false');
    const [emailFocus, setEmailFocus] = useState('false');

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState('false');

useEffect(() => {
    userRef.current.focus();
}, [])

useEffect(() => {
    const result = USER_REGEX.test(username);
    console.log(result);
    console.log(username);
    setValidUserName(result);
}, [username])

useEffect(() => {
    const result = PWD_REGEX.test(password);
    console.log(result);
    console.log(password);
    setValidPwd(result);
    const match = password === matchPwd;
    setValidMatch(match);
}, [password, matchPwd])

useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    console.log(result);
    console.log(email);
    setValidEmail(result);
}, [email])

useEffect(() => {
     setErrMsg('');
}, [username, password, matchPwd, email])

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
    const handleSign = async (e) => {
        e.preventDefault();
        const data = {
            email: email,
            password: password,
            username: username
        }
     try {
        const response = await axios.post("http://localhost:8800/register" , data)
        navigate("/login")
        console.log(response.data)
        setSuccess(true);
        
    } catch (err){
        console.log(err)
        if (!err?.response) {
            setErrMsg('No Server Response');
        } else if (err.response?.status === 409) {
            setErrMsg('Username Taken');
        } else {
            setErrMsg('Registration Failed')
        }
         errRef.current.focus();
    }
    if(success == true){
        navigate("/login")
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
        <Link to="/login" ><img className="backImg" src={backImg} alt="Back Icon" style={{marginLeft:"10px"}}/></Link>
        <div style={{textAlign: "center", color:"white", fontSize:"28px", marginTop:"-60px"}}><h1>Welcome to MakanView!</h1></div>
        
        <section>     
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>     
        {errMsg && (
  <div className="error">
    <FontAwesomeIcon icon={faTimes} />
    {errMsg}
  </div>
)}
 
        <form onSubmit={handleSign} style={{textAlign:"center", top:"40px"}}>
            
        
        <label htmlFor="email">
                            <div style={{color:"#E0CA73", fontSize:"20px", marginRight:"352px"}}>Email</div>
                            
                        </label>
                        <input
                            type="email"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                            style={{backgroundColor:"#313131", width:"400px", height:"30px", borderRadius:"25",color:"#E0CA73"}}
                        />

<label htmlFor="password">
                            <div style={{color:"#E0CA73", fontSize:"20px", marginRight:"320px"}}>Password</div>
                            
                        </label>
                        <input 
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                        aria-invalid={validPwd ? "false" : "true"}
                        aria-describedby="pwdnote"
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                        style={{backgroundColor:"#313131", width:"400px", height:"30px", borderRadius:"25",color:"#E0CA73"}}
                        />
                        <p id="pwdnote" className={pwdFocus&& !validPwd ? "instructions" : "offscreen"} style={{color:"#E0CA73"}}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exlamation mark">!</span>
                            <span aria-label="at symbol">@</span> <span aria-label="hastag">#</span> 
                            <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                            </p>
<label htmlFor="confirm_pwd">
                            <div style={{color:"#E0CA73", fontSize:"20px", marginRight:"250px"}}>Confirm Password</div>
                            
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                            style={{backgroundColor:"#313131", width:"400px", height:"30px", borderRadius:"25",color:"#E0CA73"}}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"} style={{color:"#E0CA73"}}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>

<label htmlFor="username">
                <div style={{color:"#E0CA73", fontSize:"20px", marginRight:"320px"}}>Username</div>
                                 
                    </label>
                    <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    aria-invalid={validUserName ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                    style={{backgroundColor:"#313131", width:"400px", height:"30px", borderRadius:"25",color:"#E0CA73"}}/>
                    <p id="uidnote" className={userFocus && username && !validUserName ? "instructions" : "offscreen"} style={{color:"#E0CA73"}}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>
                        <div><button disabled={!validEmail || !validPwd || !validMatch || !validUserName? true : false} style={{backroundColor:"#313131", color:"#E0CA73", width:"300px",height:"40px", borderRadius:"20px", marginLeft:"0px"}}>Confirm</button>
                        </div>
                        </form>
                        
        </section>
            
        </div>
        
      )
    }

export default Register