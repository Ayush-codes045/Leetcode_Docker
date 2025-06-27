import { PrismaClient, testCases } from "@prisma/client";
import { createClient } from "redis";
import fs from "fs";
import { exec } from "child_process";
const prisma = new PrismaClient();
const client = createClient({ url: process.env.REDIS_URL });

async function ExicuteCode(sub: any, lang: string, problemId: string) {
  lang = lang.trim().toLowerCase();
  console.log("LANG RECEIVED (after normalization):", lang);
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
      const execPromises = testCases.map((testCase: any, i: number): Promise<void> => {
        return new Promise((resolve) => {
          const inputPath = `${inputDir}/input${i}.txt`;
          const outputPath = `${outputDir}/output${i}.txt`;
          exec(
            `./program < ${inputPath} > ${outputPath}`,
            async (error, stdout, stderr) => {
              if (error) {
                console.error(`Execution error: ${error.message}`);
                resolve();
                return;
              }
              if (stderr) {
                console.error(`Execution error: ${stderr}`);
                resolve();
                return;
              }

              // Read the expected output from the test case
              const expectedOutput = testCases[i].output;

              // Read the actual output from the output file
              const actualOutput = fs.readFileSync(outputPath, "utf8");

              // Compare the expected output with the actual output
              const normalize = (str: string) => str.replace(/\r\n/g, '\n').trim();
              if (normalize(expectedOutput) === normalize(actualOutput)) {
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
              resolve();
            }
          );
        });
      });
      try {
        console.log('Waiting for all test case executions to finish...');
        await Promise.all(execPromises);
        console.log('All test case executions finished. Fetching test case statuses...');
        const all = await prisma.testCases.findMany({
          where: {
            submissionId: sub.id,
          },
        });
        console.log('Fetched test case statuses:', all.map(tc => tc.status));
        const allPassed = all.every((testCase: testCases) => {
          console.log(testCase.status);
          return testCase.status === "ACCEPTED";
        });

        // Update the submission status based on the test case results
        console.log('Updating submission status to', allPassed ? 'ACCEPTED' : 'REJECTED');
        await prisma.submission.update({
          where: {
            id: sub.id,
          },
          data: {
            status: allPassed ? "ACCEPTED" : "REJECTED",
          },
        });
        console.log("Submission status updated to", allPassed ? "ACCEPTED" : "REJECTED");
      } catch (err) {
        console.error('Error during final status update:', err);
      }
    });
  } else if (lang === "python") {
    const { code, testCases } = sub;
    const inputDir = "";
    const outputDir = "";
    // Write the code to a file
    fs.writeFileSync("program.py", code);

    // No compilation needed for Python

    // Execute the program for each test case
    const execPromises = testCases.map((testCase: any, i: number): Promise<void> => {
      return new Promise((resolve) => {
        const inputPath = `${inputDir}/input${i}.txt`;
        fs.writeFileSync(inputPath, testCases[i].input);
        const outputPath = `${outputDir}/output${i}.txt`;
        exec(
          `python3 program.py < ${inputPath} > ${outputPath}`,
          async (error, stdout, stderr) => {
            if (error) {
              console.error(`Execution error: ${error.message}`);
              resolve();
              return;
            }
            if (stderr) {
              console.error(`Execution error: ${stderr}`);
              resolve();
              return;
            }

            // Read the expected output from the test case
            const expectedOutput = testCases[i].output;

            // Read the actual output from the output file
            const actualOutput = fs.readFileSync(outputPath, "utf8");

            // Compare the expected output with the actual output
            const normalize = (str: string) => str.replace(/\r\n/g, '\n').trim();
            if (normalize(expectedOutput) === normalize(actualOutput)) {
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
            resolve();
          }
        );
      });
    });
    try {
      console.log('Waiting for all test case executions to finish...');
      await Promise.all(execPromises);
      console.log('All test case executions finished. Fetching test case statuses...');
      const all = await prisma.testCases.findMany({
        where: {
          submissionId: sub.id,
        },
      });
      console.log('Fetched test case statuses:', all.map(tc => tc.status));
      const allPassed = all.every((testCase: testCases) => {
        console.log(testCase.status);
        return testCase.status === "ACCEPTED";
      });

      // Update the submission status based on the test case results
      console.log('Updating submission status to', allPassed ? 'ACCEPTED' : 'REJECTED');
      await prisma.submission.update({
        where: {
          id: sub.id,
        },
        data: {
          status: allPassed ? "ACCEPTED" : "REJECTED",
        },
      });
      console.log("Submission status updated to", allPassed ? "ACCEPTED" : "REJECTED");
    } catch (err) {
      console.error('Error during final status update:', err);
    }
  } else if (lang === "javascript") {
    const { code, testCases } = sub;
    const inputDir = "";
    const outputDir = "";
    // Write the code to a file
    fs.writeFileSync("program.js", code);

    // No compilation needed for JavaScript

    // Execute the program for each test case
    const execPromises = testCases.map((testCase: any, i: number): Promise<void> => {
      return new Promise((resolve) => {
        const inputPath = `${inputDir}/input${i}.txt`;
        fs.writeFileSync(inputPath, testCases[i].input);
        const outputPath = `${outputDir}/output${i}.txt`;
        exec(
          `node program.js < ${inputPath} > ${outputPath}`,
          async (error, stdout, stderr) => {
            if (error) {
              console.error(`Execution error: ${error.message}`);
              resolve();
              return;
            }
            if (stderr) {
              console.error(`Execution error: ${stderr}`);
              resolve();
              return;
            }

            // Read the expected output from the test case
            const expectedOutput = testCases[i].output;

            // Read the actual output from the output file
            const actualOutput = fs.readFileSync(outputPath, "utf8");

            // Compare the expected output with the actual output
            const normalize = (str: string) => str.replace(/\r\n/g, '\n').trim();
            if (normalize(expectedOutput) === normalize(actualOutput)) {
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
            resolve();
          }
        );
      });
    });
    try {
      console.log('Waiting for all test case executions to finish...');
      await Promise.all(execPromises);
      console.log('All test case executions finished. Fetching test case statuses...');
      const all = await prisma.testCases.findMany({
        where: {
          submissionId: sub.id,
        },
      });
      console.log('Fetched test case statuses:', all.map(tc => tc.status));
      const allPassed = all.every((testCase: testCases) => {
        console.log(testCase.status);
        return testCase.status === "ACCEPTED";
      });

      // Update the submission status based on the test case results
      console.log('Updating submission status to', allPassed ? 'ACCEPTED' : 'REJECTED');
      await prisma.submission.update({
        where: {
          id: sub.id,
        },
        data: {
          status: allPassed ? "ACCEPTED" : "REJECTED",
        },
      });
      console.log("Submission status updated to", allPassed ? "ACCEPTED" : "REJECTED");
    } catch (err) {
      console.error('Error during final status update:', err);
    }
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