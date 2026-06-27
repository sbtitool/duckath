import { chmodSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const pnpmDir = join(process.cwd(), "node_modules", ".pnpm");
const directCandidates = [
  join(process.cwd(), "node_modules", "esbuild", "bin", "esbuild"),
];

function chmodExecutable(file) {
  try {
    if (!existsSync(file) || !statSync(file).isFile()) {
      return false;
    }

    chmodSync(file, 0o755);
    return true;
  } catch (error) {
    console.warn(`[prepare-hostinger-build] Could not chmod ${file}: ${error.message}`);
    return false;
  }
}

function collectEsbuildBinaries(root) {
  const binaries = [...directCandidates];

  if (!existsSync(root)) {
    return binaries;
  }

  for (const packageDir of readdirSync(root, { withFileTypes: true })) {
    if (!packageDir.isDirectory()) {
      continue;
    }

    const nestedModules = join(root, packageDir.name, "node_modules");
    binaries.push(join(nestedModules, "esbuild", "bin", "esbuild"));

    const esbuildScope = join(nestedModules, "@esbuild");
    if (!existsSync(esbuildScope)) {
      continue;
    }

    for (const platformDir of readdirSync(esbuildScope, { withFileTypes: true })) {
      if (platformDir.isDirectory()) {
        binaries.push(join(esbuildScope, platformDir.name, "bin", "esbuild"));
      }
    }
  }

  return binaries;
}

const fixed = new Set();

for (const binary of collectEsbuildBinaries(pnpmDir)) {
  if (chmodExecutable(binary)) {
    fixed.add(binary);
  }
}

if (fixed.size > 0) {
  console.log(`[prepare-hostinger-build] Ensured ${fixed.size} esbuild binary/binaries are executable.`);
}
