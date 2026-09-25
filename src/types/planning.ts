export type SolutionPlan = {
  solutionName: string
  applicationType: string
  description: string
  region: string
  users: string
  availability: string
  objective: string
  selectedServices: string[]
}

export const savedProposalStorageKey = 'cloudfoundations.savedProposal'
