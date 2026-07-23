# Secure Search Practical

A small Node.js search application demonstrating:

- Frontend and backend input validation
- XSS output encoding
- Parameterized MySQL queries
- Logging validated searches in table `2400749`
- HTTPS through an Nginx reverse proxy
- A local Gitea Git server
- A local SonarQube Community Build server

## Start the stack

After extracting the submission, build and start every service:

```powershell
sudo docker-compose up
```

Docker Compose automatically generates the self-signed certificate, initializes
the databases, configures SonarQube, and scans the source code. No preliminary
commands are required.

Open `https://127.0.0.1/`. A browser warning is expected because the
development certificate is self-signed.

SonarQube may take a few minutes to finish its first startup. Open
`http://127.0.0.1:9000/` and sign in with:

- Username: `admin`
- Password: `2400749@SIT.singaporetech.edu.sg`

The `certgen`, `sonarqube-init`, and `sonar-scanner` containers perform
one-time setup tasks and then show `Exited (0)`. This is expected and means
their tasks completed successfully.

## Run a local SonarQube scan

The initial scan runs automatically. To perform another scan manually, create
an analysis token in SonarQube, then run:

```bash
sudo docker-compose run --rm sonar-scanner
```

Open `http://127.0.0.1:9000/dashboard?id=ssd-practical-test` to view the
analysis result.

## Run unit tests

```powershell
npm install
npm test
```

## Inspect logged searches

```powershell
docker compose exec database mysql -u admin -p testdb
```

Then run:

```sql
SELECT * FROM `2400749` ORDER BY query_time DESC;
```
