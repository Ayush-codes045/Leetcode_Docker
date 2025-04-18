import { PrismaClient, testCases } from "@prisma/client";
import { createClient } from "redis";
import fs from "fs";
import { exec } from "child_process";
const prisma = new PrismaClient();
const client = createClient({ url: process.env.REDIS_URL });

async function ExicuteCode(sub: any, lang: string, problemId: string) {
  if (lang === "cpp") {
    const { code, testCases } = sub;
    const inputDir = "";
    const outputDir = "";
    // Write the code to a file
    fs.writeFileSync("program.cpp", code);

    // Write test cases to input files
    for (let i = 0; i < testCases.length; i++) {
      const inputPath = `${inputDir}/input${i}.txt`;
      fs.writeFileSync(inputPath, testCases[i].input);
    }

    // Compile the C++ code
    exec("g++ -o program program.cpp", async (error, stdout, stderr) => {
      if (error) {
        console.error(`Compilation error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Compilation error: ${stderr}`);
        return;
      }

      // Execute the program for each test case
      for (let i = 0; i < testCases.length; i++) {
        const inputPath = `${inputDir}/input${i}.txt`;
        const outputPath = `${outputDir}/output${i}.txt`;
        exec(
          `./program < ${inputPath} > ${outputPath}`,
          async (error, stdout, stderr) => {
            if (error) {
              console.error(`Execution error: ${error.message}`);
              return;
            }
            if (stderr) {
              console.error(`Execution error: ${stderr}`);
              return;
            }

            // Read the expected output from the test case
            const expectedOutput = testCases[i].output;

            // Read the actual output from the output file
            const actualOutput = fs.readFileSync(outputPath, "utf8");

            // Compare the expected output with the actual output
            if (expectedOutput === actualOutput) {
              console.log(`Test case ${i + 1}: Passed`);
              await prisma.submission.update({
                where: {
                  id: sub.id,
                },
                data: {
                  testCases: {
                    update: {
                      where: {
                        id: testCases[i].id,
                      },
                      data: {
                        status: "ACCEPTED",
                      },
                    },
                  },
                },
              });
            } else {
              console.log(`Test case ${i + 1}: Failed`);
              await prisma.submission.update({
                where: {
                  id: sub.id,
                },
                data: {
                  testCases: {
                    update: {
                      where: {
                        id: testCases[i].id,
                      },
                      data: {
                        status: "REJECTED",
                      },
                    },
                  },
                },
              });
              console.log("Expected output:", expectedOutput);
              console.log("Actual output:", actualOutput);
            }

            if (i === testCases.length - 1) {
              const all = await prisma.testCases.findMany({
                where: {
                  submissionId: sub.id,
                },
              })
              const allPassed = all.every((testCase: testCases) => {
                console.log(testCase.status);
                return testCase.status === "ACCEPTED";
              });

              // Update the submission status based on the test case results
              await prisma.submission.update({
                where: {
                  id: sub.id,
                },
                data: {
                  status: allPassed ? "ACCEPTED" : "REJECTED",
                },
              });
            }
          }
        );
      }
    });
  } else {
    console.log("Unsupported language");
  }
}

(async () => {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
    console.log("Redis connected");
    while (true) {
      try {
        const submission: {
          key: string;
          element: string;
        } | null = await client.brPop("worker", 0);
        if (!submission) continue;
        const userId = submission.element.split("'")[0];
        const submissionId = submission.element.split("'")[1];
        const problemId = submission.element.split("'")[2];
        const sub = await prisma.submission.findUnique({
          where: {
            id: submissionId,
            userId: userId,
          },
          include: {
            testCases: {
              where: {
                submissionId:submissionId,
              },
            },
          },
        });
        if (!sub || !sub.language) {
          console.log("Submission not found");
          continue;
        }
        console.log("Submission found", sub.id, sub.language);
        await ExicuteCode(sub, sub.language, problemId);
        console.log("Submission processed");
      } catch (error) {
        console.log("Error on Submission", error);
      }
    }
  } catch (error) {
    console.log("Error in redis", error);
  }
})();
