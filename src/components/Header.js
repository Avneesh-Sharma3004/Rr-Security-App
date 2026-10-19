import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CustomHeader = ({
  children,

  color = "#FFFFFF",
  statusBarStyle = "dark",

  height = 0,
  borderRadius = 0,

  paddingHorizontal = 16,
  paddingVertical = 0,

  edges = ["top"],

  style,
  contentStyle,

  ...rest
}) => {
  return (
    <>
      {/* Status Bar */}
      <StatusBar
        barStyle={statusBarStyle === "light" ? "light-content" : "dark-content"}
        backgroundColor={color}
        translucent={false}
      />

      {/* Safe Area */}
      <SafeAreaView
        edges={edges}
        style={[
          styles.safeArea,
          {
            backgroundColor: color,
          },
        ]}
      >
        {/* Header */}
        <View
          {...rest}
          style={[
            styles.header,
            {
              height,
              backgroundColor: color,
              borderRadius,
              paddingHorizontal,
              paddingVertical,
            },
            style,
          ]}
        >
          {/* Fully Flexible Content */}
          <View style={[styles.content, contentStyle]}>{children}</View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  safeArea: {
    width: "100%",
  },

  header: {
    width: "100%",
  },

  content: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
  },
});
