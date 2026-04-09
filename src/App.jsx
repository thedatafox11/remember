import { useState, useEffect, useCallback, useRef } from "react";

// ─── Demo data ────────────────────────────────────────────────────────────────
const DEMO_BOOKMARKS = [
  { id: 1,  date: "2024-04-01", author: "Paul Graham",      handle: "paulg",    text: "The most valuable people I know are the ones who can make things. Not manage things, not analyze things — make things.",                                                                avatar: "PG", likes: 4821,  reposts: 1203 },
  { id: 2,  date: "2024-04-03", author: "Andrej Karpathy",  handle: "karpathy", text: "The hottest new programming language is English. Prompt engineering is a real thing, and it's more like programming than most people realize.",                                         avatar: "AK", likes: 18234, reposts: 5102 },
  { id: 3,  date: "2024-04-10", author: "Naval Ravikant",   handle: "naval",    text: "Read what you love until you love to read. The moment it feels like a chore, you're reading the wrong thing.",                                                                          avatar: "NR", likes: 9431,  reposts: 2871 },
  { id: 4,  date: "2024-04-18", author: "Sam Altman",       handle: "sama",     text: "One of the most important things I've learned: you can get a huge amount done if you focus on one thing at a time and say no to almost everything else.",                               avatar: "SA", likes: 7223,  reposts: 1984 },
  { id: 5,  date: "2024-03-05", author: "Sahil Lavingia",   handle: "shl",      text: "Build something 100 people love, not something 1 million people kind of like. The intensity of the relationship matters more than the size.",                                           avatar: "SL", likes: 5512,  reposts: 1432 },
  { id: 6,  date: "2024-03-09", author: "Pieter Levels",    handle: "levelsio", text: "Idea → Build → Launch → Market → Grow → Monetize → Automate → Exit. Most people stop after step 1 or never start.",                                                                    avatar: "PL", likes: 11823, reposts: 3241 },
  { id: 7,  date: "2024-03-14", author: "Andrej Karpathy",  handle: "karpathy", text: "Neural nets are not magic. They're optimization machines. Given enough data and compute, they find structure. The magic is the structure was there to begin with.",                      avatar: "AK", likes: 8721,  reposts: 2103 },
  { id: 8,  date: "2024-03-20", author: "Derek Sivers",     handle: "sivers",   text: "If more information was the answer, we'd all be billionaires with perfect abs. The problem is never information — it's execution and commitment.",                                       avatar: "DS", likes: 6234,  reposts: 1876 },
  { id: 9,  date: "2024-03-27", author: "Julie Zhuo",       handle: "joulee",   text: "The best managers I know spend more time listening than talking. They ask more questions than they give answers. They make people feel heard before they feel directed.",                avatar: "JZ", likes: 4102,  reposts: 987  },
  { id: 10, date: "2024-02-04", author: "Patrick Collison", handle: "patrickc", text: "A disproportionate fraction of important discoveries come from people who are new to a field. Experts optimize; newcomers question.",                                                    avatar: "PC", likes: 7823,  reposts: 2012 },
  { id: 11, date: "2024-02-11", author: "Naval Ravikant",   handle: "naval",    text: "Desire is a contract you make with yourself to be unhappy until you get what you want. Choose your desires carefully.",                                                                  avatar: "NR", likes: 14231, reposts: 4102 },
  { id: 12, date: "2024-02-19", author: "Lenny Rachitsky",  handle: "lennysan", text: "The best product managers I've seen all share one trait: they are obsessed with the problem, not the solution. Solutions change. Problems are what matter.",                           avatar: "LR", likes: 5671,  reposts: 1432 },
  { id: 13, date: "2024-02-24", author: "Paul Graham",      handle: "paulg",    text: "Startups don't die from competition. They die from running out of money, internal conflict, or giving up. Most external threats are overrated.",                                         avatar: "PG", likes: 9023,  reposts: 2634 },
  { id: 14, date: "2024-01-07", author: "Sam Altman",       handle: "sama",     text: "AI will be the most transformative technology since the internet, and probably more so. We are at the very beginning.",                                                                 avatar: "SA", likes: 22341, reposts: 7102 },
  { id: 15, date: "2024-01-15", author: "Sahil Lavingia",   handle: "shl",      text: "The goal isn't to build a big company. The goal is to build a meaningful life. Sometimes those overlap. Often they don't.",                                                             avatar: "SL", likes: 8123,  reposts: 2341 },
  { id: 16, date: "2024-01-22", author: "Julie Zhuo",       handle: "joulee",   text: "Feedback given in public is criticism. Feedback given in private is a gift. Most people confuse the two.",                                                                               avatar: "JZ", likes: 6234,  reposts: 1823 },
];

