import { useEffect, useRef, useState, type FormEvent } from "react"
import {
  Camera,
  Calendar,
  Mail,
  Phone,
  Shield,
  User as UserIcon,
  MapPin,
  Lock,
  LoaderCircle,
  RotateCcw,
  CheckCircle2,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@/features/users/hooks"
import { getAvatarUrl, getInitials } from "@/common/lib"

const formatDateForInput = (dateVal?: string | Date | null) => {
  if (!dateVal) return ""
  try {
    const d = new Date(dateVal)
    if (isNaN(d.getTime())) return ""
    return d.toISOString().split("T")[0]
  } catch {
    return ""
  }
}

export function PersonalPage() {
  const { user, isLoading, isUpdating, updateProfile } = useUser()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [gender, setGender] = useState("Nam")
  const [dob, setDob] = useState("")
  const [address, setAddress] = useState("")

  const currentAvatarUrl = getAvatarUrl(user?.avatar)

  // Đồng bộ dữ liệu khi user được tải xong
  useEffect(() => {
    if (user) {
      setFullName(user.fullName ?? "")
      setEmail(user.email ?? "")
      setPhone(user.phone ?? "")
      setGender(user.gender ?? "Nam")
      setDob(formatDateForInput(user.dob))
      setAddress(user.address ?? "")
      setAvatarPreview(null)
      setAvatarFile(null)
    }
  }, [user])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleReset = () => {
    if (user) {
      setFullName(user.fullName ?? "")
      setEmail(user.email ?? "")
      setPhone(user.phone ?? "")
      setGender(user.gender ?? "Nam")
      setDob(formatDateForInput(user.dob))
      setAddress(user.address ?? "")
      setAvatarPreview(null)
      setAvatarFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    const formData = new FormData()
    formData.append("fullName", fullName.trim())
    formData.append("email", email.trim())
    formData.append("phone", phone.trim())
    formData.append("gender", gender)
    if (dob) formData.append("dob", dob)
    if (address.trim()) formData.append("address", address.trim())
    if (avatarFile) formData.append("avatar", avatarFile)

    // Lưu ý: Không gửi roleIds để đảm bảo không can thiệp hay chỉnh sửa quyền
    updateProfile(formData, {
      onSuccess: () => {
        setAvatarFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
      },
    })
  }

  const userRoles = user?.userRoles ?? []
  const initials = getInitials(user?.fullName || user?.username)

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      {/* Tiêu đề trang */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Thông tin cá nhân
        </h2>
        <p className="text-sm text-muted-foreground">
          Xem và cập nhật các thông tin hồ sơ của bạn trên hệ thống.
        </p>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cột trái: Hồ sơ tóm tắt & Phân quyền (Read-only) */}
        <div className="space-y-6">
          <div className="flex flex-col items-center rounded-xl border bg-card p-6 text-center text-card-foreground shadow-xs">
            {/* Ảnh đại diện & nút đổi ảnh */}
            <div className="group relative mb-4">
              <Avatar className="size-28 ring-4 ring-muted">
                <AvatarImage
                  src={avatarPreview || currentAvatarUrl}
                  alt={user?.fullName ?? "Avatar"}
                />
                <AvatarFallback className="text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || isUpdating}
                className="absolute right-0 bottom-0 flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-colors hover:bg-primary/90 disabled:opacity-50"
                title="Thay đổi ảnh đại diện"
              >
                <Camera className="size-4" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <h3 className="text-lg font-semibold">
              {user?.fullName || "Chưa đặt tên"}
            </h3>
            <p className="text-sm text-muted-foreground">@{user?.username}</p>

            {avatarPreview && (
              <span className="mt-2 text-xs font-medium text-primary">
                * Đã chọn ảnh mới (hãy nhấn Lưu thay đổi)
              </span>
            )}

            <div className="mt-6 w-full space-y-3 border-t pt-4 text-left text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-4 shrink-0" />
                <span className="truncate">
                  {user?.email || "Chưa có email"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-4 shrink-0" />
                <span>{user?.phone || "Chưa có số điện thoại"}</span>
              </div>
              {user?.address && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-4 shrink-0" />
                  <span className="truncate">{user.address}</span>
                </div>
              )}
              {user?.createdAt && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-4 shrink-0" />
                  <span>
                    Tham gia:{" "}
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Khối quyền hạn (Read-only) */}
          <div className="rounded-xl border bg-card p-5 text-card-foreground shadow-xs">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2 font-medium">
                <Shield className="size-5 text-primary" />
                <span>Vai trò & Quyền hạn</span>
              </div>
              <span className="text-xs font-normal text-muted-foreground">
                Chỉ đọc
              </span>
            </div>

            <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
              Các vai trò được cấp bởi quản trị viên hệ thống.
            </p>

            <div className="flex flex-wrap gap-2">
              {userRoles.length > 0 ? (
                userRoles.map((ur) => (
                  <span
                    key={ur.id}
                    className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                  >
                    <CheckCircle2 className="size-3.5" />
                    {ur.role?.description ||
                      ur.role?.name ||
                      `Role #${ur.roleId}`}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">
                  Chưa được gán vai trò nào
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Cột phải: Form chỉnh sửa thông tin cá nhân */}
        <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-xs lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Chỉnh sửa thông tin</h3>
            <p className="text-sm text-muted-foreground">
              Cập nhật thông tin định danh và liên hệ của bạn
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FieldGroup>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Tên đăng nhập (Read-only) */}
                <Field>
                  <FieldLabel
                    htmlFor="username"
                    className="flex items-center gap-1"
                  >
                    <span>Tên đăng nhập</span>
                    <Lock className="size-3.5 text-muted-foreground" />
                  </FieldLabel>
                  <Input
                    id="username"
                    value={user?.username ?? ""}
                    disabled
                    className="cursor-not-allowed bg-muted opacity-80"
                  />
                  <FieldDescription className="text-xs">
                    Tên đăng nhập được cố định trên hệ thống
                  </FieldDescription>
                </Field>

                {/* Họ và tên */}
                <Field>
                  <FieldLabel htmlFor="fullName">Họ và tên *</FieldLabel>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    disabled={isUpdating || isLoading}
                    required
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Email */}
                <Field>
                  <FieldLabel htmlFor="email">Email *</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    disabled={isUpdating || isLoading}
                    required
                  />
                </Field>

                {/* Số điện thoại */}
                <Field>
                  <FieldLabel htmlFor="phone">Số điện thoại *</FieldLabel>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912345678"
                    disabled={isUpdating || isLoading}
                    required
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Giới tính */}
                <Field>
                  <FieldLabel htmlFor="gender">Giới tính *</FieldLabel>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    disabled={isUpdating || isLoading}
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-base shadow-xs ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </Field>

                {/* Ngày sinh */}
                <Field>
                  <FieldLabel htmlFor="dob">Ngày sinh</FieldLabel>
                  <Input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    disabled={isUpdating || isLoading}
                  />
                </Field>
              </div>

              {/* Địa chỉ */}
              <Field>
                <FieldLabel htmlFor="address">Địa chỉ</FieldLabel>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Địa chỉ cư trú hoặc nơi làm việc"
                  disabled={isUpdating || isLoading}
                />
              </Field>

              <div className="flex flex-wrap items-center justify-end gap-3 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isUpdating || isLoading}
                  className="flex items-center gap-1.5"
                >
                  <RotateCcw className="size-4" />
                  Hoàn tác
                </Button>

                <Button
                  type="submit"
                  disabled={isUpdating || isLoading}
                  className="flex min-w-[120px] items-center gap-1.5"
                >
                  {isUpdating ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <UserIcon className="size-4" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PersonalPage
