import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/authContext";

const Share = (props: any) => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState(null);
  const [title, setTitle] = useState(null);
  const { user } = useAuth();

  const handleClick = (e: any) => {
    e.preventDefault();
  };

  const handleShare = () => {
    if (title === null || desc === null) {
      alert("Please ensure both Title and Descriptions are filled");
    } else props.props.mutate({ title, desc, file });
  };

  return (
    <View style={styles.container}>
      <View style={{ gap: 10 }}>
        <img src={user.profilePic} alt="" />
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.field}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder={``}
            onChange={(e: any) => setDesc(e.target.value)}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.field}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder={``}
            onChange={(e: any) => setTitle(e.target.value)}
          />
        </View>
      </View>
      <View style={{ flex: 1, flexDirection: "row", borderRadius: 3 }}>
        <View>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              gap: 4,
              padding: 4,
              borderRadius: 3,
              backgroundColor: "lightgray",
            }}
          >
            <Ionicons name="image" style={styles.image} />
            <Text style={{ color: "white" }}>Add Image</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }} />
        <View>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              backgroundColor: "#4b9ff2",
              borderRadius: 3,
              gap: 4,
              padding: 4,
            }}
            onPress={handleShare}
          >
            <Text style={{ color: "white" }}>Share</Text>
            <Ionicons name="send" style={styles.image} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 7,
    gap: 15,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: "gray",
  },
  field: {
    borderColor: "lightgray",
    borderRadius: 3,
    borderWidth: 1,
    width: "20%",
    fontSize: 20,
    padding: 5,
    color: "white",
  },
  image: {
    fontSize: 20,
    color: "white",
  },
  input: {
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
    color: "white",
  },
});

export default Share;
