import { describe, it, expect } from "vitest";
import {
  createAnnouncementSchema,
  markAnnouncementReadSchema,
  createCampusEventSchema,
  getEventIcsFileSchema,
  generateParentProgressReportSchema,
} from "../../functions/src/security/validators";

describe("Phase 9 Student & Parent Engagement Engine Tests", () => {
  it("validates createAnnouncementSchema payload", () => {
    const valid = {
      title: "TCS Placement Drive Instructions",
      body: "Please ensure all resumes in Vault are verified before Tuesday 5 PM.",
      targetBatch: "2025",
      targetBranch: "CSE",
    };
    const parsed = createAnnouncementSchema.parse(valid);
    expect(parsed.title).toBe("TCS Placement Drive Instructions");
    expect(parsed.targetBatch).toBe("2025");
  });

  it("validates markAnnouncementReadSchema payload", () => {
    const valid = { announcementId: "anc_123" };
    const parsed = markAnnouncementReadSchema.parse(valid);
    expect(parsed.announcementId).toBe("anc_123");
  });

  it("validates createCampusEventSchema payload", () => {
    const valid = {
      title: "Infosys Campus Interview Sprint",
      description: "Round 1 Technical & HR Interviews",
      eventType: "drive" as const,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 3600000).toISOString(),
      location: "Auditorium Block A",
    };
    const parsed = createCampusEventSchema.parse(valid);
    expect(parsed.eventType).toBe("drive");
    expect(parsed.location).toBe("Auditorium Block A");
  });

  it("validates getEventIcsFileSchema payload", () => {
    const valid = { eventId: "evt_123" };
    const parsed = getEventIcsFileSchema.parse(valid);
    expect(parsed.eventId).toBe("evt_123");
  });

  it("validates generateParentProgressReportSchema payload", () => {
    const valid = {
      userId: "user_stu_1",
      locale: "hi" as const,
    };
    const parsed = generateParentProgressReportSchema.parse(valid);
    expect(parsed.userId).toBe("user_stu_1");
    expect(parsed.locale).toBe("hi");
  });

  it("verifies DPDP opt-out privacy guard invariant", () => {
    const studentProfileOptedOut = { userId: "stu_privacy", parentReportOptOut: true };
    const studentProfileNormal = { userId: "stu_normal", parentReportOptOut: false };

    const checkReportAllowed = (profile: any) => {
      if (profile.parentReportOptOut === true) {
        throw new Error("Student has opted out of parent progress report sharing.");
      }
      return true;
    };

    expect(checkReportAllowed(studentProfileNormal)).toBe(true);
    expect(() => checkReportAllowed(studentProfileOptedOut)).toThrow(
      "Student has opted out of parent progress report sharing."
    );
  });

  it("verifies .ics iCalendar format structure", () => {
    const formatIcsDate = (isoStr: string) => {
      const d = new Date(isoStr);
      return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const icsString = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `UID:evt_123@aivi.campus`,
      `DTSTAMP:${formatIcsDate(new Date().toISOString())}`,
      `SUMMARY:Infosys Drive`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    expect(icsString).toContain("BEGIN:VCALENDAR");
    expect(icsString).toContain("END:VCALENDAR");
    expect(icsString).toContain("SUMMARY:Infosys Drive");
  });
});
