'use client'

import { useEffect, useState } from 'react'
import { KeyRound, Plus, ShieldCheck, Trash2, UserRound, UserRoundX } from 'lucide-react'

type StaffUser = {
  id: string
  username: string
  active: boolean
  createdAt: string
}

const inputCls =
  'mobile-readable-control w-full rounded-xl border border-input bg-secondary/40 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30'

export function StaffManagement() {
  const [staff, setStaff] = useState<StaffUser[]>([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function loadStaff() {
    const response = await fetch('/api/admin/users', { cache: 'no-store' })
    const body = (await response.json().catch(() => null)) as { users?: StaffUser[]; error?: string } | null
    if (!response.ok) throw new Error(body?.error || 'Staff gagal dimuat.')
    setStaff((body?.users || []).filter((user) => user.username !== 'admin'))
  }

  useEffect(() => {
    loadStaff().catch((cause) => setError(cause instanceof Error ? cause.message : 'Staff gagal dimuat.')).finally(() => setLoading(false))
  }, [])

  async function addStaff(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const body = (await response.json().catch(() => null)) as { user?: StaffUser; error?: string } | null
      if (!response.ok) throw new Error(body?.error || 'Staff gagal dibuat.')
      if (body?.user) setStaff((current) => [body.user!, ...current])
      setUsername('')
      setPassword('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Staff gagal dibuat.')
    } finally {
      setSubmitting(false)
    }
  }

  async function toggleStaff(user: StaffUser) {
    const response = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id, active: !user.active }),
    })
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null
      setError(body?.error || 'Status staff gagal diperbarui.')
      return
    }
    setStaff((current) => current.map((item) => item.id === user.id ? { ...item, active: !item.active } : item))
  }

  async function resetPassword(user: StaffUser) {
    const nextPassword = window.prompt(`Password baru untuk ${user.username} (minimal 8 karakter):`)
    if (!nextPassword) return
    const response = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id, password: nextPassword }),
    })
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null
      setError(body?.error || 'Password gagal direset.')
      return
    }
    setError('Password staff berhasil direset.')
  }

  async function deleteStaff(user: StaffUser) {
    if (!window.confirm(`Hapus staff ${user.username}?`)) return
    const response = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id }),
    })
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null
      setError(body?.error || 'Staff gagal dihapus.')
      return
    }
    setStaff((current) => current.filter((item) => item.id !== user.id))
  }

  return (
    <section className="mt-8 border-t border-border/60 pt-8">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <ShieldCheck className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">Manajemen Staff</h2>
          <p className="mt-1 text-sm text-muted-foreground">Kelola akun yang dapat mengakses antrean dan transaksi.</p>
        </div>
      </div>

      <form onSubmit={addStaff} className="mt-5 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label className="text-sm font-medium">Username<input value={username} onChange={(event) => setUsername(event.target.value)} className={`${inputCls} mt-1.5`} required /></label>
        <label className="text-sm font-medium">Password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={8} className={`${inputCls} mt-1.5`} required /></label>
        <button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"><Plus className="size-4" />Tambah Staff</button>
      </form>

      {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        {loading ? <p className="p-4 text-sm text-muted-foreground">Memuat staff...</p> : staff.length === 0 ? <p className="p-4 text-sm text-muted-foreground">Belum ada akun staff.</p> : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-secondary/50 text-muted-foreground"><tr><th className="px-4 py-3 font-medium">Username</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 text-right font-medium">Aksi</th></tr></thead>
            <tbody className="divide-y divide-border">
              {staff.map((user) => <tr key={user.id}><td className="px-4 py-3"><span className="inline-flex items-center gap-2"><UserRound className="size-4 text-primary" />{user.username}</span></td><td className="px-4 py-3">{user.active ? <span className="text-success">Aktif</span> : <span className="text-muted-foreground">Nonaktif</span>}</td><td className="px-4 py-3"><div className="flex justify-end gap-2"><button type="button" onClick={() => toggleStaff(user)} title={user.active ? 'Nonaktifkan staff' : 'Aktifkan staff'} className="rounded-lg border border-border p-2 hover:bg-secondary">{user.active ? <UserRoundX className="size-4" /> : <UserRound className="size-4" />}</button><button type="button" onClick={() => resetPassword(user)} title="Reset password" className="rounded-lg border border-border p-2 hover:bg-secondary"><KeyRound className="size-4" /></button><button type="button" onClick={() => deleteStaff(user)} title="Hapus staff" className="rounded-lg border border-destructive/40 p-2 text-destructive hover:bg-destructive/10"><Trash2 className="size-4" /></button></div></td></tr>)}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}