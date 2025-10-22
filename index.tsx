import Post from "@/app/components/post";
import { request } from "@/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Near() {
  const [filter, setFilter] = useState(null);

  const {
    isLoading: NearMeLoading,
    error: NearMeError,
    data: NearMe,
  } = useQuery({
    queryKey: ["NearQuery", filter],
    queryFn: () =>
      request.get("/events/near?category=" + filter).then((res: any) => {
        return res.data;
      }),
  });

  return (
    <View style={styles.container}>
      {NearMeLoading ? (
        <Text>Loading</Text>
      ) : NearMeError ? (
        <Text>Error loading Data</Text>
      ) : (
        NearMe?.map((event: any) => <Post event={event} key={event.id} />)
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    padding: 5,
    backgroundColor: "#141414",
    alignItems: "center",
  },
});
