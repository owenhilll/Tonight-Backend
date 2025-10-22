import { request } from "@/axios";
import { useAuth } from "@/context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Post from "./components/post";
import Share from "./components/share";

export default function Profile() {
  const { user, logout } = useAuth();
  const {
    isLoading: EventsLoading,
    error: EventsError,
    data: Events,
  } = useQuery({
    queryKey: ["userQuery", user.id],
    queryFn: () =>
      request.get("/events/" + user.id).then((res: any) => {
        return res.data;
      }),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost: any) => {
      return request.post("/events", newPost);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["userQuery", user.id] });
    },
  });

  const changeProfilePic = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
    });
    if (!result.assets) return;
    var pic = result.assets[0].uri;
    return request.post("/businesses/edit/profilepic", { pic });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileinfo}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={changeProfilePic}>
            <Image
              style={styles.image}
              defaultSource={require("../assets/images/icons8-user-not-found-50.png")}
              source={{ uri: "data:image/png;base64," + user.profilepic }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "column", flex: 1, alignSelf: "center" }}>
          <Text style={styles.userinfo}>{user.name}</Text>
          <Text style={styles.userinfo}>{user.email}</Text>
          <Text style={styles.userinfo}>{user.address}</Text>
        </View>
      </View>
      <Share props={mutation} />
      <View>
        {EventsLoading ? (
          <Text>Loading</Text>
        ) : EventsError ? (
          <Text>Error Loading User Events</Text>
        ) : (
          Events?.map((event: any) => (
            <Post queryClient={queryClient} event={event} key={event.id} />
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4f4f4f",
    flex: 1,
    padding: 4,
    gap: 5,
  },
  profileinfo: {
    borderWidth: 1,
    borderRadius: 3,
    padding: 10,
    borderColor: "gray",
    flexDirection: "row",
  },
  userinfo: {
    fontSize: 22,
    color: "white",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 150 / 2,
    overflow: "hidden",
    borderWidth: 3,
    alignSelf: "center",
    backgroundColor: "white",
  },
});
