import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./keys";

type PainEntry = {
  value: number;
  timestamp: number;
};

const getTrend = (history: PainEntry[]) => {
  if (history.length < 2) return "neutral";

  const last = history[history.length - 1].value;
  const prev = history[history.length - 2].value;

  if (last > prev) return "up";
  if (last < prev) return "down";
  return "neutral";
};

// speichern
export const savePain = async (data: PainEntry[]) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.PAIN,
      JSON.stringify(data)
    );
  } catch (e) {
    console.log("SAVE ERROR", e);
  }
};

// laden
export const loadPain = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.PAIN);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.log("LOAD ERROR", e);
    return [];
  }
};