import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, FileText, Lock, Download, LockOpen, IndianRupee,
  CheckCircle, Clock, XCircle, User, Mail, CreditCard, ChevronDown, ChevronUp,
  Plus, Edit2, Trash2, Save, X, ShieldCheck, AlertCircle, Upload, File,
  Image, FileType, Paperclip,
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
  fileUrl?: string;
  fileName?: string;
  fileMime?: string;
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

const ALL_SUBJECTS = ["Physics", "Chemistry", "English", "Mathematics", "Biology", "History", "Geography", "Economics"];

const SUBJECTS_11 = ["Physics", "Chemistry", "English", "Mathematics", "Biology"];
const SUBJECTS_12 = ["Physics", "Chemistry", "English", "Mathematics", "Biology"];

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

First Law (Law of Inertia): A body at rest stays at rest, and a body in motion continues in uniform straight-line motion unless acted upon by an external unbalanced force.

Second Law: The rate of change of momentum of a body is proportional to the applied force and occurs in the direction of the force. F = ma.

Third Law: For every action, there is an equal and opposite reaction. Forces always occur in pairs.

Friction: Static friction prevents relative motion between surfaces in contact. Kinetic friction acts when surfaces slide against each other. f = μN where μ is the coefficient of friction and N is the normal force.`,
    date: new Date().toLocaleDateString(),
  },
  {
    id: "demo-4",
    grade: "12th",
    subject: "Chemistry",
    chapter: "Solid State",
    content: `Solids are characterized by definite shape and volume. They can be crystalline (ordered arrangement) or amorphous (disordered arrangement).

Crystal Systems: There are 7 crystal systems: cubic, tetragonal, orthorhombic, hexagonal, trigonal, monoclinic, and triclinic.

Unit Cell: The smallest repeating structural unit of a crystal. For cubic systems: simple cubic (1 atom/cell), body-centered cubic (2 atoms/cell), face-centered cubic (4 atoms/cell).

Packing Efficiency: FCC and HCP have 74% packing efficiency. BCC has 68%. Simple cubic has only 52.4%.

Defects: Point defects include Schottky (cation-anion vacancy pair) and Frenkel (ion displaced to interstitial site) defects. These affect electrical conductivity and density.`,
    date: new Date().toLocaleDateString(),
  },
  {
    id: "demo-eng-12",
    grade: "12th",
    subject: "English",
    chapter: "The Last Lesson — Alphonse Daudet",
    content: `Summary: "The Last Lesson" is a story by Alphonse Daudet set during the Franco-Prussian War. It is narrated by a young boy named Franz who is late for school and dreads being questioned on French grammar.

To his surprise, he finds the village people gathered in his classroom. M. Hamel, the French teacher, announces it is the last French lesson — the German authorities have ordered that only German shall be taught in the schools of Alsace and Lorraine.

Themes:
1. Patriotism and love for one's language — the story shows how language is linked to national identity.
2. Regret and awakening — Franz regrets not learning French properly when he had the chance.
3. The cruelty of imperialism — the order to abandon one's mother tongue is a form of cultural oppression.

