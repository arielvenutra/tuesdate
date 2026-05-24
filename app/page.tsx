"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Place } from "@/types";
import PlaceCard from "@/components/PlaceCard";
import RateModal from "@/components/RateModal";

export default function Home() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rateTarget, setRateTarget] = useState<Place | null>(null);

  const fetchData = useCallback(async () => {
    const { data } = await supabase
      .from("places")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) {
      setPlaces(data);
      const current = data.find((p: Place) => p.status === "selected");
      setSelectedPlace(current ?? null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();

    // Realtime subscription so both phones stay in sync
    const channel = supabase
      .channel("places-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "places" }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  const unvisited = places.filter((p) => p.status === "unvisited");

  async function spinRoulette() {
    if (unvisited.length === 0 || spinning) return;

    setSpinning(true);

    // Clear any previously "selected" place back to unvisited first
    if (selectedPlace) {
      await supabase
        .from("places")
        .update({ status: "unvisited" })
        .eq("id", selectedPlace.id);
    }

    await new Promise((r) => setTimeout(r, 1200));

    const pick = unvisited[Math.floor(Math.random() * unvisited.length)];

    const { data } = await supabase
      .from("places")
      .update({ status: "selected" })
      .eq("id", pick.id)
      .select()
      .single();

    if (data) setSelectedPlace(data);
    setSpinning(false);
    await fetchData();
  }

  async function handleMarkVisited(id: string) {
    const place = places.find((p) => p.id === id);
    if (place) setRateTarget(place);
  }

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
    setSelectedPlace(null);
    fetchData();
  }

  return (
    <>
      <div className="pt-10 pb-4">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-brand-purple/70 text-sm font-medium tracking-widest uppercase mb-2">
            Tuesday Date Night
          </p>
          <h1 className="font-display text-4xl font-bold gradient-text leading-tight">
            Where are we<br />going this week?
          </h1>
        </div>

        {/* Roulette Button */}
        <div className="flex flex-col items-center gap-5 mb-10">
          <button
            onClick={spinRoulette}
            disabled={spinning || unvisited.length === 0}
            className="btn-roulette relative w-40 h-40 rounded-full text-white font-bold flex flex-col items-center justify-center gap-2 select-none"
          >
            <span
              className={`text-5xl leading-none transition-all duration-300 ${spinning ? "spinning inline-block" : "animate-float inline-block"}`}
            >
              {spinning ? "🎲" : "💕"}
            </span>
            <span className="text-sm font-semibold tracking-wide">
              {spinning ? "Picking…" : "Spin!"}
            </span>
          </button>

          {!loading && unvisited.length === 0 && !selectedPlace && (
            <p className="text-white/40 text-sm text-center">
              No unvisited places yet —{" "}
              <a href="/add" className="text-brand-rose underline underline-offset-2">
                add some!
              </a>
            </p>
          )}

          {unvisited.length > 0 && (
            <p className="text-white/30 text-xs">
              {unvisited.length} place{unvisited.length !== 1 ? "s" : ""} in the pool
            </p>
          )}
        </div>

        {/* Selected place card */}
        {selectedPlace && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-brand-rose/40" />
              <p className="text-xs font-medium text-brand-rose/80 uppercase tracking-widest whitespace-nowrap">
                This Week's Date
              </p>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-brand-rose/40" />
            </div>
            <PlaceCard
              place={selectedPlace}
              variant="selected"
              onMarkVisited={handleMarkVisited}
            />
          </div>
        )}

        {/* Unvisited list preview */}
        {unvisited.length > 0 && (
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/5" />
              <p className="text-xs font-medium text-white/30 uppercase tracking-widest whitespace-nowrap">
                In the Pool
              </p>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <div className="space-y-2">
              {unvisited.slice(0, 5).map((place) => (
                <div
                  key={place.id}
                  className="glass rounded-xl px-4 py-3 flex items-center gap-3"
                >
                  <span className="text-brand-purple/60 text-lg">♥</span>
                  <span className="text-sm font-medium text-white/70 truncate">{place.name}</span>
                </div>
              ))}
              {unvisited.length > 5 && (
                <p className="text-center text-xs text-white/30 pt-1">
                  +{unvisited.length - 5} more
                </p>
              )}
            </div>
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
