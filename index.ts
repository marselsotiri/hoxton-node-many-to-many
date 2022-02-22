import Database from "better-sqlite3";
import cors from "cors";
import express from "express";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 4050;

const db = new Database("./data.db", {
    verbose: console.log,
});

const getInterviewersForApplicant = db.prepare(`
SELECT DISTINCT interviewers.* FROM interviewers
JOIN interviews ON interviewers.id = interviews.interviewerId
WHERE interviews.applicantId = ?;
`);

const getApplicantsForInterviewer = db.prepare(`
SELECT DISTINCT applicants.* FROM applicants
JOIN interviews ON applicants.id = interviews.applicantId
WHERE interviews.interviewerId = ?;
`);
const getAllApplicants = db.prepare(`
SELECT * from applicants;
`);
const getApplicantById = db.prepare(`
SELECT * from applicants WHERE id = ?;
`);
const createApplicant = db.prepare(`
INSERT INTO applicants (name, email) VALUES (?,?);
`);
const getAllInterviewers = db.prepare(`
SELECT * from interviewers;
`);
const getInterviewerById = db.prepare(`
SELECT * from interviewers WHERE id = ?;
`);
const createInterviewer = db.prepare(`
INSERT INTO interviewers (name, email) VALUES (?,?);
`);

const getAllInterviews = db.prepare(`
SELECT * from interviews;
`);
const getInterviewById = db.prepare(`
SELECT * from interviews WHERE id = ?;
`);
const createInterview = db.prepare(`
INSERT INTO interviews (date, score, applicantId, interviewerId) VALUES (?,?,?,?);
`);

// applicants

app.get("/applicants", (req, res) => {
    const applicants = getAllApplicants.all();

    for (const applicant of applicants) {
        const interviewers = getInterviewersForApplicant.all(applicant.id);
        applicant.interviewers = interviewers;
    }
    res.send(applicants);
});


app.get("/applicants/:id", (req, res) => {
    const id = req.params.id;
    const applicant = getApplicantById.get(id);
    if (applicant) {
        const interviewers = getInterviewersForApplicant.all(applicant.id);
        applicant.interviewers = interviewers;
        res.send(applicant);
    } else {
        res.status(404).send("Cannot find this applicant with that ID");
    }
});



app.post("/applicants", (req, res) => {
    const { name, email } = req.body;

    const errors = [];
    if (typeof name !== "string") errors.push(`Name is missing or not a string`);
    if (typeof email !== "string") errors.push(`Email is missing or not a string`);

    if (errors.length === 0) {
        const info = createApplicant.run(name, email);
        const newApplicant = getApplicantById.get(info.lastInsertRowid);
        res.send(newApplicant);
    } else {
        res.status(400).send({ errors: errors });
    }
});


// interviewers

app.get("/interviewers", (req, res) => {
    const interviewers = getAllInterviewers.all();

    for (const interviewer of interviewers) {
        const applicants = getApplicantsForInterviewer.all(interviewer.id);
        interviewer.applicants = applicants;
    }
    res.send(interviewers);
});


app.get("/interviewers/:id", (req, res) => {
    const id = req.params.id;
    const interviewer = getInterviewerById.get(id);

    if (interviewer) {
        const applicants = getApplicantsForInterviewer.all(interviewer.id);
        interviewer.applicants = applicants;
        res.send(interviewer);
    } else {
        res.status(404).send("Cannot find this interviewer with that ID");
    }
});


app.post("/interviewers", (req, res) => {
    const { name, email } = req.body;

    const errors = [];
    if (typeof name !== "string") errors.push(`Name is missing or not a string`);
    if (typeof email !== "string") errors.push(`Email is missing or not a string`);

    if (errors.length === 0) {
        const info = createInterviewer.run(name, email);
        const newInterviewer = getInterviewerById.get(info.lastInsertRowid);
        res.send(newInterviewer);
    } else {
        res.status(400).send({ errors: errors });
    }
});


// interviews

app.get("/interviews", (req, res) => {
    const interviews = getAllInterviews.all();
    res.send(interviews);
});


app.get("/interviews/:id", (req, res) => {
    const id = req.params.id;
    const interview = getInterviewById.get(id);
    if (interview) {
        res.send(interview);
    } else {
        res.status(404).send("Cannot find this interview with that ID");
    }
});


app.post("/interviews", (req, res) => {
    const { date, score, applicantId, interviewerId } = req.body;

    const errors = [];
    if (typeof date !== "string") errors.push(`Date is missing or not a string`);
    if (typeof score !== "number") errors.push(`Score is missing or not a number`);
    if (typeof applicantId !== "number") errors.push(`ApplicantId is missing or not a number`);
    if (typeof interviewerId !== "number") errors.push(`InterviewerId is missing or not a number`);

    if (errors.length === 0) {
        const applicant = getApplicantById.get(applicantId);
        const interviewer = getInterviewerById.get(interviewerId);

        if (applicant && interviewer) {
            const info = createInterview.run(date, score, applicantId, interviewerId);
            const interview = getInterviewById.get(info.lastInsertRowid);
            res.send(interview);
        } else {
            res.status(400).send({ error: "Applicant or interviewer not found." });
        }
    } else {
        res.status(400).send({ errors: errors });
    }
});

app.listen(PORT, () => {
    console.log(`Server is up and running on http://localhost:${PORT}`);
});