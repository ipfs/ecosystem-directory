# IPFS Ecosystem Directory

Interactive IPFS ecosystem directory and showcase.

## General Information

### Deployment

This repo is currently deployed to Fleek on the following URLs:

`main` branch: https://ipfs-ecosystem.on.fleek.co/
`develop` branch: https://ipfs-ecosystem-develop.on.fleek.co/

Pushes made to the `main` or `develop` branches of this repo will automatically be reflected in the URLs above. Please allow 2-5 minutes for the application to re-build before seeing changes in your browser.

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
# Navigate to directory within which to clone the git repo. A new directory is created within this one called ecosystem-directory
$ cd ~/Desktop

# Clone the repo
$ git clone git@github.com:ipfs/ecosystem-directory.git

# Enter the repo directory
$ cd ecosystem-directory

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
