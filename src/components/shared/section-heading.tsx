import type { ReactNode } from "react";
import { TextSlot, hasSlotText } from "@/components/shared/text-slot";
import { fieldPath } from "@/components/shared/field-path";
import styles from "./section-heading.module.scss";

type HeadingTag = "h1" | "h2" | "h3";

type SectionHeadingProps = {
  instanceId: string;
  eyebrow?: string;
  title: string;
  titlePath?: string;
  titleAs?: HeadingTag;
  titleId?: string;
  className?: string;
  as?: "div" | "header";
  eyebrowClassName: string;
  titleClassName: string;
  titleInnerClassName?: string;
  children?: ReactNode;
};

/**
 * Eyebrow + title. A blank eyebrow is omitted (no schema/path placeholder).
 * The title keeps its own type styles and sits in the eyebrow's layout slot.
 */
export function SectionHeading({
  instanceId,
  eyebrow = "",
  title,
  titlePath = "title",
  titleAs = "h2",
  titleId,
  className,
  as: Wrapper = "div",
  eyebrowClassName,
  titleClassName,
  titleInnerClassName,
  children,
}: SectionHeadingProps) {
  const hasEyebrow = hasSlotText(eyebrow);
  const Tag = titleAs;
  const headingClass = hasEyebrow
    ? titleClassName
    : `${titleClassName} ${styles.flush}`.trim();

  return (
    <Wrapper className={className} data-eyebrow={hasEyebrow ? "on" : "off"}>
      {hasEyebrow ? (
        <TextSlot
          value={eyebrow}
          jsonPath={fieldPath(instanceId, "eyebrow")}
          as="p"
          className={eyebrowClassName}
        />
      ) : null}
      {children ??
        (titleInnerClassName || titleId ? (
          <Tag id={titleId} className={headingClass}>
            <TextSlot
              value={title}
              jsonPath={fieldPath(instanceId, titlePath)}
              as="span"
              className={titleInnerClassName}
            />
          </Tag>
        ) : (
          <TextSlot
            value={title}
            jsonPath={fieldPath(instanceId, titlePath)}
            as={titleAs}
            className={headingClass}
          />
        ))}
    </Wrapper>
  );
}
