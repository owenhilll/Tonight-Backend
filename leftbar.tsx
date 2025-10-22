import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LeftBar() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tonight</Text>
      <TouchableOpacity style={styles.category}>
        <Ionicons style={styles.image} name="apps" />
        <Text style={styles.categoryText}>All</Text>
      </TouchableOpacity>

      <View style={styles.category}>
        <Ionicons style={styles.image} name="restaurant" />
        <Text style={styles.categoryText}>Food</Text>
      </View>
      <View style={styles.category}>
        <Ionicons style={styles.image} name="pint" />
        <Text style={styles.categoryText}>Drink</Text>
      </View>
      <View style={styles.category}>
        <Ionicons style={styles.image} name="baseball" />
        <Text style={styles.categoryText}>Sport</Text>
      </View>
      <View style={styles.category}>
        <Ionicons style={styles.image} name="musical-notes" />
        <Text style={styles.categoryText}>Music</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "20%",
    height: "100%",
    padding: 2,
    flexDirection: "column",
  },
  header: {
    fontSize: 25,
    backgroundColor: "#141414",
    color: "white",
    alignContent: "center",
    fontWeight: "bold",
    height: 60,
  },
  category: {
    fontSize: 20,
    shadowColor: "black",
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    backgroundColor: "#292929",
    cursor: "pointer",
    borderWidth: 1,
    padding: 2,
    margin: 5,
    flexDirection: "row",
    borderRadius: 5,
    borderColor: "lightgray",
  },
  categoryText: {
    color: "white",
    fontSize: 20,
  },
  image: {
    justifyContent: "center",
    alignContent: "center",
    marginLeft: 10,
    marginRight: 10,
    color: "white",
    fontSize: 18,
  },
});
