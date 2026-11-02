/** Number of lines CodeMirror shows for a document. Used to reserve height before the editor mounts. */
export function lineCount(value: string | undefined): number {
  return (value ?? '').split('\n').length;
}
