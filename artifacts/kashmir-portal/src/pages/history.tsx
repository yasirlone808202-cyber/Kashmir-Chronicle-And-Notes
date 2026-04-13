import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, MessageSquare, Edit2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/hooks/use-local-storage";

type Comment = { id: string; name: string; content: string; date: string };
type EditSuggestion = { id: string; name: string; section: string; content: string; date: string };

const TIMELINE = [
  {
    period: "Ancient Period",
    title: "Buddhist & Hindu Era",
    content: "Kashmir was a major center of Sanskrit scholars, Buddhist philosophy, and Shaivism. Emperor Ashoka introduced Buddhism in the 3rd century BCE. Later, the Karkota Empire (7th-9th century CE) established a powerful kingdom, with Lalitaditya Muktapida being its most famous ruler.",
    color: "bg-amber-500"
  },
  {
    period: "Medieval Period",
    title: "Islamic Influence (14th Century)",
    content: "Islam arrived in Kashmir gradually through Sufi saints, most notably Bulbul Shah and Mir Sayyid Ali Hamadani. Rinchan, a Ladakhi prince, became the first Muslim ruler of Kashmir in 1320. The Shah Mir dynasty later solidified Islamic rule, bringing Persian culture, arts, and crafts to the valley.",
    color: "bg-emerald-600"
  },
  {
    period: "1586 - 1752",
    title: "Mughal Era",
    content: "Emperor Akbar conquered Kashmir in 1586. The Mughals were captivated by its beauty, calling it 'Paradise on Earth'. They built spectacular gardens like Shalimar Bagh and Nishat Bagh. This era saw peace and development in arts, though it also marked the loss of Kashmir's independence.",
    color: "bg-emerald-500"
  },
  {
    period: "1752 - 1819",
    title: "Afghan Rule",
    content: "As the Mughal Empire declined, Afghan forces under Ahmad Shah Durrani took control. This period was marked by heavy taxation and harsh governance, often considered one of the darkest periods in Kashmiri history.",
    color: "bg-slate-700"
  },
  {
    period: "1819 - 1846",
    title: "Sikh Era",
    content: "Maharaja Ranjit Singh captured Kashmir, bringing it under the Sikh Empire. This ended Afghan rule but introduced new hardships, including heavy taxes on shawls and agrarian struggles.",
    color: "bg-amber-600"
  },
  {
    period: "1846 - 1947",
    title: "Dogra Rule",
    content: "Following the First Anglo-Sikh War, the British sold Kashmir to Gulab Singh under the Treaty of Amritsar for 7.5 million Nanakshahee rupees. The Dogra dynasty ruled the princely state of Jammu and Kashmir until 1947.",
    color: "bg-rose-800"
  },
  {
    period: "1947 - Present",
    title: "Post-1947 Partition & Conflicts",
    content: "During the 1947 partition of India and Pakistan, Maharaja Hari Singh delayed joining either nation. After a tribal invasion backed by Pakistan, he signed the Instrument of Accession to India. This led to the First Kashmir War and the division of the region along the Line of Control. The region remains a flashpoint for conflict today.",
    color: "bg-blue-800"
  }
];

