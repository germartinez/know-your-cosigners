# Know Your Co-signers

Know Your Co-signers allows you to access different statistics and charts for any provided Safe smart account and its signers to see how they behave and how active they are, categorizing them with different tags like:

- `Most popular signer`: The signer who signed most Safe transactions.
- `Most popular executor`: The signer who executed most Safe transactions.
- `Occasional signer`: The signers who have signed at least one Safe transaction.
- `Occasional executor`: The signers who have executed at least one Safe transaction.
- `Best sponsor`: The signer who paid the highest total fees when executing Safe transactions.
- `100% committed`: The signers with no activity registered outside the Safe.
- `No signing activity`: The signers who didn't sign any Safe transactions.
- `No execution activity`: The signers who didn't execute any Safe transaction.

This monorepo consists of two different projects:

- [Web application](./packages/know-your-cosigners-web)
- [Backend service](./packages/know-your-cosigners-service)

## Get Started

Before running this application, the back-end service requires setting up the `NEXT_PUBLIC_SERVICE_URL` environment variable. Rename the `.env.example` to `.env` and set the variable with the right URL for the back-end service:

```
NEXT_PUBLIC_SERVICE_URL=http://localhost:4000/api/v1
```

### Installation

Execute the following command in the root folder of the monorepo to install both projects:

```bash
pnpm install
```

Alternatively, execute the following command to undo the installation and remove all the generated files:

```bash
pnpm clean
```

### Build

Execute the following command in the root folder of the monorepo to build both projects:

```bash
pnpm build
```

Alternatively, execute the following command to undo the build and remove all the generated files:

```bash
pnpm unbuild
```

### Run locally

Execute the following command to run the front-end application and back-end service locally:

```bash
pnpm dev
```

The front-end and back-end will be available at `http://localhost:3000` and `http://localhost:4000` respectively.

### Deploy in production

Execute the following command to deploy the front-end application and back-end service:

```bash
pnpm prod:deploy
```

The front-end and back-end will be available at `http://<INSERT_PUBLIC_IP_HERE>:80` and `http://<INSERT_PUBLIC_IP_HERE>:4000` respectively.

Execute the following command to stop the deployment:

```bash
pnpm prod:undeploy
```
