import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});
export async function geocodeAddress(address) {
  try {
    const response = await client.geocode({
      params: {
        address: address,
        key: process.env.API_KEY,
      },
    });

    if (response.data.status != "OK") {
      throw new Error("Geocoding failed");
    }
    return response.data.results[0];
  } catch (error) {
    console.error("Error during geocoding:", error);
    throw new Error("Geocoding failed");
  }
}
