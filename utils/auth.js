import AsyncStorage from "@react-native-async-storage/async-storage";

//save token

export async function saveToken(token){
    await AsyncStorage.setItem("userToken",token)
}

//Get token

export async function getToken(){
    return await AsyncStorage.getItem("userToken")
}

//Remove token

export async function removeToken(){
    await AsyncStorage.removeItem("userToken");
}
