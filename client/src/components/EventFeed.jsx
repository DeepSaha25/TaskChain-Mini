import { useState, useEffect, useCallback } from "react";
import { STELLAR_RPC_URL, TASK_REGISTRY_ADDRESS } from "../lib/contract";

const EVENT_POLL_INTERVAL = 8000; // 8 seconds

function formatTimeAgo(ledgerTime) {
  if (!ledgerTime) return "";
  const now = Math.floor(Date.now() / 1000);
  const diff = now - Number(ledgerTime);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function parseEventTopic(topicVal) {
  if (!topicVal) return "unknown";
  // Topics come as ScVal — try common shapes
  if (typeof topicVal === "string") return topicVal;
  if (topicVal.sym) return topicVal.sym;
  if (topicVal.str) return topicVal.str;
  return JSON.stringify(topicVal);
}

export default function EventFeed({ account }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    if (!TASK_REGISTRY_ADDRESS || !account) return;

    try {
      setLoading(true);

      // Use a ledger range going back ~200 ledgers (about 16 minutes on testnet)
      const latestResp = await fetch(STELLAR_RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getLatestLedger",
          params: {}
        })
      });

      const latestData = await latestResp.json();
      const latestLedger = latestData?.result?.sequence;
      if (!latestLedger) return;

      const startLedger = Math.max(1, latestLedger - 200);

      const response = await fetch(STELLAR_RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 2,
          method: "getEvents",
          params: {
            startLedger,
            filters: [
              {
                type: "contract",
                contractIds: [TASK_REGISTRY_ADDRESS]
              }
            ],
            pagination: { limit: 20 }
          }
        })
      });

      const data = await response.json();
      const rawEvents = data?.result?.events || [];

      const parsed = rawEvents.map((evt, idx) => {
        const topicStr = (evt.topic || []).map(parseEventTopic).join(", ");
        let type = "unknown";
        if (topicStr.includes("task_created")) type = "created";
        else if (topicStr.includes("task_toggled")) type = "toggled";
        else if (topicStr.includes("reward_minted")) type = "reward";

        return {
          id: `${evt.ledger}-${idx}`,
          type,
          topic: topicStr,
          ledger: evt.ledger,
          time: evt.ledgerClosedAt || "",
          ledgerTime: evt.ledgerClosedAt
            ? Math.floor(new Date(evt.ledgerClosedAt).getTime() / 1000)
            : null
        };
      });

      // Show newest first
      parsed.reverse();
      setEvents(parsed);
    } catch (err) {
      console.error("Event feed error:", err);
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, EVENT_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  const typeLabels = {
    created: "Task Created",
    toggled: "Task Toggled",
    reward: "Reward Minted",
    unknown: "Contract Event"
  };

  const typeIcons = {
    created: "📝",
    toggled: "🔄",
    reward: "🪙",
    unknown: "📡"
  };

  return (
    <div className="event-feed">
      {events.length === 0 ? (
        <div className="event-empty">
          {loading ? "Scanning blockchain events..." : "No recent events. Create or toggle a task to see events appear here."}
        </div>
      ) : (
        events.map((evt) => (
          <div key={evt.id} className="event-item">
            <span className={`event-dot ${evt.type}`} />
            <span className="event-text">
              {typeIcons[evt.type]} <strong>{typeLabels[evt.type]}</strong>
              <span style={{ opacity: 0.6, marginLeft: "0.4rem" }}>
                Ledger #{evt.ledger}
              </span>
            </span>
            <span className="event-time">
              {formatTimeAgo(evt.ledgerTime)}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
