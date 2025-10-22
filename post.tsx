import { useAuth } from "@/context/authContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { request } from "../../axios";

import moment from "moment";

const Post = (props: any) => {
  const { user } = useAuth();

  const {
    isLoading: placeLoading,
    error: placeError,
    data: placeData,
  } = useQuery({
    queryKey: ["business", props.event.businessid],
    queryFn: () =>
      request
        .get("/businesses/find/" + props.event.businessid)
        .then((res: any) => {
          return res.data;
        }),
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      request
        .delete("/events/delete?eventid=" + props.event.id)
        .then((res: any) => {}),
    onSuccess: () => {
      props.queryClient.invalidateQueries({ queryKey: ["userQuery", user.id] });
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  //TEMPORARY

  return (
    <View style={styles.container}>
      <View style={styles.placeinfo}>
        {placeLoading ? (
          <Text>Loading</Text>
        ) : placeError ? (
          "Error"
        ) : (
          <View>
            <Image src={placeData.profilepic} alt="" />
            <Text style={styles.info}>{placeData.name}</Text>
          </View>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <View>
          <Text style={styles.title}>Title: {props.event.title}</Text>
          <Text style={styles.desc}>Description: {props.event.desc}</Text>
        </View>
        <View>
          <Text style={styles.info}>
            {moment(props.event.posteddate).fromNow()}
          </Text>
          <img src={props.event.img} alt="" />
        </View>
        <View>
          <Text style={styles.info}>Share</Text>
        </View>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "flex-end", margin: 10 }}
      >
        <TouchableOpacity>
          <Ionicons style={styles.image} name="pencil" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons style={styles.image} onPress={handleDelete} name="trash" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "auto",
    borderColor: "lightgray",
    borderWidth: 1,
    borderRadius: 5,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    backgroundColor: "#292929",
    flexDirection: "row",
    shadowColor: "gray",
    margin: 10,
  },
  placeinfo: {
    width: "20%",
    borderRightColor: "gray",
    borderRightWidth: 1,
    marginTop: 5,
    marginBottom: 5,
  },
  title: { fontSize: 20, color: "white", margin: 5, padding: 3 },
  desc: { fontSize: 16, color: "white", margin: 5, padding: 3 },
  info: {
    color: "white",
    margin: 5,
    padding: 3,
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

export default Post;
