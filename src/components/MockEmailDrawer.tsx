"use client";

import React, { useState, useEffect } from "react";
import { Mail, RefreshCw, X, Check, Eye } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export function MockEmailDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/mock-emails");
      if (res.ok) {
        const data = await res.json();
        setEmails(data.emails || []);
        if (data.emails?.length > 0 && !selectedEmail) {
          setSelectedEmail(data.emails[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchEmails();
    }
  }, [isOpen]);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center space-x-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-full shadow-2xl hover:shadow-blue-500/40 hover:scale-110 active:scale-95 transition-all duration-200 text-xs font-semibold border-2 border-blue-400/50 hover:border-blue-300 ring-2 ring-blue-500/30 hover:ring-4 hover:ring-blue-400/40 backdrop-blur-md group"
        title="Inspect transactional emails sent by CrewDeck"
      >
        <Mail className="w-4 h-4 text-blue-200 group-hover:rotate-12 transition-transform duration-200" />
        <span className="hidden sm:inline">Mock Email Outbox</span>
        <span className="bg-blue-950/80 text-blue-200 px-2 py-0.5 rounded-full text-[10px] border border-blue-400/30 font-mono shadow-inner group-hover:border-blue-300">
          Dev Tool
        </span>
      </button>

      {/* Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/90 w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-slate-700/50">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <span>CrewDeck Mock Transactional Email Outbox</span>
                    <span className="text-xs font-normal text-slate-400 bg-slate-800/80 border border-slate-700 px-2 py-0.5 rounded-md font-mono">
                      {emails.length} Dispatched
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Inspect actual server-generated HTML emails (application receipts, interview calls, offer letters).
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={fetchEmails}
                  disabled={loading}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 hover:scale-110 active:scale-95 transition-all"
                  title="Refresh Outbox"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 hover:scale-110 active:scale-95 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body: Split View */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
              {/* Email List (Left Column) */}
              <div className="md:col-span-5 border-r border-slate-800/80 overflow-y-auto p-2 space-y-1.5 bg-slate-950/40">
                {emails.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    No emails logged yet. Submit an application or advance candidate statuses to trigger emails.
                  </div>
                ) : (
                  emails.map((email) => {
                    const isSelected = selectedEmail?.id === email.id;
                    return (
                      <button
                        key={email.id}
                        onClick={() => setSelectedEmail(email)}
                        className={`w-full text-left p-3.5 rounded-2xl transition-all duration-200 flex flex-col space-y-1.5 border ${
                          isSelected
                            ? "bg-blue-600/20 border-l-4 border-l-blue-400 border-blue-500/50 ring-2 ring-blue-400/30 shadow-lg shadow-blue-500/20 scale-[1.02]"
                            : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700 hover:scale-[1.01] active:scale-[0.99]"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-300 truncate max-w-[200px]">
                            {email.recipient}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {formatDateTime(email.sentAt)}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-white truncate">
                          {email.subject}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono">
                            {email.status}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {email.template}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Email Preview HTML (Right Column) */}
              <div className="md:col-span-7 bg-slate-900 p-6 overflow-y-auto flex flex-col">
                {selectedEmail ? (
                  <div className="space-y-4">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">To:</span>
                        <span className="font-mono text-slate-200">{selectedEmail.recipient}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Subject:</span>
                        <span className="font-semibold text-white">{selectedEmail.subject}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Sent At:</span>
                        <span className="text-slate-400">{formatDateTime(selectedEmail.sentAt)}</span>
                      </div>
                    </div>

                    <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/80 shadow-inner">
                      <div
                        className="prose prose-invert max-w-none text-slate-300"
                        dangerouslySetInnerHTML={{ __html: selectedEmail.htmlBody }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm">
                    <Eye className="w-8 h-8 mb-2 opacity-50" />
                    Select an email from the left to view rendered HTML
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
