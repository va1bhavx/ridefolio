"use client"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import type { GarageBike, Motorcycle } from "@/types/models"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/shared/fields"
import { today } from "@/lib/formatters"
import { garageSchema } from "../schemas"
import { useOwnershipActions } from "../hooks"
export function GarageForm({
  bikes,
  existing,
  onClose,
  initialModel,
}: {
  bikes: Motorcycle[]
  existing?: GarageBike
  onClose: () => void
  initialModel?: string
}) {
  const initial =
      bikes.find((b) => b.id === (existing?.modelId || initialModel)) ||
      bikes[0],
    actions = useOwnershipActions(),
    [brand, setBrand] = useState(initial.brand)
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof garageSchema>>({
    resolver: zodResolver(garageSchema),
    defaultValues: existing || {
      modelId: initial.id,
      nickname: "",
      year: initial.years.at(-1),
      variant: initial.variants[0],
      purchaseDate: "",
      odometer: 0,
    },
  })
  const modelId = useWatch({ control, name: "modelId" }),
    model = bikes.find((b) => b.id === modelId) || initial
  function choose(id: string) {
    const b = bikes.find((m) => m.id === id)!
    setValue("modelId", id)
    setValue("year", b.years.at(-1)!)
    setValue("variant", b.variants[0])
  }
  async function submit(values: z.infer<typeof garageSchema>) {
    try {
      if (
        !model.years.includes(values.year) ||
        !model.variants.includes(values.variant)
      )
        throw new Error("Choose a supported year and variant.")
      if (values.purchaseDate > today())
        throw new Error("Purchase date cannot be in the future.")
      if (existing && values.odometer < existing.odometer)
        throw new Error(
          "Odometer cannot be lower than its current recorded reading."
        )
      await actions.save("garage", {
        ...values,
        id: existing?.id || crypto.randomUUID(),
      })
      toast.success(existing ? "Motorcycle updated" : "Welcome to the garage")
      onClose()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save motorcycle")
    }
  }
  return (
    <Dialog
      open
      onOpenChange={(v) => {
        if (!v) onClose()
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogTitle>
          {existing ? "Edit your motorcycle" : "Make room for a new ride"}
        </DialogTitle>
        <DialogDescription>
          Select a supported demonstration model.
        </DialogDescription>
        <form className="space-y-4" onSubmit={handleSubmit(submit)} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Manufacturer" id="brand">
              <select
                id="brand"
                className="control"
                value={brand}
                disabled={!!existing}
                onChange={(e) => {
                  setBrand(e.target.value)
                  choose(bikes.find((b) => b.brand === e.target.value)!.id)
                }}
              >
                {[...new Set(bikes.map((b) => b.brand))].map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </Field>
            <Field label="Model" id="modelId" error={errors.modelId?.message}>
              <select
                id="modelId"
                className="control"
                value={modelId}
                disabled={!!existing}
                onChange={(e) => choose(e.target.value)}
              >
                {bikes
                  .filter((b) => b.brand === brand)
                  .map((b) => (
                    <option value={b.id} key={b.id}>
                      {b.name}
                    </option>
                  ))}
              </select>
            </Field>
            <Field label="Model year" id="year">
              <select
                id="year"
                className="control"
                {...register("year", { valueAsNumber: true })}
              >
                {model.years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Variant" id="variant">
              <select id="variant" className="control" {...register("variant")}>
                {model.variants.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field
            label="Nickname (optional)"
            id="nickname"
            error={errors.nickname?.message}
          >
            <Input
              id="nickname"
              placeholder="The Sunday ritual"
              {...register("nickname")}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Purchase date (optional)" id="purchaseDate">
              <Input
                id="purchaseDate"
                type="date"
                max={today()}
                {...register("purchaseDate")}
              />
            </Field>
            <Field
              label="Current odometer · km"
              id="odometer"
              error={errors.odometer?.message}
            >
              <Input
                id="odometer"
                type="number"
                min={0}
                {...register("odometer", { valueAsNumber: true })}
              />
            </Field>
          </div>
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save motorcycle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
