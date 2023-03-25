git-flow is a collection of Git extensions to provide high-level repository operations
for Vincent Driessen's [branching model](http://nvie.com/git-model "original
blog post").

The 60 second, tl;dr version
----------------------------
You commit all finished work that's intended to go to production on the develop branch.  You can commit and push as often as you'd like, as long as the code is production ready.  The master branch is reserved for code that is currently in production.  Never check anything into master directly.  Doing so makes our production environment and our master branch out of sync.

If you're working on a large feature, you should create your own feature branch and do your work there.  This keeps your broken code out of develop and doesn't disturb others.  It also lets you switch back to develop to help out, if needed.  You create your feature branch with:
	git flow feature start <name>
When the feature is complete, you use:
	git flow feature finish <name>

Gitflow will handle merging your feature back into the develop branch.  Cool, huh?
When it's time to push a release to master, gitflow will merge develop into master and tag the release with a similar command.  When we need to do a hotfix, we use another similar command that checks out the master branch into a hotfix branch.  We make the fix, then run a Gitflow command to merge the hotfix back into master and develop.  Want to know more about how and why this is a kick-ass git strategy?  Keep reading.

Getting started
---------------
For the best introduction to get started with `git flow`, please read Jeff
Kreeftmeijer's blog post:

[http://jeffkreeftmeijer.com/2010/why-arent-you-using-git-flow/](http://jeffkreeftmeijer.com/2010/why-arent-you-using-git-flow/)

Or have a look at one of these screen casts:

* [How to use a scalable Git branching model called git-flow](http://buildamodule.com/video/change-management-and-version-control-deploying-releases-features-and-fixes-with-git-how-to-use-a-scalable-git-branching-model-called-gitflow) (by Build a Module)
* [A short introduction to git-flow](http://vimeo.com/16018419) (by Mark Derricutt)
* [On the path with git-flow](http://codesherpas.com/screencasts/on_the_path_gitflow.mov) (by Dave Bock)


Installing git-flow
-------------------
See the Wiki for up-to-date [Installation Instructions](https://github.com/nvie/gitflow/wiki/Installation).


Integration with your shell
---------------------------
For those who use the [Bash](http://www.gnu.org/software/bash/) or
[ZSH](http://www.zsh.org) shell, please check out the excellent work on the
[git-flow-completion](http://github.com/bobthecow/git-flow-completion) project
by [bobthecow](http://github.com/bobthecow). It offers tab-completion for all
git-flow subcommands and branch names.


FAQ
---
See the [FAQ](http://github.com/nvie/gitflow/wiki/FAQ) section of the project
Wiki.


### Creating feature/release/hotfix/support branches

* To list/start/finish feature branches, use:

  		git flow feature
  		git flow feature start <name> [<base>]
  		git flow feature finish <name>

  For feature branches, the `<base>` arg must be a commit on `develop`.

* To push/pull a feature branch to the remote repository, use:

  		git flow feature publish <name>
		git flow feature pull <remote> <name>

* To list/start/finish release branches, use:

  		git flow release
  		git flow release start <release> [<base>]
  		git flow release finish <release>

  For release branches, the `<base>` arg must be a commit on `develop`.

* To list/start/finish hotfix branches, use:

  		git flow hotfix
  		git flow hotfix start <release> [<base>]
  		git flow hotfix finish <release>

  For hotfix branches, the `<base>` arg must be a commit on `master`.

* To list/start support branches, use:

  		git flow support
  		git flow support start <release> <base>

  For support branches, the `<base>` arg must be a commit on `master`.


The original README that this content was used from, with permission, was Copyright 2010 Vincent Driessen. All rights reserved.
