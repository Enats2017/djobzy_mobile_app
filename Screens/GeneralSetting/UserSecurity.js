
import React, {useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, StyleSheet, Text } from 'react-native'
import PageNameHeaderBar from '../../components/PageNameHeaderBar'
import ContactInfo from '../../components/ContactInfo'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import GradientButton from '../../components/GradientButton'
import Footer from '../../components/Footer'
import { useNavigation } from '@react-navigation/native'

const UserSecurity = () => {
    const [oldPassword , setOldPassword] = useState([]);
    const [newPassword , setPassword] = useState([]);
    const [retype , setRetype] = useState([]);
    const navigation = useNavigation();


  return (
    <>
    <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
            <PageNameHeaderBar title="Security" navigation={navigation}/>
            <View style={styles.section}>
                <ContactInfo
                   label="Old Password"
                   postalPlaceholder ="*********"
                   postalCodeValue={oldPassword}
                   onChangePostalCode={setOldPassword}
                  showPhone={false}
                  showLocation={false}
                />
                 <ContactInfo
                   label="New Password"
                   postalPlaceholder ="*********"
                   postalCodeValue={newPassword}
                   onChangePostalCode={setPassword}
                  showPhone={false}
                  showLocation={false}
                />
                <ContactInfo
                   label="Repeat New Password"
                   postalPlaceholder ="*********"
                   postalCodeValue={retype}
                   onChangePostalCode={setRetype}
                  showPhone={false}
                  showLocation={false}
            />
            </View>
            <View style={styles.question}>
                <FontAwesome name="question-circle" size={20} color="#fff" />
                <Text style={styles.info}>Password must be at least 8 characters and contain numbers and special symbols</Text>
            </View>
            <GradientButton/>



        </View>
        <Footer/>
    </SafeAreaView>
      
    </>
  )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#222222",
        paddingHorizontal:15
    },
     question:{
        flexDirection:"row",
        alignContent:"center",
        gap:10,
        paddingTop:10,
        paddingBottom:20
        
     },
     info:{
        fontFamily:"Montserrat_400Regular",
        fontSize:14,
        color:"#ffffff",
          width:"98%",
     }
})

export default UserSecurity
