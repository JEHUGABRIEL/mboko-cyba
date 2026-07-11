export type ToastKind = 'success' | 'error';

let showToastFn: ((toast: { message: string; kind: ToastKind }) => void) | null = null;

export function showToast(message: string, kind: ToastKind = 'success') {
  if (showToastFn) showToastFn({ message, kind });
}

export function setToastHandler(fn: (toast: { message: string; kind: ToastKind }) => void) {
  showToastFn = fn;
}

export function clearToastHandler() {
  showToastFn = null;
}
