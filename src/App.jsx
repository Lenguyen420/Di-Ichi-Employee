import { RouterProvider } from 'react-router-dom'
import { AppointmentsProvider } from './contexts/AppointmentsContext.jsx'
import { PotentialCandidatesProvider } from './contexts/PotentialCandidatesContext.jsx'
import { router } from './routes/AppRouter.jsx'

function App() {
  return (
    <PotentialCandidatesProvider>
      <AppointmentsProvider>
        <RouterProvider router={router} />
      </AppointmentsProvider>
    </PotentialCandidatesProvider>
  )
}

export default App
