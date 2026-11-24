import type { Feedback } from "@/types/models"
import { persistence } from "./persistence"
export interface FeedbackRepository {
  save(feedback: Feedback): Promise<void>
  list(): Promise<Feedback[]>
}
export const feedbackRepository: FeedbackRepository = {
  async save(feedback) {
    const entries = persistence.read<Feedback[]>("feedback", [])
    persistence.write("feedback", [...entries, feedback])
  },
  async list() {
    return persistence.read<Feedback[]>("feedback", [])
  },
}
