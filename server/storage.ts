import { type User, type InsertUser, type MRFRequest, type OnboardingRequest, type InsertMRF, type InsertOnboarding } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getMRFRequests(): Promise<MRFRequest[]>;
  getMRFRequest(id: string): Promise<MRFRequest | undefined>;
  createMRFRequest(mrf: InsertMRF): Promise<MRFRequest>;
  updateMRFRequest(id: string, updates: Partial<MRFRequest>): Promise<MRFRequest | undefined>;
  
  getOnboardingRequests(): Promise<OnboardingRequest[]>;
  getOnboardingRequest(id: string): Promise<OnboardingRequest | undefined>;
  createOnboardingRequest(onboarding: InsertOnboarding): Promise<OnboardingRequest>;
  updateOnboardingRequest(id: string, updates: Partial<OnboardingRequest>): Promise<OnboardingRequest | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private mrfRequests: Map<string, MRFRequest>;
  private onboardingRequests: Map<string, OnboardingRequest>;

  constructor() {
    this.users = new Map();
    this.mrfRequests = new Map();
    this.onboardingRequests = new Map();
    
    // Initialize with sample data as per BRD
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample MRF data from BRD
    const sampleMRFs: MRFRequest[] = [
      {
        id: 'MRF002',
        title: 'IT Developer',
        department: 'IT',
        entity: 'HLPL/White Collar',
        costCenter: 'Gurgaon',
        createdBy: 'John Manager',
        positions: 2,
        salaryMin: 25000,
        salaryMax: 34000,
        status: 'pending',
        rejectionReason: null,
        createdAt: new Date(),
      },
      {
        id: 'MRF003',
        title: 'HR Executive',
        department: 'HR',
        entity: 'HLPL/White Collar',
        costCenter: 'Corporate',
        createdBy: 'Sarah Manager',
        positions: 1,
        salaryMin: 22000,
        salaryMax: 28000,
        status: 'pending',
        rejectionReason: null,
        createdAt: new Date(),
      },
      {
        id: 'MRF001',
        title: 'Operations Manager',
        department: 'Operations',
        entity: 'HTSPL/Blue Collar',
        costCenter: 'Mumbai',
        createdBy: 'Mike Director',
        positions: 1,
        salaryMin: 40000,
        salaryMax: 45000,
        status: 'pending',
        rejectionReason: null,
        createdAt: new Date(),
      },
    ];

    // Sample Onboarding data from BRD
    const sampleOnboarding: OnboardingRequest[] = [
      {
        id: 'ON001',
        name: 'Rahul Sharma',
        position: 'IT Developer',
        department: 'IT',
        phone: '+91 9876543210',
        email: 'rahul.sharma@email.com',
        ctc: 320000,
        joiningDate: '2024-01-15',
        aadhaarStatus: 'verified',
        panStatus: 'verified',
        educationStatus: 'verified',
        employmentStatus: 'verified',
        status: 'pending',
        rejectionReason: null,
        createdAt: new Date(),
      },
      {
        id: 'ON002',
        name: 'Priya Patel',
        position: 'HR Executive',
        department: 'HR',
        phone: '+91 9876543211',
        email: 'priya.patel@email.com',
        ctc: 280000,
        joiningDate: '2024-01-20',
        aadhaarStatus: 'verified',
        panStatus: 'verified',
        educationStatus: 'verified',
        employmentStatus: 'pending',
        status: 'pending',
        rejectionReason: null,
        createdAt: new Date(),
      },
    ];

    sampleMRFs.forEach(mrf => this.mrfRequests.set(mrf.id, mrf));
    sampleOnboarding.forEach(onboarding => this.onboardingRequests.set(onboarding.id, onboarding));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, role: insertUser.role || "LOB_HEAD" };
    this.users.set(id, user);
    return user;
  }

  async getMRFRequests(): Promise<MRFRequest[]> {
    return Array.from(this.mrfRequests.values());
  }

  async getMRFRequest(id: string): Promise<MRFRequest | undefined> {
    return this.mrfRequests.get(id);
  }

  async createMRFRequest(mrf: InsertMRF): Promise<MRFRequest> {
    const newMRF: MRFRequest = { 
      ...mrf, 
      createdAt: new Date(),
      status: mrf.status || "pending",
      rejectionReason: mrf.rejectionReason || null
    };
    this.mrfRequests.set(mrf.id, newMRF);
    return newMRF;
  }

  async updateMRFRequest(id: string, updates: Partial<MRFRequest>): Promise<MRFRequest | undefined> {
    const existing = this.mrfRequests.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.mrfRequests.set(id, updated);
    return updated;
  }

  async getOnboardingRequests(): Promise<OnboardingRequest[]> {
    return Array.from(this.onboardingRequests.values());
  }

  async getOnboardingRequest(id: string): Promise<OnboardingRequest | undefined> {
    return this.onboardingRequests.get(id);
  }

  async createOnboardingRequest(onboarding: InsertOnboarding): Promise<OnboardingRequest> {
    const newOnboarding: OnboardingRequest = { 
      ...onboarding, 
      createdAt: new Date(),
      status: onboarding.status || "pending",
      rejectionReason: onboarding.rejectionReason || null,
      aadhaarStatus: onboarding.aadhaarStatus || "pending",
      panStatus: onboarding.panStatus || "pending",
      educationStatus: onboarding.educationStatus || "pending",
      employmentStatus: onboarding.employmentStatus || "pending"
    };
    this.onboardingRequests.set(onboarding.id, newOnboarding);
    return newOnboarding;
  }

  async updateOnboardingRequest(id: string, updates: Partial<OnboardingRequest>): Promise<OnboardingRequest | undefined> {
    const existing = this.onboardingRequests.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.onboardingRequests.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
