import {
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { savePain, loadPain } from "../../utils/pain-storage";
import React, { useEffect, useState } from "react";
import PainChart from "@/components/PainChart";

type PainEntry = {
  value: number;
  timestamp: number;
  types?: string[];
  triggers?: string[];
  medName?: string;
  medMg?: string;
};

export default function Home() {
  const [modal, setModal] = useState<
    null | "pain" | "type" | "trigger" | "med" | "history" | "ai"
  >(null);

  const [pain, setPain] = useState<number | null>(null);
  const [history, setHistory] = useState<PainEntry[]>([]);

  const [types, setTypes] = useState<string[]>([]);
  const [triggers, setTriggers] = useState<string[]>([]);

  const [medName, setMedName] = useState("");
  const [medMg, setMedMg] = useState("");

  // 🎨 Schmerz → Farbe
  const getPainColor = (value: number) => {
    if (value <= 3) return "#4ade80"; // grün
    if (value <= 6) return "#facc15"; // gelb
    if (value <= 8) return "#fb923c"; // orange
    return "#ef4444"; // rot
  };

  useEffect(() => {
    const init = async () => {
      const stored = await loadPain();
      if (Array.isArray(stored)) {
        setHistory(stored);
      }
    };

    init();
  }, []);

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

   {/* DASHBOARD */}
<View style={styles.gridContainer}>

  <Card title="Schmerz" onPress={() => setModal("pain")} />
  <Card title="Schmerzart" onPress={() => setModal("type")} />
  <Card title="Trigger" onPress={() => setModal("trigger")} />
  <Card title="Medikamente" onPress={() => setModal("med")} />
  <Card title="Verlauf" onPress={() => setModal("history")} />
  <Card title="KI Analyse" onPress={() => setModal("ai")} />

</View>

      {/* MODAL */}
      <Modal visible={modal !== null} animationType="slide">
        <SafeAreaView style={styles.modal} edges={["top", "left", "right"]}>
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
      <Text style={{ color: "#9AA8C7" }}>
        Noch keine Einträge
      </Text>
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

                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                  Schmerz: {entry.value}/10
                </Text>

               {entry.types && entry.types.length > 0 && (
  <Text style={{ color: "#9AA8C7", fontSize: 12 }}>
    Typ: {entry.types.join(", ")}
  </Text>
)}

              {entry.triggers && entry.triggers.length > 0 && (
  <Text style={{ color: "#9AA8C7", fontSize: 12 }}>
    Trigger: {entry.triggers.join(", ")}
  </Text>
)}

                {entry.medName && (
                  <Text style={{ color: "#9AA8C7", fontSize: 12 }}>
                    Medikament: {entry.medName} {entry.medMg ? `${entry.medMg}mg` : ""}
                  </Text>
                )}

                <Text style={{ color: "#666", fontSize: 11, marginTop: 4 }}>
                  {date.toLocaleDateString()} • {date.toLocaleTimeString().slice(0, 5)}
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

    {/* LISTE 0 → 10 */}
    <View style={styles.painColumn}>
      {[0,1,2,3,4,5,6,7,8,9,10].map((i) => (
        <TouchableOpacity
          key={i}
          onPress={() => setPain(i)}
          style={[
            styles.painRow,
            pain === i && styles.active,
          ]}
        >
          <Text style={styles.painText}>
            {i} / 10 – {painLevels[i]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    {/* AUSGEWÄHLTE BESCHREIBUNG */}
    {pain !== null && (
      <View style={styles.descBox}>
        <Text style={styles.descText}>
          {painLevels[pain]}
        </Text>
      </View>
    )}

    {/* SPEICHERN BUTTON (WICHTIG: AUSSERHALB DER MAP) */}
   <TouchableOpacity
  style={styles.save}
  onPress={async () => {
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

    console.log("GESPEICHERT:", newEntry);
  }}
>
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
                      style={[
                        styles.chip,
                        types.includes(t) && styles.active,
                      ]}
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

            {/* MEDS */}
            {modal === "med" && (
              <View style={styles.section}>
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

                <SaveButton />
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
  flexDirection: "row",
  flexWrap: "wrap",
  padding: 10,
},

row: {
  flexDirection: "row",
},

gridContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  paddingHorizontal: 10,
  marginTop: 20,
},


card: {
  width: "45%", 
  minHeight: 150,
  marginVertical: 8,
  borderRadius: 20,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#0f1c3f",
},

  cardText: {
  fontSize: 18,
  color: "white",
  fontWeight: "600",
},

 modal: {
  flex: 1,
  backgroundColor: "#050713",
},

 header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 16,
  paddingTop: Platform.OS === "ios" ? 10 : 20,
  paddingBottom: 10,
},

backBtn: {
  paddingVertical: 12,
  paddingHorizontal: 16,
  backgroundColor: "#0E1630",
  borderRadius: 14,
  minWidth: 100,
  alignItems: "center",
  justifyContent: "center",

  // sorgt dafür dass er NICHT zu nah an der Uhr ist
  marginTop: 6,
},

  backText: {
    color: "#9AA8C7",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  section: {
    padding: 16,
  },

  gridWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  bubble: {
    width: 45,
    height: 42,
    borderRadius: 21,
    margin: 6,
    backgroundColor: "#0E1630",
    justifyContent: "center",
    alignItems: "center",
  },

  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    margin: 6,
    backgroundColor: "#0E1630",
  },

  active: {
    backgroundColor: "#5B8CFF",
  },

  desc: {
    color: "#9AA8C7",
    marginTop: 12,
  },

  input: {
    backgroundColor: "#0E1630",
    color: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  save: {
    marginTop: 18,
    backgroundColor: "#5B8CFF",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  painColumn: {
  marginTop: 10,
},

painRow: {
  backgroundColor: "#0E1630",
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderRadius: 14,
  marginBottom: 8,
},

painText: {
  color: "#fff",
  fontSize: 13,
},

descBox: {
  marginTop: 10,
  padding: 12,
  backgroundColor: "#0E1630",
  borderRadius: 12,
},

descText: {
  color: "#9AA8C7",
  fontSize: 13,
},

timelineItem: {
  marginBottom: 12,
},

timelineLeft: {
  width: 45,
  alignItems: "center",
},

dot: {
  width: 10,
  height: 10,
  borderRadius: 5,
},

line: {
  width: 2,
  flex: 1,
  backgroundColor: "#1f2a44",
  marginTop: 2,
},

timelineContent: {
  flex: 1,
  marginLeft: 10,
  padding: 14,
  backgroundColor: "#0E1630",
  borderRadius: 14,
  borderWidth: 1,
  borderColor: "rgba(91,140,255,0.15)",
},
});