export default function History() {
  const [comments, setComments] = useLocalStorage<Comment[]>("kashmir_comments", []);
  const [edits, setEdits] = useLocalStorage<EditSuggestion[]>("kashmir_edits", []);
  
  const [newComment, setNewComment] = useState({ name: "", content: "" });
  const [newEdit, setNewEdit] = useState({ name: "", section: "", content: "" });
  const [activeTab, setActiveTab] = useState<"timeline" | "discuss" | "contribute">("timeline");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.name || !newComment.content) return;
    
    setComments([
      { id: Date.now().toString(), date: new Date().toLocaleDateString(), ...newComment },
      ...comments
    ]);
    setNewComment({ name: "", content: "" });
  };

  const handleAddEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEdit.name || !newEdit.section || !newEdit.content) return;
    
    setEdits([
      { id: Date.now().toString(), date: new Date().toLocaleDateString(), ...newEdit },
      ...edits
    ]);
    setNewEdit({ name: "", section: "", content: "" });
    alert("Thank you for your contribution! It has been saved locally.");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <div className="bg-emerald-900 text-emerald-50 py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-800/40 via-emerald-900 to-black z-0" />
        <div className="container mx-auto relative z-10 max-w-4xl text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">The Tapestry of Time</h1>
          <p className="text-xl md:text-2xl text-emerald-200 font-light">
            Journey through the centuries that shaped the Valley of Kashmir
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl -mt-8 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border p-2 flex gap-2 mb-12">
          <Button 
            variant={activeTab === "timeline" ? "default" : "ghost"} 
            className="flex-1 rounded-xl"
            onClick={() => setActiveTab("timeline")}
          >
            Historical Timeline
          </Button>
          <Button 
            variant={activeTab === "discuss" ? "default" : "ghost"} 
            className="flex-1 rounded-xl"
            onClick={() => setActiveTab("discuss")}
          >
            <MessageSquare className="w-4 h-4 mr-2" /> Discussion
          </Button>
          <Button 
            variant={activeTab === "contribute" ? "default" : "ghost"} 
            className="flex-1 rounded-xl"
            onClick={() => setActiveTab("contribute")}
          >
            <Edit2 className="w-4 h-4 mr-2" /> Contribute
          </Button>
        </div>

        {activeTab === "timeline" && (
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">
            {TIMELINE.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 ${item.color} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md z-10`} />
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{item.period}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "discuss" && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border shadow-sm">
            <h2 className="font-serif text-3xl font-bold mb-6">Community Thoughts</h2>
            <form onSubmit={handleAddComment} className="mb-10 space-y-4">
              <Input 
                placeholder="Your Name" 
                value={newComment.name}
                onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                required
                className="max-w-xs"
              />
              <Textarea 
                placeholder="Share your thoughts on Kashmir's history..." 
                value={newComment.content}
                onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                required
                className="min-h-[100px]"
              />
              <Button type="submit">
                <Send className="w-4 h-4 mr-2" /> Post Comment
              </Button>
            </form>

            <div className="space-y-6">
              {comments.length === 0 ? (
                <p className="text-muted-foreground italic">No comments yet. Be the first to share!</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">{c.name}</span>
                      <span className="text-xs text-muted-foreground">{c.date}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">{c.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "contribute" && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border shadow-sm">
            <h2 className="font-serif text-3xl font-bold mb-2">Suggest an Edit</h2>
            <p className="text-muted-foreground mb-6">Help us make this historical record more comprehensive. Factual additions only.</p>
            
            <form onSubmit={handleAddEdit} className="space-y-4 mb-10">
              <div className="grid md:grid-cols-2 gap-4">
                <Input 
                  placeholder="Your Name" 
                  value={newEdit.name}
                  onChange={(e) => setNewEdit({ ...newEdit, name: e.target.value })}
                  required
                />
                <Input 
                  placeholder="Historical Section / Era" 
                  value={newEdit.section}
                  onChange={(e) => setNewEdit({ ...newEdit, section: e.target.value })}
                  required
                />
              </div>
              <Textarea 
                placeholder="Detail your factual addition or correction..." 
                value={newEdit.content}
                onChange={(e) => setNewEdit({ ...newEdit, content: e.target.value })}
                required
                className="min-h-[150px]"
              />
              <Button type="submit" variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-200">
                <Plus className="w-4 h-4 mr-2" /> Submit Suggestion
              </Button>
            </form>

            {edits.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-4">Pending Suggestions (Locally Saved)</h3>
                <div className="space-y-4">
                  {edits.map((e) => (
                    <div key={e.id} className="p-4 rounded-xl border border-dashed bg-slate-50 dark:bg-slate-800/30">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300">{e.section}</span>
                        <span className="text-sm text-muted-foreground">by {e.name} on {e.date}</span>
                      </div>
                      <p className="text-sm mt-2">{e.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
