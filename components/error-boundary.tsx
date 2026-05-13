import React from "react";
import { Text, View, TouchableOpacity } from "react-native";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      const errorMsg = this.state.error?.message || "Sin mensaje";
      const errorStack = this.state.error?.stack?.split("\n").slice(0, 3).join(" | ") || "";
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8, color: "#11181C" }}>
            Algo salió mal
          </Text>
          <Text style={{ fontSize: 14, color: "#687076", textAlign: "center", marginBottom: 8 }}>
            Ocurrió un error inesperado. Por favor intenta de nuevo.
          </Text>
          <View style={{ backgroundColor: "#fee2e2", borderRadius: 8, padding: 12, marginBottom: 16, width: "100%" }}>
            <Text style={{ fontSize: 11, color: "#991b1b", fontFamily: "monospace" }} selectable>
              {errorMsg}
            </Text>
            {!!errorStack && (
              <Text style={{ fontSize: 10, color: "#b91c1c", marginTop: 4, fontFamily: "monospace" }} selectable>
                {errorStack}
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={this.handleRetry}
            style={{
              backgroundColor: "#0a7ea4",
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
