import { GalleryVerticalEnd, ShieldCheck } from "lucide-react"

import { LoginForm } from "./components/LoginForm"

export default function LoginPage() {
  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-2">
      <section className="flex flex-col gap-4 p-6 md:p-10">
        {/* <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            DA Project
          </a>
        </div> */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
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
          {/* <p className="mt-4 text-2xl leading-10 text-primary-foreground/75">
            Đăng nhập để tiếp tục truy cập và quản lý công việc của bạn một cách
            an toàn.
          </p> */}
        </div>
      </aside>
    </main>
  )
}
