import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

function Homepage() {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const verifyCookie = async () => {
    console.log(cookies);
    if (!cookies.token) {
      localStorage.removeItem('user');
      navigate("/login");
    }
    else{
    const response = await fetch("http://localhost:5000/api/user/verify",{
      method : "POST",
      body : JSON.stringify({token : cookies.token}),
      headers : {
          "Content-Type" : "application/json"
        }
      }
    )
    const data = await response.json();
    console.log(data);
    if(data.status)
    navigate('/chats')
    else
    navigate('/login')
  }}
  useEffect(() => {
    verifyCookie();
  }, []);
  return (
    <>
    </>
  );
}

export default Homepage