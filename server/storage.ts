import { db } from "./db";
import {
  offenses,
  logs,
  type Offense,
  type InsertOffense,
  type InsertLog,
  type Log,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getOffenses(): Promise<Offense[]>;
  createOffense(offense: InsertOffense): Promise<Offense>;
  createLog(log: InsertLog): Promise<Log>;
  seedOffenses(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getOffenses(): Promise<Offense[]> {
    return await db.select().from(offenses);
  }

  async createOffense(offense: InsertOffense): Promise<Offense> {
    const [newOffense] = await db.insert(offenses).values(offense).returning();
    return newOffense;
  }

  async createLog(log: InsertLog): Promise<Log> {
    const [newLog] = await db.insert(logs).values(log).returning();
    return newLog;
  }

  async seedOffenses(): Promise<void> {
    const count = await db.select().from(offenses);
    if (count.length > 0) return;

    const offensesData = [
      { code: "0.1", description: "No VC picture in patrol log", punishment: "Logged warning", category: "Category 0 - Logged Warnings" },
      { code: "0.2", description: "Reacting but not showing up to an event", punishment: "Logged warning", category: "Category 0 - Logged Warnings" },
      { code: "0.3", description: "Patrolling without an F.T.O", punishment: "Logged warning", category: "Category 0 - Logged Warnings" },
      { code: "0.4", description: "Not ranking someone after acceptance", punishment: "Logged warning", category: "Category 0 - Logged Warnings" },
      { code: "0.5", description: "Improper Use of Force", punishment: "One Strike", category: "Category 0 - Logged Warnings" },
      { code: "0.6", description: "Acting immature/unprofessional in game", punishment: "One Strike", category: "Category 0 - Logged Warnings" },
      { code: "0.7", description: "Failure to assign username when appointed", punishment: "One Strike", category: "Category 0 - Logged Warnings" },
      { code: "0.8", description: "Tazing or cuffing another officer", punishment: "One Strike", category: "Category 0 - Logged Warnings" },
      { code: "0.9", description: "Unprofesinalazim or Disrespect towards an HR", punishment: "1 Strike", category: "Category 0 - Logged Warnings" },
      { code: "1.0", description: "Trolling", punishment: "One Strike", category: "Category 1 - Strikes" },
      { code: "1.1", description: "Dress code issues", punishment: "Logged Warning or One Strike", category: "Category 1 - Strikes" },
      { code: "1.2", description: "Max timing players", punishment: "2 Strikes", category: "Category 1 - Strikes" },
      { code: "1.3", description: "Fail RP", punishment: "2 Strikes", category: "Category 1 - Strikes" },
      { code: "1.4", description: "Using /passto", punishment: "1-2 Strikes", category: "Category 1 - Strikes" },
      { code: "1.5", description: "Incompetence", punishment: "1–2 Strikes", category: "Category 1 - Strikes" },
      { code: "1.6", description: "Opening doors off duty", punishment: "2 Strikes", category: "Category 1 - Strikes" },
      { code: "1.7", description: "Wearing HR uniform as LR", punishment: "2 Strikes", category: "Category 1 - Strikes" },
      { code: "1.8", description: "Improper charges on civilians", punishment: "2 Strikes", category: "Category 1 - Strikes" },
      { code: "1.9", description: "Insubordination to a supervisor", punishment: "2 Strikes", category: "Category 1 - Strikes" },
      { code: "2.0", description: "Not reporting a serious incident", punishment: "2 Strikes", category: "Category 2 - Serious Offenses" },
      { code: "2.1", description: "Discrimination", punishment: "2 Strikes", category: "Category 2 - Serious Offenses" },
      { code: "2.2", description: "Threatening or harassment", punishment: "NYPD Blacklist perm", category: "Category 2 - Serious Offenses" },
      { code: "2.3", description: "Leaking info", punishment: "NYPD Blacklist perm", category: "Category 2 - Serious Offenses" },
      { code: "2.4", description: "Warrantless raid", punishment: "One Strike", category: "Category 2 - Serious Offenses" },
      { code: "2.5", description: "Account underage", punishment: "NYPD Blacklist", category: "Category 2 - Serious Offenses" },
      { code: "2.6", description: "Exploiting", punishment: "NYPD Blacklist + Ban perm", category: "Category 2 - Serious Offenses" },
      { code: "2.7", description: "Plagiarism (cheating on appys)", punishment: "Blacklist / Not Trusted perm", category: "Category 2 - Serious Offenses" },
      { code: "2.8", description: "Improper loadout", punishment: "One Strike", category: "Category 2 - Serious Offenses" },
      { code: "2.9", description: "Not in VC while on duty", punishment: "One Strike", category: "Category 2 - Serious Offenses" },
      { code: "3.0", description: "Alting", punishment: "Not Trusted / GB perm", category: "Category 3 - Blacklist Offenses" },
      { code: "3.1", description: "Tool abuse", punishment: "One Strike", category: "Category 3 - Blacklist Offenses" },
      { code: "3.2", description: "Not logging a punishment or rank change", punishment: "Logged Warning or One Strike", category: "Category 3 - Blacklist Offenses" },
      { code: "3.3", description: "Mass RK in patrol", punishment: "Fired", category: "Category 3 - Blacklist Offenses" },
      { code: "3.4", description: "Driving under rank", punishment: "One Strike", category: "Category 3 - Blacklist Offenses" },
      { code: "3.5", description: "Selling NYPD weapons/USD selling", punishment: "Ban perm", category: "Category 3 - Blacklist Offenses" },
      { code: "3.6", description: "Failing to defend civilians/constitution", punishment: "One Strike", category: "Category 3 - Blacklist Offenses" },
      { code: "3.7", description: "Ignoring emergency calls", punishment: "One Strike", category: "Category 3 - Blacklist Offenses" },
      { code: "3.8", description: "Inactivity for 7+ days", punishment: "Fired", category: "Category 3 - Blacklist Offenses" },
      { code: "3.9", description: "Lying about age", punishment: "Blacklisted", category: "Category 3 - Blacklist Offenses" },
      { code: "4.0", description: "Signing in and out to respawn faster", punishment: "1 Strike -> Fired", category: "Category 4" },
      { code: "4.1", description: "Frisk without probable cause/reasonable suspicion", punishment: "1 - 2 Strikes", category: "Category 4" },
      { code: "4.2", description: "Taking possession of a firearm during a search", punishment: "2 Strikes -> Fired", category: "Category 4" },
      { code: "4.3", description: "Failure to follow the chain of command", punishment: "1 - 2 Strikes", category: "Category 4" },
      { code: "4.4", description: "HR disrespect", punishment: "2 logged warnings -> 1 Strike", category: "Category 4" },
      { code: "4.5", description: "Unprofessionalism or Disrespect towards another officer", punishment: "2 logged warnings -> 2 Strikes", category: "Category 4" },
      { code: "4.6", description: "Acting immature/unprofessional", punishment: "2 logged warnings -> 2 Strikes", category: "Category 4" },
      { code: "4.7", description: "Robbing Players on duty", punishment: "2 Strikes", category: "Category 4" },
      { code: "4.8", description: "Unprofessionalism or Disrespect towards High Command", punishment: "2 Strikes -> Demotion -> Fired", category: "Category 4" },
      { code: "4.9", description: "Failure to present username when obligated", punishment: "2 Strikes", category: "Category 4" },
      { code: "5.0", description: "Saying the N word/slurs in chat", punishment: "2x Logged Warnings", category: "Category 5" },
      { code: "5.1", description: "Playing on LOA", punishment: "1 Strike + LOA removal", category: "Category 5" },
      { code: "5.2", description: "Reapplying before 48 hours", punishment: "NYPD Blacklist (5 days)", category: "Category 5" },
      { code: "5.3", description: "AI on applications", punishment: "NYPD Blacklist (2 weeks)", category: "Category 5" },
      { code: "5.4", description: "Beam links", punishment: "NYPD Blacklist + Ban", category: "Category 5" },
      { code: "5.5", description: "Trolling on applications", punishment: "NYPD Blacklist perm", category: "Category 5" },
      { code: "5.6", description: "Mag dumping on duty", punishment: "1x Strike", category: "Category 5" },
      { code: "5.7", description: "Opening prison doors/gates off duty", punishment: "1x Strike", category: "Category 5" },
      { code: "5.8", description: "No English", punishment: "NYPD Blacklist perm", category: "Category 5" },
      { code: "5.9", description: "Sharing answers on application", punishment: "NYPD Blacklist perm", category: "Category 5" },
      { code: "6.0", description: "Rejoining to avoid punishment", punishment: "NYPD Blacklist perm", category: "Category 6" },
      { code: "6.1", description: "Leaving Discord server", punishment: "Fired (after 7 days)", category: "Category 6" },
      { code: "6.2", description: "Looting dead bags on duty", punishment: "1x Strike", category: "Category 6" },
      { code: "6.3", description: "Unrealistic head/skintone on duty", punishment: "1x Logged Warning", category: "Category 6" },
      { code: "6.4", description: "Letting prisoners out (on/off duty)", punishment: "2x Strikes", category: "Category 6" },
      { code: "6.5", description: "Cuff rushing", punishment: "1x Strike", category: "Category 6" },
      { code: "6.6", description: "In scripting/USD servers", punishment: "NYPD Blacklist + Ban perm", category: "Category 6" },
      { code: "6.7", description: "Cop baiting", punishment: "2x Strikes", category: "Category 6" },
      { code: "6.8", description: "RK'ing off duty right outside NYPD station", punishment: "1x Strike", category: "Category 6" },
      { code: "6.9", description: "Racism/slurs", punishment: "NYPD Blacklist perm", category: "Category 6" },
      { code: "7.0", description: "Animations on duty", punishment: "2x Logged Warnings", category: "Category 7" },
      { code: "7.1", description: "Signing in/out repeatedly", punishment: "1x Strike", category: "Category 7" },
      { code: "7.2", description: "Blacklisting someone without deranking", punishment: "2x Logged Warnings", category: "Category 7" },
      { code: "7.3", description: "Unnecessary reactions", punishment: "1x Strike", category: "Category 7" },
      { code: "7.4", description: "Pinging everyone/attempting to", punishment: "1x Strike", category: "Category 7" },
      { code: "7.5", description: "NSFW", punishment: "NYPD Blacklist + Ban", category: "Category 7" },
      { code: "7.6", description: "Promoting gang in NYPD", punishment: "NYPD Blacklist perm", category: "Category 7" },
      { code: "7.7", description: "False punishment", punishment: "1–2 Strikes", category: "Category 7" },
      { code: "7.8", description: "Interrupting/trolling in trainings or tryouts", punishment: "1x Strike", category: "Category 7" },
      { code: "7.9", description: "Pinging roles", punishment: "1x Strike", category: "Category 7" },
      { code: "8.0", description: "General disrespect/unprofessionalism", punishment: "2x Logged Warnings or 1x Strike", category: "Category 8" },
      { code: "8.1", description: "Lying about having a mic", punishment: "NYPD Blacklist perm", category: "Category 8" },
      { code: "8.2", description: "Corruption", punishment: "NYPD Blacklist perm", category: "Category 8" },
      { code: "8.3", description: "Accepting someone while fired/blacklisted", punishment: "2x Logged Warnings", category: "Category 8" },
      { code: "8.4", description: "Teaming with civilians", punishment: "NYPD Blacklist perm", category: "Category 8" },
      { code: "8.5", description: "False arrest", punishment: "1x Strike", category: "Category 8" },
      { code: "8.6", description: "Fake logging", punishment: "Fired", category: "Category 8" },
      { code: "8.7", description: "Improper log format", punishment: "2x Logged Warnings", category: "Category 8" },
      { code: "8.8", description: "Duplicating", punishment: "NYPD Blacklist + Ban", category: "Category 8" },
      { code: "8.9", description: "Wrongfully searching civilians", punishment: "1x Strike", category: "Category 8" },
      { code: "9.0", description: "Not presenting badge ID in patrol logs", punishment: "1–2 Strikes", category: "Category 9" },
      { code: "9.1", description: "Revoking an IA punishment without approval", punishment: "1x Strike", category: "Category 9" },
      { code: "9.2", description: "Giving false information to officers", punishment: "1–2 Strikes", category: "Category 9" },
      { code: "9.3", description: "Driving civilian cars on duty", punishment: "1x Strike", category: "Category 9" },
      { code: "9.4", description: "Attempting to override IA decisions", punishment: "1–2 Strikes", category: "Category 9" },
      { code: "9.5", description: "Refusing lawful orders in-game from a HICOM", punishment: "1–2 Strikes", category: "Category 9" },
      { code: "9.6", description: "Requesting whitelist bypasses or rank skips", punishment: "Logged Warning or Strike", category: "Category 9" },
      { code: "9.7", description: "RKING NYPD Personnel inside PD Station", punishment: "NYPD Blacklist Perm", category: "Category 9" },
    ];

    await db.insert(offenses).values(offensesData);
  }
}

export const storage = new DatabaseStorage();
