import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import EmployeeCard from "../../../components/EmployeeCard";

export default function CorractionRequest() {
  return (
    <ScrollView>
      <View style={{marginTop:10 ,gap:10}}>
        <EmployeeCard
          name="Rahul Kumar"
          employeeId="EMP002"
          status="Approved"
          statusColors={{
            backgroundColor: "#95d172",
            textColor: "#fff",
            dotColor: "#fff",
          }}
        />
        <EmployeeCard
          name="Prem Kumar"
          employeeId="EMP004"
          status="Rejected"
          statusColors={{
            backgroundColor: "#d17572",
            textColor: "#fff",
            dotColor: "#fff",
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