const DEMO_CLASSIFIED = [
  { id: 1,  topic: "Thinking & Ideas", summary: "Making things is the highest form of value — more than managing or analysing.",       actions: ["Write or ship one small thing today — a post, a tool, a sketch", "List 3 things you have been analysing that you could just start making"], execute: "build" },
  { id: 2,  topic: "AI & Tech",        summary: "Natural language is becoming the new programming interface.",                         actions: ["Describe a feature you want in plain English and give it to an LLM", "Try prompt engineering on your next coding task"], execute: "build" },
  { id: 3,  topic: "Life & Mindset",   summary: "Genuine curiosity makes reading feel effortless rather than obligatory.",             actions: ["Drop one thing you are forcing yourself to read", "Pick up something you are genuinely curious about — no guilt"], execute: "reflect" },
  { id: 4,  topic: "Productivity",     summary: "Deep focus and saying no are the real levers of output.",                            actions: ["Identify your one most important task tomorrow and protect 2hrs for it", "Find one recurring commitment you could say no to this week"], execute: "notion" },
  { id: 5,  topic: "Startups",         summary: "A small, intensely loyal user base beats mass indifference.",                        actions: ["Name 10 specific people who would genuinely love what you are building", "Talk to one of them today — not to pitch, to listen"], execute: "build" },
  { id: 6,  topic: "Startups",         summary: "Most people stall before they ever reach distribution or monetisation.",              actions: ["Map where you honestly are in the Idea to Exit chain", "Pick the next step and set a deadline for this week"], execute: "notion" },
  { id: 7,  topic: "AI & Tech",        summary: "Neural networks find latent structure — they do not conjure it from nothing.",        actions: ["Ask an LLM to explain a model you use but do not fully understand", "Read one short explainer on how transformers work"], execute: "build" },
  { id: 8,  topic: "Life & Mindset",   summary: "More information is not the bottleneck — execution and commitment are.",              actions: ["Identify one thing you know enough about to start but have not", "Set a 20-minute timer and take the first step right now"], execute: "reflect" },
  { id: 9,  topic: "Leadership",       summary: "Great managers create space to be heard before directing.",                          actions: ["In your next 1:1, ask two questions before giving any direction", "Notice how often you speak vs listen in meetings this week"], execute: "notion" },
  { id: 10, topic: "Thinking & Ideas", summary: "Beginners ask better questions because they have not learned what is impossible.",    actions: ["Approach one familiar problem as if you had never seen it before", "Write 3 naive questions about your current project"], execute: "reflect" },
  { id: 11, topic: "Life & Mindset",   summary: "Every desire is a standing agreement to feel dissatisfied until fulfilled.",         actions: ["List your top 3 active desires — are they worth the ongoing cost?", "Pick one to either pursue fully or consciously release"], execute: "reflect" },
  { id: 12, topic: "Productivity",     summary: "Obsessing over the problem, not the solution, is what separates great PMs.",        actions: ["Write a one-paragraph problem statement — no solutions allowed", "Share it with someone and ask if they feel the pain too"], execute: "notion" },
  { id: 13, topic: "Startups",         summary: "Startups collapse from internal failure, not external competition.",                 actions: ["Audit your team biggest internal friction point right now", "Have one honest conversation about it this week"], execute: "notion" },
  { id: 14, topic: "AI & Tech",        summary: "We are at the very start of an AI shift bigger than the internet.",                  actions: ["Identify one part of your work AI could meaningfully improve", "Spend 30 mins experimenting with an AI tool in that area today"], execute: "build" },
  { id: 15, topic: "Life & Mindset",   summary: "A meaningful life and a big company are separate goals that rarely overlap.",        actions: ["Write down what meaningful actually looks like for you specifically", "Check whether your current work moves toward or away from that"], execute: "reflect" },
  { id: 16, topic: "Leadership",       summary: "Private feedback is a gift; public feedback is just criticism.",                    actions: ["Think of feedback you owe someone — schedule a private conversation", "Next time you want to correct someone, wait until you are 1:1"], execute: "notion" },
];

// ─── X archive parser ─────────────────────────────────────────────────────────
function parseXArchive(text) {
  const match = text.match(/=\s*(\[[\s\S]*\])/);
  if (!match) throw new Error("Could not parse this file. Make sure you selected bookmarks.js from your X archive.");
  const raw = JSON.parse(match[1]);
  return raw.map((item, i) => {
    const tweet = item.tweet || item;
    const user = tweet.user || {};
    const handle = user.screen_name || "unknown";
    const author = user.name || handle;
    const avatar = author.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "??";
    return {
      id: i + 1,
      tweetId: tweet.id_str || tweet.id || null,
      date: tweet.created_at ? new Date(tweet.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      author, handle, avatar,
      text: (tweet.full_text || tweet.text || "").replace(/https?:\/\/t\.co\/\S+/g, "").trim(),
      likes: parseInt(tweet.favorite_count || 0),
      reposts: parseInt(tweet.retweet_count || 0),
    };
  }).filter(b => b.text.length > 0);
}

// ─── AI classification ────────────────────────────────────────────────────────
async function classifyWithAI(bookmarks, isDemo) {
  if (isDemo) {
    await new Promise(res => setTimeout(res, 1800));
    return DEMO_CLASSIFIED;
  }
  const prompt = `You are a bookmark organiser and action coach. For each tweet: classify it, summarise it, and generate 2 specific action steps.
Choose topic from: AI & Tech, Startups, Life & Mindset, Productivity, Thinking & Ideas, Leadership, Design, Finance, Health, Other.
Choose execute from: "build" (involves making/coding), "notion" (process/workflow/task), "reflect" (mindset/personal).
Return ONLY a JSON array, no markdown. Each item: {"id": number, "topic": "string", "summary": "one short sentence", "actions": ["action 1", "action 2"], "execute": "build|notion|reflect"}.
Tweets:
${bookmarks.slice(0, 80).map(b => `ID ${b.id} (@${b.handle}): ${b.text.slice(0, 200)}`).join("\n")}`;

  const res = await fetch("/api/classify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2000, messages: [{ role: "user", content: prompt }] }),
  });
  const data = await res.json();
  const text = data.content.map(i => i.text || "").join("").replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}

