import { ShieldCheck } from "lucide-react"

import { RegisterForm } from "./components/RegisterForm"

export default function RegisterPage() {
  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-2">
      <section className="flex flex-col justify-center p-6 md:p-10">
        <div className="mx-auto flex w-full max-w-lg flex-1 items-center justify-center">
          <div className="w-full">
            <RegisterForm />
          </div>
        </div>
      </section>
      <aside className="relative hidden overflow-hidden bg-primary lg:flex lg:items-center lg:justify-center">
        <div className="absolute -top-32 -right-32 size-96 rounded-full bg-primary-foreground/10" />
        <div className="absolute -bottom-40 -left-32 size-[28rem] rounded-full bg-primary-foreground/10" />
        <div className="relative z-10 max-w-md px-12 text-center text-primary-foreground">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary-foreground/15 backdrop-blur-sm">
            <ShieldCheck className="size-8" aria-hidden="true" />
          </div>
          <h2 className="text-3xl font-bold">Đồ án 2026 - Quản lý công việc</h2>
          <p className="mt-4 leading-relaxed text-primary-foreground/80">
            Đăng ký tài khoản để bắt đầu trải nghiệm hệ thống quản lý công việc
            và phân quyền chuyên nghiệp.
          </p>
        </div>
      </aside>
    </main>
  )
}
