import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Clock, Eye, ChevronDown, ChevronUp, Plus, X, Edit2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Article {
  id: string;
  title: string;
  location: string;
  category: string;
  excerpt: string;
  content: string;
  readTime: string;
  image: string;
  date: string;
  author: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Tourist Spot": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Culture": "bg-amber-100 text-amber-800 border-amber-200",
  "Nature": "bg-teal-100 text-teal-800 border-teal-200",
  "Food": "bg-orange-100 text-orange-800 border-orange-200",
  "Adventure": "bg-blue-100 text-blue-800 border-blue-200",
  "Heritage": "bg-purple-100 text-purple-800 border-purple-200",
};

const DEFAULT_ARTICLES: Article[] = [
  {
    id: "1",
    title: "Dal Lake — The Jewel of Srinagar",
    location: "Srinagar, Kashmir",
    category: "Tourist Spot",
    excerpt: "A breathtaking 18 km² freshwater lake surrounded by majestic mountains, famous for its iconic shikaras and floating gardens.",
    content: `Dal Lake is the most iconic symbol of Kashmir and is often called the "Jewel in the Crown of Kashmir." Stretching across 18 square kilometres in the heart of Srinagar, this urban lake is surrounded by the majestic Zabarwan mountain range and the Shankaracharya hill.

The lake is home to approximately 50,000 people who live on the water in traditional wooden houseboats — some of which date back over a century. These houseboats, intricately carved and furnished, offer tourists a one-of-a-kind experience of sleeping on the water.

Shikaras — beautifully decorated wooden boats — are the primary mode of transport on the lake. You can hire one for leisurely rides or to visit the famous floating markets where vendors sell flowers, vegetables, and handicrafts directly from their boats every morning before sunrise.

The floating gardens (locally called "Rad" or "Demb") are another marvel. Kashmiris grow vegetables, lotus flowers, and even watermelons on thick mats of vegetation that float on the water. These gardens have sustained Kashmiri communities for centuries.

Best time to visit: April to October. Winters freeze parts of the lake and create magical misty mornings. The famous Nehru Park sits on an island within the lake and offers spectacular sunset views.`,
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    date: "April 2026",
    author: "Yasir Ferooz",
  },
  {
    id: "2",
    title: "Gulmarg — Where Earth Meets the Sky",
    location: "Baramulla District, Kashmir",
    category: "Adventure",
    excerpt: "A highland meadow at 2,650 metres, world-famous for its Gondola — Asia's highest cable car — and pristine ski slopes.",
    content: `Gulmarg, which means "Meadow of Flowers" in Kashmiri, sits at an elevation of 2,650 metres above sea level in the Baramulla district of Jammu & Kashmir. This highland meadow is one of the most beautiful places in all of Asia and has earned the nickname "The Switzerland of Asia."

During spring and summer (April–September), Gulmarg transforms into a carpet of wildflowers — poppies, daisies, forget-me-nots — spreading across wide green meadows framed by snow-capped peaks. Horses graze freely across the slopes and the air is so pure it feels like medicine.

The Gulmarg Gondola is the crown jewel of the destination — it is Asia's highest and longest cable car ride. It operates in two phases: the first phase goes from Gulmarg to Kongdori at 3,100 metres, and the second climbs further to Apharwat Peak at 3,980 metres. From the top, on a clear day, you can see Nanga Parbat — the world's ninth highest mountain.

In winter (December–March), Gulmarg becomes a premier ski destination. It receives some of the heaviest snowfall in the region — sometimes exceeding 12 feet — and offers slopes for beginners as well as expert skiers. Heli-skiing is also available for the adventurous.

Gulmarg Golf Course, at 2,650 metres, is one of the highest and most scenic golf courses in the world, open during the warmer months.`,
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1586880244406-556ebe35f282?auto=format&fit=crop&w=800&q=80",
    date: "March 2026",
    author: "Yasir Ferooz",
  },
  {
    id: "3",
    title: "Pahalgam — The Valley of Shepherds",
    location: "Anantnag District, Kashmir",
    category: "Nature",
    excerpt: "Where the Lidder River rushes through pine forests and alpine meadows — the gateway to the Amarnath pilgrimage and Kashmir's finest trek routes.",
    content: `Pahalgam, meaning "Valley of Shepherds," lies at an altitude of 2,130 metres in the Anantnag district of Kashmir. It sits at the confluence of the Sheshnag Lake stream and the Lidder River, creating one of the most picturesque settings in the entire Himalayan region.

This small town is the starting point for the annual Amarnath Yatra pilgrimage — one of the most important Hindu pilgrimages in India, where millions of devotees trek to a sacred ice cave believed to be the abode of Lord Shiva. The cave houses a naturally-formed ice lingam that waxes and wanes with the lunar cycle.

But Pahalgam is far more than a pilgrimage point. It is a trekker's paradise. The Betaab Valley — named after a 1983 Bollywood film shot here — is a lush green valley with crystal-clear streams that has become one of Kashmir's most photographed spots. Baisaran meadow, sometimes called "Mini Switzerland," sits just 5 km from Pahalgam and can only be reached on horseback or foot — no vehicles — which has preserved its pristine beauty.

The Aru Valley, 11 km from Pahalgam, is even more dramatic — vast alpine meadows flanked by glaciers and dense forests of pine, fir, and birch. It is the base camp for treks to Kolahoi Glacier and Tarsar-Marsar lakes.

The Lidder River that flows through Pahalgam is one of Kashmir's finest fishing rivers, especially for trout.`,
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80",
    date: "February 2026",
    author: "Yasir Ferooz",
  },
  {
    id: "4",
    title: "Wazwan — The Royal Feast of Kashmir",
    location: "Across Kashmir Valley",
    category: "Food",
    excerpt: "A multi-course culinary ceremony featuring 36 dishes, slow-cooked overnight and served on copper plates — the soul of Kashmiri identity.",
    content: `Wazwan is not just a meal — it is a cultural institution, a statement of Kashmiri identity, and one of the most elaborate culinary traditions in all of South Asia. The word "Wazwan" comes from "Waz" (cook) and "Wan" (shop), and traditionally refers to a multi-course feast prepared by specialist cooks called "Waza" who pass their knowledge from generation to generation.

A full Wazwan can feature up to 36 dishes, though at minimum seven are mandatory. It is prepared almost exclusively for weddings and special celebrations. The cooking begins the night before the feast and continues through the night — a community affair with the wazas working by firelight.

The centerpiece is always Rogan Josh — tender lamb slow-cooked in a rich sauce of dried Kashmiri chilies, fennel, ginger, and aromatic spices. The deep red color comes not from heat but from the natural pigment of Kashmiri Mawal flowers and dried chilies. It is rich, warming, and unlike any other lamb dish in the world.

Yakhni is lamb cooked in yogurt with fennel seeds and cardamom — pale, fragrant, and delicate. Tabak Maaz is fried ribs of lamb, crispy on the outside and meltingly tender within. Gushtaba — minced lamb pounded by hand into silky balls and simmered in yogurt — is the dish that traditionally ends the Wazwan, signaling that the feast is complete.

Rista is similar to Gushtaba but served in a vivid red sauce. Aab Gosht — lamb in milk — is the most delicate of all. The meal is served in a large copper basin called "Traem" shared between four people.`,
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
    date: "January 2026",
    author: "Yasir Ferooz",
  },
  {
    id: "5",
    title: "Srinagar's Old City — Walking Through History",
    location: "Old City, Srinagar",
    category: "Heritage",
    excerpt: "Labyrinthine lanes of carved wooden mosques, ancient shrines, bustling bazaars, and centuries-old craft workshops — the living heartbeat of Kashmir.",
    content: `The Old City of Srinagar is one of the most historically layered urban environments in Asia. Its narrow lanes, called "kuchas," wind through an architectural landscape shaped by over a thousand years of civilization — from ancient Hindu temples to grand Mughal gardens, medieval mosques to Sufi shrines.

The Jamia Masjid — the Grand Mosque of Srinagar — stands at the heart of the old city. Built in 1394 CE by Sultan Sikandar and later expanded by Zain-ul-Abidin, it is one of the finest examples of Indo-Saracenic architecture in the subcontinent. Its 378 wooden pillars, each carved from a single deodar cedar tree, hold up a vast wooden ceiling. The mosque can accommodate 33,333 worshippers.

The Shah-i-Hamdan mosque (Khanqah-i-Moula) is Kashmir's oldest surviving mosque, built in 1395 CE. Its exquisite papier-mâché interior — every inch decorated with intricate floral patterns painted by hand — is considered the finest example of this ancient Kashmiri art form.

Rozabal shrine in Khanyar locality is a small but deeply significant building that local tradition associates with a revered saint — it has attracted scholarly and spiritual attention for centuries.

The Lal Chowk area is the commercial and historical nerve center — where independence was declared, where protests have echoed, where Kashmir's pulse can be heard most clearly. The famous clock tower has marked time through decades of history.

The craft bazaars are an experience in themselves: shawl shops with pashmina finer than cloud, carpet dealers whose wares take months to weave, papier-mâché painters working on centuries-old designs, wood carvers turning walnut into poetry.`,
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=800&q=80",
    date: "December 2025",
    author: "Yasir Ferooz",
  },
  {
    id: "6",
    title: "Sonamarg — The Meadow of Gold",
    location: "Ganderbal District, Kashmir",
    category: "Nature",
    excerpt: "A golden meadow gateway to Himalayan glaciers, high-altitude lakes, and the legendary Zoji La pass — Kashmir's most dramatic high-altitude destination.",
    content: `Sonamarg, meaning "Meadow of Gold," earns its name in late September when the entire valley turns a deep burnished gold as the alpine grasses change colour before winter. Situated at 2,800 metres in the Ganderbal district, it is one of Kashmir's most spectacularly positioned towns, perched at the threshold between the Kashmir Valley and the high Himalayas.

The town sits along the Sindh River — a fast, glacial stream of extraordinary clarity. The river is renowned for trout fishing, and anglers come from across the world to cast in its rushing waters.

The main attraction from Sonamarg is the Thajiwas Glacier — a massive, ancient glacier that sits just 3 km from the town center. You can walk there in about an hour or hire a pony. The glacier is at its most dramatic in May and June when it is still covered in deep winter snow and the meltwater streams rush down in silver threads across the blue ice.

Sonamarg is also the base for some of Kashmir's most spectacular high-altitude treks. The Vishansar and Krishansar lakes — twin alpine lakes at over 3,800 metres — are roughly 12 km away and are connected by a high-altitude meadow carpeted with wildflowers. Gangabal Lake, beneath the sacred Harmukh peak, is another legendary destination.

The Zoji La pass (3,528 metres) just beyond Sonamarg connects Kashmir to Ladakh. Before the Zoji La tunnel opened, this was the only road connection — and it remains one of the most dramatic mountain road sections in the world.`,
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1623073284788-0e7c0acab059?auto=format&fit=crop&w=800&q=80",
    date: "November 2025",
    author: "Yasir Ferooz",
  },
];

