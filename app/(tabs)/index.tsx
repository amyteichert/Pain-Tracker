import React, { useState, useEffect } from "react";
import {
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  TextInput,
  SafeAreaView,
} from "react-native";
import PainChart from "@/components/PainChart";
import { savePain, loadPain } from "@/utils/pain-storage";

const painLevels = [
  "Kein Schmerz – Körper fühlt sich komplett normal an.",
  "Sehr leicht – kaum wahrnehmbar, nur wenn du dich darauf konzentrierst.",
  "Leicht – da, aber du kannst es gut ignorieren.",
  "Leicht bis merkbar – taucht kurz ins Bewusstsein auf.",
  "Deutlich spürbar – lenkt manchmal ab.",
  "Mittlerer Schmerz – dauerhaft präsent, aber noch kontrollierbar.",
  "Mittlerer bis starker Schmerz – beginnt dich im Alltag zu stören.",
  "Stark – beeinflusst Bewegung oder Konzentration deutlich.",
  "Sehr stark – dominiert dein Körpergefühl.",
  "Extrem – kaum auszublenden, sehr belastend.",
  "Extrem – kaum auszublenden, sehr belastend.",
];

const typesList = ["stechend", "ziehend", "dumpf", "krampfend"];
const triggerList = ["Stress", "Bewegung", "Essen", "Ruhe", "Schlaf", "Sonstiges"];

