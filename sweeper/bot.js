import { exec } from "child_process";
import fs from "fs";
const workers = fs.readdirSync("./workers").filter(file => file.endsWith(".js"));
for (const worker of workers) {
  exec(`node ./workers/${worker}`, (err, stdout, stderr) => {
    if (err) console.error(`Worker ${worker} error:`, stderr);
    else console.log(`Worker ${worker} started.`);
  });
}
