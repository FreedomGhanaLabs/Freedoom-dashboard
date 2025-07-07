export interface Heading<T> {
  title: string;
  key: keyof T;
}

/**
 * Triggers a download of `rows` as CSV, using `headings` for the header row.
 *
 * @param headings  Array of `{ title, key }` where `key` is a property of T
 * @param rows      Array of data objects
 * @param filename  Name of the downloaded file (defaults to "data.csv")
 */
export function downloadCSV<T>(
  headings: Heading<T>[],
  rows: T[],
  filename = 'data.csv'
) {
  // Build header
  const headerRow = headings.map(h => `"${h.title.replace(/"/g, '""')}"`).join(',') + '\r\n';

  // Build data rows
  const dataRows = rows
    .map(row =>
      headings
        .map(h => {
          const cell = row[h.key] ?? '';
          return `"${String(cell).replace(/"/g, '""')}"`;
        })
        .join(',')
    )
    .join('\r\n');

  // Create blob and download link
  const blob = new Blob([headerRow + dataRows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
