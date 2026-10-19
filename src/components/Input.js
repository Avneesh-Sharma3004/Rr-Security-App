import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const INPUT_CONFIG = {
  text: {
    keyboardType: "default",
    autoCapitalize: "sentences",
  },

  name: {
    keyboardType: "default",
    autoCapitalize: "words",
  },

  email: {
    keyboardType: "email-address",
    autoCapitalize: "none",
    autoCorrect: false,
  },

  phone: {
    keyboardType: "phone-pad",
    autoCapitalize: "none",
    maxLength: 10,
  },

  number: {
    keyboardType: "numeric",
    autoCapitalize: "none",
  },

  password: {
    keyboardType: "default",
    autoCapitalize: "none",
    autoCorrect: false,
    secureTextEntry: true,
  },
};

const validateInput = (type, value, required) => {
  const text = value?.trim() || "";

  if (required && !text) {
    return "This field is required";
  }

  // Agar required nahi hai aur empty hai
  if (!text) {
    return "";
  }

  switch (type) {
    case "email":
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
        return "Please enter a valid email address";
      }
      break;

    case "phone":
      if (!/^[6-9]\d{9}$/.test(text)) {
        return "Please enter a valid 10 digit mobile number";
      }
      break;

    case "number":
      if (!/^\d+$/.test(text)) {
        return "Please enter a valid number";
      }
      break;

    case "name":
      if (!/^[a-zA-Z ]+$/.test(text)) {
        return "Please enter a valid name";
      }
      break;

    case "password":
      if (text.length < 8) {
        return "Password must be at least 8 characters";
      }
      break;

    default:
      break;
  }

  return "";
};

const CustomInput = ({
  type = "text",
  placeholder = "",
  value = "",
  onChangeText,
  required = false,

  leftIcon,
  rightIcon,
  onRightIconPress,

  error,
  onBlur,
  onFocus,

  editable = true,
  disabled = false,

  style,
  inputStyle,

  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [internalError, setInternalError] = useState("");

  const config = INPUT_CONFIG[type] || INPUT_CONFIG.text;

  const hasValue = value?.length > 0;
  const shouldFloatLabel = isFocused || hasValue;

  const finalError = error || internalError;

  useEffect(() => {
    if (error !== undefined) {
      setInternalError("");
    }
  }, [error]);

  const handleChangeText = (text) => {
    setInternalError("");

    if (onChangeText) {
      onChangeText(text);
    }
  };

  const handleFocus = (event) => {
    setIsFocused(true);

    if (onFocus) {
      onFocus(event);
    }
  };

  const handleBlur = (event) => {
    setIsFocused(false);

    const validationError = validateInput(type, value, required);

    setInternalError(validationError);

    if (onBlur) {
      onBlur(event, validationError);
    }
  };

  const handleRightIconPress = () => {
    if (type === "password") {
      setShowPassword((prev) => !prev);
      return;
    }

    if (onRightIconPress) {
      onRightIconPress();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.inputWrapper,

          isFocused && styles.focusedBorder,

          finalError && styles.errorBorder,

          !editable || disabled ? styles.disabledBorder : null,
        ]}>
        {/* LEFT ICON */}

        {leftIcon && (
          <Ionicons name={leftIcon} size={22} style={styles.leftIcon} />
        )}

        {/* FLOATING LABEL */}

        {shouldFloatLabel && (
          <View style={styles.labelContainer}>
            <Text
              style={[
                styles.floatingLabel,
                isFocused && styles.focusedLabel,
                finalError && styles.errorLabel,
              ]}>
              {placeholder}
              {required && <Text style={styles.required}> *</Text>}
            </Text>
          </View>
        )}

        {/* INPUT */}

        <TextInput
          {...rest}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable && !disabled}
          placeholder={
            shouldFloatLabel ? "" : `${placeholder}${required ? " *" : ""}`
          }
          placeholderTextColor="#8A8A8A"
          keyboardType={config.keyboardType}
          autoCapitalize={config.autoCapitalize}
          autoCorrect={config.autoCorrect}
          maxLength={rest.maxLength || config.maxLength}
          secureTextEntry={type === "password" ? !showPassword : false}
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || type === "password") && styles.inputWithRightIcon,
            inputStyle,
          ]}
        />

        {/* RIGHT ICON */}

        {(rightIcon || type === "password") && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleRightIconPress}
            style={styles.rightIconContainer}>
            <Ionicons
              name={
                type === "password"
                  ? showPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                  : rightIcon
              }
              size={22}
              style={styles.rightIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* ERROR */}

      {!!finalError && <Text style={styles.errorText}>{finalError}</Text>}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 18,
  },

  inputWrapper: {
    height: 52,
    width: "100%",
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#FFFFFF",
  },

  focusedBorder: {
    borderColor: "#111827",
    borderWidth: 1,
  },

  errorBorder: {
    borderColor: "#DC2626",
  },

  disabledBorder: {
    backgroundColor: "#F3F4F6",
    borderColor: "#D1D5DB",
  },

  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#111827",
  },

  inputWithLeftIcon: {
    paddingLeft: 4,
  },

  inputWithRightIcon: {
    paddingRight: 4,
  },

  leftIcon: {
    marginLeft: 14,
    marginRight: 8,
    color: "#111827",
  },

  rightIconContainer: {
    width: 48,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  rightIcon: {
    color: "#BDBDBD",
  },

  labelContainer: {
    position: "absolute",
    left: 12,
    top: -9,
    paddingHorizontal: 5,
    backgroundColor: "#FFFFFF",
    zIndex: 10,
    borderRadius: 10,
  },

  floatingLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },

  focusedLabel: {
    color: "#111827",
  },

  errorLabel: {
    color: "#DC2626",
  },

  required: {
    color: "#DC2626",
    fontSize: 10,
  },

  errorText: {
    marginTop: 5,
    marginLeft: 4,
    fontSize: 12,
    color: "#DC2626",
  },
});
