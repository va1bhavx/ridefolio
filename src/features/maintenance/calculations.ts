import type { Reminder } from "@/types/models"
import { today } from "@/lib/formatters"
export function reminderStatus(
  reminder: Reminder,
  odometer: number,
  onDate = today()
): "Completed" | "Overdue" | "Due" | "Upcoming" {
  if (reminder.completed) return "Completed"
  if (reminder.date < onDate) return "Overdue"
  if (
    reminder.date === onDate ||
    (reminder.odometer !== undefined && odometer >= reminder.odometer)
  )
    return "Due"
  return "Upcoming"
}