// ─── Colours ──────────────────────────────────────────────────────────────────
const TOPIC_COLORS = {
  "AI & Tech":        { bg: "rgba(99,179,237,0.1)",   border: "rgba(99,179,237,0.25)",   dot: "#63b3ed" },
  "Startups":         { bg: "rgba(154,230,180,0.1)",  border: "rgba(154,230,180,0.25)",  dot: "#9ae6b4" },
  "Life & Mindset":   { bg: "rgba(246,173,85,0.1)",   border: "rgba(246,173,85,0.25)",   dot: "#f6ad55" },
  "Productivity":     { bg: "rgba(183,148,246,0.1)",  border: "rgba(183,148,246,0.25)",  dot: "#b794f6" },
  "Thinking & Ideas": { bg: "rgba(252,129,129,0.1)",  border: "rgba(252,129,129,0.25)",  dot: "#fc8181" },
  "Leadership":       { bg: "rgba(129,230,217,0.1)",  border: "rgba(129,230,217,0.25)",  dot: "#81e6d9" },
  "Design":           { bg: "rgba(237,137,54,0.1)",   border: "rgba(237,137,54,0.25)",   dot: "#ed8936" },
  "Finance":          { bg: "rgba(72,187,120,0.1)",   border: "rgba(72,187,120,0.25)",   dot: "#48bb78" },
  "Health":           { bg: "rgba(245,101,101,0.1)",  border: "rgba(245,101,101,0.25)",  dot: "#f56565" },
  "Other":            { bg: "rgba(160,174,192,0.1)",  border: "rgba(160,174,192,0.25)",  dot: "#a0aec0" },
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const formatDate = d => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const getMonthLabel = d => { const dt = new Date(d); return `${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`; };

// ─── Import screen ────────────────────────────────────────────────────────────
function ImportScreen({ onImport, onDemo, onClose }) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);
  const [showFileInstructions, setShowFileInstructions] = useState(false);
  const fileRef = useRef();

  const handleFile = file => {
    if (!file) return;
    setError(null);
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const bookmarks = parseXArchive(e.target.result);
        if (!bookmarks.length) throw new Error("No bookmarks found in this file.");
        onImport(bookmarks);
      } catch (err) { setError(err.message); }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0b0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&family=Lora:ital,wght@0,400;1,400&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{ maxWidth: "460px", width: "100%", animation: "fadeUp 0.5s ease forwards" }}>

        {/* Logo */}
        {/* Back link */}
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b6560", fontSize: "12px", fontFamily: "'DM Mono',monospace", cursor: "pointer", padding: "0 0 32px", letterSpacing: "0.04em", display: "block" }}>
          ← back to library
        </button>

        <div style={{ marginBottom: "40px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b6560", fontFamily: "'DM Mono', monospace", marginBottom: "6px" }}>welcome to</div>
          <h1 style={{ margin: "0 0 10px", fontSize: "44px", fontWeight: 300, letterSpacing: "-0.03em", color: "#f0ece4" }}>
            remember<span style={{ color: "#c8b89a" }}>.</span>
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#8a8278", lineHeight: "1.65", fontFamily: "'Lora', serif" }}>
            Save tweets. Get clarity. Take action.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "18px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
          <span style={{ fontSize: "10px", color: "#7a7570", fontFamily: "'DM Mono', monospace" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
        </div>

        {/* File import */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current.click()}
          style={{
            border: `1px dashed ${dragging ? "rgba(200,184,154,0.6)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: "14px", padding: "28px 24px", textAlign: "center", cursor: "pointer",
            background: dragging ? "rgba(200,184,154,0.04)" : "rgba(255,255,255,0.015)",
            transition: "all 0.2s ease", marginBottom: "8px",
          }}
        >
          <input ref={fileRef} type="file" accept=".js,.json" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
          <div style={{ fontSize: "22px", marginBottom: "8px", opacity: 0.3 }}>📂</div>
          <div style={{ fontSize: "13px", fontWeight: 500, color: "#a09890", marginBottom: "4px" }}>
            Import <code style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "#c8b89a", background: "rgba(200,184,154,0.08)", padding: "1px 5px", borderRadius: "4px" }}>bookmarks.js</code> from X archive
          </div>
          <div style={{ fontSize: "11px", color: "#7a7570", fontFamily: "'DM Mono', monospace" }}>drag & drop or click to browse</div>
        </div>

        {error && (
          <div style={{ background: "rgba(252,129,129,0.07)", border: "1px solid rgba(252,129,129,0.18)", borderRadius: "10px", padding: "10px 14px", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "#fc8181", fontFamily: "'DM Mono', monospace" }}>{error}</span>
          </div>
        )}

        {/* Collapsible instructions */}
        <button onClick={() => setShowFileInstructions(!showFileInstructions)}
          style={{ background: "none", border: "none", color: "#8a8278", fontSize: "11px", fontFamily: "'DM Mono', monospace", cursor: "pointer", padding: "4px 0", letterSpacing: "0.04em", marginBottom: showFileInstructions ? "10px" : "18px" }}>
          {showFileInstructions ? "▾ hide instructions" : "▸ how to get the file"}
        </button>

        {showFileInstructions && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "14px 16px", marginBottom: "18px" }}>
            {["Go to X → Settings → Your Account", "Tap Download an archive of your data", "Wait for the download email (can take hours)", "Unzip it — find bookmarks.js inside", "Drop it above ↑"].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", marginBottom: i < 4 ? "6px" : 0 }}>
                <span style={{ fontSize: "10px", color: "#c8b89a", fontFamily: "'DM Mono', monospace", fontWeight: 600, flexShrink: 0, marginTop: "2px" }}>{i + 1}</span>
                <span style={{ fontSize: "12px", color: "#a09890", lineHeight: "1.5" }}>{s}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.04)" }} />
          <span style={{ fontSize: "10px", color: "#7a7570", fontFamily: "'DM Mono', monospace" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.04)" }} />
        </div>

        <button onClick={onDemo}
          style={{ width: "100%", padding: "12px", borderRadius: "12px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#7a7570", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.2s ease" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#c8c0b8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#7a7570"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
        >
          Try with demo bookmarks
        </button>
      </div>
    </div>
  );
}

// ─── Bookmark card ────────────────────────────────────────────────────────────
function BookmarkCard({ bookmark, index }) {
  const [visible, setVisible] = useState(false);
  const c = TOPIC_COLORS[bookmark.topic] || TOPIC_COLORS["Other"];
  useEffect(() => { const t = setTimeout(() => setVisible(true), index * 30); return () => clearTimeout(t); }, [index]);

  return (
    <div style={{
      background: "#141210", border: "1px solid rgba(255,255,255,0.055)", borderRadius: "14px",
      padding: "20px", display: "flex", flexDirection: "column", gap: "12px",
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(14px)",
      transition: "opacity 0.35s ease, transform 0.35s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${c.dot}40,${c.dot}15)`, border: `1px solid ${c.dot}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: c.dot, fontFamily: "'DM Mono',monospace", flexShrink: 0 }}>
          {bookmark.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#e8e0d6", letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{bookmark.author}</div>
          <div style={{ fontSize: "11px", color: "#8a7e78", fontFamily: "'DM Mono',monospace" }}>@{bookmark.handle}</div>
        </div>
        <div style={{ fontSize: "10px", color: "#7e7268", fontFamily: "'DM Mono',monospace", flexShrink: 0 }}>{formatDate(bookmark.date)}</div>
      </div>

      <p style={{ margin: 0, fontSize: "13.5px", lineHeight: "1.7", color: "#d4cdc6", fontFamily: "'Lora',Georgia,serif", letterSpacing: "0.005em" }}>{bookmark.text}</p>

      {bookmark.summary && (
        <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: "8px", padding: "10px 12px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
          <span style={{ fontSize: "9px", color: "#c8b89a", fontFamily: "'DM Mono',monospace", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0, marginTop: "2px" }}>TL;DR</span>
          <span style={{ fontSize: "12px", color: "#c0b8b0", lineHeight: "1.55", fontStyle: "italic" }}>{bookmark.summary}</span>
        </div>
      )}

      {bookmark.actions && bookmark.actions.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ fontSize: "9px", color: "#7a7570", fontFamily: "'DM Mono',monospace", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Actions</div>
          {bookmark.actions.map((action, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "10px", color: c.dot, fontFamily: "'DM Mono',monospace", fontWeight: 700, flexShrink: 0, marginTop: "2px" }}>{i + 1}</span>
              <span style={{ fontSize: "12px", color: "#c8c0b8", lineHeight: "1.5" }}>{action}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: c.dot, fontFamily: "'DM Mono',monospace", display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: c.dot, display: "inline-block" }} />{bookmark.topic}
        </span>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>

          {/* Tweet link */}
          <a href={bookmark.tweetId ? `https://twitter.com/${bookmark.handle}/status/${bookmark.tweetId}` : `https://twitter.com/${bookmark.handle}`} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: "9px", padding: "3px 8px", borderRadius: "20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#8a8278", fontFamily: "'DM Mono',monospace", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.635 5.903-5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            View
          </a>

          {/* Claude button */}
          {(bookmark.execute === "build" || bookmark.execute === "reflect") && (
            <a href={`https://claude.ai/new?q=${encodeURIComponent(
                `I saved this post by ${bookmark.author}:\n\n"${bookmark.text}"\n\nKey idea: ${bookmark.summary}\n\nMy action steps were:\n${(bookmark.actions||[]).map((a,i)=>`${i+1}. ${a}`).join('\n')}\n\nHelp me take action on this.`
              )}`} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: "9px", padding: "3px 8px", borderRadius: "20px", background: "rgba(99,179,237,0.1)", border: "1px solid rgba(99,179,237,0.25)", color: "#63b3ed", fontFamily: "'DM Mono',monospace", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M4.304 15.978c.142.355.296.694.462 1.015l-1.6 4.8a.667.667 0 0 0 .84.84l4.8-1.6c.321.166.66.32 1.015.462L12 24l2.179-2.505c.355-.142.694-.296 1.015-.462l4.8 1.6a.667.667 0 0 0 .84-.84l-1.6-4.8c.166-.321.32-.66.462-1.015L24 12l-2.504-2.178a13.17 13.17 0 0 0-.462-1.015l1.6-4.8a.667.667 0 0 0-.84-.84l-4.8 1.6a13.17 13.17 0 0 0-1.015-.463L12 0 9.821 2.504c-.355.142-.694.297-1.015.463l-4.8-1.6a.667.667 0 0 0-.84.84l1.6 4.8A13.17 13.17 0 0 0 4.304 8.02L1.8 10.197 0 12l2.504 2.178c.142.321.296.66.462.978z"/></svg>
              Claude
            </a>
          )}

          {/* Notion button */}
          {bookmark.execute === "notion" && (
            <a href={`https://notion.so/new?title=${encodeURIComponent(bookmark.summary || bookmark.text.slice(0,60))}&content=${encodeURIComponent(
                `Source: ${bookmark.author} (@${bookmark.handle})\n\n"${bookmark.text}"\n\nKey idea: ${bookmark.summary}\n\nAction steps:\n${(bookmark.actions||[]).map((a,i)=>`${i+1}. ${a}`).join('\n')}`
              )}`} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: "9px", padding: "3px 8px", borderRadius: "20px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", color: "#d4cdc6", fontFamily: "'DM Mono',monospace", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.047.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/></svg>
              Notion
            </a>
          )}

          <span style={{ fontSize: "10px", color: "#6b6560", fontFamily: "'DM Mono',monospace" }}>♥ {Number(bookmark.likes).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function MonthDivider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", margin: "32px 0 16px" }}>
      <div style={{ fontSize: "10px", color: "#7a7570", fontFamily: "'DM Mono',monospace", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
    </div>
  );
}

// ─── Add tweet panel ──────────────────────────────────────────────────────────
function AddTweetPanel({ onAdd, onClose }) {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  // Parse handle and tweet ID from URL
  const parseUrl = (u) => {
    const m = u.match(/(?:twitter\.com|x\.com)\/([^/]+)\/status\/(\d+)/);
    return m ? { handle: m[1], tweetId: m[2] } : null;
  };

  const handleAdd = async () => {
    if (!text.trim()) { setError("Please paste the tweet text."); return; }
    setError(null);
    setAdding(true);
    const parsed = parseUrl(url);
    const raw = [{
      id: Date.now(),
      tweetId: parsed?.tweetId || null,
      handle: parsed?.handle || "unknown",
      author: parsed?.handle || "unknown",
      avatar: (parsed?.handle || "??").slice(0, 2).toUpperCase(),
      text: text.trim(),
      date: new Date().toISOString().split("T")[0],
      likes: 0,
      reposts: 0,
    }];

    try {
      const prompt = `You are a bookmark organiser and action coach. For this tweet: classify it, summarise it, and generate 2 specific action steps.
Choose topic from: AI & Tech, Startups, Life & Mindset, Productivity, Thinking & Ideas, Leadership, Design, Finance, Health, Other.
Choose execute from: "build" (involves making/coding), "notion" (process/workflow/task), "reflect" (mindset/personal).
Return ONLY a JSON array, no markdown. Each item: {"id": number, "topic": "string", "summary": "one short sentence", "actions": ["action 1", "action 2"], "execute": "build|notion|reflect"}.
Tweet:
ID ${raw[0].id} (@${raw[0].handle}): ${raw[0].text}`;

      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 500, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      const resText = data.content.map(i => i.text || "").join("").replace(/```json|```/g, "").trim();
      const results = JSON.parse(resText);
      const r = results[0];
      onAdd({ ...raw[0], topic: r?.topic || "Other", summary: r?.summary || null, actions: r?.actions || [], execute: r?.execute || null });
    } catch {
      onAdd({ ...raw[0], topic: "Other", summary: null, actions: [], execute: null });
    }
    setAdding(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#141210", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "28px", width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "16px" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "10px", color: "#7a7570", fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "3px" }}>Add bookmark</div>
            <div style={{ fontSize: "16px", fontWeight: 500, color: "#f0ece4", letterSpacing: "-0.01em" }}>Paste a tweet</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#7a7570", cursor: "pointer", fontSize: "20px", padding: "4px" }}>×</button>
        </div>

        {/* URL field */}
        <div>
          <div style={{ fontSize: "10px", color: "#7a7570", fontFamily: "'DM Mono',monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Tweet URL <span style={{ color: "#4a4540" }}>(optional — for the View link)</span></div>
          <input value={url} onChange={e => setUrl(e.target.value)}
            placeholder="https://x.com/username/status/123..."
            style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 14px", color: "#f0ece4", fontSize: "13px", fontFamily: "'DM Sans',sans-serif" }}
          />
        </div>

        {/* Tweet text field */}
        <div>
          <div style={{ fontSize: "10px", color: "#7a7570", fontFamily: "'DM Mono',monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Tweet text <span style={{ color: "#c8b89a" }}>*</span></div>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Paste the tweet text here..."
            rows={4}
            style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 14px", color: "#f0ece4", fontSize: "13px", fontFamily: "'Lora',serif", lineHeight: "1.6", resize: "vertical", outline: "none" }}
          />
        </div>

        {error && <div style={{ fontSize: "12px", color: "#fc8181", fontFamily: "'DM Mono',monospace" }}>{error}</div>}

        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: "10px", background: "transparent", border: "1px solid rgba(255,255,255,0.07)", color: "#7a7570", fontSize: "13px", fontFamily: "'DM Sans',sans-serif", cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={handleAdd} disabled={adding || !text.trim()} style={{
            flex: 2, padding: "11px", borderRadius: "10px", cursor: adding || !text.trim() ? "not-allowed" : "pointer",
            background: adding || !text.trim() ? "rgba(200,184,154,0.08)" : "rgba(200,184,154,0.15)",
            border: "1px solid rgba(200,184,154,0.25)", color: adding || !text.trim() ? "#7a7570" : "#c8b89a",
            fontSize: "13px", fontFamily: "'DM Sans',sans-serif", fontWeight: 500,
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            transition: "all 0.2s ease",
          }}>
            {adding ? (
              <><div style={{ width: 12, height: 12, borderRadius: "50%", border: "1.5px solid #c8b89a", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} /> AI organising…</>
            ) : "Add to library"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Library view ─────────────────────────────────────────────────────────────
function LibraryView({ bookmarks, setBookmarks, aiStatus, isDemo, onImport, onClearAll, onExitDemo }) {
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [mounted, setMounted] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  const handleAdd = (bookmark) => {
    setBookmarks(prev => [bookmark, ...prev]);
    setShowAdd(false);
  };

  const allTopics = [...new Set(bookmarks.map(b => b.topic).filter(t => t && t !== "…"))];
  const allMonths = [...new Set(bookmarks.map(b => getMonthLabel(b.date)))];

  const filtered = bookmarks
    .filter(b => {
      const q = search.toLowerCase();
      return (!q || b.text.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || (b.topic||"").toLowerCase().includes(q))
        && (!selectedTopic || b.topic === selectedTopic)
        && (!selectedMonth || getMonthLabel(b.date) === selectedMonth);
    })
    .sort((a, b) => sortOrder === "newest" ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date));

  const grouped = [];
  let lastMonth = null;
  filtered.forEach(b => {
    const m = getMonthLabel(b.date);
    if (m !== lastMonth) { grouped.push({ type: "divider", label: m }); lastMonth = m; }
    grouped.push({ type: "card", bookmark: b });
  });
  let cardIndex = 0;

  return (
    <div style={{ minHeight: "100vh", background: "#0d0b0a", fontFamily: "'DM Sans',sans-serif", color: "#f0ece4" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&family=Lora:ital,wght@0,400;1,400&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2520; border-radius: 2px; }
        input:focus,select:focus,textarea:focus { outline: none; }
        input::placeholder,textarea::placeholder { color: #4a4540; }
        select option { background: #1a1614; }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      {showAdd && <AddTweetPanel onAdd={handleAdd} onClose={() => setShowAdd(false)} />}

      {/* Sticky header */}
      <div style={{
        padding: "32px 40px 22px", borderBottom: "1px solid rgba(255,255,255,0.04)",
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(13,11,10,0.96)", backdropFilter: "blur(12px)",
        opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(-10px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "18px" }}>
            <div>
              <div style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b6560", fontFamily: "'DM Mono',monospace", marginBottom: "4px" }}>{isDemo ? "demo library" : "your library"}</div>
              <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 300, letterSpacing: "-0.03em", color: "#f0ece4" }}>remember<span style={{ color: "#c8b89a" }}>.</span></h1>
              {isDemo && (
                <button onClick={onExitDemo} style={{ marginTop: "6px", background: "rgba(200,184,154,0.1)", border: "1px solid rgba(200,184,154,0.25)", borderRadius: "20px", padding: "2px 10px", color: "#c8b89a", fontSize: "9px", fontFamily: "'DM Mono',monospace", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", cursor: "pointer" }}>
                  ← back to my library
                </button>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "5px" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "22px", fontWeight: 300, color: "#f0ece4", letterSpacing: "-0.02em", fontFamily: "'DM Mono',monospace" }}>
                  {filtered.length}<span style={{ fontSize: "12px", color: "#6b6560" }}>/{bookmarks.length}</span>
                </div>
                <div style={{ fontSize: "10px", color: "#6b6560", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Mono',monospace" }}>bookmarks</div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "3px 8px", borderRadius: "20px", background: aiStatus === "done" ? "rgba(154,230,180,0.07)" : "rgba(200,184,154,0.07)", border: `1px solid ${aiStatus === "done" ? "rgba(154,230,180,0.18)" : "rgba(200,184,154,0.13)"}` }}>
                {aiStatus === "loading" && <div style={{ width: 6, height: 6, borderRadius: "50%", border: "1px solid #c8b89a", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />}
                {aiStatus === "done" && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#9ae6b4", display: "inline-block" }} />}
                <span style={{ fontSize: "9px", fontFamily: "'DM Mono',monospace", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: aiStatus === "done" ? "#9ae6b4" : "#c8b89a", animation: aiStatus === "loading" ? "pulse 1.5s ease infinite" : "none" }}>
                  {aiStatus === "loading" ? "AI organising…" : "AI organised"}
                </span>
              </div>

              <div style={{ display: "flex", gap: "6px" }}>
                {!isDemo && (
                  <button onClick={() => setShowAdd(true)}
                    style={{ padding: "2px 10px", borderRadius: "20px", cursor: "pointer", fontSize: "9px", fontFamily: "'DM Mono',monospace", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", background: "rgba(200,184,154,0.1)", border: "1px solid rgba(200,184,154,0.25)", color: "#c8b89a", transition: "all 0.15s ease" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(200,184,154,0.18)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(200,184,154,0.1)"; }}
                  >+ add tweet</button>
                )}
                {!isDemo && (
                  <button onClick={onImport}
                    style={{ padding: "2px 8px", borderRadius: "20px", cursor: "pointer", fontSize: "9px", fontFamily: "'DM Mono',monospace", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", background: "transparent", border: "1px solid rgba(255,255,255,0.07)", color: "#6b6560", transition: "all 0.15s ease" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#c8b89a"; e.currentTarget.style.borderColor = "rgba(200,184,154,0.25)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#6b6560"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
                  >import</button>
                )}
                {!isDemo && bookmarks.length > 0 && (
                  <button onClick={onClearAll}
                    style={{ padding: "2px 8px", borderRadius: "20px", cursor: "pointer", fontSize: "9px", fontFamily: "'DM Mono',monospace", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", background: "transparent", border: "1px solid rgba(255,255,255,0.07)", color: "#6b6560", transition: "all 0.15s ease" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#fc8181"; e.currentTarget.style.borderColor = "rgba(252,129,129,0.25)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#6b6560"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
                  >clear all</button>
                )}
              </div>
            </div>
          </div>

          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "10px 16px", marginBottom: "12px" }}>
            <span style={{ color: "#6a5e58", fontSize: "13px" }}>⌕</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by keyword, author, or topic..."
              style={{ flex: 1, background: "none", border: "none", color: "#f0ece4", fontSize: "13px", fontFamily: "'DM Sans',sans-serif" }} />
            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "#7a7570", cursor: "pointer", fontSize: "15px", padding: 0 }}>×</button>}
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: "7px", alignItems: "center", flexWrap: "wrap" }}>
            {[["newest","Newest first"],["oldest","Oldest first"]].map(([v, l]) => null)}
            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "4px 10px", color: sortOrder !== "newest" ? "#c8b89a" : "#8a8278", fontSize: "10px", fontFamily: "'DM Mono',monospace", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>

            <select value={selectedMonth || ""} onChange={e => setSelectedMonth(e.target.value || null)} style={{ background: selectedMonth ? "rgba(200,184,154,0.08)" : "rgba(255,255,255,0.03)", border: selectedMonth ? "1px solid rgba(200,184,154,0.25)" : "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "4px 10px", color: selectedMonth ? "#c8b89a" : "#8a8278", fontSize: "10px", fontFamily: "'DM Mono',monospace", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}>
              <option value="">All months</option>
              {allMonths.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            {allTopics.length > 0 && <div style={{ width: "1px", height: "14px", background: "rgba(255,255,255,0.06)" }} />}

            {allTopics.map(topic => {
              const c = TOPIC_COLORS[topic] || TOPIC_COLORS["Other"];
              const active = selectedTopic === topic;
              return (
                <button key={topic} onClick={() => setSelectedTopic(active ? null : topic)} style={{ padding: "3px 9px", borderRadius: "20px", cursor: "pointer", fontSize: "10px", fontFamily: "'DM Mono',monospace", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", background: active ? c.bg : "transparent", border: active ? `1px solid ${c.border}` : "1px solid rgba(255,255,255,0.06)", color: active ? c.dot : "#7a7570", transition: "all 0.15s ease" }}>
                  {topic}
                </button>
              );
            })}

            {(selectedTopic || selectedMonth || search) && (
              <button onClick={() => { setSelectedTopic(null); setSelectedMonth(null); setSearch(""); }} style={{ padding: "3px 9px", borderRadius: "20px", cursor: "pointer", fontSize: "10px", fontFamily: "'DM Mono',monospace", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", background: "transparent", border: "1px solid rgba(255,255,255,0.06)", color: "#7a7570" }}>✕ clear</button>
            )}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "8px 40px 80px", opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease 0.1s" }}>
        {filtered.length === 0 && bookmarks.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "20px", opacity: 0.3 }}>🔖</div>
            <div style={{ fontSize: "20px", fontWeight: 300, color: "#f0ece4", letterSpacing: "-0.02em", marginBottom: "8px" }}>Your library is empty</div>
            <p style={{ fontSize: "14px", color: "#7a7570", lineHeight: "1.6", maxWidth: "320px", marginBottom: "32px", fontFamily: "'Lora',serif" }}>
              Add a tweet you've saved and AI will organise it, summarise it, and suggest what to do with it.
            </p>
            <button onClick={() => setShowAdd(true)} style={{
              padding: "14px 28px", borderRadius: "14px", cursor: "pointer",
              background: "rgba(200,184,154,0.12)", border: "1px solid rgba(200,184,154,0.3)",
              color: "#c8b89a", fontSize: "14px", fontFamily: "'DM Sans',sans-serif",
              fontWeight: 500, transition: "all 0.2s ease",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(200,184,154,0.2)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(200,184,154,0.12)"}
            >+ Add your first tweet</button>
            <div style={{ marginTop: "20px", display: "flex", gap: "8px", alignItems: "center" }}>
              <div style={{ height: "1px", width: "60px", background: "rgba(255,255,255,0.05)" }} />
              <span style={{ fontSize: "10px", color: "#4a4540", fontFamily: "'DM Mono',monospace" }}>or</span>
              <div style={{ height: "1px", width: "60px", background: "rgba(255,255,255,0.05)" }} />
            </div>
            <button onClick={onImport} style={{
              marginTop: "16px", padding: "10px 20px", borderRadius: "12px", cursor: "pointer",
              background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
              color: "#6b6560", fontSize: "13px", fontFamily: "'DM Sans',sans-serif",
              transition: "all 0.2s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = "#a09890"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#6b6560"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >Import from X archive</button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px 0", color: "#6b6560", fontFamily: "'DM Mono',monospace", fontSize: "12px", letterSpacing: "0.06em" }}>no bookmarks match your filters</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "10px", alignItems: "start" }}>
            {grouped.map(item => {
              if (item.type === "divider") return (
                <div key={`d-${item.label}`} style={{ gridColumn: "1/-1" }}><MonthDivider label={item.label} /></div>
              );
              const idx = cardIndex++;
              return <BookmarkCard key={item.bookmark.id} bookmark={item.bookmark} index={idx} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "remember_bookmarks";

export default function App() {
  const [screen, setScreen] = useState("library");
  const [isDemo, setIsDemo] = useState(false);
  const [aiStatus, setAiStatus] = useState("done");

  // Personal bookmarks — persisted to localStorage
  const [myBookmarks, setMyBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Demo bookmarks — never persisted, separate state
  const [demoBookmarks, setDemoBookmarks] = useState([]);

  // Active bookmarks depending on mode
  const bookmarks = isDemo ? demoBookmarks : myBookmarks;
  const setBookmarks = isDemo ? setDemoBookmarks : setMyBookmarks;

  // Persist personal bookmarks whenever they change
  useEffect(() => {
    if (!isDemo) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(myBookmarks)); } catch {}
    }
  }, [myBookmarks, isDemo]);

  const runClassification = useCallback(async (raw, demo) => {
    setAiStatus("loading");
    const setter = demo ? setDemoBookmarks : setMyBookmarks;
    setter(raw.map(b => ({ ...b, topic: "…", summary: null })));
    setIsDemo(demo);
    setScreen("library");
    try {
      const results = await classifyWithAI(raw, demo);
      const lookup = {};
      results.forEach(r => { lookup[r.id] = r; });
      const classified = raw.map(b => ({ ...b, topic: lookup[b.id]?.topic || "Other", summary: lookup[b.id]?.summary || null, actions: lookup[b.id]?.actions || [], execute: lookup[b.id]?.execute || null }));
      setter(classified);
      setAiStatus("done");
    } catch {
      setter(raw.map(b => ({ ...b, topic: "Other", summary: null })));
      setAiStatus("done");
    }
  }, []);

  const handleImport = raw => runClassification(raw, false);
  const handleDemo = () => runClassification(DEMO_BOOKMARKS, true);

  const handleExitDemo = () => {
    setIsDemo(false);
    setDemoBookmarks([]);
    setScreen("library");
  };

  const handleClearAll = () => {
    setMyBookmarks([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  if (screen === "import") return <ImportScreen onImport={handleImport} onDemo={handleDemo} onClose={() => setScreen("library")} />;
  return (
    <LibraryView
      bookmarks={bookmarks}
      setBookmarks={setBookmarks}
      aiStatus={aiStatus}
      isDemo={isDemo}
      onImport={() => setScreen("import")}
      onClearAll={handleClearAll}
      onExitDemo={handleExitDemo}
    />
  );
}