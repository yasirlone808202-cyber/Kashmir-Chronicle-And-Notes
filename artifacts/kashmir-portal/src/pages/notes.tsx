import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, FileText, Lock, Download, LockOpen, IndianRupee,
  CheckCircle, Clock, XCircle, User, Mail, CreditCard, ChevronDown, ChevronUp,
  Plus, Edit2, Trash2, Save, X, ShieldCheck, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLocalStorage } from "@/hooks/use-local-storage";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type Note = {
  id: string;
  grade: "11th" | "12th";
  subject: string;
  chapter: string;
  content: string;
  date: string;
};

type PaymentRequest = {
  id: number;
  userName: string;
  userEmail: string;
  noteId: string;
  noteTitle: string;
  subject: string;
  classLevel: string;
  upiTransactionId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

type AccessEntry = { noteId: string; code: string };

const SUBJECTS = ["Physics", "Chemistry", "English", "Mathematics", "Biology"];

const DEFAULT_NOTES: Note[] = [
  {
    id: "demo-1",
    grade: "12th",
    subject: "Physics",
    chapter: "Electrostatics",
    content: `Electric charge is a fundamental property of matter. All matter is composed of atoms, and atoms contain charged particles — positively charged protons in the nucleus and negatively charged electrons orbiting it.

Coulomb's Law: The force between two point charges is directly proportional to the product of their magnitudes and inversely proportional to the square of the distance between them: F = kq₁q₂/r².

The electric field at a point is the force experienced per unit positive charge placed at that point. Electric field lines originate from positive charges and terminate at negative charges.

Gauss's Law states that the total electric flux through any closed surface equals the enclosed charge divided by ε₀. This is extremely useful for calculating electric fields for symmetric charge distributions.

Electric potential energy and potential: The work done to bring a unit positive charge from infinity to a point is called electric potential at that point. Equipotential surfaces are perpendicular to field lines.`,
    date: new Date().toLocaleDateString(),
  },
  {
    id: "demo-2",
    grade: "11th",
    subject: "Chemistry",
    chapter: "Structure of Atom",
    content: `Atoms are the fundamental building blocks of all matter. Each element has a unique atomic number — the number of protons in the nucleus.

Dalton's Atomic Theory: All matter consists of indivisible atoms. Atoms of the same element are identical; atoms of different elements differ in mass and properties.

Thomson's Model: The atom is a sphere of positive charge with electrons embedded in it (the "plum pudding" model). This was later disproved by Rutherford.

Rutherford's Nuclear Model: Based on the famous gold foil experiment, Rutherford proposed that atoms have a small, dense, positively charged nucleus surrounded by electrons. The nucleus contains nearly all the atom's mass.

Bohr's Model: Electrons revolve around the nucleus in fixed circular orbits (energy levels). Electrons can jump between levels by absorbing or emitting photons of specific energy: ΔE = hν. This explained hydrogen's line spectrum.

Quantum Mechanical Model: Modern model treats electrons as probability clouds. Orbitals (s, p, d, f) describe regions where electrons are most likely to be found. Quantum numbers n, l, m, ms describe electron states.`,
    date: new Date().toLocaleDateString(),
  },
  {
    id: "demo-3",
    grade: "11th",
    subject: "Physics",
    chapter: "Laws of Motion",
    content: `Newton's Laws of Motion are the foundation of classical mechanics.

First Law (Law of Inertia): A body at rest stays at rest, and a body in motion continues in uniform straight-line motion unless acted upon by an external unbalanced force. This defines inertia — the resistance of an object to changes in its state of motion.

Second Law: The rate of change of momentum of a body is proportional to the applied force and occurs in the direction of the force. F = ma. This law connects force, mass, and acceleration quantitatively.

Third Law: For every action, there is an equal and opposite reaction. Forces always occur in pairs — if body A exerts a force on body B, then body B exerts an equal and opposite force on body A.

Applications: Rocket propulsion (Third Law), seat belts and airbags (First Law), weighing machines (Second Law).

Friction: Static friction prevents relative motion between surfaces in contact. Kinetic friction acts when surfaces slide against each other. f = μN where μ is the coefficient of friction and N is the normal force.`,
    date: new Date().toLocaleDateString(),
  },
  {
    id: "demo-4",
    grade: "12th",
    subject: "Chemistry",
    chapter: "Solid State",
    content: `Solids are characterized by definite shape and volume. They can be crystalline (ordered arrangement) or amorphous (disordered arrangement).

Crystal Systems: There are 7 crystal systems: cubic, tetragonal, orthorhombic, hexagonal, trigonal, monoclinic, and triclinic. Bravais lattices describe the 14 distinct 3D arrangements of lattice points.

Unit Cell: The smallest repeating structural unit of a crystal. For cubic systems: simple cubic (1 atom/cell), body-centered cubic (2 atoms/cell), face-centered cubic (4 atoms/cell).

Packing Efficiency: FCC and HCP have 74% packing efficiency — the highest possible for uniform spheres. BCC has 68%. Simple cubic has only 52.4%.

Defects: Point defects include Schottky (cation-anion vacancy pair) and Frenkel (ion displaced to interstitial site) defects. These affect electrical conductivity and density.

Electrical Properties: Conductors, semiconductors, and insulators differ in their band gaps. Doping semiconductors (n-type with donor atoms, p-type with acceptor atoms) is the basis of modern electronics.`,
    date: new Date().toLocaleDateString(),
  },
];

function downloadFile(note: Note, format: "txt" | "pdf") {
  const watermark = `================================================================
KASHMIR PORTAL — STUDY NOTES
By Yasir Ferooz | yasirlone831@gmail.com
================================================================
Class ${note.grade} | Subject: ${note.subject}
Chapter: ${note.chapter}
Date: ${note.date}
================================================================

`;
  const content = watermark + note.content + `\n\n================================================================\n© Kashmir Portal by Yasir Ferooz — All Rights Reserved\n================================================================`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${note.subject}_${note.chapter.replace(/\s+/g, "_")}_YasirFerooz.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function Notes() {
  const [notes, setNotes] = useLocalStorage<Note[]>("kashmir_notes_v2", DEFAULT_NOTES);
  const [accessList, setAccessList] = useLocalStorage<AccessEntry[]>("kashmir_access_v2", []);

  const [activeGrade, setActiveGrade] = useState<"11th" | "12th">("12th");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminError, setAdminError] = useState(false);

  const [showPayDialog, setShowPayDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [payStep, setPayStep] = useState<"pay" | "submit" | "done">("pay");
  const [payForm, setPayForm] = useState({ name: "", email: "", txId: "" });
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState("");

  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessNote, setAccessNote] = useState<Note | null>(null);
  const [accessForm, setAccessForm] = useState({ email: "", code: "" });
  const [accessLoading, setAccessLoading] = useState(false);
  const [accessError, setAccessError] = useState("");

  const [adminRequests, setAdminRequests] = useState<PaymentRequest[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [noteForm, setNoteForm] = useState<Partial<Note>>({ grade: "12th", subject: "", chapter: "", content: "" });

  const isUnlocked = (noteId: string) => accessList.some((a) => a.noteId === noteId);

  const filteredNotes = notes.filter((n) => n.grade === activeGrade);

  const loadAdminRequests = useCallback(async () => {
    setAdminLoading(true);
    try {
      const res = await fetch(`${BASE}/api/payment-requests?adminKey=yasir123`);
      if (res.ok) {
        const data = await res.json();
        setAdminRequests(data);
      }
    } finally {
      setAdminLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin && showAdminPanel) {
      loadAdminRequests();
    }
  }, [isAdmin, showAdminPanel, loadAdminRequests]);

  const handleAdminLogin = () => {
    if (adminPass === "yasir123") {
      setIsAdmin(true);
      setAdminError(false);
      setAdminPass("");
    } else {
      setAdminError(true);
    }
  };

  const openPayDialog = (note: Note) => {
    setSelectedNote(note);
    setPayStep("pay");
    setPayForm({ name: "", email: "", txId: "" });
    setPayError("");
    setShowPayDialog(true);
  };

  const submitPaymentRequest = async () => {
    if (!payForm.name.trim() || !payForm.email.trim() || !payForm.txId.trim()) {
      setPayError("Please fill in all fields.");
      return;
    }
    if (!payForm.email.includes("@")) {
      setPayError("Please enter a valid email address.");
      return;
    }
    if (!selectedNote) return;

    setPayLoading(true);
    setPayError("");
    try {
      const res = await fetch(`${BASE}/api/payment-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: payForm.name.trim(),
          userEmail: payForm.email.trim().toLowerCase(),
          noteId: selectedNote.id,
          noteTitle: selectedNote.chapter,
          subject: selectedNote.subject,
          classLevel: `Class ${selectedNote.grade}`,
          upiTransactionId: payForm.txId.trim(),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setPayError(err.error ?? "Something went wrong. Please try again.");
        return;
      }
      setPayStep("done");
    } catch {
      setPayError("Network error. Please check your connection and try again.");
    } finally {
      setPayLoading(false);
    }
  };

  const openAccessDialog = (note: Note) => {
    setAccessNote(note);
    setAccessForm({ email: "", code: "" });
    setAccessError("");
    setShowAccessDialog(true);
  };

  const verifyAccessCode = async () => {
    if (!accessForm.email.trim() || !accessForm.code.trim()) {
      setAccessError("Please fill in both fields.");
      return;
    }
    if (!accessNote) return;
    setAccessLoading(true);
    setAccessError("");
    try {
      const params = new URLSearchParams({
        email: accessForm.email.trim().toLowerCase(),
        noteId: accessNote.id,
        code: accessForm.code.trim().toUpperCase(),
      });
      const res = await fetch(`${BASE}/api/payment-requests/verify-code?${params}`);
      const data = await res.json();
      if (data.valid) {
        const newEntry: AccessEntry = { noteId: accessNote.id, code: accessForm.code.trim().toUpperCase() };
        setAccessList([...accessList.filter((a) => a.noteId !== accessNote.id), newEntry]);
        setShowAccessDialog(false);
      } else {
        setAccessError("Invalid code or email. Please check and try again.");
      }
    } catch {
      setAccessError("Network error. Please try again.");
    } finally {
      setAccessLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      await fetch(`${BASE}/api/payment-requests/${id}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminKey: "yasir123" }),
      });
      await loadAdminRequests();
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    setActionLoading(id);
    try {
      await fetch(`${BASE}/api/payment-requests/${id}/reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminKey: "yasir123" }),
      });
      await loadAdminRequests();
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveNote = () => {
    if (!noteForm.subject || !noteForm.chapter || !noteForm.content) return;
    if (editNote) {
      setNotes(notes.map((n) => n.id === editNote.id ? { ...editNote, ...noteForm, subject: noteForm.subject!, chapter: noteForm.chapter!, content: noteForm.content!, grade: noteForm.grade as "11th" | "12th" } : n));
      setEditNote(null);
    } else {
      const newNote: Note = {
        id: `note-${Date.now()}`,
        grade: noteForm.grade as "11th" | "12th",
        subject: noteForm.subject!,
        chapter: noteForm.chapter!,
        content: noteForm.content!,
        date: new Date().toLocaleDateString(),
      };
      setNotes([newNote, ...notes]);
      setShowNoteForm(false);
    }
    setNoteForm({ grade: "12th", subject: "", chapter: "", content: "" });
  };

  const startEdit = (note: Note) => {
    setEditNote(note);
    setNoteForm({ grade: note.grade, subject: note.subject, chapter: note.chapter, content: note.content });
    setShowNoteForm(false);
  };

  const pendingCount = adminRequests.filter((r) => r.status === "pending").length;

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-amber-700 via-amber-600 to-orange-600 text-white py-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-orange-300/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="uppercase tracking-[0.3em] text-amber-200 text-sm mb-4">JK BOSE</p>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">Study Portal</h1>
            <p className="text-amber-100 text-lg max-w-2xl mx-auto">
              Premium Class 11th and 12th notes compiled by Yasir Ferooz. Pay once, download and keep forever.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Grade toggle */}
          <div className="flex gap-2 bg-muted p-1.5 rounded-xl">
            {(["11th", "12th"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setActiveGrade(g)}
                data-testid={`grade-${g}`}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeGrade === g
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Class {g}
              </button>
            ))}
          </div>

          {/* Admin controls */}
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 border font-semibold">
                  Admin Mode
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 relative"
                  onClick={() => { setShowAdminPanel((v) => !v); }}
                  data-testid="button-admin-panel"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Payment Requests
                  {pendingCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {pendingCount}
                    </span>
                  )}
                </Button>
                <Button
                  size="sm"
                  onClick={() => { setShowNoteForm((v) => !v); setEditNote(null); setNoteForm({ grade: activeGrade, subject: "", chapter: "", content: "" }); }}
                  className="gap-1.5"
                  data-testid="button-add-note"
                >
                  <Plus className="h-4 w-4" />
                  Add Note
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setIsAdmin(false); setShowAdminPanel(false); }}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  type="password"
                  placeholder="Admin password"
                  value={adminPass}
                  onChange={(e) => { setAdminPass(e.target.value); setAdminError(false); }}
                  onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                  className={`w-36 h-9 text-sm ${adminError ? "border-red-400" : ""}`}
                  data-testid="input-admin-pw"
                />
                <Button size="sm" variant="outline" onClick={handleAdminLogin} data-testid="button-admin-login">
                  <Lock className="h-3.5 w-3.5 mr-1" /> Login
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Admin: Payment Requests Panel */}
        <AnimatePresence>
          {isAdmin && showAdminPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-serif text-xl font-bold">Payment Requests</h3>
                  <Button size="sm" variant="outline" onClick={loadAdminRequests} disabled={adminLoading}>
                    {adminLoading ? "Loading..." : "Refresh"}
                  </Button>
                </div>
                {adminLoading ? (
                  <div className="text-center py-10 text-muted-foreground">Loading requests...</div>
                ) : adminRequests.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">No payment requests yet.</div>
                ) : (
                  <div className="space-y-3">
                    {adminRequests.map((req) => (
                      <div key={req.id} className={`p-4 rounded-xl border ${req.status === "pending" ? "border-amber-200 bg-amber-50/50" : req.status === "approved" ? "border-emerald-200 bg-emerald-50/50" : "border-red-100 bg-red-50/30"}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-foreground">{req.userName}</span>
                              <span className="text-muted-foreground text-sm">({req.userEmail})</span>
                              <Badge className={`text-xs border ${req.status === "pending" ? "bg-amber-100 text-amber-800 border-amber-200" : req.status === "approved" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-red-100 text-red-700 border-red-200"}`}>
                                {req.status === "pending" ? <Clock className="h-3 w-3 mr-1 inline" /> : req.status === "approved" ? <CheckCircle className="h-3 w-3 mr-1 inline" /> : <XCircle className="h-3 w-3 mr-1 inline" />}
                                {req.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">{req.classLevel}</span> — {req.subject} — <span className="font-medium text-foreground">{req.noteTitle}</span>
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                              UPI TX: {req.upiTransactionId.split("|")[0]}
                            </div>
                          </div>
                          {req.status === "pending" && (
                            <div className="flex gap-2 shrink-0">
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                                onClick={() => handleApprove(req.id)}
                                disabled={actionLoading === req.id}
                                data-testid={`approve-${req.id}`}
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                                {actionLoading === req.id ? "..." : "Approve"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50 gap-1.5"
                                onClick={() => handleReject(req.id)}
                                disabled={actionLoading === req.id}
                                data-testid={`reject-${req.id}`}
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                {actionLoading === req.id ? "..." : "Reject"}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Note Form (Admin) */}
        <AnimatePresence>
          {isAdmin && (showNoteForm || editNote) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 bg-card border border-amber-200 rounded-2xl p-6 shadow-sm"
            >
              <h3 className="font-serif text-lg font-bold mb-4 text-amber-800">
                {editNote ? "Edit Note" : "Add New Note"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Class</label>
                  <Select value={noteForm.grade} onValueChange={(v) => setNoteForm({ ...noteForm, grade: v as "11th" | "12th" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="11th">Class 11th</SelectItem>
                      <SelectItem value="12th">Class 12th</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Subject</label>
                  <Select value={noteForm.subject} onValueChange={(v) => setNoteForm({ ...noteForm, subject: v })}>
                    <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Chapter / Lesson Name</label>
                  <Input value={noteForm.chapter ?? ""} onChange={(e) => setNoteForm({ ...noteForm, chapter: e.target.value })} placeholder="e.g. Electrostatics" data-testid="input-note-chapter" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Content</label>
                <Textarea
                  value={noteForm.content ?? ""}
                  onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                  rows={10}
                  placeholder="Write the full note content here..."
                  className="font-mono text-sm"
                  data-testid="input-note-content"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveNote} className="gap-1.5 bg-amber-600 hover:bg-amber-700" data-testid="button-save-note">
                  <Save className="h-4 w-4" /> {editNote ? "Save Changes" : "Publish Note"}
                </Button>
                <Button variant="outline" onClick={() => { setShowNoteForm(false); setEditNote(null); }}>
                  <X className="h-4 w-4" /> Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Note Grid by subject */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No notes for Class {activeGrade} yet.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {SUBJECTS.filter((s) => filteredNotes.some((n) => n.subject === s)).map((subject) => (
              <div key={subject}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="font-serif text-2xl font-bold text-foreground">{subject}</h2>
                  <div className="h-px flex-1 bg-border" />
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200 border">{filteredNotes.filter((n) => n.subject === subject).length} lessons</Badge>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredNotes.filter((n) => n.subject === subject).map((note) => {
                    const unlocked = isUnlocked(note.id);
                    return (
                      <NoteCard
                        key={note.id}
                        note={note}
                        unlocked={unlocked}
                        isAdmin={isAdmin}
                        onPayClick={() => openPayDialog(note)}
                        onAccessCodeClick={() => openAccessDialog(note)}
                        onDownload={(fmt) => downloadFile(note, fmt)}
                        onEdit={() => startEdit(note)}
                        onDelete={() => setNotes(notes.filter((n) => n.id !== note.id))}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPayDialog} onOpenChange={setShowPayDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Unlock — {selectedNote?.subject}: {selectedNote?.chapter}</DialogTitle>
            <DialogDescription>Class {selectedNote?.grade} — ₹5 one-time payment</DialogDescription>
          </DialogHeader>

          {payStep === "pay" && (
            <div className="space-y-4 py-2">
              {/* Amount */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-center">
                <p className="text-4xl font-bold text-amber-700 mb-1">₹ 5.00</p>
                <p className="text-sm text-amber-700">
                  UPI ID: <span className="font-mono font-bold">8082029582@fam</span>
                </p>
              </div>

              {/* Payment buttons */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Choose how to pay</p>

                {/* Google Pay */}
                <a
                  href="tez://upi/pay?pa=8082029582@fam&pn=YasirFerooz&am=5&cu=INR&tn=KashmirPortalNotes"
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 border-[#4285F4]/30 bg-[#4285F4]/5 hover:bg-[#4285F4]/10 transition-colors"
                  data-testid="button-gpay"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-sm text-[#4285F4]">Pay with Google Pay</p>
                    <p className="text-xs text-muted-foreground">Opens GPay app directly</p>
                  </div>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                </a>

                {/* Any UPI App */}
                <a
                  href="upi://pay?pa=8082029582@fam&pn=YasirFerooz&am=5&cu=INR&tn=KashmirPortalNotes"
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 border-border hover:bg-muted/50 transition-colors"
                  data-testid="button-upi-pay"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0">
                    <span className="text-white text-[10px] font-black">UPI</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-sm">Any UPI App</p>
                    <p className="text-xs text-muted-foreground">PhonePe, Paytm, BHIM &amp; more</p>
                  </div>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                </a>
              </div>

              <div className="text-xs text-center text-muted-foreground">After paying, come back and click below</div>
              <Button
                onClick={() => setPayStep("submit")}
                variant="outline"
                className="w-full h-11 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                data-testid="button-paid-submit"
              >
                I Have Paid — Submit My Request
              </Button>
            </div>
          )}

          {payStep === "submit" && (
            <div className="space-y-4 py-2">
              <p className="text-sm text-muted-foreground">Fill in your details. Yasir will verify your payment and email you an access code.</p>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Your Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Full name" value={payForm.name} onChange={(e) => setPayForm({ ...payForm, name: e.target.value })} data-testid="input-pay-name" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Your Email (for access code)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" type="email" placeholder="you@example.com" value={payForm.email} onChange={(e) => setPayForm({ ...payForm, email: e.target.value })} data-testid="input-pay-email" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">UPI Transaction ID</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9 font-mono" placeholder="e.g. 123456789012" value={payForm.txId} onChange={(e) => setPayForm({ ...payForm, txId: e.target.value })} data-testid="input-pay-txid" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Find this in your UPI app under payment history</p>
              </div>
              {payError && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {payError}
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <Button onClick={submitPaymentRequest} disabled={payLoading} className="flex-1 bg-emerald-600 hover:bg-emerald-700" data-testid="button-submit-request">
                  {payLoading ? "Submitting..." : "Submit Request"}
                </Button>
                <Button variant="outline" onClick={() => setPayStep("pay")}>Back</Button>
              </div>
            </div>
          )}

          {payStep === "done" && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground">Request Submitted!</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Yasir has been notified. Once he verifies your payment, you'll receive an access code at <strong>{payForm.email}</strong>.
              </p>
              <div className="bg-muted/50 rounded-xl p-3 text-sm text-muted-foreground">
                Usually approved within a few hours.
              </div>
              <Button onClick={() => { setShowPayDialog(false); openAccessDialog(selectedNote!); }} className="gap-2" data-testid="button-enter-code-after-submit">
                <LockOpen className="h-4 w-4" /> Enter Access Code
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Access Code Dialog */}
      <Dialog open={showAccessDialog} onOpenChange={setShowAccessDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Enter Access Code</DialogTitle>
            <DialogDescription>{accessNote?.subject} — {accessNote?.chapter}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">Enter the email you submitted and the access code you received.</p>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Email Address</label>
              <Input type="email" placeholder="you@example.com" value={accessForm.email} onChange={(e) => setAccessForm({ ...accessForm, email: e.target.value })} data-testid="input-access-email" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Access Code</label>
              <Input
                placeholder="e.g. AB3K9PXZ"
                value={accessForm.code}
                onChange={(e) => setAccessForm({ ...accessForm, code: e.target.value.toUpperCase() })}
                className="font-mono tracking-widest text-center text-lg"
                maxLength={8}
                data-testid="input-access-code"
              />
            </div>
            {accessError && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {accessError}
              </div>
            )}
            <Button onClick={verifyAccessCode} disabled={accessLoading} className="w-full bg-emerald-600 hover:bg-emerald-700" data-testid="button-verify-code">
              {accessLoading ? "Verifying..." : "Unlock Notes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NoteCard({
  note, unlocked, isAdmin, onPayClick, onAccessCodeClick, onDownload, onEdit, onDelete,
}: {
  note: Note;
  unlocked: boolean;
  isAdmin: boolean;
  onPayClick: () => void;
  onAccessCodeClick: () => void;
  onDownload: (fmt: "txt" | "pdf") => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      data-testid={`note-card-${note.id}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 border text-xs">{note.subject}</Badge>
          <div className="flex items-center gap-1">
            {isAdmin && (
              <>
                <button onClick={onEdit} className="p-1 text-muted-foreground hover:text-blue-600 transition-colors" data-testid={`edit-note-${note.id}`}>
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button onClick={onDelete} className="p-1 text-muted-foreground hover:text-red-500 transition-colors" data-testid={`delete-note-${note.id}`}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            )}
            <span className="text-xs text-muted-foreground ml-1">{note.date}</span>
          </div>
        </div>

        <h3 className="font-serif text-lg font-bold text-foreground mb-3">{note.chapter}</h3>

        {unlocked ? (
          <>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="prose prose-sm max-w-none text-foreground/90 mb-3">
                    {note.content.split("\n\n").map((p, i) => (
                      <p key={i} className="mb-2 text-sm leading-relaxed">{p}</p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-xs text-primary font-medium flex items-center gap-1 mb-3 hover:underline"
            >
              {expanded ? <><ChevronUp className="h-3 w-3" /> Collapse</> : <><ChevronDown className="h-3 w-3" /> Read Note</>}
            </button>
          </>
        ) : (
          <div className="relative mb-3">
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 blur-[3px] select-none">
              {note.content}
            </p>
          </div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-between gap-2">
        {unlocked ? (
          <>
            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
              <LockOpen className="h-3.5 w-3.5" /> Unlocked
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-7 px-3 text-xs gap-1" onClick={() => onDownload("txt")} data-testid={`download-txt-${note.id}`}>
                <FileText className="h-3 w-3" /> TXT
              </Button>
              <Button size="sm" className="h-7 px-3 text-xs gap-1 bg-slate-900 text-white hover:bg-slate-800" onClick={() => onDownload("pdf")} data-testid={`download-pdf-${note.id}`}>
                <Download className="h-3 w-3" /> PDF
              </Button>
            </div>
          </>
        ) : (
          <>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <IndianRupee className="h-3.5 w-3.5" /> ₹5 per lesson
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-7 px-3 text-xs gap-1 text-emerald-700 border-emerald-200 hover:bg-emerald-50" onClick={onAccessCodeClick} data-testid={`enter-code-${note.id}`}>
                <LockOpen className="h-3 w-3" /> Have a Code?
              </Button>
              <Button size="sm" className="h-7 px-3 text-xs gap-1 bg-amber-500 hover:bg-amber-600 text-white" onClick={onPayClick} data-testid={`pay-${note.id}`}>
                <Lock className="h-3 w-3" /> Pay ₹5
              </Button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
