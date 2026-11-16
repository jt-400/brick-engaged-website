import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { structure } from "./structure";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID ?? "1hlznrcy";
const dataset = import.meta.env.VITE_SANITY_DATASET ?? "production";

export const sanityConfig = defineConfig({
  name: "brick-engaged",
  title: "Brick Engaged",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
