"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Place } from "@/types";
import PlaceCard from "@/components/PlaceCard";
import RateModal from "@/components/RateModal";

type Tab = "visited" | "unvisited";

export default function HistoryPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("visited");
  const [rateTarget, setRateTarget] = useState<Place | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const { data } = await supabase
      .from("places")
      .select("*")
      .order("visited_at", { ascending: false, nullsFirst: false });
    if (data) setPlaces(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const channel = supabase
      .channel("history-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "places" }, fetchData)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchData]);

  async function handleRateSubmit(rating: number, review: string) {
    if (!rateTarget) return;
    await supabase
      .from("places")
      .update({
        status: "visited",
        rating,
        review: review || null,
        visited_at: new Date().toISOString(),
      })
      .eq("id", rateTarget.id);
    setRateTarget(null);
    fetchData();
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    await supabase.from("places").delete().eq("id", id);
    fetchData();
    setDeleting(null);
  }

  const visited = places.filter((p) => p.status === "visited");
  const unvisited = places.filter((p) => p.status !== "visited");

  const displayed = tab === "visited" ? visited : unvisited;

  const avgRating =
    visited.length > 0
      ? (visited.reduce((sum, p) => sum + (p.rating ?? 0), 0) / visited.filter((p) => p.rating).length).toFixed(1)
      : null;

  return (
    <>
      <div className="pt-10">
        <div className="mb-6">
          <p className="text-brand-purple/70 text-sm font-medium tracking-widest uppercase mb-2">
            Our Memories
          </p>
          <h1 className="font-display text-3xl font-bold gradient-text">Date History</h1>
        </div>

        {/* Stats row */}
        {visited.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="glass rounded-2xl p-4 text-center">
              <p className="text-3xl font-bold gradient-text">{visited.length}</p>
              <p className="text-xs text-white/40 mt-1">Dates done</p>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <p className="text-3xl font-bold gradient-text">{avgRating ?? "—"}</p>
              <p className="text-xs text-white/40 mt-1">Avg rating ★</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex glass rounded-xl p-1 mb-5">
          {(["visited", "unvisited"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === t
                  ? "bg-gradient-to-r from-brand-rose to-brand-purple text-white shadow"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {t === "visited" ? `Visited (${visited.length})` : `Wishlist (${unvisited.length})`}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl h-28 animate-pulse" />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">{tab === "visited" ? "🗺️" : "✨"}</p>
            <p className="text-white/40 text-sm">
              {tab === "visited"
                ? "No dates logged yet. Go on one and rate it!"
                : "No places in the wishlist yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map((place) => (
              <div key={place.id} className="relative group">
                <PlaceCard
                  place={place}
                  variant={place.status === "selected" ? "selected" : "history"}
                  onMarkVisited={(id) => {
                    const p = places.find((x) => x.id === id);
                    if (p) setRateTarget(p);
                  }}
                />
                <button
                  onClick={() => handleDelete(place.id)}
                  disabled={deleting === place.id}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 focus:opacity-100 text-white/20 hover:text-brand-rose transition-all duration-200 p-1.5 rounded-lg hover:bg-brand-rose/10"
                  aria-label="Delete place"
                >
                  {deleting === place.id ? (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {rateTarget && (
        <RateModal
          place={rateTarget}
          onSubmit={handleRateSubmit}
          onClose={() => setRateTarget(null)}
        />
      )}
    </>
  );
}