Important Quotes:
- "And I think that is one of the saddest things in the world." (M. Hamel on forgetting one's language)

Character Sketch of M. Hamel: He is a dedicated teacher who spends his last day dressed in his finest clothes. He does not blame the children for not learning; he blames himself and the parents too. He represents dignity in the face of defeat.`,
    date: new Date().toLocaleDateString(),
  },
  {
    id: "demo-eng-12-2",
    grade: "12th",
    subject: "English",
    chapter: "My Mother at Sixty-Six — Kamala Das",
    content: `My Mother at Sixty-Six is a poem by Kamala Das from the collection Flamingo (Class 12 JK BOSE).

The poem deals with the poet's fear of losing her aging mother. While driving to the Cochin airport, she looks at her mother dozing beside her and is struck by the pallor of her face — "as a corpse's" and "like a late winter's moon." These similes convey the signs of old age and the closeness of death.

Key Poetic Devices:
- Simile: "her face ashen like that of a corpse" — compares mother's face to a dead person to show aging.
- Simile: "pale as a late winter's moon" — the moon at this time is faint, far away, symbolic of fading life.
- Imagery: "young trees sprinting" — contrasts the vitality of young life with the stillness of old age.

Theme: The central theme is the fear of separation and loss. The poet is torn between the natural cycle of life and death, and her emotional attachment to her mother.

The poet's parting words — "See you soon, Amma" — are a way to suppress her pain and remain optimistic. The "smile and smile and smile" in the closing lines shows a forced cheerfulness masking deep grief.`,
    date: new Date().toLocaleDateString(),
  },
  {
    id: "demo-eng-11",
    grade: "11th",
    subject: "English",
    chapter: "The Portrait of a Lady — Khushwant Singh",
    content: `The Portrait of a Lady is the first chapter in Hornbill (Class 11 English, JK BOSE), written by Khushwant Singh.

The story traces the relationship between the author and his grandmother across three phases of life — childhood in the village, school years in the city, and the narrator's five years abroad.

Three Phases:
1. Village Phase: The grandmother was kind, caring, and deeply religious. She would wake him up, help him get ready for school, and accompany him to the temple school.
2. City Phase: A gap developed between them as he attended an English school. She could not help him with his lessons and disapproved of music being taught.
3. Abroad Phase: The grandmother withdrew into prayers and spinning. When he returned after five years, she celebrated — but died peacefully the next morning.

Character of the Grandmother:
- Deeply religious (always praying, chanting beads)
- Self-sacrificing and devoted
- Dignified in old age — she did not mourn, she celebrated his return

Theme: The story explores the changing nature of relationships with modernisation and urbanisation, and the enduring bond of love between generations.

Important Symbol: The sparrows she fed on the roof — on the day of her death, thousands of sparrows gathered silently, as if to mourn.`,
    date: new Date().toLocaleDateString(),
  },
  {
    id: "demo-eng-11-2",
    grade: "11th",
    subject: "English",
    chapter: "We're Not Afraid to Die — Gordon Cook & Alan East",
    content: `We're Not Afraid to Die is the second chapter in Hornbill (Class 11, JK BOSE). It is a true adventure story narrated by the unnamed narrator (based on Gordon Cook).

The narrator, a 37-year-old businessman, attempts to replicate the voyage of Captain James Cook — circumnavigating the globe. He sets out with his wife Mary, son Jonathan (6), daughter Suzanne (7), and two professional seamen.

Key Events:
- The voyage begins at Plymouth, England in July 1976.
- They face a massive storm near the Cape of Good Hope that batters the ship Wavewalker severely.
- The narrator is thrown overboard but manages to climb back. He and the crew bail water continuously.
- They discover two islands — Ile Amsterdam — after precise navigation.

Themes:
- Courage and perseverance in the face of danger
- Teamwork and leadership in crisis
- The indomitable spirit of the human will

Character of Jonathan and Suzanne:
- Jonathan writes: "We're not afraid of dying if we can all be together." This quote gives the story its title and captures the family's spirit.
- Suzanne hides her own injury (a fractured skull) to not worry her parents.`,
    date: new Date().toLocaleDateString(),
  },
  {
    id: "demo-math-12",
    grade: "12th",
    subject: "Mathematics",
    chapter: "Relations and Functions",
    content: `Relations: A relation R from set A to set B is a subset of A × B. If (a, b) ∈ R, we say a is related to b.

Types of Relations:
1. Reflexive: (a, a) ∈ R for all a ∈ A
2. Symmetric: (a, b) ∈ R implies (b, a) ∈ R
3. Transitive: (a, b) ∈ R and (b, c) ∈ R implies (a, c) ∈ R
4. Equivalence: Reflexive + Symmetric + Transitive

Functions: A function f: A → B assigns each element of A to exactly one element of B.

Types of Functions:
- One-one (Injective): f(a₁) = f(a₂) implies a₁ = a₂
- Onto (Surjective): Every element of B has a pre-image in A
- Bijective: Both one-one and onto

Composition of Functions: If f: A→B and g: B→C, then gof: A→C, where (gof)(x) = g(f(x)).

Invertible Functions: A function f is invertible if and only if it is bijective. The inverse is denoted f⁻¹.`,
    date: new Date().toLocaleDateString(),
  },
];

function getFileIcon(mime?: string) {
  if (!mime) return <FileText className="h-5 w-5" />;
  if (mime.startsWith("image/")) return <Image className="h-5 w-5 text-blue-500" />;
  if (mime === "application/pdf") return <FileType className="h-5 w-5 text-red-500" />;
  return <File className="h-5 w-5 text-slate-500" />;
}