export default function Home() {
  const [modal, setModal] = useState<string | null>(null);
  const [pain, setPain] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [medName, setMedName] = useState<string>("");
  const [medMg, setMedMg] = useState<string>("");

  useEffect(() => {
    // Load pain history on mount
    const loadHistory = async () => {
      const data = await loadPain();
      setHistory(data);
    };
    loadHistory();
  }, []);

  const toggle = (value: string, list: string[], setList: any) => {
    setList(
      list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value]
    );
  };

  const Card = ({ title, onPress }: any) => (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );

  const SaveButton = () => (
    <TouchableOpacity style={styles.save}>
      <Text style={{ color: "#fff", fontWeight: "600" }}>Speichern</Text>
    </TouchableOpacity>
  );

  const Header = ({ title }: any) => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => setModal(null)}
        style={styles.backBtn}
        activeOpacity={0.7}
      >
        <Text style={styles.backText}>← Zurück</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>

      <View style={{ width: 90 }} />
    </View>
  );

  const save = async () => {
    if (pain === null) return;

    const newEntry = {
      value: pain,
      timestamp: Date.now(),
      types,
      triggers,
      medName,
      medMg,
    };

    const updated = [...history, newEntry];
    setHistory(updated);
    await savePain(updated);
    setModal(null);
    setPain(null);
    setMedName("");
    setMedMg("");
    console.log("GESPEICHERT:", newEntry);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* DASHBOARD */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.gridContainer}>
          <Card title="Schmerz" onPress={() => setModal("pain")} />
          <Card title="Schmerzart" onPress={() => setModal("type")} />
          <Card title="Trigger" onPress={() => setModal("trigger")} />
          <Card title="Medikamente" onPress={() => setModal("med")} />
          <Card title="Verlauf" onPress={() => setModal("history")} />
          <Card title="KI Analyse" onPress={() => setModal("ai")} />
        </View>
      </ScrollView>

      {/* MODAL */}
      <Modal visible={modal !== null} animationType="slide">
        <SafeAreaView style={styles.modal}>
          <Header
            title={
              modal === "pain"
                ? "Schmerz"
                : modal === "type"
                ? "Schmerzart"
                : modal === "trigger"
                ? "Trigger"
                : modal === "history"
                ? "Verlauf"
                : modal === "ai"
                ? "KI Analyse"
                : "Medikamente"
            }
          />

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {/* VERLAUF */}
            {modal === "history" && (
              <View style={styles.section}>
                <PainChart data={history} />

                {history.length === 0 && (
                  <Text style={{ color: "#9AA8C7" }}>Noch keine Einträge</Text>
                )}

                <View style={{ marginTop: 10 }}>
                  {history
                    .slice()
                    .reverse()
                    .map((entry, index) => {
                      const date = new Date(entry.timestamp);

                      return (
                        <View key={index} style={styles.timelineItem}>
                          <View style={styles.timelineContent}>
                            <Text
                              style={{
                                color: "#fff",
                                fontWeight: "700",
                                fontSize: 16,
                              }}
                            >
                              Schmerz: {entry.value}/10
                            </Text>

                            {entry.types?.length > 0 && (
                              <Text
                                style={{
                                  color: "#9AA8C7",
                                  fontSize: 12,
                                }}
                              >
                                Typ: {entry.types.join(", ")}
                              </Text>
                            )}

                            {entry.triggers?.length > 0 && (
                              <Text
                                style={{
                                  color: "#9AA8C7",
                                  fontSize: 12,
                                }}
                              >
                                Trigger: {entry.triggers.join(", ")}
                              </Text>
                            )}

                            {entry.medName && (
                              <Text
                                style={{
                                  color: "#9AA8C7",
                                  fontSize: 12,
                                }}
                              >
                                Medikament: {entry.medName}{" "}
                                {entry.medMg ? `${entry.medMg}mg` : ""}
                              </Text>
                            )}

                            <Text
                              style={{
                                color: "#666",
                                fontSize: 11,
                                marginTop: 4,
                              }}
                            >
                              {date.toLocaleDateString()} •{" "}
                              {date.toLocaleTimeString().slice(0, 5)}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                </View>
              </View>
            )}

            {/* PAIN */}
            {modal === "pain" && (
              <View style={styles.section}>
                <View style={styles.painColumn}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => setPain(i)}
                      style={[styles.painRow, pain === i && styles.active]}
                    >
                      <Text style={styles.painText}>
                        {i} / 10 – {painLevels[i]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {pain !== null && (
                  <View style={styles.descBox}>
                    <Text style={styles.descText}>{painLevels[pain]}</Text>
                  </View>
                )}

                <TouchableOpacity style={styles.save} onPress={save}>
                  <Text style={{ color: "#fff", fontWeight: "600" }}>
                    Speichern
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* TYPE */}
            {modal === "type" && (
              <View style={styles.section}>
                <View style={styles.gridWrap}>
                  {typesList.map((t) => (
                    <TouchableOpacity
                      key={t}
                      onPress={() => toggle(t, types, setTypes)}
                      style={[styles.chip, types.includes(t) && styles.active]}
                    >
                      <Text style={{ color: "#fff" }}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <SaveButton />
              </View>
            )}

            {/* TRIGGER */}
            {modal === "trigger" && (
              <View style={styles.section}>
                <View style={styles.gridWrap}>
                  {triggerList.map((t) => (
                    <TouchableOpacity
                      key={t}
                      onPress={() => toggle(t, triggers, setTriggers)}
                      style={[
                        styles.chip,
                        triggers.includes(t) && styles.active,
                      ]}
                    >
                      <Text style={{ color: "#fff" }}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <SaveButton />
              </View>
            )}

            {/* MED */}
            {modal === "med" && (
              <View style={{ padding: 16 }}>
                <TextInput
                  placeholder="Medikament"
                  placeholderTextColor="#666"
                  value={medName}
                  onChangeText={setMedName}
                  style={styles.input}
                />

                <TextInput
                  placeholder="mg"
                  placeholderTextColor="#666"
                  value={medMg}
                  onChangeText={setMedMg}
                  keyboardType="numeric"
                  style={styles.input}
                />

                <TouchableOpacity style={styles.save} onPress={save}>
                  <Text style={{ color: "#fff", fontWeight: "600" }}>
                    Speichern
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050713",
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  backBtn: {
    padding: 8,
  },

  backText: {
    color: "#5B8CFF",
    fontSize: 16,
    fontWeight: "600",
  },

  headerTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    marginVertical: 10,
  },

  headerSub: {
    color: "white",
    opacity: 0.8,
    marginTop: 6,
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    marginBottom: 16,
    backgroundColor: "#111827",
    padding: 20,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#5B8CFF",
  },

  cardText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },

  modal: {
    flex: 1,
    backgroundColor: "#050713",
  },

  section: {
    padding: 16,
  },

  painColumn: {
    marginBottom: 20,
  },

  painRow: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#0E1630",
    borderRadius: 12,
  },

  painText: {
    color: "#fff",
  },

  descBox: {
    backgroundColor: "#0E1630",
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },

  descText: {
    color: "#9AA8C7",
    fontSize: 14,
    lineHeight: 20,
  },

  active: {
    backgroundColor: "#5B8CFF",
  },

  save: {
    marginTop: 20,
    backgroundColor: "#5B8CFF",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  entry: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#0E1630",
    borderRadius: 12,
  },

  timelineItem: {
    marginBottom: 16,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: "#5B8CFF",
  },

  timelineContent: {
    backgroundColor: "#0E1630",
    padding: 12,
    borderRadius: 8,
  },

  gridWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#0E1630",
    borderRadius: 20,
  },

  input: {
    backgroundColor: "#0E1630",
    color: "white",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
});