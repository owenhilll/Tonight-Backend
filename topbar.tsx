import { useAuth } from "@/context/authContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  Button,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function TopBar() {
  const [modalVisible, setModalVisible] = useState(false);
  const onProfilePress = () => {
    setModalVisible(!modalVisible);
  };
  const { logout } = useAuth();
  return (
    <View style={styles.container}>
      <TextInput style={styles.search} placeholder="Search" />
      <TouchableOpacity>
        <Ionicons style={styles.image} name="file-tray-full" />
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Button title="Settings" onPress={() => setModalVisible(false)} />
            <Button title="Logout" onPress={logout} />
          </View>
        </View>
      </Modal>
      <TouchableOpacity onPress={onProfilePress}>
        <Ionicons style={styles.image} name="person-circle" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#141414",
    height: 60,
    alignContent: "flex-end",
    paddingLeft: 2,
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: "row",
  },
  modalBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 300,
    margin: 10,
    alignSelf: "flex-end",
  },
  modalContent: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    fontSize: 20,
    alignContent: "center",
    fontWeight: "bold",
  },
  search: {
    fontSize: 18,
    borderWidth: 1,
    marginRight: 10,
    backgroundColor: "#292929",
    color: "white",
    width: "100%",
    padding: 4,
    borderColor: "lightgray",
    borderRadius: 5,
    justifyContent: "center",
  },
  image: {
    justifyContent: "center",
    alignContent: "center",
    marginLeft: 10,
    marginRight: 10,
    color: "white",
    fontSize: 40,
  },
});