function getFileBadgeLabel(mime?: string, fileName?: string) {
  if (!mime && !fileName) return "File";
  if (mime?.startsWith("image/")) return "Image";
  if (mime === "application/pdf") return "PDF";
  const ext = fileName?.split(".").pop()?.toUpperCase();
  return ext ?? "File";
}

function downloadTextFile(note: Note) {
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

export default function Notes() {
  const [notes, setNotes] = useLocalStorage<Note[]>("kashmir_notes_v3", DEFAULT_NOTES);
  const [accessList, setAccessList] = useLocalStorage<AccessEntry[]>("kashmir_access_v2", []);

  const [activeGrade, setActiveGrade] = useState<"11th" | "12th">("12th");
  const [searchQuery, setSearchQuery] = useState("");
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

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploadedMime, setUploadedMime] = useState("");
  const [uploadedName, setUploadedName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUnlocked = (noteId: string) => accessList.some((a) => a.noteId === noteId);

  const activeSubjects = activeGrade === "11th" ? SUBJECTS_11 : SUBJECTS_12;
  const filteredNotes = notes.filter((n) => {
    if (n.grade !== activeGrade) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.chapter.toLowerCase().includes(q) ||
      n.subject.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q)
    );
  });

  const loadAdminRequests = useCallback(async () => {
    setAdminLoading(true);
    try {
      const res = await fetch(`${BASE}/api/payment-requests?adminKey=yasir123`);
      if (res.ok) setAdminRequests(await res.json());
    } finally {
      setAdminLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin && showAdminPanel) loadAdminRequests();
  }, [isAdmin, showAdminPanel, loadAdminRequests]);

  const handleAdminLogin = () => {
    if (adminPass === "yasir123") { setIsAdmin(true); setAdminError(false); setAdminPass(""); }
    else setAdminError(true);
  };

  const handleFileSelect = (file: File) => {
    setUploadFile(file);
    setUploadProgress("idle");
    setUploadedUrl("");
    setUploadedMime(file.type);
    setUploadedName(file.name);
  };

  const handleUploadFile = async () => {
    if (!uploadFile) return;
    setUploadProgress("uploading");
    try {
      const fd = new FormData();
      fd.append("file", uploadFile);
      const res = await fetch(`${BASE}/api/upload`, {
        method: "POST",
        headers: { "x-admin-key": "yasir123" },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setUploadedUrl(data.url);
      setUploadedMime(data.mimeType);
      setUploadedName(data.originalName);
      setUploadProgress("done");
    } catch {
      setUploadProgress("error");
    }
  };

  const resetUpload = () => {
    setUploadFile(null);
    setUploadProgress("idle");
    setUploadedUrl("");
    setUploadedMime("");
    setUploadedName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openAddForm = () => {
    setEditNote(null);
    setNoteForm({ grade: activeGrade, subject: "", chapter: "", content: "" });
    resetUpload();
    setShowNoteForm(true);
  };

  const handleSaveNote = () => {
    if (!noteForm.subject || !noteForm.chapter) return;
    const base: Note = {
      id: editNote?.id ?? `note-${Date.now()}`,
      grade: noteForm.grade as "11th" | "12th",
      subject: noteForm.subject!,
      chapter: noteForm.chapter!,
      content: noteForm.content ?? "",
      date: editNote?.date ?? new Date().toLocaleDateString(),
      fileUrl: uploadedUrl || editNote?.fileUrl,
      fileName: uploadedName || editNote?.fileName,
      fileMime: uploadedMime || editNote?.fileMime,
    };
    if (!base.fileUrl) { delete base.fileUrl; delete base.fileName; delete base.fileMime; }
    if (editNote) {
      setNotes(notes.map((n) => n.id === editNote.id ? base : n));
      setEditNote(null);
    } else {
      setNotes([base, ...notes]);
      setShowNoteForm(false);
    }
    setNoteForm({ grade: activeGrade, subject: "", chapter: "", content: "" });
    resetUpload();
  };

  const startEdit = (note: Note) => {
    setEditNote(note);
    setNoteForm({ grade: note.grade, subject: note.subject, chapter: note.chapter, content: note.content });
    resetUpload();
    if (note.fileUrl) { setUploadedUrl(note.fileUrl); setUploadedMime(note.fileMime ?? ""); setUploadedName(note.fileName ?? "file"); setUploadProgress("done"); }
    setShowNoteForm(false);
  };

  const openPayDialog = (note: Note) => {
    setSelectedNote(note); setPayStep("pay"); setPayForm({ name: "", email: "", txId: "" }); setPayError(""); setShowPayDialog(true);
  };

  const submitPaymentRequest = async () => {
    if (!payForm.name.trim() || !payForm.email.trim() || !payForm.txId.trim()) { setPayError("Please fill in all fields."); return; }
    if (!payForm.email.includes("@")) { setPayError("Please enter a valid email address."); return; }
    if (!selectedNote) return;
    setPayLoading(true); setPayError("");
    try {
      const res = await fetch(`${BASE}/api/payment-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: payForm.name.trim(), userEmail: payForm.email.trim().toLowerCase(),
          noteId: selectedNote.id, noteTitle: selectedNote.chapter,
          subject: selectedNote.subject, classLevel: `Class ${selectedNote.grade}`,
          upiTransactionId: payForm.txId.trim(),
        }),
      });
      if (!res.ok) { const e = await res.json(); setPayError(e.error ?? "Something went wrong."); return; }
      setPayStep("done");
    } catch { setPayError("Network error. Please check your connection."); }
    finally { setPayLoading(false); }
  };

  const openAccessDialog = (note: Note) => {
    setAccessNote(note); setAccessForm({ email: "", code: "" }); setAccessError(""); setShowAccessDialog(true);
  };

  const verifyAccessCode = async () => {
    if (!accessForm.email.trim() || !accessForm.code.trim()) { setAccessError("Please fill in both fields."); return; }
    if (!accessNote) return;
    setAccessLoading(true); setAccessError("");
    try {
      const params = new URLSearchParams({ email: accessForm.email.trim().toLowerCase(), noteId: accessNote.id, code: accessForm.code.trim().toUpperCase() });
      const res = await fetch(`${BASE}/api/payment-requests/verify-code?${params}`);
      const data = await res.json();
      if (data.valid) {
        setAccessList([...accessList.filter((a) => a.noteId !== accessNote.id), { noteId: accessNote.id, code: accessForm.code.trim().toUpperCase() }]);
        setShowAccessDialog(false);
      } else { setAccessError("Invalid code or email. Please check and try again."); }
    } catch { setAccessError("Network error. Please try again."); }
    finally { setAccessLoading(false); }
  };

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try { await fetch(`${BASE}/api/payment-requests/${id}/approve`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminKey: "yasir123" }) }); await loadAdminRequests(); }
    finally { setActionLoading(null); }
  };

  const handleReject = async (id: number) => {
    setActionLoading(id);
    try { await fetch(`${BASE}/api/payment-requests/${id}/reject`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminKey: "yasir123" }) }); await loadAdminRequests(); }
    finally { setActionLoading(null); }
  };

  const pendingCount = adminRequests.filter((r) => r.status === "pending").length;
  const isFormOpen = showNoteForm || !!editNote;

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
              Premium Class 11th &amp; 12th notes by Yasir Ferooz — text notes, PDFs, and images.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Top controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex gap-2 bg-muted p-1.5 rounded-xl">
            {(["11th", "12th"] as const).map((g) => (
              <button key={g} onClick={() => setActiveGrade(g)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeGrade === g ? "bg-amber-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                Class {g}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isAdmin ? (
              <>
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 border font-semibold">Admin Mode</Badge>
                <Button size="sm" variant="outline" className="gap-1.5 relative" onClick={() => setShowAdminPanel((v) => !v)}>
                  <ShieldCheck className="h-4 w-4" /> Payments
                  {pendingCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{pendingCount}</span>}
                </Button>
                <Button size="sm" onClick={openAddForm} className="gap-1.5 bg-amber-500 hover:bg-amber-600 text-white">
                  <Plus className="h-4 w-4" /> Add Note
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setIsAdmin(false); setShowAdminPanel(false); setShowNoteForm(false); setEditNote(null); }}>Logout</Button>
              </>
            ) : (
              <>
                <Input type="password" placeholder="Admin password" value={adminPass}
                  onChange={(e) => { setAdminPass(e.target.value); setAdminError(false); }}
                  onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                  className={`w-36 h-9 text-sm ${adminError ? "border-red-400" : ""}`} />
                <Button size="sm" variant="outline" onClick={handleAdminLogin}>
                  <Lock className="h-3.5 w-3.5 mr-1" /> Login
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mb-8">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by chapter, subject or keyword..."
            className="pl-11 pr-10 h-11 text-sm rounded-xl bg-card border-border shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Admin: Payments Panel */}
        <AnimatePresence>
          {isAdmin && showAdminPanel && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-serif text-xl font-bold">Payment Requests</h3>
                  <Button size="sm" variant="outline" onClick={loadAdminRequests} disabled={adminLoading}>{adminLoading ? "Loading..." : "Refresh"}</Button>
                </div>
                {adminLoading ? <div className="text-center py-10 text-muted-foreground">Loading...</div>
                  : adminRequests.length === 0 ? <div className="text-center py-10 text-muted-foreground">No payment requests yet.</div>
                  : (
                    <div className="space-y-3">
                      {adminRequests.map((req) => (
                        <div key={req.id} className={`p-4 rounded-xl border ${req.status === "pending" ? "border-amber-200 bg-amber-50/50" : req.status === "approved" ? "border-emerald-200 bg-emerald-50/50" : "border-red-100 bg-red-50/30"}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold">{req.userName}</span>
                                <span className="text-muted-foreground text-sm">({req.userEmail})</span>
                                <Badge className={`text-xs border ${req.status === "pending" ? "bg-amber-100 text-amber-800 border-amber-200" : req.status === "approved" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-red-100 text-red-700 border-red-200"}`}>
                                  {req.status === "pending" ? <Clock className="h-3 w-3 mr-1 inline" /> : req.status === "approved" ? <CheckCircle className="h-3 w-3 mr-1 inline" /> : <XCircle className="h-3 w-3 mr-1 inline" />}
                                  {req.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground"><span className="font-medium text-foreground">{req.classLevel}</span> — {req.subject} — <span className="font-medium text-foreground">{req.noteTitle}</span></div>
                              <div className="text-xs text-muted-foreground font-mono">TX: {req.upiTransactionId.split("|")[0]}</div>
                            </div>
                            {req.status === "pending" && (
                              <div className="flex gap-2 shrink-0">
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1" onClick={() => handleApprove(req.id)} disabled={actionLoading === req.id}>
                                  <CheckCircle className="h-3.5 w-3.5" />{actionLoading === req.id ? "..." : "Approve"}
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 gap-1" onClick={() => handleReject(req.id)} disabled={actionLoading === req.id}>
                                  <XCircle className="h-3.5 w-3.5" />{actionLoading === req.id ? "..." : "Reject"}
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

        {/* Admin: Add/Edit Note Form */}
        <AnimatePresence>
          {isAdmin && isFormOpen && (
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mb-10">
              <div className="bg-card border-2 border-amber-300 rounded-2xl shadow-md overflow-hidden">
                <div className="bg-amber-50 border-b border-amber-200 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                      {editNote ? <Edit2 className="h-4 w-4 text-white" /> : <Plus className="h-4 w-4 text-white" />}
                    </div>
                    <h3 className="font-bold text-amber-900 text-lg">{editNote ? "Edit Note" : "Add New Note"}</h3>
                  </div>
                  <button onClick={() => { setShowNoteForm(false); setEditNote(null); resetUpload(); }} className="text-amber-600 hover:text-amber-800">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  {/* Row 1: Class + Subject + Chapter */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Class</label>
                      <Select value={noteForm.grade} onValueChange={(v) => setNoteForm({ ...noteForm, grade: v as "11th" | "12th" })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="11th">Class 11th</SelectItem>
                          <SelectItem value="12th">Class 12th</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Subject</label>
                      <Select value={noteForm.subject} onValueChange={(v) => setNoteForm({ ...noteForm, subject: v })}>
                        <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                        <SelectContent>
                          {ALL_SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Chapter / Lesson Title</label>
                      <Input value={noteForm.chapter ?? ""} onChange={(e) => setNoteForm({ ...noteForm, chapter: e.target.value })} placeholder="e.g. Electrostatics" />
                    </div>
                  </div>

                  {/* Text content */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Text Content <span className="normal-case text-muted-foreground/60 font-normal">(optional if uploading a file)</span></label>
                    <Textarea value={noteForm.content ?? ""} onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })} rows={8} placeholder="Type or paste full notes here..." className="font-mono text-sm resize-y" />
                  </div>

                  {/* File upload */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Attach File <span className="normal-case text-muted-foreground/60 font-normal">(PDF, Word, Image, or any file — max 50 MB)</span></label>

                    {uploadProgress === "done" && uploadedUrl ? (
                      <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                        {getFileIcon(uploadedMime)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-emerald-800 truncate">{uploadedName}</p>
                          <p className="text-xs text-emerald-600">Uploaded successfully</p>
                        </div>
                        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 shrink-0" onClick={resetUpload}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${dragOver ? "border-amber-400 bg-amber-50" : "border-border hover:border-amber-300 hover:bg-amber-50/30"}`}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input ref={fileInputRef} type="file" className="hidden" accept="*/*"
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }} />
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">Drop file here or click to browse</p>
                        <p className="text-xs text-muted-foreground mt-1">PDF, Word, PowerPoint, Images, or any file</p>
                      </div>
                    )}

                    {uploadFile && uploadProgress !== "done" && (
                      <div className="mt-3 flex items-center gap-3 p-3 bg-muted rounded-xl">
                        <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm text-foreground flex-1 truncate">{uploadFile.name}</span>
                        {uploadProgress === "uploading" ? (
                          <span className="text-xs text-amber-600 animate-pulse font-medium">Uploading...</span>
                        ) : uploadProgress === "error" ? (
                          <span className="text-xs text-red-500 font-medium">Failed</span>
                        ) : (
                          <Button size="sm" onClick={handleUploadFile} className="bg-amber-500 hover:bg-amber-600 text-white h-7 px-3 text-xs gap-1">
                            <Upload className="h-3 w-3" /> Upload
                          </Button>
                        )}
                        <button onClick={resetUpload} className="text-muted-foreground hover:text-red-500"><X className="h-4 w-4" /></button>
                      </div>
                    )}
                  </div>

                  {/* Save button */}
                  <div className="flex gap-3 pt-2 border-t border-border">
                    <Button onClick={handleSaveNote} disabled={!noteForm.subject || !noteForm.chapter || (uploadProgress === "uploading")}
                      className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                      <Save className="h-4 w-4" /> {editNote ? "Save Changes" : "Publish Note"}
                    </Button>
                    <Button variant="outline" onClick={() => { setShowNoteForm(false); setEditNote(null); resetUpload(); }}>
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes by subject */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
            {searchQuery ? (
              <>
                <p className="text-lg font-medium">No results for &ldquo;{searchQuery}&rdquo;</p>
                <p className="text-sm mt-1">Try a different keyword or <button onClick={() => setSearchQuery("")} className="text-amber-600 underline">clear the search</button></p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium">No notes for Class {activeGrade} yet.</p>
                {isAdmin && <Button className="mt-4 gap-2" onClick={openAddForm}><Plus className="h-4 w-4" /> Add the first note</Button>}
              </>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {activeSubjects
              .filter((s) => filteredNotes.some((n) => n.subject === s))
              .map((subject) => {
                const subjectNotes = filteredNotes.filter((n) => n.subject === subject);
                return (
                  <section key={subject}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="h-8 w-1 bg-amber-500 rounded-full" />
                      <h2 className="font-serif text-2xl font-bold">{subject}</h2>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 border text-xs">{subjectNotes.length} {subjectNotes.length === 1 ? "lesson" : "lessons"}</Badge>
                      <div className="h-px flex-1 bg-border" />
                      {isAdmin && (
                        <Button size="sm" variant="ghost" className="gap-1 text-xs text-muted-foreground hover:text-amber-700"
                          onClick={() => { setEditNote(null); setNoteForm({ grade: activeGrade, subject, chapter: "", content: "" }); resetUpload(); setShowNoteForm(true); }}>
                          <Plus className="h-3 w-3" /> Add to {subject}
                        </Button>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {subjectNotes.map((note) => (
                        <NoteCard
                          key={note.id}
                          note={note}
                          unlocked={isUnlocked(note.id)}
                          isAdmin={isAdmin}
                          onPayClick={() => openPayDialog(note)}
                          onAccessCodeClick={() => openAccessDialog(note)}
                          onDownload={() => downloadTextFile(note)}
                          onEdit={() => startEdit(note)}
                          onDelete={() => setNotes(notes.filter((n) => n.id !== note.id))}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}

            {/* Extra subjects not in default list */}
            {filteredNotes
              .filter((n) => !activeSubjects.includes(n.subject))
              .reduce<string[]>((acc, n) => acc.includes(n.subject) ? acc : [...acc, n.subject], [])
              .map((subject) => {
                const subjectNotes = filteredNotes.filter((n) => n.subject === subject);
                return (
                  <section key={subject}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="h-8 w-1 bg-amber-500 rounded-full" />
                      <h2 className="font-serif text-2xl font-bold">{subject}</h2>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 border text-xs">{subjectNotes.length} {subjectNotes.length === 1 ? "lesson" : "lessons"}</Badge>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {subjectNotes.map((note) => (
                        <NoteCard
                          key={note.id}
                          note={note}
                          unlocked={isUnlocked(note.id)}
                          isAdmin={isAdmin}
                          onPayClick={() => openPayDialog(note)}
                          onAccessCodeClick={() => openAccessDialog(note)}
                          onDownload={() => downloadTextFile(note)}
                          onEdit={() => startEdit(note)}
                          onDelete={() => setNotes(notes.filter((n) => n.id !== note.id))}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
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
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-center">
                <p className="text-4xl font-bold text-amber-700 mb-1">₹ 5.00</p>
                <p className="text-sm text-amber-700">UPI ID: <span className="font-mono font-bold">8082029582@fam</span></p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Choose how to pay</p>
                <a href="tez://upi/pay?pa=8082029582@fam&pn=YasirFerooz&am=5&cu=INR&tn=KashmirPortalNotes"
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 border-[#4285F4]/30 bg-[#4285F4]/5 hover:bg-[#4285F4]/10 transition-colors">
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
                <a href="upi://pay?pa=8082029582@fam&pn=YasirFerooz&am=5&cu=INR&tn=KashmirPortalNotes"
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 border-border hover:bg-muted/50 transition-colors">
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
              <Button onClick={() => setPayStep("submit")} variant="outline" className="w-full h-11 border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                I Have Paid — Submit My Request
              </Button>
            </div>
          )}

          {payStep === "submit" && (
            <div className="space-y-4 py-2">
              <p className="text-sm text-muted-foreground">Fill in your details. Yasir will verify your payment and email you an access code.</p>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Your Name</label>
                <div className="relative"><User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="Full name" value={payForm.name} onChange={(e) => setPayForm({ ...payForm, name: e.target.value })} /></div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Your Email (for access code)</label>
                <div className="relative"><Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9" type="email" placeholder="you@example.com" value={payForm.email} onChange={(e) => setPayForm({ ...payForm, email: e.target.value })} /></div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">UPI Transaction ID</label>
                <div className="relative"><CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9 font-mono" placeholder="e.g. 123456789012" value={payForm.txId} onChange={(e) => setPayForm({ ...payForm, txId: e.target.value })} /></div>
                <p className="text-xs text-muted-foreground mt-1">Find this in your UPI app under payment history</p>
              </div>
              {payError && <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg"><AlertCircle className="h-4 w-4 shrink-0" />{payError}</div>}
              <div className="flex gap-2 pt-1">
                <Button onClick={submitPaymentRequest} disabled={payLoading} className="flex-1 bg-emerald-600 hover:bg-emerald-700">{payLoading ? "Submitting..." : "Submit Request"}</Button>
                <Button variant="outline" onClick={() => setPayStep("pay")}>Back</Button>
              </div>
            </div>
          )}

          {payStep === "done" && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto"><CheckCircle className="h-8 w-8 text-emerald-600" /></div>
              <h3 className="font-serif text-xl font-bold">Request Submitted!</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">Yasir has been notified. You'll receive an access code at <strong>{payForm.email}</strong> once approved.</p>
              <div className="bg-muted/50 rounded-xl p-3 text-sm text-muted-foreground">Usually approved within a few hours.</div>
              <Button onClick={() => { setShowPayDialog(false); openAccessDialog(selectedNote!); }} className="gap-2">
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
            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Email Address</label><Input type="email" placeholder="you@example.com" value={accessForm.email} onChange={(e) => setAccessForm({ ...accessForm, email: e.target.value })} /></div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Access Code</label>
              <Input placeholder="e.g. AB3K9PXZ" value={accessForm.code} onChange={(e) => setAccessForm({ ...accessForm, code: e.target.value.toUpperCase() })} className="font-mono tracking-widest text-center text-lg" maxLength={8} />
            </div>
            {accessError && <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg"><AlertCircle className="h-4 w-4 shrink-0" />{accessError}</div>}
            <Button onClick={verifyAccessCode} disabled={accessLoading} className="w-full bg-emerald-600 hover:bg-emerald-700">{accessLoading ? "Verifying..." : "Unlock Notes"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NoteCard({ note, unlocked, isAdmin, onPayClick, onAccessCodeClick, onDownload, onEdit, onDelete }: {
  note: Note; unlocked: boolean; isAdmin: boolean;
  onPayClick: () => void; onAccessCodeClick: () => void;
  onDownload: () => void; onEdit: () => void; onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasFile = !!note.fileUrl;
  const isImage = note.fileMime?.startsWith("image/");
  const fileBadge = getFileBadgeLabel(note.fileMime, note.fileName);

  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 border text-xs">{note.subject}</Badge>
            {hasFile && (
              <Badge className={`text-xs border ${note.fileMime === "application/pdf" ? "bg-red-50 text-red-700 border-red-200" : note.fileMime?.startsWith("image/") ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-700 border-slate-200"}`}>
                {getFileIcon(note.fileMime)}
                <span className="ml-1">{fileBadge}</span>
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {isAdmin && (
              <>
                <button onClick={onEdit} className="p-1 text-muted-foreground hover:text-blue-600 transition-colors"><Edit2 className="h-3.5 w-3.5" /></button>
                <button onClick={onDelete} className="p-1 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
              </>
            )}
            <span className="text-xs text-muted-foreground ml-1">{note.date}</span>
          </div>
        </div>

        <h3 className="font-serif text-lg font-bold text-foreground mb-3 leading-snug">{note.chapter}</h3>

        {/* Content preview or full */}
        {note.content && (
          unlocked ? (
            <>
              <AnimatePresence>
                {expanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-3">
                    {note.content.split("\n\n").map((p, i) => <p key={i} className="text-sm leading-relaxed text-foreground/90 mb-2">{p}</p>)}
                  </motion.div>
                )}
              </AnimatePresence>
              <button onClick={() => setExpanded((v) => !v)} className="text-xs text-primary font-medium flex items-center gap-1 mb-3 hover:underline">
                {expanded ? <><ChevronUp className="h-3 w-3" /> Collapse</> : <><ChevronDown className="h-3 w-3" /> Read Note</>}
              </button>
            </>
          ) : (
            <div className="mb-3">
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 blur-[3px] select-none">{note.content}</p>
            </div>
          )
        )}

        {/* File preview (images only when unlocked) */}
        {hasFile && unlocked && isImage && (
          <div className="mb-3 rounded-xl overflow-hidden border border-border">
            <img src={`${BASE}${note.fileUrl}`} alt={note.chapter} className="w-full object-cover max-h-40" />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-between gap-2">
        {unlocked ? (
          <>
            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold"><LockOpen className="h-3.5 w-3.5" /> Unlocked</div>
            <div className="flex gap-2">
              {note.content && (
                <Button size="sm" variant="outline" className="h-7 px-3 text-xs gap-1" onClick={onDownload}>
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
              {!hasFile && !note.content && <span className="text-xs text-muted-foreground">No content yet</span>}
            </div>
          </>
        ) : (
          <>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" /> ₹5 per lesson</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-7 px-3 text-xs gap-1 text-emerald-700 border-emerald-200 hover:bg-emerald-50" onClick={onAccessCodeClick}>
                <LockOpen className="h-3 w-3" /> Code?
              </Button>
              <Button size="sm" className="h-7 px-3 text-xs gap-1 bg-amber-500 hover:bg-amber-600 text-white" onClick={onPayClick}>
                <Lock className="h-3 w-3" /> Pay ₹5
              </Button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
