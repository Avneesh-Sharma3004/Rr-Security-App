import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import UserHeader from "../../../components/UserHeader";
import navigationServices from "../../../navigation/navigationServices";

export default function Hamburger({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <UserHeader navigation={navigation} />
      <View>
        <Pressable onPress={()=> navigationServices.navigate("Notification")} style={{paddingHorizontal:10,marginTop:10}}>
        <Text style={{fontSize:16,fontWeight:"600"}}>Notification</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
