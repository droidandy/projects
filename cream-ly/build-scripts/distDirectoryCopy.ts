import copyfiles from "copyfiles";
import path from "path";

const copyFilesToDist = () => {
  const srcDirectory = "./src/";
  const distDirectory = path.resolve(__dirname, "../dist");

  const copy = (subDir, ext = "*.liquid", extraProps = {}, distDir = null) => {
    const paths = [
      `${srcDirectory}/${subDir}/${ext}`,
      `${distDirectory}/${distDir ? distDir : subDir}`,
    ];

    copyfiles(
      paths,
      { verbose: true, all: true, flat: true, up: true, ...extraProps },
      () => {
        console.log("copy is finished for " + subDir);
      }
    );
  };

  [
    "layout",
    "templates",
    "templates/customers",
    "sections",
    "snippets",
  ].forEach((dir) => copy(dir, "*.liquid"));
  ["assets", "config", "locales"].forEach((dir) => copy(dir, "*"));
  ["assets/svg"].forEach((dir) => copy(dir, "*", {}, "assets"));
};

copyFilesToDist();
