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
        lang = lang.trim().toLowerCase();
        console.log("LANG RECEIVED (after normalization):", lang);
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
                if (error || stderr) {
                    console.error(`Compilation error: ${(error === null || error === void 0 ? void 0 : error.message) || stderr}`);
                    yield prisma.submission.update({
                        where: { id: sub.id },
                        data: { status: "REJECTED" },
                    });
                    return;
                }
                // Execute the program for each test case
                const execPromises = testCases.map((testCase, i) => {
                    return new Promise((resolve) => {
                        const inputPath = `${inputDir}/input${i}.txt`;
                        const outputPath = `${outputDir}/output${i}.txt`;
                        (0, child_process_1.exec)(`./program < ${inputPath} > ${outputPath}`, (error, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
                            if (error || stderr) {
                                console.error(`Execution error: ${(error === null || error === void 0 ? void 0 : error.message) || stderr}`);
                                yield prisma.submission.update({
                                    where: { id: sub.id },
                                    data: { status: "REJECTED" },
                                });
                                resolve();
                                return;
                            }
                            // Read the expected output from the test case
                            const expectedOutput = testCases[i].output;
                            // Read the actual output from the output file
                            const actualOutput = fs_1.default.readFileSync(outputPath, "utf8");
                            // Compare the expected output with the actual output
                            const normalize = (str) => str.replace(/\r\n/g, '\n').trim();
                            if (normalize(expectedOutput) === normalize(actualOutput)) {
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
                                yield prisma.submission.update({
                                    where: { id: sub.id },
                                    data: { status: "REJECTED" },
                                });
                                console.log("Expected output:", expectedOutput);
                                console.log("Actual output:", actualOutput);
                            }
                            resolve();
                        }));
                    });
                });
                try {
                    console.log('Waiting for all test case executions to finish...');
                    yield Promise.all(execPromises);
                    console.log('All test case executions finished. Fetching test case statuses...');
                    const all = yield prisma.testCases.findMany({
                        where: {
                            submissionId: sub.id,
                        },
                    });
                    console.log('Fetched test case statuses:', all.map(tc => tc.status));
                    const allPassed = all.every((testCase) => {
                        console.log(testCase.status);
                        return testCase.status === "ACCEPTED";
                    });
                    // Update the submission status based on the test case results
                    console.log('Updating submission status to', allPassed ? 'ACCEPTED' : 'REJECTED');
                    yield prisma.submission.update({
                        where: {
                            id: sub.id,
                        },
                        data: {
                            status: allPassed ? "ACCEPTED" : "REJECTED",
                        },
                    });
                    console.log("Submission status updated to", allPassed ? "ACCEPTED" : "REJECTED");
                }
                catch (err) {
                    console.error('Error during final status update:', err);
                }
            }));
        }
        else if (lang === "python") {
            const { code, testCases } = sub;
            const inputDir = "";
            const outputDir = "";
            // Write the code to a file
            fs_1.default.writeFileSync("program.py", code);
            // No compilation needed for Python
            // Execute the program for each test case
            const execPromises = testCases.map((testCase, i) => {
                return new Promise((resolve) => {
                    const inputPath = `${inputDir}/input${i}.txt`;
                    fs_1.default.writeFileSync(inputPath, testCases[i].input);
                    const outputPath = `${outputDir}/output${i}.txt`;
                    (0, child_process_1.exec)(`python3 program.py < ${inputPath} > ${outputPath}`, (error, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
                        if (error || stderr) {
                            console.error(`Execution error: ${(error === null || error === void 0 ? void 0 : error.message) || stderr}`);
                            yield prisma.submission.update({
                                where: { id: sub.id },
                                data: { status: "REJECTED" },
                            });
                            resolve();
                            return;
                        }
                        // Read the expected output from the test case
                        const expectedOutput = testCases[i].output;
                        // Read the actual output from the output file
                        const actualOutput = fs_1.default.readFileSync(outputPath, "utf8");
                        // Compare the expected output with the actual output
                        const normalize = (str) => str.replace(/\r\n/g, '\n').trim();
                        if (normalize(expectedOutput) === normalize(actualOutput)) {
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
                            yield prisma.submission.update({
                                where: { id: sub.id },
                                data: { status: "REJECTED" },
                            });
                            console.log("Expected output:", expectedOutput);
                            console.log("Actual output:", actualOutput);
                        }
                        resolve();
                    }));
                });
            });
            try {
                console.log('Waiting for all test case executions to finish...');
                yield Promise.all(execPromises);
                console.log('All test case executions finished. Fetching test case statuses...');
                const all = yield prisma.testCases.findMany({
                    where: {
                        submissionId: sub.id,
                    },
                });
                console.log('Fetched test case statuses:', all.map(tc => tc.status));
                const allPassed = all.every((testCase) => {
                    console.log(testCase.status);
                    return testCase.status === "ACCEPTED";
                });
                // Update the submission status based on the test case results
                console.log('Updating submission status to', allPassed ? 'ACCEPTED' : 'REJECTED');
                yield prisma.submission.update({
                    where: {
                        id: sub.id,
                    },
                    data: {
                        status: allPassed ? "ACCEPTED" : "REJECTED",
                    },
                });
                console.log("Submission status updated to", allPassed ? "ACCEPTED" : "REJECTED");
            }
            catch (err) {
                console.error('Error during final status update:', err);
            }
        }
        else if (lang === "javascript") {
            const { code, testCases } = sub;
            const inputDir = "";
            const outputDir = "";
            // Write the code to a file
            fs_1.default.writeFileSync("program.js", code);
            // No compilation needed for JavaScript
            // Execute the program for each test case
            const execPromises = testCases.map((testCase, i) => {
                return new Promise((resolve) => {
                    const inputPath = `${inputDir}/input${i}.txt`;
                    fs_1.default.writeFileSync(inputPath, testCases[i].input);
                    const outputPath = `${outputDir}/output${i}.txt`;
                    (0, child_process_1.exec)(`node program.js < ${inputPath} > ${outputPath}`, (error, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
                        if (error || stderr) {
                            console.error(`Execution error: ${(error === null || error === void 0 ? void 0 : error.message) || stderr}`);
                            yield prisma.submission.update({
                                where: { id: sub.id },
                                data: { status: "REJECTED" },
                            });
                            resolve();
                            return;
                        }
                        // Read the expected output from the test case
                        const expectedOutput = testCases[i].output;
                        // Read the actual output from the output file
                        const actualOutput = fs_1.default.readFileSync(outputPath, "utf8");
                        // Compare the expected output with the actual output
                        const normalize = (str) => str.replace(/\r\n/g, '\n').trim();
                        if (normalize(expectedOutput) === normalize(actualOutput)) {
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
                            yield prisma.submission.update({
                                where: { id: sub.id },
                                data: { status: "REJECTED" },
                            });
                            console.log("Expected output:", expectedOutput);
                            console.log("Actual output:", actualOutput);
                        }
                        resolve();
                    }));
                });
            });
            try {
                console.log('Waiting for all test case executions to finish...');
                yield Promise.all(execPromises);
                console.log('All test case executions finished. Fetching test case statuses...');
                const all = yield prisma.testCases.findMany({
                    where: {
                        submissionId: sub.id,
                    },
                });
                console.log('Fetched test case statuses:', all.map(tc => tc.status));
                const allPassed = all.every((testCase) => {
                    console.log(testCase.status);
                    return testCase.status === "ACCEPTED";
                });
                // Update the submission status based on the test case results
                console.log('Updating submission status to', allPassed ? 'ACCEPTED' : 'REJECTED');
                yield prisma.submission.update({
                    where: {
                        id: sub.id,
                    },
                    data: {
                        status: allPassed ? "ACCEPTED" : "REJECTED",
                    },
                });
                console.log("Submission status updated to", allPassed ? "ACCEPTED" : "REJECTED");
            }
            catch (err) {
                console.error('Error during final status update:', err);
            }
        }
        else if (lang === "java") {
            const { code, testCases } = sub;
            const inputDir = "";
            const outputDir = "";
            fs_1.default.writeFileSync("Main.java", code);
            (0, child_process_1.exec)("javac Main.java", (error, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
                if (error || stderr) {
                    console.error(`Compilation error: ${(error === null || error === void 0 ? void 0 : error.message) || stderr}`);
                    yield prisma.submission.update({
                        where: { id: sub.id },
                        data: { status: "REJECTED" },
                    });
                    return;
                }
                const execPromises = testCases.map((testCase, i) => {
                    return new Promise((resolve) => {
                        const inputPath = `${inputDir}/input${i}.txt`;
                        const outputPath = `${outputDir}/output${i}.txt`;
                        fs_1.default.writeFileSync(inputPath, testCases[i].input);
                        (0, child_process_1.exec)(`java Main < ${inputPath} > ${outputPath}`, (error, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
                            if (error || stderr) {
                                console.error(`Execution error: ${(error === null || error === void 0 ? void 0 : error.message) || stderr}`);
                                yield prisma.submission.update({
                                    where: { id: sub.id },
                                    data: { status: "REJECTED" },
                                });
                                resolve();
                                return;
                            }
                            const expectedOutput = testCases[i].output;
                            const actualOutput = fs_1.default.readFileSync(outputPath, "utf8");
                            const normalize = (str) => str.replace(/\r\n/g, '\n').trim();
                            if (normalize(expectedOutput) === normalize(actualOutput)) {
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
                                yield prisma.submission.update({
                                    where: { id: sub.id },
                                    data: { status: "REJECTED" },
                                });
                                console.log("Expected output:", expectedOutput);
                                console.log("Actual output:", actualOutput);
                            }
                            resolve();
                        }));
                    });
                });
                try {
                    console.log('Waiting for all test case executions to finish...');
                    yield Promise.all(execPromises);
                    console.log('All test case executions finished. Fetching test case statuses...');
                    const all = yield prisma.testCases.findMany({
                        where: {
                            submissionId: sub.id,
                        },
                    });
                    console.log('Fetched test case statuses:', all.map(tc => tc.status));
                    const allPassed = all.every((testCase) => {
                        console.log(testCase.status);
                        return testCase.status === "ACCEPTED";
                    });
                    console.log('Updating submission status to', allPassed ? 'ACCEPTED' : 'REJECTED');
                    yield prisma.submission.update({
                        where: {
                            id: sub.id,
                        },
                        data: {
                            status: allPassed ? "ACCEPTED" : "REJECTED",
                        },
                    });
                    console.log("Submission status updated to", allPassed ? "ACCEPTED" : "REJECTED");
                }
                catch (err) {
                    console.error('Error during final status update:', err);
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
