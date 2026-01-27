
# Online Judge Platform

This repository contains a full-stack, containerized online judge platform, similar to LeetCode. It provides a complete environment for users to practice coding problems, submit solutions, and receive real-time feedback. The entire application is orchestrated using Docker and Docker Compose for easy setup and deployment..

## Features

- **User Authentication:** Secure user registration and login using credentials, Google, or GitHub, powered by NextAuth.js.
- **Problem Management:**
  - Admins/users can add new coding problems with a rich-text editor for descriptions, define difficulty levels (Easy, Medium, Hard), and provide multiple test cases.
  - Browse and filter a list of available problems.
- **Online Code Editor:** An in-browser Monaco Editor for writing and submitting solutions in C++, with support for other languages.
- **Code Compilation & Execution:** A dedicated worker service picks up submissions, compiles the code, and runs it against the provided test cases in an isolated environment.
- **Real-time Feedback:** Submissions are processed asynchronously, and users can see the status of their solution (Pending, Accepted, Rejected) and the results for each test case.
- **Submission History:** Users can view their past submissions for any given problem.

## Tech Stack

- **Frontend (Client):** Next.js, React, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend (Worker):** Node.js, Redis, Prisma
- **Database:** PostgreSQL
- **Authentication:** NextAuth.js
- **Containerization:** Docker, Docker Compose

## Architecture

The application is composed of multiple services that work together, managed by Docker Compose:

- **`client`**: A Next.js application that serves as the user interface. It handles user registration, login, problem viewing, and code submission.
- **`worker`**: A Node.js service responsible for processing code submissions. It listens for new jobs on a Redis queue, fetches the submission details from the database, compiles and executes the code, and updates the results.
- **`postgres`**: A PostgreSQL database instance that stores all application data, including users, problems, test cases, and submissions.
- **`redis`**: A Redis instance that functions as a message broker. The `client` pushes new submission tasks to a list, and the `worker` consumes tasks from this list.

### Submission Flow

1.  A user submits their code through the **client** UI.
2.  A new `Submission` record is created in the **PostgreSQL** database with a `PENDING` status.
3.  A job message, containing the `submissionId` and `userId`, is pushed to the `worker` list in **Redis**.
4.  The **worker** service, listening on the Redis list, pops the job message.
5.  The worker fetches the code and corresponding test cases from the database.
6.  It writes the source code and input files to its local filesystem within the container.
7.  The code is compiled (e.g., using `g++` for C++) and executed against each test case.
8.  The worker compares the program's output with the expected output for each test case and updates its status (`ACCEPTED` or `REJECTED`).
9.  After all test cases are run, the final status of the submission is updated in the database.
10. The user can view the outcome on the submission page.

## Getting Started

To run this project locally, you need to have Docker and Docker Compose installed.

### Prerequisites

-   [Docker](https://docs.docker.com/get-docker/)
-   [Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ayush-codes045/leetcode_docker.git
    cd leetcode_docker
    ```

2.  **Configure Environment Variables:**

    Create a `.env` file inside the `client` directory by copying the example:

    ```bash
    cp client/.env client/.env
    ```

    Open `client/.env` and add your OAuth secrets. The `DATABASE_URL` and `REDIS_URL` are already configured for the Docker Compose network.

    ```env
    # client/.env

    # These are set for the docker-compose network
    DATABASE_URL="postgresql://postgres:postgres@db:5432/leetcode"
    REDIS_URL="redis://redis:6379"

    # Fill these in for OAuth
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET="your_strong_secret_here"
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    GITHUB_CLIENT_ID=
    GITHUB_CLIENT_SECRET=
    ```

3.  **Build and Run the Application:**

    From the root directory, run the following command:
    ```bash
    docker-compose up --build
    ```
    This command will build the images for the `client` and `worker` services and start all the containers.

4.  **Access the Application:**

    -   **Web Application:** [http://localhost:3000](http://localhost:3000)
    -   **Prisma Studio (Database GUI):** [http://localhost:5555](http://localhost:5555)

## Project Structure

```
.
├── docker-compose.yml      # Defines and orchestrates all services
├── client/                   # Next.js frontend application
│   ├── app/                  # App Router, pages, and API routes
│   ├── components/           # React components
│   ├── actions/              # Server actions for database operations
│   ├── prisma/               # Prisma schema and migrations for the client
│   ├── lib/                  # Auth, DB connection, utilities
│   ├── Dockerfile
│   └── ...
└── worker/                   # Node.js code execution worker
    ├── src/                  # Worker source code
    ├── prisma/               # Prisma schema and migrations for the worker
    ├── Dockerfile
    └── ...
