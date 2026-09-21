# The website assistant

The "Ask AI" button on opencoregroup.com. Visitors ask about OpenCore's services, work and
process; it answers from the site's own published copy and points them to a call or the contact
form when a person should take over.

## What it's built on

- **[eve](https://eve.dev)**, Vercel's agent framework. The agent is defined by the files in this
  directory; `withEve(nextConfig)` in [next.config.ts](../next.config.ts) mounts it at same-origin
  `/eve/v1/*`. eve's guides ship inside the package at `node_modules/eve/docs/`. Read the relevant
  one before changing eve-facing code.
- **Vercel AI Gateway.** The model is `deepseek/deepseek-v4-flash`: the job is short answers from a
  brief that already contains them, which a small fast model does well. Override with
  `ASSISTANT_MODEL`. Authenticated by `AI_GATEWAY_API_KEY` locally and by project OIDC on Vercel,
  so no provider key lives in this repo.

## This directory

| Path                           | What it is                                                                                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `agent.ts`                     | Runtime config: the model.                                                                                                                     |
| `instructions.md`              | The brief: who it is, how it answers, what it must not invent.                                                                                 |
| `instructions/site_summary.ts` | Adds the site summary to the brief when a conversation starts.                                                                                 |
| `lib/site-summary.ts`          | Fetches that summary from the site's own `/llms.txt` (cached for an hour).                                                                     |
| `channels/eve.ts`              | The HTTP boundary: an origin check and size cap for every caller, then anonymous visitors on the chat routes only, within a per-IP send limit. |
| `lib/rate-limit.ts`            | The in-memory send limiter the channel uses.                                                                                                   |
| `hooks/record_spend.ts`        | One `[assistant-spend]` log line per model call: tokens and billed cost.                                                                       |
| `tools/`                       | Only `disableTool()` files. See below.                                                                                                         |

### One source of truth for what it knows

The agent runs as its own service, outside Next, so it can't import the site's modules. It reads
`/llms.txt` instead, which the site already builds from its page copy and Sanity content. The
assistant therefore can't know anything the public pages don't say. To change what it knows,
change the site (or `src/app/llms.txt/route.ts`), not this directory.

Locally it reads production's `/llms.txt` by default. Set
`ASSISTANT_KNOWLEDGE_URL=http://localhost:3000/llms.txt` to test content changes.

### Default harness: disabled

eve gives every agent framework tools by default (shell, files, web access, subagents, follow-up
questions). A public Q&A bot needs none of them, and each is attack surface, so every one has a
`disableTool()` file in `tools/`. Keep those files, and after any eve upgrade re-check the live
surface in case new defaults appeared:

```bash
curl -s localhost:3000/eve/v1/info | jq '.tools.available[].name, .tools.disabledFramework'
```

As of eve 0.39.3, `available` is `load_skill` plus eve's inert `task_*` coordination tools, and
`disabledFramework` is `agent`, `ask_question`, `bash`, `read_file`, `todo`, `web_fetch`,
`web_search`, `write_file`. With the file and shell tools gone eve provisions no sandbox.

## Cost and abuse

The endpoint is public and anonymous. In order of how much each actually protects the bill:

1. **A budget on the AI Gateway key / project.** The only hard ceiling. Set one.
2. **The channel gate** (`channels/eve.ts`): same-origin browsers only, 16 KB per send, 20 sends
   per IP per ten minutes. The limiter is in-memory, so on serverless it is a speed bump, not a
   wall. Move it to Redis/KV if abuse shows up in the `[assistant-spend]` logs.
3. **The small model.** A flooded endpoint costs cents, not dollars, per thousand answers.

## Frontend

`src/components/assistant/`: `AssistantProvider` (open/close state, mounts the floating launcher and
lazy-loads the panel), `AssistantPanel` (`useEveAgent` from `eve/react`), `AssistantMessage`
(renders the small Markdown subset the brief allows, and nothing else, since model output is
untrusted). Copy lives in `src/lib/constants/assistant.ts`.
