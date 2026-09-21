// Removes one of eve's framework-default tools. The website assistant answers from its brief
// and nothing else: no shell, files, web access, subagents or follow-up prompts.
// See agent/README.md ("Default harness").
import { disableTool } from "eve/tools";

export default disableTool();
