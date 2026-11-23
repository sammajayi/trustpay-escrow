export interface Milestone {
  id: string;
  project_id?: string;
  milestone_index: number;
  title: string;
  description?: string;
  amount: number;
  status: 'pending' | 'submitted' | 'in_revision' | 'approved' | 'disputed';
  due_date?: string;
  submitted_at?: string;
  auto_release_at?: string;
  revision_limit?: number;
  revisions_remaining?: number;
  revision_note?: string;
  deliverable_hash?: string;
  deliverable_url?: string;
  deliverable_notes?: string;
  deliverable_type?: string;
  tx_hash?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  subtitle?: string;
  category: string;
  budget: number;
  token?: 'USDC' | 'EURC' | 'XLM' | 'PYUSD' | string;
  token_address?: string;
  status: 'draft' | 'in_progress' | 'completed' | 'disputed' | 'open';
  deadline?: string;
  visibility?: string;
  client_id?: string;
  client_address?: string;
  freelancer_id?: string;
  freelancer_address?: string;
  arbiter_id?: string;
  arbiter_address?: string;
  contract_id?: string;
  project_id_onchain?: number | string | bigint;
  tx_hash?: string;
  created_at?: string;
  milestones?: Milestone[];
  applicants?: Applicant[];
  proposals?: Proposal[];
  attachments?: string[];
  files?: any[];
  yield_enabled?: boolean;
  estimated_yield?: number;
  blend_pool_address?: string;
}

export interface Applicant {
  id: string;
  project_id?: string;
  freelancer_id?: string;
  stellar_address?: string;
  freelancer_address?: string;
  name: string;
  pitch: string;
  cover_note?: string;
  portfolio_url?: string;
  demo_url?: string;
  status?: 'pending' | 'accepted' | 'denied' | 'granted' | 'rejected';
  granted?: boolean;
  created_at?: string;
  zk_attestation?: unknown;
}

export interface Proposal {
  id: string;
  project_id: string;
  project_title: string;
  stellar_address?: string;
  freelancer_address?: string;
  cover_note?: string;
  portfolio_url?: string;
  pitch: string;
  budget: number;
  status: 'pending' | 'accepted' | 'denied' | 'granted' | 'rejected';
  created_at: string;
}

export interface User {
  id: string;
  stellar_address: string;
  email?: string;
  role?: string;
  is_client: boolean;
  is_freelancer: boolean;
  created_at?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalProjects: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/** One payout tranche in a DAO escrow proposal. */
export interface DaoProposalMilestone {
  title: string;
  amount: number;
  due_date?: string;
}

/** Escrow terms plus governance settings used to generate a DAO proposal. */
export interface DaoProposalInput {
  proposalTitle: string;
  projectTitle: string;
  description: string;
  category?: string;
  token: string;
  tokenAddress: string;
  /** DAO treasury account that funds and authorises the escrow (the contract's `client`). */
  treasuryAddress: string;
  freelancerAddress?: string;
  arbiterAddress?: string;
  milestones: DaoProposalMilestone[];
  yieldEnabled: boolean;
  deadline?: string;
  votingPeriodDays: number;
}
