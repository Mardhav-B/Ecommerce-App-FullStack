import { memo, useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ShippingFormValues } from "@/services/checkout.api";
import type { SavedAddress } from "@/services/auth.api";

interface CheckoutFormProps {
  defaultValues?: Partial<ShippingFormValues>;
  savedAddresses?: SavedAddress[];
  onSubmit: (values: ShippingFormValues) => void;
  isSubmitting?: boolean;
}

function CheckoutFormComponent({
  defaultValues,
  savedAddresses = [],
  onSubmit,
  isSubmitting = false,
}: CheckoutFormProps) {
  const { register, handleSubmit, reset, setValue } = useForm<ShippingFormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      ...defaultValues,
    },
  });

  useEffect(() => {
    reset({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      ...defaultValues,
    });
  }, [defaultValues, reset]);

  const applySavedAddress = (address: SavedAddress) => {
    setValue("address", address.street);
    setValue("city", address.city);
    setValue("state", address.state);
    setValue("zipCode", address.zipCode);
    setValue("country", address.country);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl border border-biscuit-light bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">Shipping Details</h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter delivery information before moving to payment.
        </p>
      </div>

      {savedAddresses.length > 0 ? (
        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-slate-700">Use saved address</p>
          <div className="grid gap-3">
            {savedAddresses.map((address) => (
              <button
                key={address.id}
                type="button"
                onClick={() => applySavedAddress(address)}
                className="rounded-xl border border-biscuit-light bg-biscuit-light/35 p-4 text-left transition hover:border-biscuit hover:bg-biscuit-light/60"
              >
                <p className="text-sm font-medium text-slate-900">{address.street}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  {address.city}, {address.state}, {address.country} - {address.zipCode}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
          <Input {...register("name")} className="h-11 rounded-xl border-biscuit-light" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
          <Input {...register("email")} className="h-11 rounded-xl border-biscuit-light" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
          <Input {...register("phone")} className="h-11 rounded-xl border-biscuit-light" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">Address</label>
          <Input {...register("address")} className="h-11 rounded-xl border-biscuit-light" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">City</label>
          <Input {...register("city")} className="h-11 rounded-xl border-biscuit-light" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">State</label>
          <Input {...register("state")} className="h-11 rounded-xl border-biscuit-light" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Zip Code</label>
          <Input {...register("zipCode")} className="h-11 rounded-xl border-biscuit-light" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Country</label>
          <Input {...register("country")} className="h-11 rounded-xl border-biscuit-light" />
        </div>
      </div>

      <Button
        type="submit"
        className="mt-6 h-12 w-full bg-biscuit text-white hover:bg-biscuit-dark"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Redirecting..." : "Continue to Payment"}
      </Button>
    </form>
  );
}

const CheckoutForm = memo(CheckoutFormComponent);

export default CheckoutForm;
