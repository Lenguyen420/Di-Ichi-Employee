export const EnrollmentSteps = ({ steps }) => (
  <div className="grid gap-3 md:grid-cols-5">
    {steps.map((step, index) => (
      <div key={step} className="rounded-lg border border-orange-100 bg-white p-3">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-orange-600 text-sm font-black text-white">{index + 1}</span>
        <p className="mt-3 text-sm font-black text-slate-950">{step}</p>
      </div>
    ))}
  </div>
)
