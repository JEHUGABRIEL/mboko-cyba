let showToastFn: ((msg: string) => void) | null = null;

export function showToast(message: string) {
  if (showToastFn) showToastFn(message);
}

export function setToastHandler(fn: (msg: string) => void) {
  showToastFn = fn;
}

export function clearToastHandler() {
  showToastFn = null;
}
