# PoC AU Nuxt

Proof of concepts for AU web frontend implementations in NuxtJS.

## General Information

### Deployment

This repo is currently deployed to Fleek on the following URL:

[https://raspy-sun-7856.on.fleek.co](https://raspy-sun-7856.on.fleek.co)

Pushes made to the `master` branch of this repo will automatically be reflected in the URL above. Please allow 2-5 minutes for the application to re-build before seeing changes in your browser.

### Server

**Ports**

```
development: 20000
stable: 20001
production: 20002
```

**Mode**: `static`

**Environment Variables**

```
NODE_ENV → development|production
SERVER_ENV → development|stable|production
```

## Getting Started

### A. Get Repo

In a terminal, run the commands below to get set up

```bash
# Navigate to directory within which to clone the git repo. A new directory is created within this one called poc-au-nuxt
$ cd ~/Desktop

# Clone the repo
$ git clone git@github.com:agency-undone/poc-au-nuxt.git

# Enter the repo directory
$ cd poc-au-nuxt

# Add your user information
$ git config user.name "Your Name"
$ git config user.email "your.email@agencyundone.com"

# Install npm dependencies
$ npm ci
```

### B. Generating a self-signed SSL certificate

Used for development in a local environment (such as on your personal computer). You only need to do this once. If you've already done this for a different project, just copy your existing `localhost_cert.pem` and `localhost_key.pem` files from `~/.ssh` into the root directory of this repo and skip the rest of this step.

1. [Install mkcert and generate certificate](https://github.com/FiloSottile/mkcert) by running the commands below, in that order:

  ```bash
  $ cd ~/.ssh
  $ brew install mkcert
  $ mkcert -install
  $ mkcert -key-file localhost_key.pem -cert-file localhost_cert.pem localhost 127.0.0.1
  $ cat localhost_cert.pem > localhost_fullchain.pem
  $ cat "$(mkcert -CAROOT)/rootCA.pem" >> localhost_fullchain.pem
  ```

2. Copy the new `localhost_cert.pem` and `localhost_key.pem` files to the root directory of this repo
3. Start the server and navigate to `https://localhost:<your_port>`

### C. Environment variables

Create a file called `.env` and put it into the root directory of this repo. Add the following environment variables:

```
NODE_ENV=development
SERVER_ENV=development
```

### D. Start the app

```bash
$ npm run dev
```

## Creating a PoC

PoC's will likely take one of 3 different forms:

- Component
- Plugin
- Module

In each case, they should be as compartmentalized as possible. The following steps should be taken:

1. Create a page in the `/pages` directory. You can duplicate the `index.vue` page and then rename it and update any references with new names. The filename of the page will be converted into the route. So if you're making a PoC called "Fancy New Feature", you should name your page `fancy-new-feature.vue` and then the route to access this page will automagically be generated as: `https://<domain>/fancy-new-feature`.

2. Create a directory in either `/component`, `/modules` or `/plugins` with the name of your new PoC (same name as the page, ex: `fancy-new-feature`) and put as many related sub-components into this directory as well. The parent feature component can then be imported into the page you created above. This way, we end up with 1 page per PoC and all relevant components inside a single directory of the same name.

3. Create a README.md file _inside each new PoC directory_ and describe the functionality of your PoC in a good amount of detail, especially quirks and edge cases. In cases where you need to add files that can't be placed into your feature directory (such as importing a plugin through `/plugins` and `nuxt.config.js`), then please document this in this README file as well.
