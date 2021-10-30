export const ACTIONS = ['Convert'] as const;

export type Action = typeof ACTIONS[number];

export function isAction(maybeAction: string): maybeAction is Action {
  return ACTIONS.includes(maybeAction as Action);
}
