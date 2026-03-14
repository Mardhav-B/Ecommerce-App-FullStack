import { memo, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ShippingFormValues } from "@/services/checkout.api";
import type { SavedAddress } from "@/services/auth.api";
import { useAppStore } from "@/stores/app.store";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Enter a valid email"),
  phone: z.string().min(8, "Phone is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(4, "Zip code is required"),
  country: z.string().min(2, "Country is required"),
});

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
  const selectedCheckoutAddressId = useAppStore(
    (state) => state.selectedCheckoutAddressId,
  );
  const setSelectedCheckoutAddressId = useAppStore(
    (state) => state.setSelectedCheckoutAddressId,
  );
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ShippingFormValues>({
    resolver: zodResolver(checkoutSchema),
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
    setSelectedCheckoutAddressId(null);
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
  }, [defaultValues, reset, setSelectedCheckoutAddressId]);

  useEffect(() => {
    if (!savedAddresses.length) {
      setSelectedCheckoutAddressId(null);
      return;
    }

    const hasSelectedAddress = savedAddresses.some(
      (address) => address.id === selectedCheckoutAddressId,
    );

    if (!hasSelectedAddress) {
      setSelectedCheckoutAddressId(null);
    }
  }, [savedAddresses, selectedCheckoutAddressId, setSelectedCheckoutAddressId]);

  const applySavedAddress = (address: SavedAddress) => {
    setSelectedCheckoutAddressId(address.id);
    setValue("address", address.street);
    setValue("city", address.city);
    setValue("state", address.state);
    setValue("zipCode", address.zipCode);
    setValue("country", address.country);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl border border-biscuit-light bg-white p-4 shadow-sm sm:p-5 md:p-6"
    >
      <div className="mb-5 sm:mb-6">
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Shipping Details</h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter delivery information before moving to payment.
        </p>
      </div>

      {savedAddresses.length > 0 ? (
        <div className="mb-5 sm:mb-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Use saved address
          </label>
          <div className="relative">
            <select
              value={selectedCheckoutAddressId ?? ""}
              onChange={(event) => {
                const nextAddress = savedAddresses.find(
                  (address) => address.id === event.target.value,
                );

                if (nextAddress) {
                  applySavedAddress(nextAddress);
                  return;
                }

                setSelectedCheckoutAddressId(null);
              }}
              className="h-11 w-full appearance-none rounded-xl border border-biscuit-light bg-[linear-gradient(180deg,#fff_0%,#fcf8f3_100%)] px-3.5 pr-10 text-sm text-slate-700 shadow-sm outline-none transition duration-200 focus:border-biscuit focus:shadow-[0_0_0_4px_rgba(201,141,89,0.12)] sm:h-12 sm:px-4 sm:pr-11"
            >
              <option value="">Choose address</option>
              {savedAddresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.street}, {address.city}, {address.state}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      ) : null}

      <div className="grid gap-3.5 sm:gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
          <Input {...register("name")} className="h-11 rounded-xl border-biscuit-light" />
          {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
          <Input {...register("email")} className="h-11 rounded-xl border-biscuit-light" />
          {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
          <Input {...register("phone")} className="h-11 rounded-xl border-biscuit-light" />
          {errors.phone ? <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p> : null}
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">Address</label>
          <Input {...register("address")} className="h-11 rounded-xl border-biscuit-light" />
          {errors.address ? <p className="mt-1 text-xs text-red-600">{errors.address.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">City</label>
          <Input {...register("city")} className="h-11 rounded-xl border-biscuit-light" />
          {errors.city ? <p className="mt-1 text-xs text-red-600">{errors.city.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">State</label>
          <Input {...register("state")} className="h-11 rounded-xl border-biscuit-light" />
          {errors.state ? <p className="mt-1 text-xs text-red-600">{errors.state.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Zip Code</label>
          <Input {...register("zipCode")} className="h-11 rounded-xl border-biscuit-light" />
          {errors.zipCode ? <p className="mt-1 text-xs text-red-600">{errors.zipCode.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Country</label>
          <Input {...register("country")} className="h-11 rounded-xl border-biscuit-light" />
          {errors.country ? <p className="mt-1 text-xs text-red-600">{errors.country.message}</p> : null}
        </div>
      </div>

      <Button
        type="submit"
        className="mt-5 h-11 w-full bg-biscuit text-white hover:bg-biscuit-dark sm:mt-6 sm:h-12"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Redirecting..." : "Continue to Payment"}
      </Button>
    </form>
  );
}

const CheckoutForm = memo(CheckoutFormComponent);

export default CheckoutForm;
