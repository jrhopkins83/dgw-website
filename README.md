# dgw-website (dgw-website)

Donkey's Gone Wild poker league website

## Install the dependencies
```bash
npm install
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

## Creat Firebase project(s) and update environment variables
1. Create a new Firebase project to be used for testing/staging.
2. If you plan on running a production site, creat a 2nd project
3. Copy the .quasar.env example.json file to .quasar.env.json in the root directory
4. Insert Firebase config parameters for the "staging" Firebase project (optional: also "production") into .quasar.env.json

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
npm run dev
```

### Build the app
To test the build in "staging":
npm run deploy-to-staging"

To deploy to production:
npm run deploy-to-production

