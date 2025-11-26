import React from 'react'
import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageNameHeaderBar from '../../components/PageNameHeaderBar'
import Identity from '../../components/IdentificationPage'

const IdentityVerification = () => {
  return (
    <>
    <SafeAreaView>
        <View style ={styles.container}>
            <PageNameHeaderBar/>
            <View style={styles.section}>
                <Identity/>
            </View>
        </View>
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

export default IdentityVerification
