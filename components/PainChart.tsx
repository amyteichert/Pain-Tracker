import React from "react";
import { View, Dimensions } from "react-native";
import Svg, { Polyline, Circle } from "react-native-svg";

type Entry = {
  value: number;
  timestamp: number;
};

const { width } = Dimensions.get("window");

export default function PainChart({ data }: { data: Entry[] }) {
  if (!data || data.length < 2) return null;

  const chartWidth = width - 32;
  const chartHeight = 120;
  const max = 10;

  const lastData = data.slice(-10);

  const points = lastData.map((d, i) => {
    const x = (i / (lastData.length - 1)) * chartWidth;
    const y = chartHeight - (d.value / max) * chartHeight;
    return { x, y };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <View
      style={{
        backgroundColor: "#0E1630",
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
      }}
    >
      <Svg height={chartHeight} width={chartWidth}>
        <Polyline
          points={polylinePoints}
          fill="none"
          stroke="#5B8CFF"
          strokeWidth={2}
        />

        {points.map((p, i) => (
          <Circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3}
            fill={
              lastData[i].value <= 3
                ? "#4ade80"
                : lastData[i].value <= 6
                ? "#facc15"
                : "#f87171"
            }
          />
        ))}
      </Svg>
    </View>
  );
}