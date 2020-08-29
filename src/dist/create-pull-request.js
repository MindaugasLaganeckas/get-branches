"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.createPullRequest = void 0;
var core = require("@actions/core");
var create_or_update_branch_1 = require("./create-or-update-branch");
var github_helper_1 = require("./github-helper");
var git_command_manager_1 = require("./git-command-manager");
var git_auth_helper_1 = require("./git-auth-helper");
var utils = require("./utils");
function createPullRequest(inputs) {
    return __awaiter(this, void 0, Promise, function () {
        var gitAuthHelper, repoPath, git, githubHelper, remoteUrl, baseRemote, branchRemoteName, branchRepository, parentRepository, remoteUrl_1, symbolicRefResult, workingBase, base, _a, _b, _c, parsedAuthor, parsedCommitter, result, error_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 23, 24, 27]);
                    repoPath = utils.getRepoPath(inputs.path);
                    return [4 /*yield*/, git_command_manager_1.GitCommandManager.create(repoPath)
                        // Save and unset the extraheader auth config if it exists
                    ];
                case 1:
                    git = _d.sent();
                    // Save and unset the extraheader auth config if it exists
                    core.startGroup('Save persisted git credentials');
                    gitAuthHelper = new git_auth_helper_1.GitAuthHelper(git);
                    return [4 /*yield*/, gitAuthHelper.savePersistedAuth()];
                case 2:
                    _d.sent();
                    core.endGroup();
                    githubHelper = new github_helper_1.GitHubHelper(inputs.token);
                    core.startGroup('Determining the base and head repositories');
                    return [4 /*yield*/, git.tryGetRemoteUrl()];
                case 3:
                    remoteUrl = _d.sent();
                    baseRemote = utils.getRemoteDetail(remoteUrl);
                    branchRemoteName = inputs.pushToFork ? 'fork' : 'origin';
                    branchRepository = inputs.pushToFork
                        ? inputs.pushToFork
                        : baseRemote.repository;
                    if (!inputs.pushToFork) return [3 /*break*/, 6];
                    return [4 /*yield*/, githubHelper.getRepositoryParent(branchRepository)];
                case 4:
                    parentRepository = _d.sent();
                    if (parentRepository != baseRemote.repository) {
                        throw new Error("Repository '" + branchRepository + "' is not a fork of '" + baseRemote.repository + "'. Unable to continue.");
                    }
                    remoteUrl_1 = utils.getRemoteUrl(baseRemote.protocol, branchRepository);
                    return [4 /*yield*/, git.exec(['remote', 'add', 'fork', remoteUrl_1])];
                case 5:
                    _d.sent();
                    _d.label = 6;
                case 6:
                    core.endGroup();
                    core.info("Pull request branch target repository set to " + branchRepository);
                    if (!(baseRemote.protocol == 'HTTPS')) return [3 /*break*/, 8];
                    core.startGroup('Configuring credential for HTTPS authentication');
                    return [4 /*yield*/, gitAuthHelper.configureToken(inputs.token)];
                case 7:
                    _d.sent();
                    core.endGroup();
                    _d.label = 8;
                case 8:
                    // Determine if the checked out ref is a valid base for a pull request
                    // The action needs the checked out HEAD ref to be a branch
                    // This check will fail in the following cases:
                    // - HEAD is detached
                    // - HEAD is a merge commit (pull_request events)
                    // - HEAD is a tag
                    core.startGroup('Checking the checked out ref');
                    return [4 /*yield*/, git.exec(['symbolic-ref', 'HEAD', '--short'], true)];
                case 9:
                    symbolicRefResult = _d.sent();
                    if (symbolicRefResult.exitCode != 0) {
                        core.debug("" + symbolicRefResult.stderr);
                        throw new Error('The checked out ref is not a valid base for a pull request. Unable to continue.');
                    }
                    workingBase = symbolicRefResult.stdout.trim();
                    base = inputs.base ? inputs.base : workingBase;
                    // Throw an error if the base and branch are not different branches
                    // of the 'origin' remote. An identically named branch in the `fork`
                    // remote is perfectly fine.
                    if (branchRemoteName == 'origin' && base == inputs.branch) {
                        throw new Error("The 'base' and 'branch' for a pull request must be different branches. Unable to continue.");
                    }
                    core.endGroup();
                    if (!inputs.branchSuffix) return [3 /*break*/, 15];
                    _a = inputs.branchSuffix;
                    switch (_a) {
                        case 'short-commit-hash': return [3 /*break*/, 10];
                        case 'timestamp': return [3 /*break*/, 12];
                        case 'random': return [3 /*break*/, 13];
                    }
                    return [3 /*break*/, 14];
                case 10:
                    // Suffix with the short SHA1 hash
                    _b = inputs;
                    _c = inputs.branch + "-";
                    return [4 /*yield*/, git.revParse('HEAD', [
                            '--short'
                        ])];
                case 11:
                    // Suffix with the short SHA1 hash
                    _b.branch = _c + (_d.sent());
                    return [3 /*break*/, 15];
                case 12:
                    // Suffix with the current timestamp
                    inputs.branch = inputs.branch + "-" + utils.secondsSinceEpoch();
                    return [3 /*break*/, 15];
                case 13:
                    // Suffix with a 7 character random string
                    inputs.branch = inputs.branch + "-" + utils.randomString();
                    return [3 /*break*/, 15];
                case 14: throw new Error("Branch suffix '" + inputs.branchSuffix + "' is not a valid value. Unable to continue.");
                case 15:
                    // Output head branch
                    core.info("Pull request branch to create or update set to '" + inputs.branch + "'");
                    // Configure the committer and author
                    core.startGroup('Configuring the committer and author');
                    parsedAuthor = utils.parseDisplayNameEmail(inputs.author);
                    parsedCommitter = utils.parseDisplayNameEmail(inputs.committer);
                    git.setIdentityGitOptions([
                        '-c',
                        "author.name=" + parsedAuthor.name,
                        '-c',
                        "author.email=" + parsedAuthor.email,
                        '-c',
                        "committer.name=" + parsedCommitter.name,
                        '-c',
                        "committer.email=" + parsedCommitter.email
                    ]);
                    core.info("Configured git committer as '" + parsedCommitter.name + " <" + parsedCommitter.email + ">'");
                    core.info("Configured git author as '" + parsedAuthor.name + " <" + parsedAuthor.email + ">'");
                    core.endGroup();
                    // Create or update the pull request branch
                    core.startGroup('Create or update the pull request branch');
                    return [4 /*yield*/, create_or_update_branch_1.createOrUpdateBranch(git, inputs.commitMessage, inputs.base, inputs.branch, branchRemoteName, inputs.signoff)];
                case 16:
                    result = _d.sent();
                    core.endGroup();
                    if (!['created', 'updated'].includes(result.action)) return [3 /*break*/, 18];
                    // The branch was created or updated
                    core.startGroup("Pushing pull request branch to '" + branchRemoteName + "/" + inputs.branch + "'");
                    return [4 /*yield*/, git.push([
                            '--force-with-lease',
                            branchRemoteName,
                            "HEAD:refs/heads/" + inputs.branch
                        ])];
                case 17:
                    _d.sent();
                    core.endGroup();
                    _d.label = 18;
                case 18:
                    // Set the base. It would have been '' if not specified as an input
                    inputs.base = result.base;
                    if (!result.hasDiffWithBase) return [3 /*break*/, 20];
                    // Create or update the pull request
                    return [4 /*yield*/, githubHelper.createOrUpdatePullRequest(inputs, baseRemote.repository, branchRepository)];
                case 19:
                    // Create or update the pull request
                    _d.sent();
                    return [3 /*break*/, 22];
                case 20:
                    if (!['updated', 'not-updated'].includes(result.action)) return [3 /*break*/, 22];
                    core.info("Branch '" + inputs.branch + "' no longer differs from base branch '" + inputs.base + "'");
                    core.info("Closing pull request and deleting branch '" + inputs.branch + "'");
                    return [4 /*yield*/, git.push([
                            '--delete',
                            '--force',
                            branchRemoteName,
                            "refs/heads/" + inputs.branch
                        ])];
                case 21:
                    _d.sent();
                    _d.label = 22;
                case 22: return [3 /*break*/, 27];
                case 23:
                    error_1 = _d.sent();
                    core.setFailed(error_1.message);
                    return [3 /*break*/, 27];
                case 24:
                    // Remove auth and restore persisted auth config if it existed
                    core.startGroup('Restore persisted git credentials');
                    return [4 /*yield*/, gitAuthHelper.removeAuth()];
                case 25:
                    _d.sent();
                    return [4 /*yield*/, gitAuthHelper.restorePersistedAuth()];
                case 26:
                    _d.sent();
                    core.endGroup();
                    return [7 /*endfinally*/];
                case 27: return [2 /*return*/];
            }
        });
    });
}
exports.createPullRequest = createPullRequest;
