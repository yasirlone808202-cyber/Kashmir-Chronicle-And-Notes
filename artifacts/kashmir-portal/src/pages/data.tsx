import { motion } from "framer-motion";
import { Users, Car, Heart, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const RELIGION_DATA = [
  { name: "Islam", value: 68.3, color: "#10b981" },
  { name: "Hinduism", value: 28.4, color: "#f59e0b" },
  { name: "Sikhism", value: 1.9, color: "#3b82f6" },
  { name: "Buddhism", value: 0.9, color: "#8b5cf6" },
  { name: "Christianity", value: 0.3, color: "#ef4444" },
];

const DISTRICT_POPULATION = [
  { name: "Srinagar", pop: 1236829 },
  { name: "Jammu", pop: 1529958 },
  { name: "Anantnag", pop: 898074 },
  { name: "Baramulla", pop: 1078692 },
  { name: "Kupwara", pop: 870354 },
];

export default function Data() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <div className="bg-blue-900 text-blue-50 py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-800/40 via-blue-900 to-black z-0" />
        <div className="container mx-auto relative z-10 max-w-5xl">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-center">Kashmir in Numbers</h1>
          <p className="text-xl md:text-2xl text-blue-200 font-light text-center max-w-3xl mx-auto">
            Visualizing the demographics, diversity, and scale of Jammu & Kashmir
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-8 relative z-20">
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Users, label: "Total Population", value: "~12.5M", sub: "Census Data" },
            { icon: Shield, label: "Districts", value: "20", sub: "Administrative Units" },
            { icon: Car, label: "Registered Vehicles", value: "2.1M+", sub: "Growing 8% yearly" },
            { icon: Heart, label: "Literacy Rate", value: "67.16%", sub: "Improving steadily" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm text-center"
            >
              <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Religious Demographics</CardTitle>
              <CardDescription>Percentage distribution across J&K</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={RELIGION_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {RELIGION_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Major Districts Population</CardTitle>
              <CardDescription>Top populous districts in J&K</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DISTRICT_POPULATION} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip formatter={(value) => value.toLocaleString()} />
                    <Bar dataKey="pop" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md border-t-4 border-t-amber-500">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Emergence of Religions in Kashmir</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              The religious landscape of Kashmir is a rich mosaic formed over millennia. Historically, Kashmir was a profound center of learning for both Hinduism (particularly Kashmiri Shaivism) and Buddhism.
            </p>
            <ul>
              <li><strong>Buddhism & Hinduism:</strong> Before the 14th century, Buddhism and Hinduism flourished. Emperor Ashoka introduced Buddhism, and the valley later became the birthplace of the Mahayana school. Similarly, Kashmiri Shaivism developed as a highly sophisticated philosophical system.</li>
              <li><strong>Islam:</strong> Islam was introduced peacefully by Sufi saints and mystics traveling from Central Asia and Persia in the 13th and 14th centuries. Bulbul Shah and later Shah-e-Hamadan (Mir Sayyid Ali Hamadani) played crucial roles. The mass conversion of the populace occurred organically over centuries, influenced by the egalitarian message of Sufism.</li>
              <li><strong>Sikhism:</strong> The Sikh presence grew notably during the period of Sikh rule (1819-1846) under Maharaja Ranjit Singh, establishing vibrant communities that persist to this day.</li>
            </ul>
            <p>
              This historical interplay has birthed 'Kashmiriyat' — a unique syncretic culture defined by religious harmony, shared customs, and mutual respect among its diverse inhabitants.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
