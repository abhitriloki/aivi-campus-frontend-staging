import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  CheckCircle2,
  Users,
  Trophy,
  Calendar,
  Sparkles,
  ArrowRight,
  Plus,
  TrendingUp,
  Target,
  Building2,
  BookOpen,
  Code2,
  Mic2,
  Layers,
  ChevronRight,
} from "lucide-react";
import { mockSprints, MockSprint } from "@/services/mockCampusData";
import { toast } from "sonner";
import AnimatedNumber from "@/components/motion/AnimatedNumber";
import { useAuth } from "@/contexts/AuthContext";

export default function PlacementSprints() {
  const { tenant } = useAuth();
  const effectiveTenantId = tenant.tenantId ||
    (typeof window !== "undefined" ? localStorage.getItem("aivi_active_tenant_id") : null);
  const isCustomTenant = Boolean(
    effectiveTenantId &&
    effectiveTenantId !== "demo-sunrise" &&
    effectiveTenantId !== "demo-campus-001"
  );
  // Real provisioned colleges start with no sprints — only demo environment shows mock Sunrise sprints
  const [sprints, setSprints] = useState<MockSprint[]>(isCustomTenant ? [] : mockSprints);
  const [activeSprint, setActiveSprint] = useState<MockSprint | null>(isCustomTenant ? null : mockSprints[0]);


  const taskIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "coding":
        return <Code2 className="h-4 w-4 text-sky-600" />;
      case "interview":
      case "ai interview":
        return <Mic2 className="h-4 w-4 text-violet-600" />;
      case "quiz":
      case "aptitude":
        return <BookOpen className="h-4 w-4 text-amber-600" />;
      default:
        return <Layers className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Editorial Header Band */}
      <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-[#101820] via-[#101820] to-[#143E3B] p-6 text-white shadow-[0_20px_50px_-24px_hsl(210_33%_10%/0.5)] lg:p-7">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,hsl(176_52%_45%/0.35),transparent_70%)] blur-2xl" />
          <div className="bg-grid-light absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_70%_90%_at_0%_0%,black,transparent)]" />
        </div>
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[hsl(176_52%_62%)]">
              <Zap className="h-3.5 w-3.5" /> 7-Day &amp; 14-Day Readiness Sprints
            </p>
            <h1 className="mt-1.5 font-display text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-tight tracking-[-0.015em]">
              Drive-Aligned Preparation Sprints
            </h1>
            <p className="mt-1 max-w-2xl text-[13.5px] text-slate-400 leading-relaxed">
              Structured company-targeted training loops combining daily aptitude challenges, coding sandboxes, and AI voice mock interviews before corporate placement drives.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={() => toast.info("Sprint Builder Modal — Create custom company preparation sprint.")}
              className="group h-10 rounded-full bg-[linear-gradient(180deg,hsl(176_52%_46%),hsl(178_58%_30%))] px-5 text-[13px] font-bold text-white shadow-[0_8px_24px_-6px_hsl(177_51%_42%/0.75),inset_0_1px_0_hsl(0_0%_100%/0.35)] hover:brightness-110"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Create New Sprint
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            icon: Zap,
            label: "Active Sprints",
            value: <AnimatedNumber value={sprints.length} />,
            suffix: " Campaigns",
            hint: sprints.length ? "Live & currently enrolling" : "No active campaigns",
            delta: isCustomTenant ? (sprints.length ? `${sprints.length} active` : "None scheduled") : "2026 Batch",
            tint: "text-amber-600 bg-amber-500/10 border-amber-500/20",
          },
          {
            icon: Users,
            label: "Total Enrolled",
            value: <AnimatedNumber value={sprints.reduce((acc, s) => acc + (s.enrolledStudentsCount || 0), 0)} />,
            suffix: " Students",
            hint: sprints.length ? "Across participating branches" : "Enrollment opens with drives",
            delta: isCustomTenant ? `${sprints.reduce((acc, s) => acc + (s.enrolledStudentsCount || 0), 0)} enrolled` : "+18% vs last week",
            tint: "text-primary bg-primary/10 border-primary/20",
          },
          {
            icon: TrendingUp,
            label: "Avg Completion Rate",
            value: sprints.length ? <span><AnimatedNumber value={68} />.4%</span> : <span>0%</span>,
            hint: "Curriculum milestone progress",
            delta: sprints.length ? "7-day sprint velocity" : "Awaiting student starts",
            tint: "text-sky-600 bg-sky-500/10 border-sky-500/20",
            bar: sprints.length ? 68.4 : 0,
          },
          {
            icon: Trophy,
            label: "Avg Benchmark Score",
            value: sprints.length ? (
              <span>
                <AnimatedNumber
                  value={Math.round(sprints.reduce((acc, s) => acc + (s.averageScore || 0), 0) / sprints.length)}
                />{" "}
                <span className="text-sm text-slate-400 font-medium">/ 100</span>
              </span>
            ) : (
              <span>
                — <span className="text-sm text-slate-400 font-medium">/ 100</span>
              </span>
            ),
            hint: "Sprint evaluation average",
            delta: sprints.length ? "+14% vs un-sprinted candidates" : "No baseline yet",
            tint: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
          >
            <div className="flex items-start justify-between">
              <span className={`grid h-10 w-10 place-items-center rounded-xl border ${s.tint}`}>
                <s.icon className="h-4.5 w-4.5" />
              </span>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                <TrendingUp className="h-3 w-3" /> {s.delta}
              </span>
            </div>
            <p className="mt-4 font-display text-[28px] font-bold leading-none tracking-[-0.01em] text-[#101820] tabular-nums">
              {s.value}
              {s.suffix && <span className="text-sm font-semibold text-slate-500">{s.suffix}</span>}
            </p>
            <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">{s.label}</p>
            <p className="mt-1 text-[11.5px] font-medium text-slate-500">{s.hint}</p>
            {s.bar !== undefined && (
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-[#2D8B86]" style={{ width: `${s.bar}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty state for real colleges with no sprints yet */}
      {sprints.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 py-20 text-center">
          <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-border bg-muted">
            <Zap className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No active sprints yet</h3>
          <p className="mt-1.5 max-w-sm text-[13px] text-slate-500 leading-relaxed">
            Create a Sprint from a Placement Drive or launch a custom campaign to start targeted preparation for your students.
          </p>
          <Button
            onClick={() => toast.info("Sprint Builder Modal — Create custom company preparation sprint.")}
            className="mt-5 h-9 rounded-full bg-[linear-gradient(180deg,hsl(176_52%_46%),hsl(178_58%_30%))] px-5 text-[13px] font-bold text-white"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Create First Sprint
          </Button>
        </div>
      )}

      {/* Sprints List & Detailed Task Timeline (Only when sprints exist) */}
      {sprints.length > 0 && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Sprint Selector Cards */}
        <div className="space-y-3.5 lg:col-span-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-primary" /> Active Campaigns ({sprints.length})
            </h2>
            <Badge variant="soft" className="text-[10.5px]">Live</Badge>
          </div>

          {sprints.map((sprint) => {
            const isSelected = activeSprint?.id === sprint.id;
            return (
              <div
                key={sprint.id}
                onClick={() => setActiveSprint(sprint)}
                className={`cursor-pointer rounded-2xl p-4.5 transition-all duration-200 border ${
                  isSelected
                    ? "border-primary bg-[hsl(177_51%_31%/0.04)] shadow-md ring-2 ring-primary/30"
                    : "border-border/70 bg-card hover:border-border hover:shadow-card"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(177_51%_31%/0.1)] text-primary font-bold text-sm">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-slate-900 text-[15px]">{sprint.title}</h3>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">{sprint.targetRole} · <span className="text-primary font-bold">{sprint.targetCompany}</span></p>
                    </div>
                  </div>
                  <Badge variant="warning" className="font-bold text-[10.5px] shrink-0">
                    {sprint.durationDays} Days
                  </Badge>
                </div>

                <div className="mt-3.5 grid grid-cols-2 gap-2 pt-3 border-t border-border/60 text-xs">
                  <div>
                    <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide">Enrollment</span>
                    <p className="font-bold text-slate-800 mt-0.5">{sprint.enrolledStudentsCount} Students</p>
                  </div>
                  <div>
                    <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide">Benchmark Score</span>
                    <p className="font-bold text-primary mt-0.5">{sprint.averageScore} / 100</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Sprint Roadmap & Task Schedule */}
        <div className="lg:col-span-8">
          {activeSprint && (
            <Card className="overflow-hidden shadow-card border-border/70">
              <CardHeader className="border-b border-border/60 bg-gradient-to-r from-white to-[hsl(177_51%_31%/0.03)] py-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success" className="font-bold text-[10.5px]">● Enrolling Live</Badge>
                      <span className="text-xs font-mono text-slate-400">ID: {activeSprint.id}</span>
                    </div>
                    <CardTitle className="mt-1 font-display text-xl font-bold text-slate-900">{activeSprint.title}</CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-0.5">
                      Target Role: <strong className="text-slate-800">{activeSprint.targetRole}</strong> at <strong className="text-primary">{activeSprint.targetCompany}</strong>
                    </CardDescription>
                  </div>
                  <Badge variant="info" className="text-xs font-bold self-start sm:self-auto px-3 py-1">
                    {activeSprint.enrolledStudentsCount} Candidates Enrolled
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Sprint Curriculum Schedule
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">{activeSprint.tasks.length} Daily Modules</span>
                </div>

                <div className="space-y-3">
                  {activeSprint.tasks.map((task) => (
                    <div
                      key={task.day}
                      className="group flex items-center justify-between p-4 rounded-xl border border-border/70 bg-card transition-all hover:border-primary/30 hover:bg-slate-50/70 shadow-xs"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 font-mono shadow-xs">
                          D{task.day}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[9.5px] font-bold text-slate-600 uppercase">
                              {taskIcon(task.type)}
                              {task.type}
                            </span>
                            <h4 className="text-[13.5px] font-bold text-slate-900 truncate">{task.title}</h4>
                          </div>
                          <p className="text-[11.5px] text-slate-500 mt-0.5">Company-aligned technical assessment checkpoint</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-4">
                        <span className="text-xs font-bold text-emerald-600 block">
                          {task.completedCount} / {activeSprint.enrolledStudentsCount}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
