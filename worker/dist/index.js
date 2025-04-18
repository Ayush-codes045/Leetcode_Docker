"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const redis_1 = require("redis");
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const prisma = new client_1.PrismaClient();
const client = (0, redis_1.createClient)({ url: process.env.REDIS_URL });
function ExicuteCode(sub, lang, problemId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (lang === "cpp") {
            const { code, testCases } = sub;
            const inputDir = "";
            const outputDir = "";
            // Write the code to a file
            fs_1.default.writeFileSync("program.cpp", code);
            // Write test cases to input files
            for (let i = 0; i < testCases.length; i++) {
                const inputPath = `${inputDir}/input${i}.txt`;
                fs_1.default.writeFileSync(inputPath, testCases[i].input);
            }
            // Compile the C++ code
            (0, child_process_1.exec)("g++ -o program program.cpp", (error, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
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
                    (0, child_process_1.exec)(`./program < ${inputPath} > ${outputPath}`, (error, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
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
                        const actualOutput = fs_1.default.readFileSync(outputPath, "utf8");
                        // Compare the expected output with the actual output
                        if (expectedOutput === actualOutput) {
                            console.log(`Test case ${i + 1}: Passed`);
                            yield prisma.submission.update({
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
                        }
                        else {
                            console.log(`Test case ${i + 1}: Failed`);
                            yield prisma.submission.update({
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
                            const all = yield prisma.testCases.findMany({
                                where: {
                                    submissionId: sub.id,
                                },
                            });
                            const allPassed = all.every((testCase) => {
                                console.log(testCase.status);
                                return testCase.status === "ACCEPTED";
                            });
                            // Update the submission status based on the test case results
                            yield prisma.submission.update({
                                where: {
                                    id: sub.id,
                                },
                                data: {
                                    status: allPassed ? "ACCEPTED" : "REJECTED",
                                },
                            });
                        }
                    }));
                }
            }));
        }
        else {
            console.log("Unsupported language");
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!client.isOpen) {
            yield client.connect();
        }
        console.log("Redis connected");
        while (true) {
            try {
                const submission = yield client.brPop("worker", 0);
                if (!submission)
                    continue;
                const userId = submission.element.split("'")[0];
                const submissionId = submission.element.split("'")[1];
                const problemId = submission.element.split("'")[2];
                const sub = yield prisma.submission.findUnique({
                    where: {
                        id: submissionId,
                        userId: userId,
                    },
                    include: {
                        testCases: {
                            where: {
                                submissionId: submissionId,
                            },
                        },
                    },
                });
                if (!sub || !sub.language) {
                    console.log("Submission not found");
                    continue;
                }
                console.log("Submission found", sub.id, sub.language);
                yield ExicuteCode(sub, sub.language, problemId);
                console.log("Submission processed");
            }
            catch (error) {
                console.log("Error on Submission", error);
            }
        }
    }
    catch (error) {
        console.log("Error in redis", error);
    }
}))();
