import React from "react";
import { TouchableOpacity, Text, View, ActivityIndicator } from "react-native";
import { StyleSheet } from "react-native";

interface GoogleSignInButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onPress,
  isLoading = false,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.buttonDisabled,
        isLoading && styles.buttonLoading,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {isLoading ? (
          <>
            <ActivityIndicator color="#1F2937" size={20} />
            <Text style={styles.loadingText}>Autenticando...</Text>
          </>
        ) : (
          <>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.text}>Continuar con Google</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonLoading: {
    opacity: 0.9,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  googleIcon: {
    fontSize: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
});
