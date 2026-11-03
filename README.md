# typescript_playground

***

## How to run typescript files on Webstorm

The simplest approach is to use WebStorm's built-in terminal and the tsx runner.

### Step 1 — Open your project

Open WebStorm, then open your interview-prep project folder (or create a new folder). Create url_shortener.ts and type the code above.



### Step 2 — Open the terminal

In WebStorm, open View → Tool Windows → Terminal, or use Option + F12.



### Step 3 — Install the TypeScript runner

If this is a new Node project, run:

```
npm init -y
npm install --save-dev typescript tsx @types/node
```


This creates package.json and installs the development tools locally.


### Step 4 — Run your file

```npx tsx playground/bank_transfer_implementation_10_27_26/bank_transfer.ts```


Expected output:
All tests pass.

Once that works, you can create a Run/Debug Configuration in WebStorm to avoid repeatedly typing the command.

Open Run → Edit Configurations → + → npm, choose your project's package.json, and configure an npm script. For example, add this to your package.json:
{
  "scripts": {
    "start": "tsx url_shortener.ts"
  }
}


Add the scripts entry to the existing file rather than replacing its other contents. Then run npm start, or select that npm script in WebStorm's Run configuration.

For quick interview exercises, though, npx tsx filename.ts is often the lowest-friction approach.