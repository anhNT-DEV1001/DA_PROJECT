import { cn } from "@/common/lib"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/features/auth/hooks"
import { Eye, EyeOff, LoaderCircle } from "lucide-react"
import { useState, type FormEvent } from "react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate()
  const { loginMutation, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = String(formData.get("username") ?? "").trim()
    const password = String(formData.get("password") ?? "")

    loginMutation.mutate(
      { username, password },
      {
        onSuccess: () => navigate("/home", { replace: true }),
      }
    )
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      aria-busy={isLoading}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Đăng nhập</h1>
        </div>
        <Field>
          {/* <FieldLabel htmlFor="username">Tên đăng nhập</FieldLabel> */}
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="Tên đăng nhập"
            autoComplete="username"
            disabled={isLoading}
            required
          />
        </Field>
        <Field>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              className="pr-10"
              disabled={isLoading}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
              onClick={() => setShowPassword((current) => !current)}
              disabled={isLoading}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </Field>
        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <LoaderCircle
                className="size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Đăng nhập
          </Button>
        </Field>
        {/* <div className="flex items-center">
          <a href="#" className="ml-auto text-xs">
            Quên mật khẩu?
          </a>
        </div> */}
        <Field>
          <FieldDescription className="text-center">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-primary no-underline transition-colors hover:underline"
            >
              Đăng ký
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
