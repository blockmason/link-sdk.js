# Blockmason Link SDK for JavaScript

[![CircleCI][3]][4]

## Installing

To add this library to your app, do one of the following:

Using [Yarn][1]:

```
yarn add @blockmason/link-sdk
```

Using [NPM][2]:

```
npm install @blockmason/link-sdk
```

## Usage

### Importing the module

First, your app should import the `link` module from this library.

Using ES6:

```
import { link } from '@blockmason/link';
```

Using CommonJS modules (Node.js):

```
const { link } = require('@blockmason/link');
```

### Configuring

Once you have the `link()` function imported, create a client for your
Link project like this:

```
const project = link({
  clientId: '<your-client-id>',
  clientSecret: '<your-client-secret>'
});
``` 

Use the **Client ID** and **Client Secret** provided by your Link project
to fill in the respective values above.

### Interacting with your Link project

Then, you can use the `project` object to make requests against your
Link project.

For example, assuming your project has a **GET /echo** endpoint that
expects a `message` input and responds with a `message` output:

```
const { message } = await project.get('/echo', {
  message: 'Hello, world!'
});
console.log(message);
// "Hello, world!"
```

Another example, assuming your project has a **POST /mint** endpoint
that expects `to` and `amount` inputs:

```
await project.post('/mint', {
  amount: 1000,
  to: '0x1111222233334444555566667777888899990000'
});
```

[1]: https://yarnpkg.com/
[2]: https://nodejs.org/
[3]: https://circleci.com/gh/blockmason/link-sdk.js.svg?style=svg
[4]: https://circleci.com/gh/blockmason/link-sdk.js
