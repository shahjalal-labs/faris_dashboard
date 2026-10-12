type GuardOptions = {
  canEdit: boolean;
  onBlocked?: () => void;
};

export const guardAction = <T extends (...args: any[]) => void>(
  action: T,
  { canEdit, onBlocked }: GuardOptions
) => {
  return (...args: Parameters<T>) => {
    if (!canEdit) {
      onBlocked?.();
      return;
    }
    action(...args);
  };
};