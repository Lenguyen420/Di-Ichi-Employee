import { RouterProvider } from 'react-router-dom'
import { AppointmentsProvider } from './contexts/AppointmentsContext.jsx'
import { router } from './routes/AppRouter.jsx'

function App() {
  return (
    <AppointmentsProvider>
      <RouterProvider router={router} />
    </AppointmentsProvider>
  )
}

export default App
