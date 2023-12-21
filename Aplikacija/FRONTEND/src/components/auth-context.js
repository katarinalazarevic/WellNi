import React, {useState,useEffect} from "react";
import { createContext } from "react";
import jwtDecode from 'jwt-decode';
const AuthContext = React.createContext({
    token: '',
    isLoggedIn:false,
    username:'',
    login:(token,username)=>{},
    logout:()=>{},
    sessionTimeLeft:'',
    resetTimer: () => {}
});

export const AuthContextProvider = (props) => {
    const[token,setToken]=useState(null);
    const[username, setUsername]= useState(null);
    const [sessionTimeLeft, setSessionTimeLeft] = useState(null);
    const userIsLoggedIn = !!token;
    const [timer, setTimer] = useState(null);

    const loginHandler = (token, username) => {
        //console.log("Login:", token, username); // Provera vrednosti tokena i korisničkog imena prilikom prijave

        setToken(token);
        setUsername(username);
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        
        const decodedToken = jwtDecode(token);
        const expirationTime = decodedToken.exp * 1000; // UNIX timestamp u milisekundama
        const currentTime = Date.now();
        const timeLeft = expirationTime - currentTime;
      
        setSessionTimeLeft(timeLeft);
        if (timer) {
            clearInterval(timer);
        }
      
        const newtimer = setInterval(() => {
          const newTimeLeft = expirationTime - Date.now();
          setSessionTimeLeft(newTimeLeft);
      
          if (newTimeLeft <= 0) {
            clearInterval(newtimer);
            logoutHandler();
          }
        }, 1000);
        setTimer(newtimer);
    }

    const logoutHandler = () => {
        setToken(null);
        setUsername(null);
        setSessionTimeLeft(null);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        if (timer) {
            clearInterval(timer);
        }
    }

    const resetTimer = () => {
        if (timer) {
          clearInterval(timer);
        }
    }


    const contextValue = {
        token:token,
        isLoggedIn:userIsLoggedIn,
        username:username,
        login: loginHandler,
        logout: logoutHandler,
        sessionTimeLeft: sessionTimeLeft,
        resetTimer: resetTimer
    }

    return <AuthContext.Provider value = {contextValue}>{props.children}</AuthContext.Provider>

}
export default AuthContext;