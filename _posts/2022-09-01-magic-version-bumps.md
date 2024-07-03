---
title: Magic version bumps for Github PRs
link: magic-version-bumps-for-github-prs
published_date: 2022-09-01
---

This post is about a configuration that I added to my a Github repo that I'm working on to make it automatically commit a version bump whenever someone merges a PR with a special label, and the hoops that I had to jump through to make it work.

For the tl;dr, skip to the last section ("Final solution").

# The problem

The idea was born from a frustrating situation that I started to notice on my current project. On this project, the `master` branch is protected, so you cannot push to `master`; you must open a PR. The following checks apply:

1. Your BitRise build must pass
2. Your branch must be up to date
3. You need at least 2 approvals
4. Reviews are dismissed when you push changes

These checks are enforced automatically and cannot (easily) be bypassed. In addition, we have a conventional requirement that each PR needs an appropriate version bump. To be clear, this means that the developer who opens the PR must update some files to bump the version of the module, and push those changes along with the rest of the PR, where the rest of the team will ensure that the version bump is present in the diff.

This is where the frustration arises. To see why, consider the following: Firstly, a version bump constitutes a *change*, which means that when you push a version bump to your PR, it dismisses any reviews you have accrued up to then. Secondly, a version bump is represented *literally* in your PR. You cannot simply declare your *intention* to bump the version; you must update it to a specific version, and that update must be correct relative to the version that is currently in master. Thirdly, multiple people can and often do open PRs simultaneously.

Here's a scenario. You open a PR for a small fix and forget to include a version bump. You get two approvals, but your team lead helpfully points out that you should include the bump. So you update the version from 13.0.2 to 13.0.3 on your local machine and push the changes to the PR. You have now lost the two approvals that you already had, and must wait for the build to pass on Bitrise again before you can consider merging. So you wait 10 minutes for the build, campaign to get your approvals again, and that should be it... except, something has happened. While you were updating your PR, your teammate has merged hers. You click the button to update your branch from master. Your teammate's PR included a minor version bump, so the version on master is now 13.1.0, and you must now go back to your local machine, pull the remote branch, bump the version to 13.1.1, push, wait for CI to pass, and get reviews *again*.

If your team is particularly productive and attempting to merge many PRs, this requirement to perform version bumps locally will seriously slow them down. We ended up trying to pre-empt merges; for example, I might see that someone else's PR is going to go in before mine and bump my version by *two* patch numbers instead of one. But this can become hairy, and shouldn't be necessary at all.

# We can do better

One way to analyse the existing problem is to say that, instead of declaring our *intent* ("this PR should be accompanied by a patch version bump"), we were doing the actual work ("this PR bumps the module to 13.0.2"). So if we can somehow change that, life would be better. 

I could picture an ideal solution where, when I open a PR, I just have to indicate to my team and to Github itself what kind of bump should occur. When the PR is merged, Github itself should perform the bump.

This way, my team can still verify that the PR is associated with the correct *type* of version bump (major, minor or patch). Moreover, even if my PR gets outdated by someone else merging theirs, I only need to merge master back into mine. Crucially, this does not dismiss my existing approvals. And as a bonus, if this is implemented a certain way, we can even enforce that people remember to indicate their version bumps for the PR checks to pass; otherwise, they simply won't be able to merge.

This ideal solution would require me to implement the following components:

- A way to indicate my intent to perform a certain kind of version bump
- The requirement that each PR must be accompanied by such a version bump indicator
- An automated workflow that performs the version bump when a PR with such an indicator is merged

# Setting up a playground

