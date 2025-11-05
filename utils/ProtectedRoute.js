import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getToken } from "./auth";

export default function ProtectedRoute({ navigation, children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await getToken();
      if (!token) {
        navigation.replace("Login"); // redirect if not logged in
      }
      setLoading(false);
    };
    checkLogin();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  

  return children;
}
