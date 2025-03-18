import type { ColumnRule } from "./columnRule";
import type { FoundationRule } from "./foundationRule";
import type { FreecellRule } from "./freecellRule";

export type Rule = ColumnRule | FreecellRule | FoundationRule;
