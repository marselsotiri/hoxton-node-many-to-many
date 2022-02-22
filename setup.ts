import Database from 'better-sqlite3'

const db = new Database('./data.db', {
    verbose: console.log
})

// applicants
const applicants = [
    {
        name: 'Marsel',
        email: 'marsel@marsel.com'
    },
    {
        name: 'Albi',
        email: 'albi@email.com'
    }, {
        name: 'Altin',
        email: 'altin@hotmail.com'
    }, {
        name: 'Gentian',
        email: 'gentian@mali.com'
    },
]

// interviewers
const interviewers = [
    {
        name: 'Rinor',
        email: "rinor@123.com"
    },
    {
        name: 'Geri',
        email: "geri@123.com"
    },
    {
        name: 'Visard',
        email: "viso@123.com"
    },
    {
        name: 'Egon',
        email: "egon@123.com"
    },
    {
        name: 'Andi',
        email: "andi@123.com"
    },
    {
        name: 'Aldo',
        email: "aldo@123.com"
    },
]

// interviews
const interviews = [
    {
        applicantId: 1,
        interviewerId: 3,
        date: "15/1/2022",
        score: 45
    },
    {
        applicantId: 1,
        interviewerId: 2,
        date: "14/1/2022",
        score: 87
    },
    {
        applicantId: 2,
        interviewerId: 5,
        date: "11/1/2022",
        score: 57
    },
    {
        applicantId: 2,
        interviewerId: 5,
        date: "15/2/2022",
        score: 68
    },
    {
        applicantId: 3,
        interviewerId: 4,
        date: "14/2/2022",
        score: 45
    },
    {
        applicantId: 3,
        interviewerId: 1,
        date: "10/1/2022",
        score: 78
    },
    {
        applicantId: 4,
        interviewerId: 4,
        date: "4/1/2022",
        score: 95
    },
    {
        applicantId: 4,
        interviewerId: 3,
        date: "4//2022",
        score: 66
    }
]

db.exec(`
DROP TABLE IF EXISTS interviews;
DROP TABLE IF EXISTS applicants;
DROP TABLE IF EXISTS interviewers;

CREATE TABLE IF NOT EXISTS applicants (
  id INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS interviewers (
  id INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS interviews (
  id INTEGER,
  applicantId INTEGER NOT NULL,
  interviewerId INTEGER NOT NULL,
  date Text NOT NULL,
  score INTEGER,
  PRIMARY KEY (id),
  FOREIGN KEY (applicantId) REFERENCES applicants(id),
  FOREIGN KEY (interviewerId) REFERENCES interviewers(id)
);
`)

const createApplicant = db.prepare(`
INSERT INTO applicants (name, email) VALUES (?, ?);
`)

const createInterviewer = db.prepare(`
INSERT INTO interviewers (name, email) VALUES (?, ?);
`)

const createInterview = db.prepare(`
INSERT INTO interviews (applicantId, interviewerId, date, score)
VALUES (?, ? ,?, ?);
`)

for (const applicant of applicants) {
    createApplicant.run(applicant.name, applicant.email)
}

for (const interviewer of interviewers) {
    createInterviewer.run(interviewer.name, interviewer.email)
}

for (const interview of interviews) {
    createInterview.run(interview.applicantId, interview.interviewerId, interview.date, interview.score)
}
