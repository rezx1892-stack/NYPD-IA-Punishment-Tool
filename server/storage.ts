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
    
    const offensesData = [
      // Major Offenses (Fire/Blacklist)
      { code: "9.4", description: "Beam links", punishment: "Ban → Temp Ban (if compromised)", category: "Major Offenses" },
      { code: "9.3", description: "Racism/slurs", punishment: "Blacklist", category: "Major Offenses" },
      { code: "9.2", description: "5+ applications (where user quits and rejoins)", punishment: "Blacklist", category: "Major Offenses" },
      { code: "9.1", description: "Driving civilian cars on duty", punishment: "Fire", category: "Major Offenses" },
      { code: "9.0", description: "Promoting gangs in NYPD", punishment: "Fire → Blacklist", category: "Major Offenses" },
      { code: "8.9", description: "Corruption", punishment: "Blacklist", category: "Major Offenses" },
      { code: "8.8", description: "Fake logging", punishment: "Blacklist", category: "Major Offenses" },
      { code: "8.7", description: "RKING NYPD Personnel inside PD Station", punishment: "Blacklist", category: "Major Offenses" },
      { code: "8.6", description: "No English", punishment: "Blacklist (Unless user can provide proficiency in English)", category: "Major Offenses" },
      { code: "8.5", description: "Leaking Intelligence Divisions", punishment: "Bronx 3 Ban", category: "Major Offenses" },
      { code: "8.4", description: "In scripting/USD servers", punishment: "Bronx 3 Ban", category: "Major Offenses" },
      { code: "8.3", description: "Playing/owning Bronx Copies", punishment: "Bronx 3 Ban", category: "Major Offenses" },
      { code: "8.2", description: "NSFW", punishment: "Blacklist", category: "Major Offenses" },
      { code: "8.1", description: "Trolling on applications", punishment: "Blacklist", category: "Major Offenses" },
      { code: "8.0", description: "Sharing application answers", punishment: "Blacklist", category: "Major Offenses" },
      { code: "7.9", description: "Rejoining to avoid punishment", punishment: "Blacklist", category: "Major Offenses" },
      { code: "7.8", description: "Lying about having a mic", punishment: "Blacklist (Until user can show proof of microphone)", category: "Major Offenses" },
      { code: "7.7", description: "AI on applications", punishment: "Blacklist", category: "Major Offenses" },
      { code: "7.6", description: "Reapplying before 48 hours", punishment: "Blacklist", category: "Major Offenses" },
      { code: "7.5", description: "Lying about age", punishment: "Blacklist", category: "Major Offenses" },
      { code: "7.4", description: "Alting", punishment: "Blacklist", category: "Major Offenses" },
      { code: "7.3", description: "Plagiarism (applications)", punishment: "Blacklist", category: "Major Offenses" },
      { code: "7.2", description: "Teaming with civilians", punishment: "Fire", category: "Major Offenses" },
      { code: "7.1", description: "Max timing players", punishment: "Blacklist", category: "Major Offenses" },
      { code: "7.0", description: "Opening doors off duty", punishment: "Blacklist", category: "Major Offenses" },
      { code: "6.9", description: "Robbing players on duty", punishment: "Blacklist", category: "Major Offenses" },
      { code: "6.8", description: "Opening prison doors off duty", punishment: "Fire", category: "Major Offenses" },
      { code: "6.7", description: "Letting prisoners out", punishment: "Blacklist", category: "Major Offenses" },
      { code: "6.6", description: "Trolling in trainings", punishment: "Fire (ACAD), 2x Strikes", category: "Major Offenses" },
      { code: "6.5", description: "Pinging roles/everyone", punishment: "Blacklist", category: "Major Offenses" },
      { code: "6.4", description: "Stating NYPD K in a VC/channel marked for professionalism", punishment: "Fire", category: "Major Offenses" },
      { code: "6.3", description: "Attempting to use loopholes for personal gain", punishment: "Fire", category: "Major Offenses" },
      
      // Moderate Violations (Strikes)
      { code: "6.2", description: "Improper use of /passto", punishment: "1x Strike", category: "Moderate Violations" },
      { code: "6.1", description: "Trolling", punishment: "1x Strike, 2x Logged Warnings", category: "Moderate Violations" },
      { code: "6.0", description: "Tazing or cuffing another officer", punishment: "2x Strike, 1x Logged Warnings", category: "Moderate Violations" },
      { code: "5.9", description: "Copbaiting", punishment: "2x Strike, Copbaiting List, Watchlist", category: "Moderate Violations" },
      { code: "5.8", description: "Signing in & out", punishment: "1x Strike", category: "Moderate Violations" },
      { code: "5.7", description: "Giving false information to officers", punishment: "2x Strike", category: "Moderate Violations" },
      { code: "5.6", description: "Freechatting in suggestions", punishment: "1x Strike", category: "Moderate Violations" },
      { code: "5.3", description: "Refusing lawful orders in-game from a HICOM", punishment: "1x-2x Strike", category: "Moderate Violations" },
      { code: "5.2", description: "Improper use of force", punishment: "1x Strike", category: "Moderate Violations" },
      { code: "5.1", description: "Insubordination", punishment: "1x Strike", category: "Moderate Violations" },
      { code: "5.0", description: "Incompetence", punishment: "1x Strike", category: "Moderate Violations" },
      { code: "4.9", description: "Improper charges on civilians", punishment: "1x Strike", category: "Moderate Violations" },
      { code: "4.8", description: "Not reporting a serious incident", punishment: "1x Strike, 2x Logged Warnings", category: "Moderate Violations" },
      { code: "4.7", description: "Improper Breach", punishment: "1x Strike", category: "Moderate Violations" },
      { code: "4.6", description: "Warrantless RICO", punishment: "2x Strike", category: "Moderate Violations" },
      { code: "4.5", description: "Improper loadout", punishment: "1x Strike", category: "Moderate Violations" },
      { code: "4.4", description: "Not in VC while on duty", punishment: "1x Strike", category: "Moderate Violations" },
      { code: "4.3", description: "Tool abuse", punishment: "2x Strike", category: "Moderate Violations" },
      { code: "4.2", description: "Driving under rank", punishment: "1x Strike", category: "Moderate Violations" },
      { code: "4.1", description: "Failing to defend civilians/constitution", punishment: "1x Strike", category: "Moderate Violations" },
      { code: "4.0", description: "Frisk without probable cause", punishment: "1x Strike", category: "Moderate Violations" },
      { code: "3.9", description: "Taking firearm during search", punishment: "1x Strike (Unless FBI or RP)", category: "Moderate Violations" },
      { code: "3.8", description: "Mag dumping on duty", punishment: "1x Strike", category: "Moderate Violations" },
      { code: "3.7", description: "Looting dead bags on duty", punishment: "2x Strike", category: "Moderate Violations" },
      { code: "3.6", description: "Cuff rushing", punishment: "1x Strike", category: "Moderate Violations" },
      { code: "3.5", description: "Killing off duty near station", punishment: "2x Strike", category: "Moderate Violations" },
      { code: "3.4", description: "Unnecessary reactions", punishment: "1x Strike", category: "Moderate Violations" },
      { code: "3.3", description: "False arrest", punishment: "1x Strike", category: "Moderate Violations" },
      { code: "3.2", description: "Wrongful searching civilians", punishment: "1x Strike", category: "Moderate Violations" },
      { code: "3.1", description: "Dresscode violation (general)", punishment: "1x Strike", category: "Moderate Violations" },
      { code: "3.0", description: "Disrespectful in ticket", punishment: "1x Strike, Ticket closure", category: "Moderate Violations" },
      { code: "2.9", description: "Intentionally running over civilians", punishment: "1x Strike", category: "Moderate Violations" },
      { code: "2.8", description: "AFK for 10 minutes+ signed on", punishment: "1x Strike", category: "Moderate Violations" },
      { code: "2.7", description: "Letting someone else play on your account", punishment: "2x Strike", category: "Moderate Violations" },
      
      // Minor Violations (Logged Warnings)
      { code: "2.6", description: "Failure to present username when obligated", punishment: "1x Logged warnings", category: "Minor Violations" },
      { code: "2.5", description: "Not presenting badge ID", punishment: "2x Logged warnings", category: "Minor Violations" },
      { code: "2.4", description: "Ignoring emergency calls", punishment: "2x Logged warnings", category: "Minor Violations" },
      { code: "2.3", description: "Wearing HR uniform as LR", punishment: "2x Logged warnings", category: "Minor Violations" },
      { code: "2.2", description: "Disrespect towards HR", punishment: "2x Logged warnings", category: "Minor Violations" },
      { code: "2.1", description: "Failure to follow chain of command", punishment: "1x Logged warnings", category: "Minor Violations" },
      { code: "2.0", description: "Requesting whitelist bypasses or rank skips", punishment: "1x Logged warnings", category: "Minor Violations" },
      { code: "1.9", description: "Patrolling without an F.T.O", punishment: "1x Logged warnings", category: "Minor Violations" },
      { code: "1.8", description: "Improper log format", punishment: "2x Logged warnings", category: "Minor Violations" },
      { code: "1.7", description: "Animations on duty", punishment: "1x Logged warnings", category: "Minor Violations" },
      { code: "1.6", description: "Unrealistic head/skintone on duty", punishment: "2x Logged warnings", category: "Minor Violations" },
      { code: "1.5", description: "Immaturity/unprofessionalism", punishment: "2x Logged warnings", category: "Minor Violations" },
      { code: "1.4", description: "Reacting but not showing up to an event", punishment: "1x Logged warnings", category: "Minor Violations" },
      { code: "1.3", description: "No VC picture in patrol log", punishment: "1x Logged warnings", category: "Minor Violations" },
      { code: "1.2", description: "Failure to properly supervise a Probationary Officer", punishment: "1x Strike", category: "Minor Violations" },
      
      // High Rank Violations
      { code: "1.1", description: "Revoking an IA punishment without approval", punishment: "1x Strike", category: "High Rank Violations" },
      { code: "1.0", description: "Skipping applications", punishment: "1x Strike", category: "High Rank Violations" },
      { code: "0.9", description: "Accepting someone while fired/blacklisted", punishment: "1x Strike", category: "High Rank Violations" },
      { code: "0.8", description: "Blacklisting someone without deranking", punishment: "1x Strike", category: "High Rank Violations" },
      { code: "0.7", description: "Failure to maintain a calm demeanor when dealing with a situation", punishment: "1x Strike", category: "High Rank Violations" },
      { code: "0.6", description: "Dating a fellow colleague", punishment: "Fired", category: "High Rank Violations" },
      { code: "0.5", description: "False punishment", punishment: "1x Strike", category: "High Rank Violations" },
      { code: "0.4", description: "Failure to properly represent NYPD in The Bronx 3 chats (Only regarding NYPD topics)", punishment: "1x Strike", category: "High Rank Violations" },
      { code: "0.3", description: "Antagonization of HR, Division, or NYPD personnel", punishment: "1x Strike → Demotion", category: "High Rank Violations" },
      { code: "0.2", description: "Failure to react to HR announcements", punishment: "1x Strike", category: "High Rank Violations" },
      { code: "0.1", description: "Not ranking someone after acceptance", punishment: "1x Strike", category: "High Rank Violations" },
    ];

    if (count.length > 0) {
      // Clear existing offenses and re-seed
      await db.delete(offenses);
    }
    
    await db.insert(offenses).values(offensesData);
  }
}

export const storage = new DatabaseStorage();