This was going to require a lot of trial and error, so I set up a safe playground repo where I could test my implementation without subjecting my work team to my half-baked ideas and frequent changes. You can see it [here](https://github.com/phlippieb-discovery/test-podbump-on-merge).

# Indicating intent

The first question I tackled was how to indicate which kind of version bump to associate with a PR. I briefly considered storing this information in the codebase itself, but couldn't see a way to do this that wouldn't suffer the same problems that we're trying to solve.

I opted to use labels on the PR itself. I created four labels: `bump:major`, `bump:minor`, `bump:patch`, and `bump:none`. The last one is useful in that it allows you to indicate, explicitly, that your PR definitely shouldn't have a version bump; we do this with strictly under-the-hood changes that don't need a release.

# Requiring a label

The next question is how to ensure that the team remembers to use the labels. After all, this is an opportunity to take a check that was purely convention (reviewers should look through the changes and make sure the author didn't forget the bump) and make it automatic.

This was actually quite easy. Github user `mheap` has created a very useful action called ["Require Labels"](https://github.com/marketplace/actions/require-labels), which does most of the work. I just had to create a check in our repository that specifically check for one of the labels I defined before. The [full action](https://github.com/phlippieb-discovery/test-podbump-on-merge/blob/main/.github/workflows/has-version-bump-label.yml) on my side looks like this:

```yml
name: Has version-bump label
on:
  pull_request:
    types: [opened, labeled, unlabeled, synchronize]
jobs:
  require-version-bump-label:
    runs-on: ubuntu-latest
    steps:
      - uses: mheap/github-action-required-labels@v2
        with:
          mode: exactly
          count: 1
          labels: "bump:patch, bump:minor, bump:major, bump:none"

```

It even enforces that only *one* of the labels are selected.

# Reading the label

So far so good! Next up, I wanted to detect when a PR is merged into master with a relevant label, and perform some placeholder action. This was also easy. The only tricky thing is that the action trigger must reside with the pull request branch, so that it has access to those labels. This is contrary to common wisdom, which is that you would hook up such an action to `push`es on the main branch.

The [full action](https://github.com/phlippieb-discovery/test-podbump-on-merge/blob/main/.github/workflows/on-merge-to-main.yml) reads thusly:

```yml
name: Version bump
on:
  pull_request:
    branches: [ "main" ]
    types: [ closed ]
  workflow_dispatch:
jobs:
  perform-patch-bump:
    if: ${{ (github.event.pull_request.merged == true) && (contains(github.event.pull_request.labels.*.name, 'bump:patch')) }}
    uses: phlippieb-discovery/test-podbump-on-merge/.github/workflows/bump-version.yml@main
    with:
      bump_type: patch
  perform-minor-bump:
    if: ${{ (github.event.pull_request.merged == true) && (contains(github.event.pull_request.labels.*.name, 'bump:minor')) }}
    uses: phlippieb-discovery/test-podbump-on-merge/.github/workflows/bump-version.yml@main
    with:
      bump_type: minor
  perform-major-bump:
    if: ${{ (github.event.pull_request.merged == true) && (contains(github.event.pull_request.labels.*.name, 'bump:major')) }}
    uses: phlippieb-discovery/test-podbump-on-merge/.github/workflows/bump-version.yml@main
    with:
      bump_type: major
```

It's a bit funny-looking, but in essence the over-arching action is triggered whenever a pull request is `closed`, which is an event that occurs in practice whenever a PR is merged (among others); then within this action, there are three jobs that can potentially run. Each of these jobs require that the PR was actually merged, and that it had a particular label. This is how we differentiate the different types of version bumps we may want to perform.

It also hooks into another action that lives on the same repo, called `bump-version.yml`; implementing this part was the next step.

# Performing the bump

The matter of actually performing the version bump is very specific to your tech and project. In my case, working on a CocoaPods-based iOS module, it was a matter of invoking a Fastlane command, which updates a Podspec file and re-installs the module using CocoaPods.

When doing builds on an iOS project, you often need CI actions to run on a Mac machine, which is quite expensive compared to a Linux machine. In this case, we could run the action on Ubuntu. The trick was to create a separate, dedicated Fastfile just for Github Actions; this Fastfile resides inside .github/fastlane.

If you're interested, this is what the Fastfile looks like:

```ruby
fastlane_version '2.178.0'

desc 'Bump podspec version'
lane :bump_podspec_ci do
    version = version_bump_podspec(path: "../<YOUR_PODSPEC>.podspec", bump_type: ENV["PODSPEC_BUMP_TYPE"])
    cocoapods(podfile: "../App/Podfile")
    sh("echo PODSPEC_BUMP_NEW_VERSION=#{version} >> $GITHUB_ENV")
end
```

The fastlane action itself expects a string to specify the type of bump, which should be either "major", "minor" or "patch".

So how do we invoke fastlane from a Github action?

# Creating a reusable bumper action

Recall that our "on-merge" action is responsible for determining the type of bump to perform, based on the label. Regardless of the type of bump, the work of performing the bump is going to be highly similar, so ideally we wouldn't have the same thing inside each of our label cases.

Instead, we create a [reusable action](https://docs.github.com/en/actions/using-workflows/reusing-workflows) called "Bump Podspec", which we can invoke from each of our label type cases, only changing the input we pass along.

An initial version of this reusable action looked like this:

```yaml
name: Bump Podspec
on:
  workflow_call:
    inputs:
      bump_type: # "major", "minor" or "patch"
        required: true
        type: string
jobs:
  bump-podspec-version:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout project
        uses: actions/checkout@v3
        
      - name: Set up Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '2.7.2'
          bundler-cache: true  # runs 'bundle install' and caches installed gems automatically
          
      - name: Configure netrc for api.github.com
        uses: extractions/netrc@v1
        with:
          machine: api.github.com
          username: <redacted>
          password: ${{ secrets.<REDACTED> }}

      - name: Configure netrc for github.com
        uses: extractions/netrc@v1
        with:
          machine: github.com
          username: <redacted>
          password: ${{ secrets.<REDACTED> }}
          
      - name: Bump podspec version using Fastlane
        env:
          PODSPEC_BUMP_TYPE: ${{ inputs.bump_type }}
        run: |
          cd .github
          bundle exec fastlane bump_podspec_ci
          
      - name: Show changes
        run: git status
```

Some things to note:
- This runs on Ubuntu :)
- We configure netrc with a (redacted) token for a reusable bot. This is so that we can perform basic git operations, which is needed by CocoaPods when doing a `pod install`; the operation relies heavily on git clones.
- We don't commit or push any changes yet; we just want to check that it's doing the right thing.

Running this on my test repo yielded promising results, so I implemented it on the work repo, and hit a wall. The fastlane action kept failing with the error `fatal: could not read Username for 'https://github.com': No such device or address`.

Upon closer inspection, I realised that the netrc setup step produced different output on my work repo than on the test repo; the password field was blank. For some reason, the token that I wanted to use wasn't available in this context.

This issue seems to be specific to the case of invoking this workflow from another, as a reusable action. Even though the token was an organisation-level secret which our repo definitely had access to, it wasn't being shared in this context. The fix was actually quite simple, once I found it: the workflow that *invokes* this one just had to declare that the invoked workflow will inherit its secrets, by adding `secrets: inherit` to each job's specification.

```yaml

# Invoking workflow:
...
jobs:
  perform-patch-bump:
    if: ${{ (github.event.pull_request.merged == true) && (contains(github.event.pull_request.labels.*.name, 'bump:patch')) }}
    secrets: inherit # <-- magic spell that makes it work
    uses: <YOUR_ORG>/<YOUR_REPO>/.github/workflows/bump-podspec.yml@master
    with:
      bump_type: patch
...
```

Now I could see that, when I merge a PR with a 'bump:patch' label, the action is triggered and it actually performs the version bump. All that's left is to commit and push the change. How hard can that be?

# Committing and pushing the change

It was very hard.

Github makes it nearly impossible for a bot to push to a protected branch.

I tried lots of things that did not work, including

- Making the organisation-level shared bot an admin (since admin users on this repo *can* push to master, despite the protection rules)
- Adding the bot to the list of users that can bypass required pull requests
- Restricting the users who can push to master and adding the bot there
- Using any of the pre-built actions I could find on the Actions Marketplace that supposedly allows pushing to restricted branches, such as [this one](https://github.com/marketplace/actions/push-to-status-check-protected-branches) or [this one](https://github.com/marketplace/actions/push-to-a-protected-branch)

The problem was that our master branch is protected, and to date, Github just doesn't allow bots to bypass protection rules. There have been several discussions asking Github to implement a workaround, touting use cases very much like this one, but the current response is that Github will not do so. See [this discussion](https://github.com/orgs/community/discussions/25305), or [this one](https://github.com/orgs/community/discussions/13836), or [this one](https://github.com/orgs/community/discussions/27217).

One of these discussions had a [terse but helpful comment](https://github.com/orgs/community/discussions/13836#discussioncomment-3175732):

> So you can do one of two things, build a github app and grant it access to bypass branch merge rules, or have a user who can and have them craete a PAT, store it in the repos as a secret and use that PAT in the action which will act like the administrator bypassing the branch rules.

At this point, I have spent an inordinate amount of time trying to make my magic version bumps work, so I opted for a less-than-ideal solution: using my own personal access token (PAT). It should be clear why this isn't the best solution (if I update my token or leave the team, the CI breaks), but I couldn't justify spending much more time on this task.

All I had to do now was to create a PAT for this purpose and hook it into the action. To create the PAT, I headed to [my token settings](https://github.com/settings/tokens) and created a new one, only selecting the `repo` scope. Then, to hook it into the workflow, I decided to use a [prebuilt push action](https://github.com/ad-m/github-push-action). I added this to the end of the "Bump Podspec" worflow:

```yaml
      ...
      steps:
      ...
      - name: Push changes
        uses: ad-m/github-push-action@master
        with:
          github_token: ${{ secrets.MY_TOKEN }}
          branch: ${{ github.ref }}
```

This still didn't work. Luckily, the final fix required was documented in the push action. When checking out the repo, I just had to disable "persist-credentials".

# Final solution / everything put together

Let's do it backwards so that each component is testable in isolation, and then composed into the previous step.

## 1. Add a PAT

Add a personal access token that can be used by your workflows to commit and push changes on a protected branch. This requires you to be blessed with the ability to push to master.

1. Go to [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Click "generate new token"
3. Name it and give it the "repos" scope

## 2. Add a Fastfile with an action that performs the version bump

This is specific to development on iOS modules that get published via CocoaPods. I don't think you need to use Fastlane for day-to-day development for this to work, as this uses an isolated config and a standalone action.

Add a fastfile like this one at `.github/fastlane/Fastfile`:

```ruby
fastlane_version '2.178.0'

desc 'Bump podspec version'
lane :bump_podspec_ci do
    version = version_bump_podspec(path: "../<YOUR_PODSPEC>.podspec", bump_type: ENV["PODSPEC_BUMP_TYPE"])
    cocoapods(podfile: "../App/Podfile")
    sh("echo PODSPEC_BUMP_NEW_VERSION=#{version} >> $GITHUB_ENV")
end
```

## 3. Add a reusable workflow that performs a version bump and commits and pushes the changes

This uses the Fastfile we defined in step 2. Substitute with whichever version bump mechanism is relevant to your project.

Add this workflow to `.github/workflows/bump-podspec.yml`:

```yaml
name: Bump Podspec
on:
  workflow_dispatch:
    inputs:
      bump_type:
        required: true
        type: choice
        options:
          - patch
          - minor
          - major
  workflow_call:
    inputs:
      bump_type: # "major", "minor" or "patch"
        required: true
        type: string
jobs:
  bump-podspec-version:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout project
        uses: actions/checkout@v3
        with:
          persist-credentials: false # Note 1
        
      - name: Set up Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '2.7.2'
          bundler-cache: true
          
      - name: Configure netrc for api.github.com
        uses: extractions/netrc@v1
        with:
          machine: api.github.com
          username: <YOUR_USERNAME> # Note 2
          password: ${{ secrets.<YOUR_TOKEN> }} # Note 2

      - name: Configure netrc for github.com
        uses: extractions/netrc@v1
        with:
          machine: github.com
          username: <YOUR_USERNAME> # Note 2
          password: ${{ secrets.<YOUR_TOKEN> }} # Note 2
          
      - name: Bump podspec version using Fastlane # Note 3
        env:
          PODSPEC_BUMP_TYPE: ${{ inputs.bump_type }}
        run: |
          cd .github
          bundle exec fastlane bump_podspec_ci
          
      - name: Commit changes
        run: |
          git config user.email "<YOUR_EMAIL>" # Note 2
          git config user.name "<YOUR_USERNAME>" # Note 2
          git diff HEAD
          git add <PATH/TO/YOUR_PODSPEC.podspec <PATH/TO/YOUR_PODFILE.lock> # Note 4
          git commit -m "Bump pod ${{ inputs.bump_type }} ${{ env.PODSPEC_BUMP_NEW_VERSION }}"
        
      - name: Push changes
        uses: ad-m/github-push-action@master
        with:
          github_token: ${{ secrets.<YOUR_TOKEN> }} # Note 5
          branch: ${{ github.ref }}
          
      - name: Display new version
        run: echo $PODSPEC_BUMP_NEW_VERSION
```

Notes:
1. `persist-credentials: false` is required to allow you to push your changes using your own token near the end
2. Replace `<YOUR_USERNAME>`, `<YOUR_EMAIL>` and `<YOUR_TOKEN>` with those of any agent that is allowed to perform git clones. This might be an organisation bot, or maybe even the Github bot; I didn't check
3. Replace this step with your mechanism for performing a version bump if needed
4. Add the files that get updated when you perform a version bump. The ones in this script are specific to iOS projects
5. Here, use the name of the personal access token you created in step 1. This is the part where a bot doesn't work.

## 4. Add labels

Add the labels that users of your repository can/should add to trigger version bumps.

1. Go to [https://github.com/YOUR_ORG/YOUR_REPO/labels](https://github.com/YOUR_ORG/YOUR_REPO/labels) (substituting placeholders)
2. Click "New label"
3. Add your labels. I suggest naming them `bump:major`, `bump:minor`, `bump:patch` and `bump:none`.

The last label, `bump:none`, is useful if you are going to force contributors to add any of these labels. Some pull requests just shouldn't have version bumps.

## 5. Add a workflow that detects labels when PRs get merged

When someone merges a pull request that had one of the labels you added in step 4, this workflow should kick off the reusable workflow you added in step 3.

Add a workflow like this one as `.github/workflows/version-bump-on-merge.yml`:

```yml
name: Version bump on merge
on:
  pull_request:
    branches: [ "main"] # Note 1
    types: [ closed ] # Note 2
jobs:
  perform-patch-bump:
    if: ${{ (github.event.pull_request.merged == true) && (contains(github.event.pull_request.labels.*.name, 'bump:patch')) }}
    secrets: inherit
    uses: <YOUR_ORG>/<YOUR_REPO>/.github/workflows/bump-podspec.yml@master # Note 3
    with:
      bump_type: patch
  perform-minor-bump:
    if: ${{ (github.event.pull_request.merged == true) && (contains(github.event.pull_request.labels.*.name, 'bump:minor')) }}
    secrets: inherit
    uses: <YOUR_ORG>/<YOUR_REPO>/.github/workflows/bump-podspec.yml@master # Note 3
    with:
      bump_type: minor
  perform-major-bump:
    if: ${{ (github.event.pull_request.merged == true) && (contains(github.event.pull_request.labels.*.name, 'bump:major')) }}
    secrets: inherit
    uses: <YOUR_ORG>/<YOUR_REPO>/.github/workflows/bump-podspec.yml@master # Note 3
    with:
      bump_type: major
```

Notes:
1. This specifies the branches which, when pull requests are merged *into* them, will trigger the version bump.
2. This workflow will get triggered by more events than just by merging a PR. However, the `if` predicates below will filter out any unwanted events.
3. Replace this with the full path to your reusable workflow; basically, when you view the workflow, this should be the URL without `https://github.com/`.

## 6. Make the labels required

Lastly, if you want to enforce that each PR either has a version bump or explicitly opts out (by using the `bump:none` label), add a check for your PRs.

Add the following workflow as `.github/workflows/has-version-bump-label.yml`:

```yml
name: Has version-bump label
on:
  pull_request:
    types: [opened, labeled, unlabeled, synchronize]
jobs:
  require-version-bump-label:
    runs-on: ubuntu-latest
    steps:
      - uses: mheap/github-action-required-labels@v2
        with:
          mode: exactly
          count: 1
          labels: "bump:patch, bump:minor, bump:major, bump:none"
```

Then set it as a required check for your protected branches (e.g. main):

1. Go to your branch protection rules at [https://github.com/YOUR_ORG/YOUR_REPO/settings/branch_protection_rules](https://github.com/YOUR_ORG/YOUR_REPO/settings/branch_protection_rules)
2. Check the "Require status checks to pass before merging" option
3. Under "Status checks that are required", add the workflow you just added

## Conclusion

And that should be everything! Your repo is now set up to perform magic version bumps when anyone adds one of your magic labels to their PRs.
