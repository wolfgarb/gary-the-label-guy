// this var is a reference to the DOM that holds repo issues
var issuesContainer = document.querySelector("#issues-container");
// this DOM references limit warning function
var limitWarningEl = document.querySelector("#limit-warning");
// dom to make repo name the header
var repoNameEl = document.querySelector("#repo-name")

var displayWarning = function(repo) {
  limitWarningEl.textContent = "To see more than 30 issues, visit ";

  var linkEl = document.createElement("a");
  linkEl.textContent = "See more issues on GitHub";
  linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
  linkEl.setAttribute("target", "_blank");

  // append all created elements to warning container
  limitWarningEl.appendChild(linkEl);
};

var getRepoName = function() {
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];
    if (repoName) {
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
    } 
    else {
        document.location.replace("index.html")
    }
    
}

var getRepoIssues = function(repo) {
  var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function(data) {
        displayIssues(data);

        // check if API has paginated issues (more than 30 wont be displayed, link to github)
        if (response.headers.get("Link")) {
          displayWarning(repo);
        }
      });
    } else {
      alert("Error with request");
    }
  });
};

var displayIssues = function(issues) {
  if (issues.length === 0) {
    issuesContainer.textContent = "This repo has no open issues.";
    return;
  }
  for (var i = 0; i < issues.length; i++) {
    // create a link element to take users to the issue on github
    var issueEl = document.createElement("a");
    issueEl.classList = "list-item flex-row justify-space-between align-center";
    issueEl.setAttribute("href", issues[i].html_url);
    issueEl.setAttribute("target", "_blank");

    // span el to hold issue TITLE
    var titleEl = document.createElement("span");
    titleEl.textContent = issues[i].title;

    // append to the issueEl container
    issueEl.appendChild(titleEl);

    // create el for issue TYPE
    var typeEl = document.createElement("span");

    // check if issue or pull request
    if (issues[i].pull_request) {
      typeEl.textContent = "(Pull request)";
    } else {
      typeEl.textContent = "(Issue)";
    }

    // append to the issueEl container
    issueEl.appendChild(typeEl);

    //append all created elements to the DOm
    issuesContainer.appendChild(issueEl);
  }
};

getRepoName();
