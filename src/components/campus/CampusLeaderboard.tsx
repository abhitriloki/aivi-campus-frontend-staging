import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, Trophy, Sparkles, Shield, User, Star } from "lucide-react";

export interface LeaderboardEntry {
  rank: number;
  fullName: string;
  branch: string;
  batch: string;
  points: number;
  aesScore: number;
  practiceCount: number;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, fullName: "Rahul Sharma", branch: "CSE", batch: "2025", points: 850, aesScore: 92, practiceCount: 24 },
  { rank: 2, fullName: "Priya Patel", branch: "ECE", batch: "2025", points: 790, aesScore: 88, practiceCount: 21 },
  { rank: 3, fullName: "Aniket Verma", branch: "CSE", batch: "2025", points: 740, aesScore: 85, practiceCount: 19 },
  { rank: 4, fullName: "Sneha Reddy", branch: "ME", batch: "2025", points: 680, aesScore: 82, practiceCount: 16 },
  { rank: 5, fullName: "Vikram Singh", branch: "EEE", batch: "2025", points: 620, aesScore: 79, practiceCount: 14 },
];

export default function CampusLeaderboard() {
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [anonymize, setAnonymize] = useState(false);

  const getDisplayName = (fullName: string) => {
    if (!anonymize) return fullName;
    const parts = fullName.split(" ");
    return parts.map((p) => p[0] + ".").join(" ");
  };

  const filtered = MOCK_LEADERBOARD.filter(
    (e) => branchFilter === "ALL" || e.branch === branchFilter
  );

  return (
    <Card className="border-border/50 bg-card p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-1">Campus Gamification</Badge>
          <h3 className="text-xl font-bold tracking-tight">Weekly Student Readiness Leaderboard</h3>
          <p className="text-xs text-muted-foreground">Points awarded for AI Resume Analyses (+10), Mock Interviews (+20) & Sprint Tasks (+50).</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setAnonymize(!anonymize)}>
            <Shield className="h-3.5 w-3.5 mr-1" />
            {anonymize ? "Initials Mode (ON)" : "Full Names Mode"}
          </Button>

          <select
            className="p-2 bg-card border border-border rounded-xl text-xs font-bold"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
          >
            <option value="ALL">All Branches</option>
            <option value="CSE">CSE Branch</option>
            <option value="ECE">ECE Branch</option>
            <option value="ME">Mechanical</option>
            <option value="EEE">Electrical</option>
          </select>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.slice(0, 3).map((item, idx) => (
          <Card key={item.rank} className={`p-4 text-center border-border/50 ${idx === 0 ? "bg-primary/5 border-primary/30" : "bg-card"}`}>
            <div className="flex justify-center mb-2">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center font-extrabold text-lg ${
                idx === 0 ? "bg-yellow-500/20 text-yellow-500" : idx === 1 ? "bg-gray-400/20 text-gray-300" : "bg-amber-600/20 text-amber-600"
              }`}>
                #{item.rank}
              </div>
            </div>

            <h4 className="font-extrabold text-base">{getDisplayName(item.fullName)}</h4>
            <p className="text-xs text-muted-foreground">{item.branch} • Batch {item.batch}</p>

            <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-bold">
              <span className="text-primary">{item.points} Points</span>
              <Badge variant="outline">AES: {item.aesScore}</Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Practice Sessions</TableHead>
              <TableHead>AES Index</TableHead>
              <TableHead className="text-right">Readiness Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.rank}>
                <TableCell className="font-extrabold text-xs">#{item.rank}</TableCell>
                <TableCell className="font-bold text-xs">{getDisplayName(item.fullName)}</TableCell>
                <TableCell><Badge variant="outline">{item.branch}</Badge></TableCell>
                <TableCell className="text-xs">{item.practiceCount} Sessions</TableCell>
                <TableCell className="font-bold text-xs text-green-500">{item.aesScore} / 100</TableCell>
                <TableCell className="text-right font-extrabold text-primary">{item.points} PTS</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
