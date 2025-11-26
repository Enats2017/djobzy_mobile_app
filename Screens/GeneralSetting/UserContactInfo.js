import React from 'react'
import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageNameHeaderBar from '../../components/PageNameHeaderBar'
import ContactInfo from '../../components/ContactInfo'
import GoogleMap from '../../components/GoogleMap'
import { useNavigation } from '@react-navigation/native'
import Footer from '../../components/Footer'
import { ScrollView } from 'react-native'
import GradientButton from '../../components/GradientButton'

const UserContactInfo = () => {
    const navigation = useNavigation();
  return (
    <>
    <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
            <PageNameHeaderBar title="Contact Info" navigation={navigation}/>
            <ScrollView contentContainerStyle={{paddingBottom:50}} showsVerticalScrollIndicator={false}>
            <ContactInfo/>
            <GoogleMap  region={{
                latitude: 19.0760,
                longitude: 72.8777,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }}/>
            <View style={{paddingTop:10}}>
                <GradientButton title="Send"/>
            </View>
            </ScrollView>
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
    }
 })

export default UserContactInfo
