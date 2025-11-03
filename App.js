import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";

export default function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Izin lokasi ditolak 😢");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const apiKey = "YOUR_API"; // ganti dengan API key kamu
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=id`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        setErrorMsg("Gagal mengambil data cuaca 😭");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.text}>Mengambil data cuaca...</Text>
      </SafeAreaView>
    );
  }

  if (errorMsg) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>{errorMsg}</Text>
      </SafeAreaView>
    );
  }

  const weatherDesc = weather?.weather?.[0]?.main?.toLowerCase();
  const lottieSource =
    weatherDesc?.includes("rain")
      ? require("./assets/rain.json")
      : weatherDesc?.includes("cloud")
      ? require("./assets/cloudy.json")
      : require("./assets/sunny.json");

  return (
    <SafeAreaView style={styles.container}>
      <LottieView
        source={lottieSource}
        autoPlay
        loop
        style={{ width: 180, height: 180 }}
      />
      <Text style={styles.city}>{weather?.name}</Text>
      <Text style={styles.temp}>{weather?.main?.temp}°C</Text>
      <Text style={styles.desc}>{weather?.weather?.[0]?.description}</Text>
      <Text style={styles.range}>
        Maks: {weather?.main?.temp_max}°C | Min: {weather?.main?.temp_min}°C
      </Text>
      <Text style={styles.detail}>
        💨 Angin: {weather?.wind?.speed} m/s | 💧 Kelembapan:{" "}
        {weather?.main?.humidity}%
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d5f4ffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  city: {
    fontSize: 28,
    marginTop: 10,
  },
  temp: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#1E40AF",
  },
  desc: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#1E3A8A",
  },
  text: {
    marginTop: 20,
    fontSize: 16,
  },
  range: {
    fontSize: 16,
    marginTop: 5,
    color: "#1E3A8A",
  },
  detail: {
    fontSize: 16,
    marginTop: 3,
    color: "#1E40AF",
  },
});
