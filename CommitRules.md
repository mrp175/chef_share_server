# Chef-Share-Server

**Rules for committing:**
All commits should fall into one of these categories: 

* fix: Patches a bug in your codebase.
* feat: Introduces a new feature to the codebase.
* BREAKING CHANGE:  A commit that has a footer BREAKING CHANGE:, or appends a ! after the type/scope, introduces a breaking change. A BREAKING CHANGE can be part of commits of any type.
* style: Adds features and updates related to styling.
* test: Should be used for anything related to testing.
* docs: Should be used for anything related to documentation.
* chore: Should be used for regular code maintenance.
* misc: Should be used for anything else that does not fall into these categories.



**Here is an example of a good commit message:**
Capitalized, short (50 chars or less) summary

More detailed explanatory text, if necessary.  Wrap it to about 72
characters or so.  In some contexts, the first line is treated as the
subject of an email and the rest of the text as the body.  The blank
line separating the summary from the body is critical (unless you omit
the body entirely); tools like rebase can get confused if you run the
two together.

Write your commit message in the imperative: "Fix bug" and not "Fixed bug"
or "Fixes bug."  This convention matches up with commit messages generated
by commands like git merge and git revert.

Further paragraphs come after blank lines.

- Bullet points are okay, too

- Typically a hyphen or asterisk is used for the bullet, followed by a
  single space, with blank lines in between, but conventions vary here

- Use a hanging indent

If you use an issue tracker, add a reference(s) to them at the bottom,
like so:

Resolves: #123
