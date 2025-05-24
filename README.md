We have implemented the below commit types to create the releases and changelog.

- `feat` - for new features.
- `fix` - for bug fixes
- `perf` - for performance improvements
- `revert` - for reverting changes
- `docs` - for documentation changes
- `style` - for changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor` - for code changes that neither fixes a bug nor adds a feature
- `test` - for adding missing tests or correcting existing tests
- `build` - for changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- `ci` - for changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- `ops` - for changes that affect the operations of the system or external dependencies (example scopes: Kubernetes, Ansible, Terraform)
- `hotfix` - for hotfix. hotfix are patches to the latest minor release. for example, if the latest minor release is 1.1.0, the hotfix will be 1.1.1. in our case if the hotfix is generated with dedicated branch it will create a prerelease branch with hotfix in the release name. for example, if the hotfix is generated with dedicated branch hotfix/1.1.1, the prerelease branch will be 1.1.1-hotfix. if the hotfix is generated with master branch it will create a prerelease branch with hotfix in the release name. for example, if the hotfix is generated with master branch, the prerelease branch will be 1.1.1-hotfix.1
- `merge` - for merge commits. merge commits are generated automatically when we merge the pull request. current default format in github is `Merge pull request #<pull-request-number> from <branch-name>`. for example, Merge pull request #1 from feature/1.1.0. as we are also including the merged PRs section in release notes we are using this commit type to identify the merge commits. as the default message format for github is not in required format we need to update the commit message manually. for example, if the default message is `Merge pull request #1 from feature/1.1.0` we need to update the commit message to `merge: pull request #1 from feature/1.1.0`. if the commit message is not in the required format the commit will be ignored while creating the release and changelog.

- `chore` - for changes to the build process or auxiliary tools and libraries such as documentation generation. and any other task that doesn't fall in any of the above categories.