import AuthForm from "@/components/auth/auth-form"

export default function AuthPage() {
  return (
    <div className="container mx-auto px-4 max-w-6xl py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Join TechTo.Earth</h1>
        <p className="text-lg text-gray-600">
          Sign in or create an account to join our community of tech professionals transitioning to earth-based careers.
        </p>
      </div>
      <AuthForm />
    </div>
  )
}
