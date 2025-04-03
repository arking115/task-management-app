import axios from "axios";

export async function pingBackend(): Promise<string> {
  try {
    const response = await axios.get("http://localhost:5232/api/ping");
    return response.data;
  } catch (error) {
    console.error("Ping failed:", error);
    return "Error reaching backend";
  }
}
