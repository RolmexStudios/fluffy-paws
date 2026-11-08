export function hasSlotText(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

export function TextSlot({
  value,
  jsonPath,
  as = "span",
  className = "",
  placeholderClassName = "text-[#9a8f85] italic",
  hideWhenEmpty = false,
}: {
  value: string;
  jsonPath: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4";
  className?: string;
  placeholderClassName?: string;
  /** Skip the json-path placeholder when the slot is blank. */
  hideWhenEmpty?: boolean;
}) {
  const trimmed = value.trim();
  if (trimmed) {
    const Tag = as;
    return <Tag className={className}>{trimmed}</Tag>;
  }

  if (hideWhenEmpty) {
    return null;
  }

  const Tag = as;
  return (
    <Tag className={`${className} ${placeholderClassName}`}>
      <span className="font-mono text-xs not-italic opacity-80">{jsonPath}</span>
    </Tag>
  );
}
