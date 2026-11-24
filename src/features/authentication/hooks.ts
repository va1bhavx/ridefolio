"use client"
import { useQuery } from "@tanstack/react-query"
import { authentication } from "@/services/authentication"
export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: () => authentication.session(),
    staleTime: 0,
  })
}
