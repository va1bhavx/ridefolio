"use client"
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
  type Resolver,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field } from "./fields"
export interface EditorField<T extends FieldValues> {
  name: Path<T>
  label: string
  type?: "text" | "number" | "date" | "textarea" | "checkbox" | "select"
  options?: { value: string; label: string }[]
  hint?: string
  max?: string
  step?: string
}
export function RecordEditor<T extends FieldValues>({
  title,
  description,
  schema,
  defaults,
  fields,
  onSave,
  onClose,
}: {
  title: string
  description: string
  schema: z.ZodType<T, T>
  defaults: DefaultValues<T>
  fields: EditorField<T>[]
  onSave: (v: T) => Promise<void>
  onClose: () => void
}) {
  const { register, handleSubmit, getFieldState, formState } = useForm<T>({
    resolver: zodResolver(schema) as Resolver<T>,
    defaultValues: defaults,
  })
  return (
    <Dialog
      open
      onOpenChange={(v) => {
        if (!v) onClose()
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        <form
          noValidate
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={handleSubmit(async (v) => {
            try {
              await onSave(v)
              toast.success("Record saved")
              onClose()
            } catch (e) {
              toast.error(
                e instanceof Error ? e.message : "Could not save this record."
              )
            }
          })}
        >
          {fields.map((f) => {
            const error = getFieldState(f.name, formState).error?.message
            const id = `record-${f.name}`
            const props = {
              ...register(f.name, { valueAsNumber: f.type === "number" }),
              id,
              "aria-invalid": !!error,
              "aria-describedby": error ? `${id}-error` : undefined,
            }
            return (
              <div
                key={f.name}
                className={
                  f.type === "textarea" || f.type === "checkbox"
                    ? "sm:col-span-2"
                    : ""
                }
              >
                {f.type === "checkbox" ? (
                  <label className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      className="size-4 accent-primary"
                      {...props}
                    />
                    {f.label}
                  </label>
                ) : (
                  <Field id={id} label={f.label} error={error}>
                    {f.type === "select" ? (
                      <select className="control" {...props}>
                        {f.options?.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    ) : f.type === "textarea" ? (
                      <Textarea rows={3} {...props} />
                    ) : (
                      <Input
                        type={f.type || "text"}
                        step={
                          f.step || (f.type === "number" ? "any" : undefined)
                        }
                        max={f.max}
                        {...props}
                      />
                    )}
                  </Field>
                )}
                {f.hint && (
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {f.hint}
                  </p>
                )}
              </div>
            )
          })}
          <div className="flex justify-end gap-3 border-t pt-4 sm:col-span-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={formState.isSubmitting} type="submit">
              {formState.isSubmitting ? "Saving…" : "Save record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
