# expressBookReview

Repository name required by the assignment: **expressBookReview**.

## Run locally
1. Install Node.js (LTS).
2. Open this folder in VS Code or a terminal.
3. Run `npm install`.
4. Run `npm start`.
5. Keep the server running at `http://localhost:5000` while testing cURL commands.

## Evidence files
The `evidence/` folder contains one file per grading criterion. For Tasks 2–10, run the listed cURL command against the local server and paste the **actual terminal response** under the command. For Task 1, create the GitHub repository as a fork of `ibm-developer-skills-network/expressBookReview`, then paste the actual GitHub API response into `evidence/githubrepo`.

Do not submit placeholder text as evidence. The server stores users, sessions, and reviews in memory, so restart clears them. Run registration and login before the review tasks.

## Task 11
The implementation is in `routes/general.js`. It includes `retrieveBooks()` using Axios and async/await, with filters for ISBN, author, and title.
