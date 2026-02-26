import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import semver from "semver";
import prompts from "prompts";

const TAG_MAP = [[/^rc[0-9]+$/, "next"] as const];
const DEFAULT_TAG = "latest";

function $(cmd: string, options?: { quiet?: boolean }): void {
  try {
    execSync(cmd, { stdio: options?.quiet ? "ignore" : "inherit" });
  } catch (error) {
    if (!options?.quiet) {
      console.error(`Command failed: ${cmd}`);
      process.exit(1);
    }
    throw error;
  }
}

async function doesTagAlreadyExist(version: string) {
  try {
    $(`gh api -X GET /repos/{owner}/{repo}/git/ref/tags/v${version}`, {
      quiet: true,
    });
    return true;
  } catch {
    return false;
  }
}

function lint() {
  console.info("Linting...");
  $(`pnpm --filter astro-js-typesafe-routes run lint`);
}

function runTests() {
  console.info("Running tests...");
  $(`pnpm --filter astro-js-typesafe-routes run test`);
}

function build() {
  console.info("Building...");
  $(`pnpm --filter astro-js-typesafe-routes run build`);
}

function publishToNpm(tag: string) {
  // Using npm/pnpm authentication from the system
  $(
    `pnpm --filter astro-js-typesafe-routes publish --tag ${tag} --access public --no-git-checks`,
  );
}

function tagAndPush(version: string) {
  $(`git tag -a v${version} -m "Release version ${version}"`);
  $(`git push origin v${version}`);
}

function createRelease(version: string, isPreRelease: boolean) {
  $(
    `gh release create v${version} --generate-notes ${isPreRelease ? "--prerelease" : ""}`,
  );
}

function getVersionAndTag(version: string) {
  const parsedVersion = semver.valid(version);
  if (!parsedVersion) {
    throw new Error(`Invalid version: ${version}`);
  }
  const tag = version.split("-").at(1);
  if (tag === undefined) {
    return { version: parsedVersion, tag: DEFAULT_TAG };
  }
  const matching = TAG_MAP.find(([regex]) => regex.test(tag));
  if (matching === undefined) {
    throw new Error(`Invalid tag: ${tag}`);
  }
  return { version: parsedVersion, tag: matching[1] };
}

async function run() {
  const packageJsonPath = join(process.cwd(), "package", "package.json");
  const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

  // 1. Prompt for Version Bump
  const { releaseType } = await prompts({
    type: "select",
    name: "releaseType",
    message: `Current version is ${pkg.version}. How would you like to bump it?`,
    choices: [
      { title: `Patch (${semver.inc(pkg.version, "patch")})`, value: "patch" },
      { title: `Minor (${semver.inc(pkg.version, "minor")})`, value: "minor" },
      { title: `Major (${semver.inc(pkg.version, "major")})`, value: "major" },
      { title: "Skip bump (Keep current)", value: "skip" },
    ],
  });

  if (!releaseType) process.exit(1); // User cancelled

  if (releaseType !== "skip") {
    // Increment version
    const nextVersion = semver.inc(
      pkg.version,
      releaseType as semver.ReleaseType,
    );
    if (!nextVersion) throw new Error("Semver failed to increment");

    pkg.version = nextVersion;
    writeFileSync(
      packageJsonPath,
      JSON.stringify(pkg, null, 2) + "\n",
      "utf-8",
    );

    // Commit the version bump immediately so our tag represents the new version
    $(`git commit -a -m "chore: version bump to ${nextVersion}"`);
  }

  const { version, tag } = getVersionAndTag(pkg.version);

  const versionIsBusy = await doesTagAlreadyExist(version);
  if (versionIsBusy) {
    console.error(`Version "${version}" already exists natively on Github.`);
    process.exit(1);
  }

  const res = await prompts({
    type: "confirm",
    name: "value",
    message: `Publish ${pkg.name} version "v${version}" under npm tag "${tag}"?`,
    initial: false,
  });

  if (!res.value) {
    // If they cancel here, the version bump commit still happened, but we don't push/tag
    console.log("Release cancelled.");
    process.exit(1);
  }

  const isPreRelease = tag !== DEFAULT_TAG;

  lint();
  runTests();
  build();
  tagAndPush(version);
  publishToNpm(tag);
  createRelease(version, isPreRelease);

  console.log(`\n✅ Release v${version} successfully completed!`);
}

run().catch((err) => {
  console.error("Release script failed:", err);
  process.exit(1);
});
