"use client"

import { Atmosphere } from "@/components/atmosphere"
import { PainelView } from "@/components/painel-view"
import { OrganizerGate } from "@/components/organizer-gate"

export default function PainelPage() {
  return (
    <main className="relative min-h-dvh">
      <Atmosphere />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-16">
        <OrganizerGate>
          <PainelView />
        </OrganizerGate>
      </div>
    </main>
  )
}
