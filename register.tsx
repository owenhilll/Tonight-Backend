import { Link } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AboutScreen() {
  return (
    <SafeAreaView
      style={{
        height: "100%",
        backgroundColor: "#303332",
        justifyContent: "center",
      }}
    >
      <View style={styles.container}>
        <View style={{ width: "100%" }}>
          <Text style={styles.header}>Tonight.</Text>
          <View style={{ flex: 1 }}>
            <View>
              <TextInput style={styles.input} placeholder="Email" />
              <TextInput style={styles.input} placeholder="Password" />
              <TextInput style={styles.input} placeholder="Confirm Password" />
              <TouchableOpacity style={styles.button}>
                Create Account
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.footer}>
            <Text style={styles.text}>Already have an account?</Text>
            <View style={{ flex: 1 }}>
              <Link style={styles.button} href="/login">
                Login
              </Link>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    alignContent: "center",
    height: "70%",
    width: "50%",
    backgroundColor: "#141414",
    padding: 30,
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
  footer: {
    borderTopWidth: 1,
    borderTopColor: "white",
    alignSelf: "stretch",
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
