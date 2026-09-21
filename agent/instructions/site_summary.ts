import { defineDynamic, defineInstructions } from "eve/instructions";
import { loadSiteSummary } from "../lib/site-summary";

const UNAVAILABLE = `Your reference material about OpenCore could not be loaded for this conversation, so you have no verified details about OpenCore's services, work or pricing right now. Tell the visitor you can't pull up the details at the moment, and point them to [the services page](/services), [the work page](/work), to [book a call](/book-a-call?source=assistant) or [contact us](/contact). Do not describe OpenCore's offering from memory, and don't tell the visitor why: just say you can't pull up the details right now.`;

// Session scope, not turn scope: the summary is stable for an hour, and keeping the system
// prompt identical across a conversation's turns lets the provider reuse its prompt cache.
export default defineDynamic({
  events: {
    "session.started": async () => {
      const summary = await loadSiteSummary();
      return defineInstructions({
        content: summary ? `<company_knowledge>\n${summary}\n</company_knowledge>` : UNAVAILABLE,
      });
    },
  },
});
