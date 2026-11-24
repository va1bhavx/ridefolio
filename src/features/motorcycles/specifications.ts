import type { Motorcycle } from "@/types/models"
export const numericSpecs: {
  key: "displacement" | "power" | "torque" | "weight" | "tank" | "seat"
  label: string
  unit: string
  explanation: string
}[] = [
  {
    key: "displacement",
    label: "Engine capacity",
    unit: "cc",
    explanation:
      "The volume swept by the pistons. Capacity alone does not determine performance.",
  },
  {
    key: "power",
    label: "Peak power",
    unit: "bhp",
    explanation:
      "The rate at which the engine can do work. Gearing and weight also influence acceleration.",
  },
  {
    key: "torque",
    label: "Peak torque",
    unit: "Nm",
    explanation:
      "Twisting force at the engine. Its delivery across engine speeds matters as much as the peak.",
  },
  {
    key: "weight",
    label: "Kerb weight",
    unit: "kg",
    explanation:
      "The motorcycle’s ready-to-ride weight. Lower weight may make manoeuvring easier; fit and balance matter too.",
  },
  {
    key: "tank",
    label: "Fuel tank",
    unit: "L",
    explanation:
      "Nominal fuel capacity. Actual range depends on usable fuel and real-world consumption.",
  },
  {
    key: "seat",
    label: "Seat height",
    unit: "mm",
    explanation:
      "Height from the ground. Seat width, suspension sag and rider proportions affect how easily you reach the ground.",
  },
]
export function specificationRows(bike: Motorcycle) {
  return [
    ...numericSpecs.map((s) => ({
      label: s.label,
      value: `${bike[s.key]} ${s.unit}`,
      explanation: s.explanation,
    })),
    ...[
      ["Engine", bike.engine],
      ["Cooling", bike.cooling],
      ["Transmission", bike.transmission],
      ["Suspension", bike.suspension],
      ["Brakes", bike.brakes],
      ["Tyres", bike.tyres],
      ["Dimensions", bike.dimensions],
    ].map(([label, value]) => ({
      label,
      value,
      explanation:
        "Demonstration baseline. Verify your exact year and variant with the manufacturer.",
    })),
  ]
}
