import { Transform } from 'class-transformer';

export function Trim() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed === '' ? undefined : trimmed;
    }
    return value;
  });
}
