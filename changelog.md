## 1.0.0 - 2025-11-20
* refactor: rename API modules from agentManagement to agents and phoneNumberManagement to phoneNumbers
* This refactoring renames two core API modules to improve clarity and consistency:
* Renamed `agentManagement` to `agents` for simpler, more intuitive naming
* Renamed `phoneNumberManagement` to `phoneNumbers` for consistency with the new naming convention
* The changes include updating all client classes, request/response types, method signatures, documentation examples, and test files to reflect the new module names. This is a breaking change that affects the public API surface, requiring users to update their import statements and client method calls.
* Key changes:
* Rename AgentManagementClient to AgentsClient with updated method signatures
* Rename PhoneNumberManagementClient to PhoneNumbersClient with updated method signatures
* Update all type definitions from *AgentManagement* to *Agents* pattern
* Update all type definitions from *PhoneNumberManagement* to *PhoneNumbers* pattern
* Update documentation and code examples throughout README and reference files
* Remove changelog.md file as part of repository cleanup
* Update test files to reflect new client naming
* 🌿 Generated with Fern

