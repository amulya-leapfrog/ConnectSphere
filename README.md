<p align="center">
    <em>Monorepo nest react Boilerplate.</em>
</p>
<p align="center">
	<!-- local repository, no metadata badges. -->
<p>
<p align="center">
		<em>Developed with the software and tools below.</em>
</p>
<p align="center">
	<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=default&logo=JavaScript&logoColor=black" alt="JavaScript">
	<img src="https://img.shields.io/badge/Prettier-F7B93E.svg?style=default&logo=Prettier&logoColor=black" alt="Prettier">
	<img src="https://img.shields.io/badge/HTML5-E34F26.svg?style=default&logo=HTML5&logoColor=white" alt="HTML5">
	<img src="https://img.shields.io/badge/YAML-CB171E.svg?style=default&logo=YAML&logoColor=white" alt="YAML">
	<img src="https://img.shields.io/badge/Jest-C21325.svg?style=default&logo=Jest&logoColor=white" alt="Jest">
	<img src="https://img.shields.io/badge/Vite-646CFF.svg?style=default&logo=Vite&logoColor=white" alt="Vite">
	<br>
	<img src="https://img.shields.io/badge/React-61DAFB.svg?style=default&logo=React&logoColor=black" alt="React">
	<img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=default&logo=ESLint&logoColor=white" alt="ESLint">
	<img src="https://img.shields.io/badge/tsnode-3178C6.svg?style=default&logo=ts-node&logoColor=white" alt="tsnode">
	<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=default&logo=TypeScript&logoColor=white" alt="TypeScript">
	<img src="https://img.shields.io/badge/JSON-000000.svg?style=default&logo=JSON&logoColor=white" alt="JSON">
</p>

<br><!-- TABLE OF CONTENTS -->

<details>
  <summary>Table of Contents</summary><br>

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Tests](#tests)

</details>
<hr>

## Overview

Boilerplate repository to create the Social Network graph application

---

## Features

|     | Feature           | Description                                                                                                                                                                     |
| --- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ⚙️  | **Architecture**  | Utilizes a monorepo structure with clear separation into client-server models underpinned by NestJS and React frameworks. Includes efficient build tooling with Turbo and Vite. |
| 🔩  | **Code Quality**  | Adheres to high standards with ESLint and Prettier integration. TypeScript is used extensively for type safety and robust code.                                                 |
| 📄  | **Documentation** | Extensive inline documentation and separate server/client `package.json` files dictating operational and developmental guidelines.                                              |
| 🔌  | **Integrations**  | Integrated with MinIO for object storage, leveraging Docker for environment consistency and NestJS for backend structure.                                                       |
| 🧩  | **Modularity**    | Highly modular, separating functionality into server and client apps with a mix of reusable services and components.                                                            |
| 🧪  | **Testing**       | Includes Jest for both unit and end-to-end testing, with specific configurations for e2e tests on the server side.                                                              |
| ⚡️ | **Performance**   | Optimized build processes using Vite for the client and Turbo for task management, aiming for high-performance operations.                                                      |
| 🛡️  | **Security**      | Employs Docker for secure and isolated environments; also uses strict TypeScript configurations for additional safety.                                                          |
| 📦  | **Dependencies**  | Extensive use of npm packages, including React ecosystems, NestJS, TypeScript, and various testing libraries.                                                                   |
| 🚀  | **Scalability**   | Designed for scalability with modular components and a monorepo setup to accommodate growth in both services and applications.                                                  |

````

---

##  Repository Structure

```sh
└── /
    ├── README.md
    ├── apps
    │   ├── client
    │   └── server
    ├── docker-compose.yml
    ├── package.json
    ├── pnpm-lock.yaml
    ├── pnpm-workspace.yaml
    └── turbo.json
````

---

## Getting Started

**System Requirements:**

- **Node**: `version >= 20`

### Installation

<h4>From <code>source</code></h4>

> 1. Clone the repository:
>
> ```bash
> $ git clone ../
> ```
>
> 2. Change to the project directory:
>
> ```bash
> $ cd
> ```
>
> 3. Install the dependencies:
>
> ```bash
> $ pnpm install
> ```

### Usage

<h4>From <code>source</code></h4>

> Run using the command below:
>
> ```bash
> $ pnpm dev
> ```

### Tests

> Run the test suite using the command below:
>
> ```bash
> $ pnpm test
> ```

---
