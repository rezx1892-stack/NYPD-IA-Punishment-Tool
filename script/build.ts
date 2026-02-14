import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, writeFile } from "fs/promises";
import { join } from "path";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  // Fix SPA routing for GitHub Pages
  try {
    const indexPath = join("dist", "public", "index.html");
    const fourOhFourPath = join("dist", "public", "404.html");
    let indexContent = (await readFile(indexPath, "utf-8"));
    
    // Fix relative paths for GitHub Pages if not at root
    // This is a simple replacement for common assets
    indexContent = indexContent.replaceAll('src="/', 'src="./');
    indexContent = indexContent.replaceAll('href="/', 'href="./');
    
    await writeFile(fourOhFourPath, indexContent);
    await writeFile(indexPath, indexContent);
    console.log("created 404.html and fixed paths for SPA routing");
  } catch (err) {
    console.warn("Could not create 404.html:", err);
  }

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