const STORAGE_KEY = "kashmir_blog_articles";

function useArticles() {
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as Article[];
    } catch {}
    return DEFAULT_ARTICLES;
  });

  const save = (updated: Article[]) => {
    setArticles(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addArticle = (article: Article) => save([article, ...articles]);
  const updateArticle = (article: Article) =>
    save(articles.map((a) => (a.id === article.id ? article : a)));
  const deleteArticle = (id: string) => save(articles.filter((a) => a.id !== id));

  return { articles, addArticle, updateArticle, deleteArticle };
}

const CATEGORIES = ["Tourist Spot", "Culture", "Nature", "Food", "Adventure", "Heritage"];

function ArticleCard({
  article,
  onEdit,
  onDelete,
  isAdmin,
}: {
  article: Article;
  onEdit: (a: Article) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      data-testid={`article-card-${article.id}`}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <Badge
            className={`text-xs border ${CATEGORY_COLORS[article.category] ?? "bg-gray-100 text-gray-800 border-gray-200"}`}
          >
            {article.category}
          </Badge>
          <div className="flex items-center gap-1 text-white/80 text-xs">
            <Clock className="h-3 w-3" />
            {article.readTime} read
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-2 mb-1">
          <MapPin className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
          <span className="text-xs text-muted-foreground">{article.location}</span>
        </div>
        <h3 className="font-serif text-xl font-bold text-foreground mb-2 leading-snug">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{article.excerpt}</p>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="prose prose-sm prose-emerald max-w-none text-foreground/90 mb-4">
                {article.content.split("\n\n").map((para, i) => (
                  <p key={i} className="mb-3 text-sm leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-primary hover:text-primary/80 px-0"
              onClick={() => setExpanded((v) => !v)}
              data-testid={`toggle-article-${article.id}`}
            >
              <Eye className="h-4 w-4" />
              {expanded ? "Collapse" : "Read Article"}
              {expanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {isAdmin && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-blue-600 hover:text-blue-700"
                  onClick={() => onEdit(article)}
                  data-testid={`edit-article-${article.id}`}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-red-500 hover:text-red-600"
                  onClick={() => onDelete(article.id)}
                  data-testid={`delete-article-${article.id}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </>
            )}
            <span>
              <Calendar className="h-3 w-3 inline mr-1" />
              {article.date}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ArticleForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Article>;
  onSave: (a: Article) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<Article>>(
    initial ?? {
      title: "",
      location: "",
      category: "Tourist Spot",
      excerpt: "",
      content: "",
      readTime: "5 min",
      image: "",
      date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      author: "Yasir Ferooz",
    }
  );

  const field = (key: keyof Article) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = () => {
    if (!form.title || !form.content || !form.excerpt) return;
    onSave({
      id: initial?.id ?? Date.now().toString(),
      title: form.title ?? "",
      location: form.location ?? "",
      category: form.category ?? "Tourist Spot",
      excerpt: form.excerpt ?? "",
      content: form.content ?? "",
      readTime: form.readTime ?? "5 min",
      image: form.image ?? "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
      date: form.date ?? "",
      author: form.author ?? "Yasir Ferooz",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-md"
    >
      <h3 className="font-serif text-xl font-bold text-foreground">
        {initial?.id ? "Edit Article" : "Write New Article"}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Title *</label>
          <Input
            value={form.title ?? ""}
            onChange={field("title")}
            placeholder="Article title"
            data-testid="input-article-title"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Location</label>
          <Input
            value={form.location ?? ""}
            onChange={field("location")}
            placeholder="e.g. Srinagar, Kashmir"
            data-testid="input-article-location"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
          <select
            value={form.category ?? "Tourist Spot"}
            onChange={field("category")}
            className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            data-testid="select-article-category"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Read Time</label>
          <Input
            value={form.readTime ?? ""}
            onChange={field("readTime")}
            placeholder="e.g. 5 min"
            data-testid="input-article-readtime"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Cover Image URL
          </label>
          <Input
            value={form.image ?? ""}
            onChange={field("image")}
            placeholder="https://images.unsplash.com/..."
            data-testid="input-article-image"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-muted-foreground mb-1">Excerpt *</label>
          <Textarea
            value={form.excerpt ?? ""}
            onChange={field("excerpt")}
            rows={2}
            placeholder="A short description of the article..."
            data-testid="input-article-excerpt"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Full Article Content * (separate paragraphs with a blank line)
          </label>
          <Textarea
            value={form.content ?? ""}
            onChange={field("content")}
            rows={10}
            placeholder="Write the full article here..."
            className="font-mono text-sm"
            data-testid="input-article-content"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSave} className="gap-2" data-testid="button-save-article">
          <Save className="h-4 w-4" />
          Save Article
        </Button>
        <Button variant="outline" onClick={onCancel} data-testid="button-cancel-article">
          Cancel
        </Button>
      </div>
    </motion.div>
  );
}

export default function Explore() {
  const { articles, addArticle, updateArticle, deleteArticle } = useArticles();
  const [activeCategory, setActiveCategory] = useState("All");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPw, setAdminPw] = useState("");
  const [adminError, setAdminError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editArticle, setEditArticle] = useState<Article | null>(null);

  const categories = ["All", ...CATEGORIES];
  const filtered =
    activeCategory === "All" ? articles : articles.filter((a) => a.category === activeCategory);

  const handleAdminLogin = () => {
    if (adminPw === "yasir123") {
      setIsAdmin(true);
      setAdminError(false);
    } else {
      setAdminError(true);
    }
  };

  const handleSave = (article: Article) => {
    if (editArticle) {
      updateArticle(article);
      setEditArticle(null);
    } else {
      addArticle(article);
      setShowForm(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-950 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="uppercase tracking-[0.3em] text-emerald-300 text-sm mb-4">
              Travel &amp; Stories
            </p>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Explore Kashmir
            </h1>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
              Stories, travel guides, and local knowledge about Kashmir's most beautiful places —
              written from the heart by a Kashmiri.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-testid={`filter-${cat}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-border hover:border-primary/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Admin */}
          <div className="flex items-center gap-2 shrink-0">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 border">
                  Admin Mode
                </Badge>
                <Button
                  size="sm"
                  onClick={() => setShowForm(true)}
                  className="gap-1.5"
                  data-testid="button-new-article"
                >
                  <Plus className="h-4 w-4" />
                  New Article
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsAdmin(false)}
                  data-testid="button-logout-admin"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  type="password"
                  placeholder="Admin password"
                  value={adminPw}
                  onChange={(e) => {
                    setAdminPw(e.target.value);
                    setAdminError(false);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                  className={`w-36 h-8 text-sm ${adminError ? "border-red-400" : ""}`}
                  data-testid="input-admin-password"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAdminLogin}
                  data-testid="button-admin-login"
                >
                  Login
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* New / Edit form */}
        <AnimatePresence>
          {(showForm || editArticle) && (
            <div className="mb-8">
              <ArticleForm
                initial={editArticle ?? undefined}
                onSave={handleSave}
                onCancel={() => {
                  setShowForm(false);
                  setEditArticle(null);
                }}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-medium">No articles in this category yet.</p>
            {isAdmin && (
              <p className="text-sm mt-2">
                Click "New Article" above to write the first one.
              </p>
            )}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filtered.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  isAdmin={isAdmin}
                  onEdit={(a) => {
                    setEditArticle(a);
                    setShowForm(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  onDelete={deleteArticle}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
