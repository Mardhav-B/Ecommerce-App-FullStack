import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPinHouse, Pencil, Plus, LogOut, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { useOrders } from "../hooks/useOrders";
import {
  deleteAddress,
  logoutUser,
  saveAddress,
  updateAddress,
  type SavedAddress,
} from "../services/auth.api";
import { isOrderMarkedPaid } from "../services/order.api";
import { Skeleton } from "../components/ui/skeleton";

interface AddressForm {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

const addressSchema = z.object({
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  zipCode: z.string().min(4, "ZIP code is required"),
});

export default function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user, isLoading, isError } = useAuth();
  const { data: orders = [] } = useOrders();
  const [visible, setVisible] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
  });

  const addressMutation = useMutation({
    mutationFn: (data: AddressForm) =>
      editingAddress ? updateAddress(editingAddress.id, data) : saveAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      reset();
      setEditingAddress(null);
      setSaveMessage(
        editingAddress ? "Address updated successfully." : "Address saved successfully.",
      );
    },
    onError: (error) => {
      setSaveMessage(
        error instanceof Error ? error.message : "Failed to save address",
      );
    },
  });
  const deleteAddressMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setSaveMessage("Address removed successfully.");
      if (editingAddress) {
        setEditingAddress(null);
        reset();
      }
    },
    onError: (error) => {
      setSaveMessage(
        error instanceof Error ? error.message : "Failed to delete address",
      );
    },
  });

  const handleLogout = async () => {
    await logoutUser();
    queryClient.removeQueries({ queryKey: ["authUser"] });
    navigate("/");
  };

  useEffect(() => {
    if (!isLoading && user) {
      setVisible(true);
    }
  }, [isLoading, user]);

  const startEditingAddress = (address: SavedAddress) => {
    setEditingAddress(address);
    setSaveMessage(null);
    reset({
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      zipCode: address.zipCode,
    });
  };

  const cancelEditingAddress = () => {
    setEditingAddress(null);
    reset();
    setSaveMessage(null);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#fcf5ee_0%,#f3e5d6_100%)] px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <Skeleton className="h-48 w-full rounded-[2rem]" />
          <Skeleton className="h-80 w-full rounded-[2rem]" />
        </div>
      </main>
    );
  }

  if (isError || !user) {
    navigate("/auth");
    return null;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fcf5ee_0%,#f3e5d6_100%)] px-4 py-10">
      <div
        className={`mx-auto max-w-6xl space-y-8 transition-all duration-500 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#e7ba8f_0%,#c98d59_100%)] p-8 text-white shadow-[0_30px_90px_rgba(106,70,39,0.18)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/75">
                Your profile
              </p>
              <h1 className="mt-3 text-4xl font-semibold">{user.name}</h1>
              <p className="mt-2 text-white/85">{user.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-biscuit-light text-biscuit-dark">
                <MapPinHouse className="size-5" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Saved Addresses
                </h2>
                <p className="text-sm text-slate-500">
                  Store delivery addresses the way large marketplaces do.
                </p>
              </div>
            </div>

            {user.addresses && user.addresses.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {user.addresses.map((address) => (
                  <div
                    key={address.id}
                    className="rounded-[1.5rem] border border-biscuit-light bg-[linear-gradient(180deg,#fff_0%,#fcf3ea_100%)] p-5"
                  >
                    <div className="mb-3 inline-flex rounded-full bg-biscuit-light px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-biscuit-dark">
                      Delivery address
                    </div>
                    <p className="text-sm leading-7 text-slate-700">
                      {address.street}
                      <br />
                      {address.city}, {address.state}
                      <br />
                      {address.country} - {address.zipCode}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEditingAddress(address)}
                        className="inline-flex items-center gap-2 rounded-full border border-biscuit/25 px-3 py-2 text-xs font-semibold text-biscuit-dark transition hover:border-biscuit"
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteAddressMutation.mutate(address.id)}
                        disabled={deleteAddressMutation.isPending}
                        className="inline-flex items-center gap-2 rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                      >
                        <Trash2 className="size-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-biscuit-light bg-biscuit-light/35 p-8 text-center text-slate-500">
                No saved addresses yet.
              </div>
            )}
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-biscuit-light text-biscuit-dark">
                <Plus className="size-5" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h2>
                <p className="text-sm text-slate-500">
                  {editingAddress
                    ? "Update this saved address for future checkouts."
                    : "Save a shipping address for your next checkout."}
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit((data) => addressMutation.mutate(data))}
              className="space-y-4"
            >
              {(
                [
                  ["street", "Street address"],
                  ["city", "City"],
                  ["state", "State"],
                  ["country", "Country"],
                  ["zipCode", "ZIP code"],
                ] as const
              ).map(([field, label]) => (
                <label key={field} className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    {label}
                  </span>
                  <input
                    {...register(field)}
                    placeholder={label}
                    className="h-12 w-full rounded-2xl border border-biscuit/25 bg-[#fffaf6] px-4 outline-none transition focus:border-biscuit"
                  />
                  {errors[field] ? (
                    <p className="mt-1 text-xs text-red-600">
                      {errors[field]?.message}
                    </p>
                  ) : null}
                </label>
              ))}

              {saveMessage ? (
                <div className="rounded-2xl border border-biscuit/20 bg-biscuit-light/50 px-4 py-3 text-sm text-slate-700">
                  {saveMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={addressMutation.isPending}
                className="w-full rounded-2xl bg-biscuit py-3 font-semibold text-white transition hover:bg-biscuit-dark disabled:opacity-60"
              >
                {addressMutation.isPending
                  ? "Saving..."
                  : editingAddress
                    ? "Update Address"
                    : "Save Address"}
              </button>

              {editingAddress ? (
                <button
                  type="button"
                  onClick={cancelEditingAddress}
                  className="w-full rounded-2xl border border-biscuit/25 py-3 font-semibold text-biscuit-dark transition hover:border-biscuit"
                >
                  Cancel Editing
                </button>
              ) : null}
            </form>
          </section>
        </div>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">
              Recent Orders
            </h2>
            <p className="text-sm text-slate-500">
              Quick access to the latest orders from your account.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-biscuit-light bg-biscuit-light/20 p-6 text-sm text-slate-500">
              No orders yet.
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="rounded-[1.25rem] border border-biscuit-light bg-[linear-gradient(180deg,#fff_0%,#fcf3ea_100%)] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {order.id}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-biscuit-dark">
                        ${order.totalPrice.toFixed(2)}
                      </p>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        {isOrderMarkedPaid(order.id) ? "PAID" : order.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    {order.items.slice(0, 2).map((item) => (
                      <p key={item.id} className="text-xs text-slate-500">
                        {item.product.name} x {item.quantity}
                      </p>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-biscuit/25 px-4 py-2 text-xs font-semibold text-biscuit-dark transition hover:border-biscuit"
                  >
                    <ShoppingBag className="size-3.5" />
                    View Order
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
