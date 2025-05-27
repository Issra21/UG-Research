export type UserRole = "researcher" | "admin" | "student" | "lab_director"
export type PublicationType = "article" | "conference" | "thesis" | "book" | "chapter" | "patent"
export type ProjectStatus = "active" | "completed" | "suspended" | "planned"

export interface Profile {
  id: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
  title?: string
  department?: string
  laboratory?: string
  phone?: string
  office_location?: string
  bio?: string
  research_interests?: string[]
  orcid_id?: string
  google_scholar_id?: string
  avatar_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Publication {
  id: string
  author_id: string
  title: string
  abstract?: string
  publication_type: PublicationType
  journal_name?: string
  conference_name?: string
  publication_date?: string
  doi?: string
  isbn?: string
  pages?: string
  volume?: string
  issue?: string
  publisher?: string
  keywords?: string[]
  co_authors?: string[]
  pdf_url?: string
  external_url?: string
  citation_count: number
  is_published: boolean
  created_at: string
  updated_at: string
  author?: Profile
}

export interface ResearchProject {
  id: string
  title: string
  description?: string
  principal_investigator_id: string
  status: ProjectStatus
  start_date?: string
  end_date?: string
  budget?: number
  funding_source?: string
  keywords?: string[]
  objectives?: string
  methodology?: string
  expected_outcomes?: string
  created_at: string
  updated_at: string
  principal_investigator?: Profile
  collaborators?: ProjectCollaborator[]
}

export interface ProjectCollaborator {
  id: string
  project_id: string
  collaborator_id: string
  role?: string
  contribution_percentage?: number
  joined_at: string
  collaborator?: Profile
}
