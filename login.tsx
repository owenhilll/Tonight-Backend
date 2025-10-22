import { useState } from "react";

import { useAuth } from "../context/authContext.js";

import { Link, Redirect, useNavigation } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Login = () => {
  const { session, login } = useAuth();

  const navigation = useNavigation();

  const [TextInputs, setTextInputs] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    setTextInputs((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const [err, setErr] = useState(null);

  const handleLogin = async () => {
    try {
      await login(TextInputs);
    } catch (err: any) {
      console.log(err);
      setErr(err);
    }
  };

  if (session) return <Redirect href="/" />;

  return (
    <SafeAreaView
      style={{
        height: "100%",
        backgroundColor: "#303332",
        justifyContent: "center",
      }}
    >
      <View style={styles.container}>
        <View style={styles.left}>
          <Text style={styles.header}>Tonight.</Text>

          <Text style={styles.text}>Don't you have an account?</Text>
          <View style={{ flex: 1 }}>
            <Link style={styles.button} href="/register">
              Create Account
            </Link>
          </View>
          <View style={styles.footer}>
            <Text style={styles.text}>Business Portal</Text>
            <Link style={styles.button} href="/register">
              Register Business
            </Link>
          </View>
        </View>
        <View style={styles.right}>
          <Text style={styles.text}>Login</Text>
          <View>
            <TextInput
              style={styles.input}
              onChange={handleChange}
              placeholder="Email"
              nativeID="email"
            />
            <TextInput
              style={styles.input}
              onChange={handleChange}
              placeholder="Password"
              nativeID="password"
            />
            {err && err}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "70%",
    height: "70%",
    alignSelf: "center",
    alignContent: "center",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "white",
    alignSelf: "stretch",
  },
  left: {
    width: "30%",
    backgroundColor: "#201f21",
    padding: 10,
  },
  right: {
    width: "70%",
    padding: 10,
    backgroundColor: "#141414",
  },
  input: {
    fontSize: 18,
    borderWidth: 1,
    marginTop: 10,
    backgroundColor: "#292929",
    color: "white",
    padding: 4,
    borderColor: "lightgray",
    borderRadius: 5,
    justifyContent: "center",
  },
  header: {
    fontSize: 25,
    color: "white",
    alignContent: "center",
    fontWeight: "bold",
    height: 60,
    margin: 5,
  },
  text: {
    fontSize: 18,
    color: "white",
    alignContent: "center",
    margin: 5,
    fontWeight: "semibold",
    height: 40,
  },
  button: {
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
});
export default Login;
