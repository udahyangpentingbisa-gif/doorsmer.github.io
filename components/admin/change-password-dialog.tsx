'use client'

import { useState } from 'react'
import { KeyRound, X } from 'lucide-react'

const inputCls =
  'mobile-readable-control w-full rounded-xl border border-input bg-secondary/40 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'
const labelCls = 'mb-1.5 block text-sm font-medium'

export function ChangePasswordDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!open) return null

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/admin/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: data.get('currentPassword'),
          newPassword: data.get('newPassword'),
          confirmPassword: data.get('confirmPassword'),
        }),
      })
      const body = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) throw new Error(body?.error || 'Password gagal disimpan.')

      form.reset()
      setSuccess(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Password gagal disimpan.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleClose() {
    if (submitting) return
    setError(null)
    setSuccess(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 glow-cyan"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="size-5 text-primary" />
            <h3 id="change-password-title" className="text-lg font-semibold">
              Ganti Password Admin
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Password baru akan langsung digunakan untuk login berikutnya.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="current-password" className={labelCls}>Password Lama</label>
            <input id="current-password" name="currentPassword" type="password" required autoComplete="current-password" className={inputCls} />
          </div>
          <div>
            <label htmlFor="new-password" className={labelCls}>Password Baru</label>
            <input id="new-password" name="newPassword" type="password" required minLength={8} autoComplete="new-password" className={inputCls} />
            <p className="mt-1 text-xs text-muted-foreground">Minimal 8 karakter.</p>
          </div>
          <div>
            <label htmlFor="confirm-password" className={labelCls}>Konfirmasi Password Baru</label>
            <input id="confirm-password" name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" className={inputCls} />
          </div>

          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          {success && <p role="status" className="text-sm text-success">Password berhasil diganti.</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleClose} disabled={submitting} className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-secondary">
              Tutup
            </button>
            <button type="submit" disabled={submitting} className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
              {submitting ? 'Menyimpan...' : 'Simpan Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}