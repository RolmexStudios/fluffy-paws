import type { ComponentType } from "react";
import type {
  BrochureBlockProps,
  BrochureBookingContent,
  BrochureBookingVariant,
} from "@/types/brochure";
import { WidgetBooking } from "@/components/bookings/templates/widget/WidgetBooking";

export type BookingTemplateComponent = ComponentType<
  BrochureBlockProps<BrochureBookingContent>
>;

export const bookingTemplates: Record<
  BrochureBookingVariant,
  BookingTemplateComponent
> = {
  widget: WidgetBooking,
};
