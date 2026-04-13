import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, FileText, Lock, Download, LockOpen, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

type Note = {
  id: string;
  grade: "11th" | "12th";
  subject: string;
  chapter: string;
  content: string;
  date: string;
};

export default function Notes() {
  const [notes, setNotes] = useLocalStorage<Note[]>("kashmir_notes", [
    {
      id: "1",
      grade: "12th",
      subject: "Physics",
      chapter: "Electrostatics",
      content: "Electric charge is a fundamental property of matter. Coulomb's Law dictates the force between two point charges...",
      date: new Date().toLocaleDateString()
    },
    {
      id: "2",
      grade: "11th",
      subject: "Chemistry",
      chapter: "Structure of Atom",
      content: "Atoms are the building blocks of elements. The Bohr model introduced quantized orbits for electrons...",
      date: new Date().toLocaleDateString()
    }
  ]);
  
  const [payments, setPayments] = useLocalStorage<Record<string, boolean>>("kashmir_payments", {});
  
  const [activeGrade, setActiveGrade] = useState<"11th" | "12th">("12th");
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  
  // New note state
  const [newNote, setNewNote] = useState<Partial<Note>>({ grade: "12th", subject: "", chapter: "", content: "" });
  
  // Payment dialog state
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === "yasir123") {
      setIsAdminAuth(true);
      setAdminPass("");
    } else {
      alert("Incorrect password");
    }
  };

  const handleUploadNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.subject || !newNote.chapter || !newNote.content) return;
    
    setNotes([
      {
        id: Date.now().toString(),
        grade: newNote.grade as "11th" | "12th",
        subject: newNote.subject,
        chapter: newNote.chapter,
        content: newNote.content,
        date: new Date().toLocaleDateString()
      },
      ...notes
    ]);
    
    setNewNote({ grade: activeGrade, subject: "", chapter: "", content: "" });
    alert("Note uploaded successfully!");
  };

  const handleDownload = (note: Note, format: "pdf" | "txt") => {
    if (!payments[note.id]) {
      setSelectedNote(note);
      setShowPayment(true);
      return;
    }

    const watermarkedContent = `KASHMIR PORTAL - YASIR FEROOZ\nClass ${note.grade} | ${note.subject} | ${note.chapter}\n\n${note.content}`;
    
    const blob = new Blob([watermarkedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.subject}_${note.chapter}_YasirFerooz.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const confirmPayment = () => {
    if (selectedNote) {
      setPayments({ ...payments, [selectedNote.id]: true });
      setShowPayment(false);
      alert("Payment confirmed! You can now download the notes.");
    }
  };

  const filteredNotes = notes.filter((n) => n.grade === activeGrade);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <div className="bg-amber-600 text-amber-50 py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay" />
        <div className="container mx-auto relative z-10 max-w-5xl text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">Study Portal</h1>
          <p className="text-xl md:text-2xl text-amber-100 font-light">
            Premium JK BOSE study notes compiled by Yasir Ferooz
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-8 relative z-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border p-2 flex gap-2 w-full md:w-auto">
            <Button 
              variant={activeGrade === "11th" ? "default" : "ghost"} 
              className={`flex-1 md:w-32 rounded-xl text-lg ${activeGrade === "11th" ? "bg-amber-500 hover:bg-amber-600" : ""}`}
              onClick={() => setActiveGrade("11th")}
            >
              Class 11th
            </Button>
            <Button 
              variant={activeGrade === "12th" ? "default" : "ghost"} 
              className={`flex-1 md:w-32 rounded-xl text-lg ${activeGrade === "12th" ? "bg-amber-500 hover:bg-amber-600" : ""}`}
              onClick={() => setActiveGrade("12th")}
            >
              Class 12th
            </Button>
          </div>

          {!isAdminAuth ? (
            <form onSubmit={handleAdminLogin} className="flex gap-2 w-full md:w-auto">
              <Input 
                type="password" 
                placeholder="Admin Password" 
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full md:w-48 bg-white dark:bg-slate-900"
              />
              <Button type="submit" variant="outline" className="bg-white dark:bg-slate-900">
                <Lock className="w-4 h-4 mr-2" /> Login
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 px-4 rounded-xl border shadow-sm">
              <span className="text-sm font-bold text-amber-600">Admin Mode Active</span>
              <Button variant="ghost" size="sm" onClick={() => setIsAdminAuth(false)}>Logout</Button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredNotes.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border shadow-sm"
                >
                  <BookOpen className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                  <h3 className="text-xl font-bold text-slate-500 mb-2">No notes available yet</h3>
                  <p className="text-muted-foreground">Check back later or contact Yasir Ferooz.</p>
                </motion.div>
              ) : (
                filteredNotes.map((note) => {
                  const isPaid = payments[note.id];
                  return (
                    <motion.div
                      key={note.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white dark:bg-slate-900 rounded-3xl border shadow-sm overflow-hidden group"
                    >
                      <div className="p-8">
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-sm font-bold rounded-full">
                            {note.subject}
                          </span>
                          <span className="text-sm text-muted-foreground">{note.date}</span>
                        </div>
                        <h3 className="font-serif text-2xl font-bold mb-3">{note.chapter}</h3>
                        
                        <div className="relative">
                          <p className={`text-slate-600 dark:text-slate-300 leading-relaxed ${!isPaid ? "line-clamp-3 blur-[2px] select-none" : ""}`}>
                            {note.content}
                          </p>
                          
                          {!isPaid && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-slate-900/40">
                              <Button 
                                onClick={() => handleDownload(note, "pdf")}
                                className="shadow-xl bg-amber-500 hover:bg-amber-600 text-white rounded-full px-6"
                              >
                                <Lock className="w-4 h-4 mr-2" /> Unlock for ₹5
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 px-8 border-t flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                          {isPaid ? (
                            <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                              <LockOpen className="w-4 h-4 mr-1" /> Unlocked
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <IndianRupee className="w-4 h-4 mr-1" /> ₹5 per lesson
                            </span>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="rounded-full"
                            onClick={() => handleDownload(note, "txt")}
                          >
                            <FileText className="w-4 h-4 mr-2" /> TXT
                          </Button>
                          <Button 
                            size="sm"
                            className="rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                            onClick={() => handleDownload(note, "pdf")}
                          >
                            <Download className="w-4 h-4 mr-2" /> PDF
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-6">
            {isAdminAuth && (
              <Card className="border-amber-200 shadow-md">
                <CardHeader className="bg-amber-50 dark:bg-amber-900/20 border-b">
                  <CardTitle className="flex items-center text-amber-800 dark:text-amber-400">
                    <Edit2 className="w-5 h-5 mr-2" /> Upload New Note
                  </CardTitle>
                </CardHeader>
                <form onSubmit={handleUploadNote}>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Class</label>
                      <Select 
                        value={newNote.grade} 
                        onValueChange={(val) => setNewNote({ ...newNote, grade: val as "11th" | "12th" })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="11th">Class 11th</SelectItem>
                          <SelectItem value="12th">Class 12th</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject</label>
                      <Input 
                        placeholder="e.g. Physics" 
                        value={newNote.subject}
                        onChange={(e) => setNewNote({ ...newNote, subject: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Chapter Name</label>
                      <Input 
                        placeholder="e.g. Electrostatics" 
                        value={newNote.chapter}
                        onChange={(e) => setNewNote({ ...newNote, chapter: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Content</label>
                      <Textarea 
                        placeholder="Write or paste your notes here..." 
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                        required
                        className="min-h-[200px]"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                      Publish Note
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            )}

            <Card className="bg-slate-900 text-white border-none shadow-xl">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IndianRupee className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="font-serif text-2xl font-bold">Why ₹5?</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  These notes represent hundreds of hours of careful curation, cross-referencing JK BOSE syllabus guidelines, and formatting for readability. 
                  A nominal fee of ₹5 per lesson helps support the hosting of this portal and motivates me to keep adding more premium content.
                </p>
                <p className="font-bold text-amber-400 pt-4">- Yasir Ferooz</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Unlock Study Material</DialogTitle>
            <DialogDescription>
              {selectedNote?.subject} - {selectedNote?.chapter}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <div className="text-4xl font-bold text-amber-600 flex items-center">
              <IndianRupee className="w-8 h-8 mr-1" /> 5.00
            </div>
            <p className="text-center text-sm text-muted-foreground max-w-[250px]">
              Scan the QR code in any UPI app or tap the button below to pay directly.
            </p>
            
            <a 
              href="upi://pay?pa=8082029582@fam&pn=YasirFerooz&am=5&cu=INR" 
              className="w-full"
            >
              <Button className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg">
                Pay via UPI App
              </Button>
            </a>
          </div>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full py-6 border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/40"
              onClick={confirmPayment}
            >
              I Have Paid ₹5
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Payment verification is based on trust system for now. Please be honest!
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
