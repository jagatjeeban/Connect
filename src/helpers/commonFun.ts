type VerticalItemLayout = {
  height: number;
  y: number;
};

/**
 * Finds the scrubber letter whose vertical center is closest to a touch point.
 *
 * @param locationY - Touch position relative to the scrubber rail.
 * @param letters - Ordered letters available in the scrubber.
 * @param letterLayouts - Measured vertical layouts keyed by letter.
 * @returns The nearest measured letter, or `null` when none can be resolved.
 */
export const getNearestScrubberLetter = (
  locationY: number,
  letters: readonly string[],
  letterLayouts: Readonly<Record<string, VerticalItemLayout>>,
): string | null => {
  let closestLetter: string | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const letter of letters) {
    const layout = letterLayouts[letter];

    if (!layout) continue;

    const centerY = layout.y + layout.height / 2;
    const nextDistance = Math.abs(locationY - centerY);

    if (nextDistance < closestDistance) {
      closestDistance = nextDistance;
      closestLetter = letter;
    }
  }

  return closestLetter;
};
