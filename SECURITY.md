# Security policy

This is the default policy for every repository in the xano-sdk organization
that does not carry its own.

## Reporting a vulnerability

Report it privately, not in a public issue: on the repository's **Security**
tab, choose **Report a vulnerability** to open a private security advisory.

Include what you found, how to reproduce it, and what an attacker could do with
it. A proof of concept helps; a redacted one is fine.

We will acknowledge the report and keep you updated as we work through it. We
are a small team and do not promise a fixed response window — if you have not
heard anything after a week, please ping the advisory thread.

Please give us a chance to ship a fix before disclosing publicly. We will credit
you in the release notes unless you would rather we did not.

## Supported versions

Only the latest published release of each package receives fixes. There are no
maintained release branches — upgrade to the newest version to pick up security
patches.

## Scope

This policy covers the package published from the repository and the
repository itself. The `xanosdk` CLI and `@xano/sdk` have their own policy in
[xano-sdk/sdk](https://github.com/xano-sdk/sdk). Vulnerabilities in the Xano
platform itself are out of scope here — report those through Xano's own security
channels.

When sharing logs or code in an issue, redact tokens, API keys and instance
URLs first.
