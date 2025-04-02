import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";
const git = simpleGit();

const writeAndCommit = async (date) => {
  const data = { date };

  return new Promise((resolve, reject) => {
    jsonfile.writeFile(path, data, async (err) => {
      if (err) return reject(err);
      try {
        await git.add([path]);
        await git.commit(date, undefined, { "--date": date });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });
};

const makeCommits = async (n) => {
  for (let i = 0; i < n; i++) {
    const daysAgo = random.int(0, 6); // only the last 7 days
    const date = moment()
      .subtract(daysAgo, "days")
      .hour(random.int(9, 17))
      .minute(random.int(0, 59))
      .second(random.int(0, 59))
      .format();

    console.log(`Creating commit with date: ${date}`);

    try {
      await writeAndCommit(date);
    } catch (err) {
      console.error("❌ Commit failed:", err);
      break;
    }
  }

  console.log("✅ Done creating commits. You can now run `git push` manually if you want.");
};

makeCommits(10);
