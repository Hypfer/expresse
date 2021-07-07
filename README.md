This is a patched version of expresse for use with Valetudo

Notable changes

- Maximum of 5 open connections per hub. If a 6. client connects, the earliest connection will be closed
- Maximum of 200kb in-flight per connection to avoid OOM issues. Additional messages will be dropped silently
- No typescript
