import { useState, PropsWithChildren } from "react";
import { StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";

import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { IconSymbol } from "./icon-symbol";

const Colors = {
  light: { icon: "#888" },
  dark: { icon: "#fff" }
};

export function Collapsible({
  children,
  title,
}: PropsWithChildren<{ title: string }>) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? "light";

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((prev) => !prev)}
        activeOpacity={0.8}
      >
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
          style={{
            transform: [{ rotate: isOpen ? "90deg" : "0deg" }],
          }}
        />

        <View style={{ marginLeft: 6 }}>
          <ThemedText type="defaultSemiBold">{title}</ThemedText>
        </View>
      </TouchableOpacity>

      {isOpen && (
        <ThemedView style={styles.content}>
          {children}
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});