import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, LoaderCircle } from "lucide-react"

import { cn } from "@/common/lib"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { useAuth } from "@/features/auth/hooks"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate()
  const { registerMutation, isLoading } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [gender, setGender] = useState("Nam")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = String(formData.get("username") ?? "").trim()
    const fullName = String(formData.get("fullName") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim()
    const phone = String(formData.get("phone") ?? "").trim()
    const password = String(formData.get("password") ?? "")
    const passwordConfirm = String(formData.get("passwordConfirm") ?? "")
    const address = String(formData.get("address") ?? "").trim()
    const dob = String(formData.get("dob") ?? "").trim()

    if (password !== passwordConfirm) {
      toast.add({
        id: "auth-register-password-mismatch",
        type: "error",
        title: "Mật khẩu không khớp",
        description: "Mật khẩu xác nhận không trùng khớp, vui lòng nhập lại.",
        priority: "high",
      })
      return
    }

    registerMutation.mutate(
      {
        username,
        fullName,
        email,
        phone,
        gender,
        password,
        passwordConfirm,
        ...(address ? { address } : {}),
        ...(dob ? { dob } : {}),
      },
      {
        onSuccess: () => {
          navigate("/login", { replace: true })
        },
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
          <h1 className="text-2xl font-bold">Đăng ký tài khoản</h1>
          <p className="text-sm text-muted-foreground">
            Nhập thông tin bên dưới để tạo tài khoản mới
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="fullName">Họ và tên *</FieldLabel>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Nguyễn Văn A"
              autoComplete="name"
              disabled={isLoading}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="username">Tên đăng nhập *</FieldLabel>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="nguyenvana"
              autoComplete="username"
              disabled={isLoading}
              required
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="email">Email *</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email@example.com"
              autoComplete="email"
              disabled={isLoading}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Số điện thoại *</FieldLabel>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="0912345678"
              autoComplete="tel"
              disabled={isLoading}
              required
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="gender">Giới tính *</FieldLabel>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              disabled={isLoading}
              required
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-base shadow-xs ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </Field>

          <Field>
            <FieldLabel htmlFor="dob">Ngày sinh</FieldLabel>
            <Input id="dob" name="dob" type="date" disabled={isLoading} />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="address">Địa chỉ</FieldLabel>
          <Input
            id="address"
            name="address"
            type="text"
            placeholder="Hà Nội, Việt Nam"
            disabled={isLoading}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="password">Mật khẩu *</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ít nhất 6 ký tự"
                autoComplete="new-password"
                className="pr-10"
                disabled={isLoading}
                minLength={6}
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
            <FieldLabel htmlFor="passwordConfirm">
              Xác nhận mật khẩu *
            </FieldLabel>
            <div className="relative">
              <Input
                id="passwordConfirm"
                name="passwordConfirm"
                type={showPasswordConfirm ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
                className="pr-10"
                disabled={isLoading}
                minLength={6}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                onClick={() => setShowPasswordConfirm((current) => !current)}
                disabled={isLoading}
                aria-label={
                  showPasswordConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                }
                aria-pressed={showPasswordConfirm}
              >
                {showPasswordConfirm ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </Field>
        </div>

        <Field className="mt-2">
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && (
              <LoaderCircle
                className="size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Đăng ký tài khoản
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-primary no-underline transition-colors hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
