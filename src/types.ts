export const GATES = [
	"AND",
	"NAND",
	"NOR",
	"NOT",
	"OR",
	"XNOR",
	"XOR",
] as const;

export type Gate = (typeof GATES)[number];
