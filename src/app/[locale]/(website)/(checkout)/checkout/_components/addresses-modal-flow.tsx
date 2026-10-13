'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRouter } from '@/i18n/navigation';
import { AddressFormSchema } from '@/lib/schema/address.schema';
import { Address } from '@/lib/types/user-addresses';
import { cn } from '@/lib/utility/tailwind-merge';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { useAddAddress } from '../_hooks/use-add-address';
import { useDeleteAddress } from '../_hooks/use-delete-address';
import { useUpdateAddress } from '../_hooks/use-update-address';
import AddressForm from './add-address-form';
import AddressSelector from './address-selector';

const MapSelector = dynamic(() => import('./map-selector'), {
  loading: () => (
    <div
      aria-busy="true"
      className="h-[400px] w-full animate-pulse rounded-lg bg-muted"
    />
  ),
});

interface AddressesModalProps {
  userAddresses: Address[];
  trigger?: React.ReactNode;
}

type DialogStep = 'list' | 'form' | 'map';

const emptyFormData: Partial<AddressFormSchema> = {
  username: '',
  city: '',
  street: '',
  phone: '',
  lat: '',
  long: '',
};

export function AddressesModalFlow({
  userAddresses,
  trigger,
}: AddressesModalProps) {
  // Translations
  const t = useTranslations('my-addresses');

  // State
  const [step, setStep] = useState<DialogStep>('list');
  const [open, setOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [formData, setFormData] =
    useState<Partial<AddressFormSchema>>(emptyFormData);

  // Hooks
  const router = useRouter();
  const { isPending: isAddPending, addAddress } = useAddAddress();
  const { pendingUpdate, updateAddress } = useUpdateAddress();
  const { pendingDelete, deleteAddress } = useDeleteAddress();

  const isPending = [isAddPending, pendingUpdate].some(Boolean);

  // Functions
  const resetForm = () => {
    setFormData(emptyFormData);
    setEditingAddressId(null);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setStep('list');
      resetForm();
    }
  };

  const handleEditAddress = (address: Address) => {
    setFormData({
      username: address.username,
      city: address.city,
      street: address.street,
      phone: address.phone,
    });
    setEditingAddressId(address._id);
    setStep('form');
  };

  const handleFormComplete = (
    data: Omit<AddressFormSchema, 'lat' | 'long'>,
  ) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep('map');
  };

  const handleMapSubmit = (location: { lat: number; lng: number }) => {
    const completeData: AddressFormSchema = {
      ...formData,
      lat: location.lat.toString(),
      long: location.lng.toString(),
    } as AddressFormSchema;

    const onSuccess = () => {
      resetForm();
      router.refresh();
      setStep('list');
    };

    if (editingAddressId) {
      updateAddress(
        { id: editingAddressId, data: completeData },
        { onSuccess },
      );
    } else {
      addAddress(completeData, { onSuccess });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* Modal Button */}
      <DialogTrigger asChild>
        {trigger || (
          <Button
            className="mb-9 w-full rounded-xl py-6 text-base font-medium dark:bg-softpink-300 dark:text-black dark:hover:bg-softpink-400"
            variant={'secondary'}
          >
            {t('open-address-book')}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className={cn(
          'scrollbar-gutter-stable h-[85vh] max-w-3xl overflow-y-auto dark:bg-zinc-800',
          step !== 'list' && 'py-4',
          step === 'list' && 'h-[75vh]',
        )}
      >
        {/* Dialog Header */}
        <DialogHeader className="mt-2 flex flex-row items-start justify-between gap-4 space-y-0">
          <DialogTitle className="text-start text-2xl font-bold">
            {step === 'list' && t('my-addresses')}
            {(step === 'form' || step === 'map') &&
              (editingAddressId ? t('update-address') : t('add-new-address'))}
          </DialogTitle>

          {step === 'list' && (
            <Button
              onClick={() => {
                resetForm();
                setStep('form');
              }}
              className="shrink-0 bg-maroon-50 text-maroon-600 hover:bg-maroon-100"
            >
              {t('add-new-address')}
            </Button>
          )}
        </DialogHeader>

        {/* Steps */}
        {step === 'list' && (
          <AddressSelector
            userAddresses={userAddresses}
            onEditAddress={handleEditAddress}
            onDeleteAddress={deleteAddress}
            pendingDelete={pendingDelete}
          />
        )}

        {step === 'form' && (
          <AddressForm
            data={formData as AddressFormSchema}
            onBack={() => setStep('list')}
            onFormComplete={handleFormComplete}
          />
        )}

        {step === 'map' && (
          <MapSelector
            initialPosition={
              formData.lat && formData.long
                ? {
                    lat: parseFloat(formData.lat),
                    lng: parseFloat(formData.long),
                  }
                : undefined
            }
            onSubmit={handleMapSubmit}
            onBack={() => setStep('form')}
            isPending={isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
