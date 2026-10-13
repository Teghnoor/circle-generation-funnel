import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ohne das wählt Next das Home-Verzeichnis als Workspace-Root, weil dort
  // ebenfalls eine package-lock.json liegt.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
