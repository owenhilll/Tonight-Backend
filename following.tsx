import { request } from "@/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Following() {
  const [filter, setFilter] = useState(null);
  const {
    isLoading: FollowingLoading,
    error: FollowingError,
    data: Following,
  } = useQuery({
    queryKey: ["FollowingQuery", filter],
    queryFn: () =>
      request.get("/events/following?category=" + filter).then((res: any) => {
        return res.data;
      }),
  });
  return (
    <View>
      {
        /* {FollowingLoading
          ? "Loading"
          : Following?.map((event: any) => (
              <Post event={event} key={event.id} />
              ))} */
        <Text>test</Text>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
