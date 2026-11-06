//we wanna share user's information among multiple components so we have to create a sort of global var they all can use
import { createContext, useEffect, useState } from "react";
import axios from "axios"

//so createcontext is like a empty custom box that everyone can share
export const AuthContext = createContext()

//and context provider puts the actual values inside that box for everyone
export const AuthContextProvider = ({children})=>{

    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    //globalizing login logout to be accessible from anywhere
   const login = async (inputs) => {
    try {
        const res = await axios.post("/api/auth/login", inputs); 
        setCurrentUser(res.data.user);
        setToken(res.data.token)

        //save both in local storage for reference
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
    } catch (err) {
        console.error("Login failed:", err.response?.data || err.message);
        throw err; 
    }
    };

    const logout = async()=>{
        console.log("logout attempt")
        // const res =await axios.post("/api/auth/logout",{})  //this was only needed when i was using cookies :(
        setCurrentUser(null);  
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };
    
    useEffect(()=>{
        if (currentUser){ localStorage.setItem("user", JSON.stringify(currentUser)); } //put user stuff in local storage persist bw reloads
        if(token){localStorage.setItem("token", token) }
   }, [currentUser, token]);

    return  <AuthContext.Provider value={{currentUser,token, login, logout}}>
                {children}
            </AuthContext.Provider>;
}