import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomButton from '../../components/Button'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../hooks/UseAuth';

export default function AdminDashboard() {
      const { logout } = useAuth();

  return (
    <SafeAreaView>
    <View>
      <Text>AdminDashboard</Text>
      <CustomButton title='Logout' color='red' onPress={()=>logout()}/>
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})