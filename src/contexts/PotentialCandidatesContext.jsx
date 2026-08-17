import { useMemo, useState } from 'react'
import { potentialCandidates as initialPotentialCandidates } from '../datas/potentialCandidatesData.js'
import { PotentialCandidatesContext } from './potentialCandidatesContext.js'

export const PotentialCandidatesProvider = ({ children }) => {
  const [candidates, setCandidates] = useState(initialPotentialCandidates)

  const value = useMemo(() => ({ candidates, setCandidates }), [candidates])

  return <PotentialCandidatesContext.Provider value={value}>{children}</PotentialCandidatesContext.Provider>
}
