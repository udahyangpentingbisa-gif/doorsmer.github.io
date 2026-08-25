'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Droplets, LockKeyhole } from 'lucide-react'
import { AdminDashboard } from './admin-dashboard'
import type { AdminRole } from '@/lib/server/auth'

export function AdminGate() {
  const [authenticated, setAuthenticated] = useState(false)
  const [role, setRole] = useState<AdminRole | null>(null)
  const [ready, setReady] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [sessionError, setSessionError] = useState('')

  useEffect(() => {
    fetch('/api/admin/session')
      .then(async (response) => {
        const body = (await response.json().catch(() => null)) as
          | { authenticated?: boolean; role?: AdminRole | null; error?: string }
          | null
        if (!response.ok) throw new Error(body?.error)
        return { authenticated: body?.authenticated === true, role: body?.role ?? null }
      })
      .then((body) => {
        setAuthenticated(body.authenticated)
        setRole(body.role)
      })
      .catch(() => setSessionError('Admin belum siap. Periksa environment variables di Vercel.'))
      .finally(() => setReady(true))
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const response = await fetch('/api/admin/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (response.ok) {
      setAuthenticated(true)
      const body = (await response.json()) as { role?: AdminRole }
      setRole(body.role ?? null)
      setError('')
      window.location.reload()
      return
    }

    setError('Username atau password tidak sesuai.')
  }

  async function handleLogout() {
    await fetch('/api/admin/session', { method: 'DELETE' })
    window.location.reload()
    setAuthenticated(false)
    setUsername('')
    setPassword('')
  }

  if (!ready) return null
  if (sessionError) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-4 py-10">
        <section className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-xl sm:p-8">
          <h1 className="text-xl font-bold">Admin tidak dapat dibuka</h1>
          <p className="mt-2 text-sm text-muted-foreground">{sessionError}</p>
        </section>
      </main>
    )
  }
  if (authenticated) return <AdminDashboard onLogout={handleLogout} role={role} />

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary glow-cyan">
            <Droplets className="size-6" />
          </span>
          <h1 className="mt-4 text-2xl font-bold">Login Admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Masuk untuk mengelola antrean dan transaksi BogelWash.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="admin-username" className="mb-1.5 block text-sm font-medium">
              Username
            </label>
            <input
              id="admin-username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
              className="mobile-readable-control w-full rounded-xl border border-input bg-secondary/40 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              className="mobile-readable-control w-full rounded-xl border border-input bg-secondary/40 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <LockKeyhole className="size-4" />
            Masuk ke Dashboard
          </button>
        </form>
      </section>
    </main>
  )
}