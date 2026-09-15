"use client";

import React, { useState } from "react";
import { Calendar, Clock, MapPin, CheckCircle2, X, AlertCircle } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface InterviewBookingModalProps {
  applicationId: string;
  societyName: string;
  availableSlots: Array<{
    id: string;
    startTime: string | Date;
    endTime: string | Date;
    location: string;
    maxCapacity: number;
    bookings?: Array<any>;
  }>;
  onClose: () => void;
  onBooked: () => void;
}

export function InterviewBookingModal({
  applicationId,
  societyName,
  availableSlots,
  onClose,
  onBooked,
}: InterviewBookingModalProps) {
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBooking = async () => {
    if (!selectedSlotId) {
      setError("Please select a time slot first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/interviews/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: selectedSlotId,
          applicationId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to book interview slot");
        return;
      }

      onBooked();
      onClose();
    } catch {
      setError("Network error while reserving slot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Book Your Interview Slot
              </h3>
              <p className="text-xs text-slate-400">
                Society: <span className="text-blue-300 font-semibold">{societyName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slot Selection */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-xs text-slate-400 leading-relaxed">
            Select one of the open panel interview windows below. You will receive an instant confirmation and mock email invite.
          </p>

          <div className="space-y-3">
            {availableSlots.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs bg-slate-950/40 rounded-2xl border border-slate-800">
                No active interview slots published by the leads yet. Please check back shortly!
              </div>
            ) : (
              availableSlots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                const isFull = (slot.bookings?.length || 0) >= slot.maxCapacity;

                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={isFull}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      isFull
                        ? "opacity-50 bg-slate-950 border-slate-800 cursor-not-allowed"
                        : isSelected
                        ? "bg-blue-600/15 border-blue-500 shadow-lg shadow-blue-500/10"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-xs font-bold text-white">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        <span>{formatDateTime(slot.startTime)}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span className="truncate max-w-[280px]">{slot.location}</span>
                      </div>
                    </div>

                    <div>
                      {isFull ? (
                        <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20 font-semibold">
                          Slot Full
                        </span>
                      ) : isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : (
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                          Available
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleBooking}
            disabled={!selectedSlotId || loading}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Confirming..." : "Confirm & Reserve Slot"}
          </button>
        </div>
      </div>
    </div>
  );
}
