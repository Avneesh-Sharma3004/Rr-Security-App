
import React, { useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CustomButton = ({
  title = "Submit",
  onPress,
  disabled = false,
  loading = false,

  color = "#2563EB",
  textColor = "#FFFFFF",
  variant = "solid", // solid | outline

  width = "100%",
  height = 45,
  borderRadius = 5,
  borderColor = "#E5E7EB",

  fontSize = 14,
  fontWeight = "600",

  leftIcon,
  iconSize = 16,
  iconColor,
  iconGap = 7,

  style,
  textStyle,
  ...rest
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const isOutline = variant === "outline";

  const animate = (toValue) => {
    if (disabled || loading) return;

    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 30,
      bounciness: 5,
    }).start();
  };

  const handlePress = () => {
    if (disabled || loading) return;
    onPress?.();
  };

  return (
    <Animated.View
      style={[
        { width, height, transform: [{ scale }] },
        style,
      ]}
    >
      <Pressable
        {...rest}
        disabled={disabled || loading}
        onPress={handlePress}
        onPressIn={() => animate(0.96)}
        onPressOut={() => animate(1)}
        style={[
          styles.button,
          {
            height,
            borderRadius,
            backgroundColor: isOutline ? "#FFFFFF" : color,
            borderWidth: isOutline ? 1 : 0,
            borderColor: isOutline ? borderColor : color,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <View style={styles.content}>
          {loading ? (
            <Text
              style={[
                styles.text,
                { color: textColor, fontSize, fontWeight },
                textStyle,
              ]}
            >
              Please wait...
            </Text>
          ) : (
            <>
              {leftIcon ? (
                <Ionicons
                  name={leftIcon}
                  size={iconSize}
                  color={iconColor ?? textColor}
                  style={{ marginRight: iconGap }}
                />
              ) : null}

              <Text
                style={[
                  styles.text,
                  { color: textColor, fontSize, fontWeight },
                  textStyle,
                ]}
              >
                {title}
              </Text>
            </>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {},
});
