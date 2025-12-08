interface ValidationFeedbackProps {
  error?: string | null
  strength?: "Weak" | "Medium" | "Strong" | null
}

export default function ValidationFeedback({ error, strength }: ValidationFeedbackProps) {
  if (!error && !strength) return null

  const strengthColor =
    strength === "Weak" ? "text-red-500" : strength === "Medium" ? "text-yellow-500" : "text-green-500"

  return (
    <div className="mt-1 text-xs font-medium animate-slide-down">
      {error && <p className="text-destructive">{error}</p>}
      {strength && <p className={strengthColor}>Password strength: {strength}</p>}
    </div>
  )
}

