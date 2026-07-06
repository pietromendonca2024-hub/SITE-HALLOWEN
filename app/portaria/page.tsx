"use client"

import { Atmosphere } from "@/components/atmosphere"
import { PortariaView } from "@/components/portaria-view"
import { OrganizerGate } from "@/components/organizer-gate"

export default function PortariaPage() {
  return (
    <main className="relative min-h-dvh">
      <Atmosphere />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-16">
        <OrganizerGate>
          <PortariaView />
        </OrganizerGate>
      </div>
    </main>
  )
}
