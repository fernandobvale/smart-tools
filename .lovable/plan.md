

## GitHub Security Alert: jsPDF PDF Object Injection (CVE-2026-25755)

### What is this?

This is a vulnerability in `jsPDF` versions **before 4.2.0** where the `addJS()` method doesn't sanitize input, allowing attackers to inject malicious PDF objects. However, **your project doesn't use `addJS()` at all** — you only use `jsPDF` for generating receipts and course reports via `doc.text()`, `doc.addImage()`, and `jspdf-autotable`.

### Current State

Your `package.json` already declares `"jspdf": "^4.2.0"`, which was updated in the previous security hardening round. The fix is simply ensuring the **lock file** resolves to `4.2.0` or later.

### Plan

1. **Force reinstall jsPDF to `>=4.2.0`** — re-add the dependency at `^4.2.0` to regenerate the lock file entry, which should clear the GitHub Dependabot alert.

That's it — one step. No code changes needed since `addJS()` is not used anywhere in the project.

