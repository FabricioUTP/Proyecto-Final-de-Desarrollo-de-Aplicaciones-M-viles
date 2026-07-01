// src/components/ErrorBoundary.jsx
// Captura errores de render en el árbol de componentes hijo y
// muestra una pantalla de recuperación en lugar de un crash total.

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Logger from "../utils/logger";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message ?? "Error desconocido",
    };
  }

  componentDidCatch(error, info) {
    Logger.error("ErrorBoundary", error?.message ?? "Error de render", {
      componentStack: info?.componentStack ?? "",
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <View style={styles.container}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.title}>Algo salió mal</Text>
        <Text style={styles.subtitle}>
          Ocurrió un error inesperado en esta sección de la app.
        </Text>
        <Text style={styles.detail} numberOfLines={3}>
          {this.state.errorMessage}
        </Text>
        <TouchableOpacity style={styles.btn} onPress={this.handleReset} activeOpacity={0.8}>
          <Text style={styles.btnText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: "#F8FAFC",
  },
  icon:     { fontSize: 48, marginBottom: 16 },
  title:    { fontSize: 20, fontWeight: "700", color: "#1A2340", marginBottom: 8, textAlign: "center" },
  subtitle: { fontSize: 14, color: "#64748B", marginBottom: 12, textAlign: "center" },
  detail:   { fontSize: 12, color: "#94A3B8", marginBottom: 28, textAlign: "center", fontStyle: "italic" },
  btn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});

export default ErrorBoundary;