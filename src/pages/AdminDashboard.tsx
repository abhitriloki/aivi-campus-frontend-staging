import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { httpsCallable } from "firebase/functions";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db, functions } from "@/integrations/firebase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BarChart3,
  TrendingUp,
  FileText,
  Loader2,
  Crown,
  CreditCard,
  DollarSign,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  ArrowUpRight,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { doc, getDoc } from "firebase/firestore";

interface UserProfile {
  user_id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  role: string;
  plan_type: string;
  monthly_used: number;
  total_analyses: number;
}

interface UsageStat {
  analysis_type: string;
  count: number;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [usageStats, setUsageStats] = useState<UsageStat[]>([]);
  const [totalAnalyses, setTotalAnalyses] = useState(0);
  const [planDistribution, setPlanDistribution] = useState<Record<string, number>>({});
  const [betaStats, setBetaStats] = useState<{ first1000Used: number } | null>(null);
  const [totalCost, setTotalCost] = useState(0);
  const [costPerModule, setCostPerModule] = useState<Record<string, number>>({});
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/dashboard");
      return;
    }
    fetchAdminData();
  }, [isAdmin]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [profilesSnap, rolesSnap, usageLogsSnap, analysesSnap, plansSnap, betaSnap, messagesSnap] = await Promise.all([
        getDocs(collection(db, "profiles")),
        getDocs(collection(db, "user_roles")),
        getDocs(collection(db, "ai_usage_logs")),
        getDocs(collection(db, "analysis_results")),
        getDocs(collection(db, "user_plans")),
        getDoc(doc(db, "system_stats", "beta")),
        getDocs(query(collection(db, "contact_messages"), orderBy("createdAt", "desc"), limit(50))),
      ]);

      const profiles = profilesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const roles = rolesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const usageLogs = usageLogsSnap.docs.map(d => d.data());
      const analyses = analysesSnap.docs.map(d => d.data());
      const plans = plansSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      const planDist: Record<string, number> = { free: 0, starter: 0, pro: 0 };

      const userList: UserProfile[] = (profiles as any[]).map((p: any) => {
        const userRole = (roles as any[]).find(r => r.userId === p.userId);
        const userPlan = (plans as any[]).find(pl => pl.id === p.userId);
        const planType = userPlan?.plan_type || "free";
        planDist[planType] = (planDist[planType] || 0) + 1;
        const userTotalAnalyses = (analyses as any[]).filter(a => a.userId === p.userId).length;
        return {
          user_id: p.userId,
          full_name: p.fullName || p.full_name || null,
          email: p.email || p.contactEmail || null,
          created_at: p.createdAt?.toDate?.()?.toISOString?.() || "",
          role: userRole?.role || "user",
          plan_type: planType,
          monthly_used: userPlan?.monthly_analysis_used || 0,
          total_analyses: userTotalAnalyses,
        };
      });

      setUsers(userList);
      setPlanDistribution(planDist);
      setBetaStats(betaSnap.exists() ? betaSnap.data() as any : { first1000Used: 0 });

      let calculatedTotalCost = 0;
      const typeMap: Record<string, number> = {};
      const moduleCost: Record<string, number> = {};

      (usageLogs as any[]).forEach(l => {
        const type = l.analysisType || l.analysis_type;
        if (type) {
          typeMap[type] = (typeMap[type] || 0) + 1;
          const cost = l.estimatedCost || 0;
          calculatedTotalCost += cost;
          moduleCost[type] = (moduleCost[type] || 0) + cost;
        }
      });
      setUsageStats(Object.entries(typeMap).map(([analysis_type, count]) => ({ analysis_type, count })));
      setTotalCost(calculatedTotalCost);
      setCostPerModule(moduleCost);
      setTotalAnalyses(analyses.length);

      const msgs = messagesSnap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString?.() || "Unknown",
        } as ContactMessage;
      });
      setContactMessages(msgs);
    } catch (e: any) {
      console.error("Admin data fetch failed:", e);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (targetUserId: string, updates: { role?: string; planType?: string; resetQuota?: boolean }) => {
    try {
      const fn = httpsCallable(functions, "adminUpdateUser");
      await fn({ targetUserId, ...updates });
      toast.success("User updated");
      fetchAdminData();
    } catch (e: any) {
      toast.error(e.message || "Failed to update user");
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!userSearchQuery.trim()) return true;
    const query = userSearchQuery.toLowerCase().trim();
    return (
      (u.email && u.email.toLowerCase().includes(query)) ||
      (u.full_name && u.full_name.toLowerCase().includes(query)) ||
      (u.user_id && u.user_id.toLowerCase().includes(query))
    );
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-[1.8rem] border border-[#E7ECEF] bg-white/90">
        <Loader2 className="h-8 w-8 animate-spin text-[#24B7A9]" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
      tone: "from-[#EFFBFA] to-[#F6FFFD]",
      iconColor: "text-[#19A99B]",
    },
    {
      label: "Total Analyses",
      value: totalAnalyses,
      icon: BarChart3,
      tone: "from-[#EFF6FF] to-[#F8FBFF]",
      iconColor: "text-[#3B82F6]",
    },
    {
      label: "Beta Trial Usage",
      value: `${betaStats?.first1000Used || 0} / 1000`,
      icon: Sparkles,
      tone: "from-[#FFF7E7] to-[#FFFDF6]",
      iconColor: "text-[#D59C45]",
    },
    {
      label: "Est. AI Compute Cost",
      value: `$${totalCost.toFixed(4)}`,
      icon: DollarSign,
      tone: "from-[#FDF4FF] to-[#FFF8FF]",
      iconColor: "text-[#A855F7]",
    },
  ];

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#FF6D4A]">
            <ShieldCheck className="h-4 w-4" /> Admin Console
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#112031] md:text-3xl">
            Platform Operations & Intelligence
          </h1>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((c, i) => (
          <motion.div
            key={c.label}
            className={`relative overflow-hidden rounded-[1.8rem] border border-[#E7ECEF] bg-gradient-to-br ${c.tone} p-5 shadow-[0_12px_32px_-20px_rgba(17,32,49,0.1)]`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7D8891]">
                {c.label}
              </span>
              <c.icon className={`h-5 w-5 ${c.iconColor}`} />
            </div>
            <p className="mt-3 text-2xl font-bold text-[#112031] md:text-3xl">{c.value}</p>
          </motion.div>
        ))}
      </div>

      {/* PLAN DISTRIBUTION CARD */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)] lg:col-span-1"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#112031]">Plan Breakdown</h2>
            <Crown className="h-5 w-5 text-[#FF6D4A]" />
          </div>
          <div className="space-y-3">
            {Object.entries(planDistribution).map(([plan, count]) => (
              <div key={plan} className="flex items-center justify-between rounded-xl bg-[#FCFCFA] p-3 border border-[#E7ECEF]">
                <span className="text-sm font-semibold capitalize text-[#112031]">{plan}</span>
                <span className="rounded-full bg-[#11313B] px-3 py-1 text-xs font-bold text-white">{count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* USAGE STATS BREAKDOWN */}
        <motion.div
          className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)] lg:col-span-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#112031]">Module Activity & Costs</h2>
            <BarChart3 className="h-5 w-5 text-[#24B7A9]" />
          </div>
          <div className="space-y-4">
            {usageStats.map((stat) => {
              const maxCount = Math.max(...usageStats.map((s) => s.count));
              const pct = maxCount > 0 ? (stat.count / maxCount) * 100 : 0;
              return (
                <div key={stat.analysis_type} className="rounded-[1.3rem] border border-[#E7ECEF] bg-[#FCFCFA] p-4">
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold capitalize text-[#112031]">
                        {stat.analysis_type.replaceAll("_", " ")}
                      </p>
                      <p className="text-xs leading-6 text-[#7D8891]">
                        {stat.count} requests logged
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#112031]">
                        ${(costPerModule[stat.analysis_type] || 0).toFixed(4)}
                      </p>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#98A4AC]">
                        Cost
                      </p>
                    </div>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#EAF0F2]">
                    <motion.div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#24B7A9_0%,#8BDDD4_100%)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.24 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ALL USERS TABLE WITH SEARCH */}
      <motion.div
        className="overflow-hidden rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
      >
        <div className="border-b border-[#E7ECEF] px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#EFFBFA_0%,#FFF4EF_100%)] text-[#FF6D4A]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A4AC]">
                User control
              </p>
              <h2 className="mt-1 text-xl font-semibold text-[#112031]">
                All users {userSearchQuery ? `(${filteredUsers.length} of ${users.length})` : `(${users.length})`}
              </h2>
            </div>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7D8891]" />
            <input
              type="text"
              placeholder="Search by email, name, or UID..."
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#E3E8EC] bg-[#FCFCFA] pl-10 pr-4 py-2.5 text-xs text-[#112031] placeholder:text-[#98A4AC] outline-none transition-all focus:border-[#169C8F] focus:bg-white focus:ring-2 focus:ring-[#169C8F]/10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="bg-[#FCFCFA]">
                <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A4AC]">User & Email</th>
                <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A4AC]">Role</th>
                <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A4AC]">Plan</th>
                <th className="px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A4AC]">Monthly Used</th>
                <th className="px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A4AC]">Total Runs</th>
                <th className="px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A4AC]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#7D8891]">
                    No users matching "{userSearchQuery}"
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.user_id} className="border-t border-[#EEF2F3] align-top hover:bg-[#FAFBFB]/60 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#112031]">{u.full_name || "Unnamed User"}</p>
                      {u.email ? (
                        <p className="mt-0.5 text-xs font-medium text-[#169C8F] select-all">{u.email}</p>
                      ) : (
                        <p className="mt-0.5 text-xs text-[#98A4AC] italic">No email linked</p>
                      )}
                      <p className="mt-1 font-mono text-[11px] text-[#7D8891]">{u.user_id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                          u.role === "admin"
                            ? "bg-[#FFF4E7] text-[#B87B1E]"
                            : "bg-[#EFFBFA] text-[#169C8F]"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                          u.plan_type === "pro"
                            ? "bg-[#FFF2EF] text-[#FF6D4A]"
                            : u.plan_type === "starter"
                              ? "bg-[#EFFBFA] text-[#169C8F]"
                              : "bg-[#F1F4F6] text-[#73818C]"
                        }`}
                      >
                        {u.plan_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-[#112031]">{u.monthly_used}</td>
                    <td className="px-6 py-4 text-center font-medium text-[#112031]">{u.total_analyses}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                          onClick={() => updateUser(u.user_id, { role: u.role === "admin" ? "user" : "admin" })}
                          className="rounded-xl border border-[#E3E8EC] bg-white px-3 py-2 text-xs font-semibold text-[#55626D] transition-colors hover:bg-[#FAFBFC]"
                        >
                          {u.role === "admin" ? "Demote" : "Make Admin"}
                        </button>
                        <select
                          value={u.plan_type}
                          onChange={(e) => updateUser(u.user_id, { planType: e.target.value })}
                          className="rounded-xl border border-[#E3E8EC] bg-white px-3 py-2 text-xs font-semibold text-[#112031] outline-none"
                        >
                          <option value="free">Free</option>
                          <option value="starter">Starter</option>
                          <option value="pro">Pro</option>
                        </select>
                        <button
                          onClick={() => updateUser(u.user_id, { resetQuota: true })}
                          className="rounded-xl bg-[#11313B] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#173B46]"
                        >
                          Reset Quota
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* CONTACT MESSAGES INBOX */}
      <motion.div
        className="overflow-hidden rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26 }}
      >
        <div className="border-b border-[#E7ECEF] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#EFFBFA_0%,#FFF4EF_100%)] text-[#FF6D4A]">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A4AC]">
                Inbox
              </p>
              <h2 className="mt-1 text-xl font-semibold text-[#112031]">Recent contact messages</h2>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {contactMessages.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-[#7D8891]">
              No contact messages found.
            </div>
          ) : (
            <table className="w-full min-w-[980px] text-sm">
              <thead>
                <tr className="bg-[#FCFCFA]">
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A4AC]">Sender</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A4AC]">Subject</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A4AC]">Message</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A4AC]">Date</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A4AC]">Status</th>
                </tr>
              </thead>
              <tbody>
                {contactMessages.map((m) => (
                  <tr key={m.id} className="border-t border-[#EEF2F3] align-top">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-semibold text-[#112031]">{m.name}</p>
                      <a href={`mailto:${m.email}`} className="mt-1 inline-block text-xs text-[#169C8F] hover:underline">
                        {m.email}
                      </a>
                    </td>
                    <td className="max-w-[240px] px-6 py-4 font-medium text-[#112031]" title={m.subject}>
                      <div className="truncate">{m.subject}</div>
                    </td>
                    <td className="max-w-md px-6 py-4 text-[#66727C]" title={m.message}>
                      <div className="truncate">{m.message}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs text-[#7D8891]">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                          m.status === "new"
                            ? "bg-[#FFF4E7] text-[#B87B1E]"
                            : "bg-[#F1F4F6] text-[#73818C]"
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      {/* PLAN RULES */}
      <motion.div
        className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#EFFBFA_0%,#FFF4EF_100%)] text-[#FF6D4A]">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A4AC]">
              Plan rules
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#112031]">Current commercial configuration</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              name: "Free (Discovery)",
              body: "Lifetime limits per module",
              note: "Resume: 2 • Job Fit: 2 • Others: 1 each",
            },
            {
              name: "Starter — ₹399/mo",
              body: "30 analyses per month",
              note: "All modules, rewrite, version tracking",
            },
            {
              name: "Pro — ₹599/mo",
              body: "Unlimited analyses",
              note: "Priority AI, exports, premium support",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="rounded-[1.45rem] border border-[#E7ECEF] bg-[linear-gradient(180deg,#FCFCFA_0%,#FFFFFF_100%)] p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#112031]">{item.name}</p>
                  <p className="mt-2 text-sm text-[#66727C]">{item.body}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#FF6D4A]" />
              </div>
              <p className="mt-4 text-xs leading-6 text-[#7D8891]">{item.note}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
