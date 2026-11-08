"use client";

import { BrochureBlock } from "@/components/shared/brochure-block";
import { emptyBookingBlueprint } from "@/components/bookings/blueprint";
import { bookingTemplates } from "@/components/bookings/templates";
import type {
  BrochureBlockProps,
  BrochureBookingContent,
} from "@/types/brochure";

export function Booking({
  instanceId = "BrochureBooking_1",
  data = emptyBookingBlueprint(),
}: BrochureBlockProps<BrochureBookingContent>) {
  const Template = bookingTemplates[data.variant] ?? bookingTemplates.widget;
  return (
    <BrochureBlock size={data.sectionSize}>
      <Template instanceId={instanceId} data={data} />
    </BrochureBlock>
  );
}

Booking.displayName = "BrochureBooking";

export const BrochureBooking = Booking;
