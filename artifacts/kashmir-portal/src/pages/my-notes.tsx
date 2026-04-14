import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  BookOpen, Download, FileText, LockOpen, File, Image as ImageIcon,
  FileType, LogIn, UserPlus, ChevronDown, ChevronUp, GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { useLocalStorage } from "@/hooks/use-local-storage";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type Note = {
  id: string;
  grade: "11th" | "12th";
  subject: string;
  chapter: string;
  content: string;
  date: string;
  fileUrl?: string;
  fileName?: string;
  fileMime?: string;
};

type UnlockedNote = {
  noteId: string;
  noteTitle: string;
  subject: string;
  classLevel: string;
  accessCode: string;
};

function getFileIcon(mime?: string) {
  if (!mime) return <FileText className="h-5 w-5 text-slate-400" />;
  if (mime.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-blue-500" />;
  if (mime === "application/pdf") return <FileType className="h-5 w-5 text-red-500" />;
  return <File className="h-5 w-5 text-slate-400" />;
}

function getFileBadgeLabel(mime?: string, fileName?: string) {
  if (!mime && !fileName) return "File";
  if (mime?.startsWith("image/")) return "Image";
  if (mime === "application/pdf") return "PDF";
  return fileName?.split(".").pop()?.toUpperCase() ?? "File";
}

function downloadText(note: Note) {
  const watermark = `================================================================\nKASHMIR PORTAL — STUDY NOTES\nBy Yasir Ferooz | yasirlone831@gmail.com\n================================================================\nClass ${note.grade} | Subject: ${note.subject}\nChapter: ${note.chapter}\n================================================================\n\n`;
  const content = watermark + note.content + `\n\n================================================================\n© Kashmir Portal by Yasir Ferooz\n================================================================`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${note.subject}_${note.chapter.replace(/\s+/g, "_")}_YasirFerooz.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function NoteRow({ note, unlocked }: { note: Note; unlocked: UnlockedNote }) {
  const [expanded, setExpanded] = useState(false);
  const hasFile = !!note.fileUrl;
  const fileBadge = getFileBadgeLabel(note.fileMime, note.fileName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 border text-xs">
              {unlocked.subject}
            </Badge>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 border text-xs">
              <LockOpen className="h-2.5 w-2.5 mr-1" /> Unlocked
            </Badge>
            {hasFile && (
              <Badge className={`text-xs border flex items-center gap-1 ${note.fileMime === "application/pdf" ? "bg-red-50 text-red-700 border-red-200" : note.fileMime?.startsWith("image/") ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-700 border-slate-200"}`}>
                {getFileIcon(note.fileMime)}
                {fileBadge}
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground shrink-0">{note.date}</span>
        </div>

        <h3 className="font-serif text-lg font-bold text-foreground mb-3 leading-snug">
          {note.chapter}
        </h3>

        {note.content && (
          <>
            {expanded ? (
              <div className="mb-3 space-y-2">
                {note.content.split("\n\n").map((p, i) => (
                  <p key={i} className="text-sm leading-relaxed text-foreground/80">{p}</p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                {note.content}
              </p>
            )}
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-xs text-primary font-medium flex items-center gap-1 mb-3 hover:underline"
            >
              {expanded ? <><ChevronUp className="h-3 w-3" /> Collapse</> : <><ChevronDown className="h-3 w-3" /> Read Full Note</>}
            </button>
          </>
        )}

        {hasFile && note.fileMime?.startsWith("image/") && (
          <div className="mb-3 rounded-xl overflow-hidden border border-border">
            <img src={`${BASE}${note.fileUrl}`} alt={note.chapter} className="w-full object-cover max-h-48" />
          </div>
        )}
      </div>

      <div className="px-5 py-3 bg-muted/30 border-t border-border/60 flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground font-mono">
          Code: <span className="font-bold text-foreground tracking-widest">{unlocked.accessCode}</span>
        </span>
        <div className="flex gap-2">
          {note.content && (
            <Button size="sm" variant="outline" className="h-7 px-3 text-xs gap-1" onClick={() => downloadText(note)}>
              <FileText className="h-3 w-3" /> TXT
            </Button>
          )}
          {hasFile && (
            <a href={`${BASE}${note.fileUrl}`} download={note.fileName ?? "note"} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="h-7 px-3 text-xs gap-1 bg-slate-900 text-white hover:bg-slate-800">
                <Download className="h-3 w-3" /> {fileBadge}
              </Button>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function MyNotes() {
  const { user, unlockedNotes, loading } = useAuth();
  const [notes] = useLocalStorage<Note[]>("kashmir_notes_v3", []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm w-full text-center space-y-6"
        >
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="h-10 w-10 text-amber-600" />
          </div>
          <div>
            <h2 className="font-serif text-3xl font-bold mb-2">My Notes</h2>
            <p className="text-muted-foreground">
              Sign in to see all your purchased notes in one place — accessible from any device.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/notes">
              <Button className="w-full gap-2 bg-amber-500 hover:bg-amber-600 text-white h-11">
                <LogIn className="h-4 w-4" /> Go to Study Notes &amp; Sign In
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground">
              Use the Login or Sign Up button in the top-right corner
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const enriched = unlockedNotes
    .map((u) => ({ unlocked: u, note: notes.find((n) => n.id === u.noteId) }))
    .filter((x): x is { unlocked: UnlockedNote; note: Note } => !!x.note);

  const byClass: Record<string, typeof enriched> = {};
  for (const item of enriched) {
    const cls = item.unlocked.classLevel;
    if (!byClass[cls]) byClass[cls] = [];
    byClass[cls].push(item);
  }

  const initials = user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 text-white py-14 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-teal-300/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center sm:items-end gap-5"
          >
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-3xl font-bold shrink-0">
              {initials}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-emerald-200 text-sm font-medium uppercase tracking-widest mb-1">My Library</p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold">{user.name}</h1>
              <p className="text-emerald-100 mt-1">{user.email}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-6 mt-8"
          >
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 text-center">
              <p className="text-2xl font-bold">{unlockedNotes.length}</p>
              <p className="text-xs text-emerald-200 mt-0.5">Unlocked Notes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 text-center">
              <p className="text-2xl font-bold">
                {new Set(unlockedNotes.map((n) => n.subject)).size}
              </p>
              <p className="text-xs text-emerald-200 mt-0.5">Subjects</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 text-center">
              <p className="text-2xl font-bold">
                {new Set(unlockedNotes.map((n) => n.classLevel)).size}
              </p>
              <p className="text-xs text-emerald-200 mt-0.5">Classes</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {unlockedNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-5">
              <GraduationCap className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-2">No notes yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              You haven't purchased any notes yet. Head to the Study Notes page to get started.
            </p>
            <Link href="/notes">
              <Button className="gap-2 bg-amber-500 hover:bg-amber-600 text-white">
                <BookOpen className="h-4 w-4" /> Browse Study Notes
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-12">
            {Object.entries(byClass)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([classLevel, items]) => {
                const bySubject: Record<string, typeof items> = {};
                for (const item of items) {
                  if (!bySubject[item.unlocked.subject]) bySubject[item.unlocked.subject] = [];
                  bySubject[item.unlocked.subject].push(item);
                }

                return (
                  <section key={classLevel}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-1 bg-emerald-500 rounded-full" />
                        <h2 className="font-serif text-2xl font-bold">{classLevel}</h2>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 border">
                        {items.length} {items.length === 1 ? "note" : "notes"}
                      </Badge>
                      <div className="h-px flex-1 bg-border" />
                    </div>

                    <div className="space-y-8">
                      {Object.entries(bySubject).map(([subject, subItems]) => (
                        <div key={subject}>
                          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                            <span className="w-4 h-px bg-border" />
                            {subject}
                            <span className="w-full h-px bg-border" />
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {subItems.map(({ note, unlocked }) => (
                              <NoteRow key={note.id} note={note} unlocked={unlocked} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}

            <div className="text-center pt-4">
              <Link href="/notes">
                <Button variant="outline" className="gap-2">
                  <BookOpen className="h-4 w-4" /> Browse More Notes
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
