
import { getToken } from "./auth";

const API_URL = "http://192.168.10.106:8000/api";

export async function fetchProfile(){
    const token = await getToken();
    const res = await fetch(`${API_URL}/me`,{
      headers:{
        "content-Type":"application/json",
        Authorization: `Bearer ${token}`,
      }  ,
    });

    const data = await res.json();
    console.log(data);
    
    return data;

}