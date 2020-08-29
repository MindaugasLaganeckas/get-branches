"use strict";
exports.__esModule = true;
exports.GitHubHelper = void 0;
var octokit_client_1 = require("./octokit-client");
var ERROR_PR_REVIEW_FROM_AUTHOR = 'Review cannot be requested from pull request author';
var GitHubHelper = /** @class */ (function () {
    function GitHubHelper(token) {
        var options = {};
        if (token) {
            options.auth = "" + token;
        }
        this.octokit = new octokit_client_1.Octokit(options);
    }
    return GitHubHelper;
}());
exports.GitHubHelper = GitHubHelper;
