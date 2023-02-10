import React from 'react';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Restaurant from './pages/Restaurant'
import { Switch } from 'react-router-dom'
import Account from './pages/Account'
import Friends from './pages/Friends'
import News from './pages/News'
import Randomizer from './pages/Randomizer'
import Trending from './pages/Trending'
import Filter from './pages/Filter'
import Login from './pages/Login'
import Register from './pages/Register'
import Reviews from './pages/Reviews'
import Result from './pages/Result'
import UpdateReview from './pages/UpdateReview'
import UserReview from './pages/UserReview'
import RestaurantFilter from './pages/RestaurantFilter';
import Edit from './pages/Edit';



const App = () => {
  return (
    <div className = "App">
    <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path='/restaurant/:restaurant_id' element={<Restaurant/>}/>
          <Route path='/reviews/:restaurant_id' element={<Reviews/>}/>
          <Route path='/reviewsUpdate/:review_id' element={<UpdateReview/>}/>
          <Route path='/userReview/:account_id' element={<UserReview/>}/>
          <Route path="/account/:account_id" element={<Account/>}/>
          <Route path="/restuarantFilter/:" element={<RestaurantFilter/>}/>
          <Route path="/account" element={<Account/>}/>
          <Route path="/edit/:account_id" element={<Edit/>}/>
          <Route path="/Liked/:account_id" element={<Friends/>}/>
          <Route path="/news" element={<News/>}/>
          <Route path="/randomizer" element={<Randomizer/>}/>
          <Route path="/trending" element={<Trending/>}/>
          <Route path="/filter" element={<Filter/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/result/:restaurantName" element={<Result/>} />


          
        
        </Routes>
    </Router>
  </div>
   
  );
}

export default App;


