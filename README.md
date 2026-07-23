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

Generate the self-signed development certificate once:

```powershell
docker compose --profile tools run --rm certgen
```

Build and start the application:

```powershell
docker compose up -d --build
```

Open `https://127.0.0.1/`. A browser warning is expected because the
development certificate is self-signed.

SonarQube may take a few minutes to finish its first startup. Open
`http://127.0.0.1:9000/` and sign in with:

- Username: `admin`
- Password: `2400749@SIT.singaporetech.edu.sg`

The `sonarqube-init` container changes the default administrator password on
the first startup and then exits successfully. This is expected.

## Run a local SonarQube scan

Create an analysis token in SonarQube, then run:

```powershell
$env:SONAR_TOKEN = "your-analysis-token"
docker compose --profile tools run --rm sonar-scanner
Remove-Item Env:SONAR_TOKEN
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
