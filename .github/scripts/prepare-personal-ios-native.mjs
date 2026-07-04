import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"

const rootDir = process.cwd()
const mobileDir = resolve(rootDir, "apps/mobile")
const packagePath = join(mobileDir, "package.json")
const packageJson = JSON.parse(readFileSync(packagePath, "utf8"))

const removedPackages = ["expo-updates"]
const dependencySections = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
]

let packageChanged = false

for (const section of dependencySections) {
  const dependencies = packageJson[section]

  if (!dependencies || typeof dependencies !== "object") {
    continue
  }

  for (const packageName of removedPackages) {
    if (packageName in dependencies) {
      delete dependencies[packageName]
      packageChanged = true
      console.log(`Removed ${packageName} from apps/mobile/package.json ${section}.`)
    }
  }
}

if (packageChanged) {
  writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`)
}

const removePath = (path) => {
  if (!existsSync(path)) {
    return
  }

  rmSync(path, { recursive: true, force: true })
  console.log(`Removed ${path}`)
}

for (const packageName of removedPackages) {
  removePath(join(mobileDir, "node_modules", packageName))
  removePath(join(rootDir, "node_modules", packageName))

  const pnpmDir = join(rootDir, "node_modules/.pnpm")
  if (!existsSync(pnpmDir)) {
    continue
  }

  for (const entry of readdirSync(pnpmDir)) {
    if (entry.startsWith(`${packageName}@`)) {
      removePath(join(pnpmDir, entry))
    }
  }
}
