"use client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession } from "@/features/authentication"
import { ownership } from "@/services/ownership"
import type { Collection, OwnershipData } from "@/types/models"
export function useOwnership() {
  const session = useSession()
  return useQuery({
    queryKey: ["ownership", session.data?.id],
    queryFn: () => ownership.read(session.data!.id),
    enabled: !!session.data,
  })
}
export function useOwnershipActions() {
  const session = useSession(),
    client = useQueryClient()
  const userId = session.data?.id
  return {
    async save<K extends Collection>(
      collection: K,
      item: OwnershipData[K][number]
    ) {
      if (!userId) throw new Error("Sign in first.")
      await ownership.save(userId, collection, item)
      await client.invalidateQueries({ queryKey: ["ownership", userId] })
    },
    async remove(collection: Collection, id: string) {
      if (!userId) throw new Error("Sign in first.")
      await ownership.remove(userId, collection, id)
      await client.invalidateQueries({ queryKey: ["ownership", userId] })
    },
    async preferences(value: OwnershipData["preferences"]) {
      if (!userId) throw new Error("Sign in first.")
      await ownership.preferences(userId, value)
      await client.invalidateQueries({ queryKey: ["ownership", userId] })
    },
  }
}
