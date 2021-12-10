const dotenv = require('dotenv');
const { createServer } = require("http");
const { Octokit } = require("@octokit/core");

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
});

//create a server object:
createServer(async function (req, res) {
  console.log("Reequest ke ", req.url, " dimulai");

  console.log(req.url);

  if (req.url.includes("/api")) {
    res.setHeader("Content-Type", "application/json");

    // https://docs.github.com/en/rest/reference/actions#create-a-workflow-dispatch-event
    const response = await octokit.request(
      "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches",
      {
        owner: process.env.GH_OWNER,
        repo: process.env.GH_REPO,
        workflow_id: process.env.GH_WORKFLOW,
        ref: process.env.GH_REF,
        inputs: JSON.parse(process.env.GH_INPUT)
      },
    );

    res.write(JSON.stringify(response));
    res.end(); //end the response
  } else {
    res.setHeader("Content-Type", "text/html");
    res.write(`
    <h2>How To:</h2>
    <ul>
        <li>Copy .env.example to .env</li>
        <li>Update Value</li>
        <li>Running Service</li>
        <li>Click Submit Button Below</li>
    </ul>
    <form action="/api">
        <input type="submit" value="Submit">
    </form>`); //write a response to the client
    res.end(); //end the response
  }
}).listen(3000); //the server object listens on port 8080
