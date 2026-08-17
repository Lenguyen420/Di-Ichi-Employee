import { useContext } from 'react'
import { PotentialCandidatesContext } from './potentialCandidatesContext.js'

export const usePotentialCandidates = () => {
  const context = useContext(PotentialCandidatesContext)

  if (!context) {
    throw new Error('usePotentialCandidates must be used within a PotentialCandidatesProvider')
  }

  return context
}
