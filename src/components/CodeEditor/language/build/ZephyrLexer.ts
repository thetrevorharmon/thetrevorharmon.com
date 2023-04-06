// Generated from grammar/ZephyrLexer.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { CharStream } from "antlr4ts/CharStream";
import { Lexer } from "antlr4ts/Lexer";
import { LexerATNSimulator } from "antlr4ts/atn/LexerATNSimulator";
import { NotNull } from "antlr4ts/Decorators";
import { Override } from "antlr4ts/Decorators";
import { RuleContext } from "antlr4ts/RuleContext";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";


export class ZephyrLexer extends Lexer {
	public static readonly CONST = 1;
	public static readonly LET = 2;
	public static readonly ASSIGN = 3;
	public static readonly SEMICOLON = 4;
	public static readonly BLOCK_COMMENT = 5;
	public static readonly LINE_COMMENT = 6;
	public static readonly NUMBER = 7;
	public static readonly STRING = 8;
	public static readonly IDENTIFIER = 9;
	public static readonly WHITESPACE = 10;

	// tslint:disable:no-trailing-whitespace
	public static readonly channelNames: string[] = [
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN",
	];

	// tslint:disable:no-trailing-whitespace
	public static readonly modeNames: string[] = [
		"DEFAULT_MODE",
	];

	public static readonly ruleNames: string[] = [
		"CONST", "LET", "ASSIGN", "SEMICOLON", "BLOCK_COMMENT", "LINE_COMMENT", 
		"NUMBER", "STRING", "IDENTIFIER", "WHITESPACE",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'const'", "'let'", "'='", "';'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "CONST", "LET", "ASSIGN", "SEMICOLON", "BLOCK_COMMENT", "LINE_COMMENT", 
		"NUMBER", "STRING", "IDENTIFIER", "WHITESPACE",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(ZephyrLexer._LITERAL_NAMES, ZephyrLexer._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return ZephyrLexer.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace


	constructor(input: CharStream) {
		super(input);
		this._interp = new LexerATNSimulator(ZephyrLexer._ATN, this);
	}

	// @Override
	public get grammarFileName(): string { return "ZephyrLexer.g4"; }

	// @Override
	public get ruleNames(): string[] { return ZephyrLexer.ruleNames; }

	// @Override
	public get serializedATN(): string { return ZephyrLexer._serializedATN; }

	// @Override
	public get channelNames(): string[] { return ZephyrLexer.channelNames; }

	// @Override
	public get modeNames(): string[] { return ZephyrLexer.modeNames; }

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x02\fX\b\x01\x04" +
		"\x02\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04" +
		"\x07\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x03\x02\x03\x02\x03" +
		"\x02\x03\x02\x03\x02\x03\x02\x03\x03\x03\x03\x03\x03\x03\x03\x03\x04\x03" +
		"\x04\x03\x05\x03\x05\x03\x06\x03\x06\x03\x06\x03\x06\x07\x06*\n\x06\f" +
		"\x06\x0E\x06-\v\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x07\x03" +
		"\x07\x03\x07\x03\x07\x07\x078\n\x07\f\x07\x0E\x07;\v\x07\x03\x07\x03\x07" +
		"\x03\b\x06\b@\n\b\r\b\x0E\bA\x03\t\x03\t\x07\tF\n\t\f\t\x0E\tI\v\t\x03" +
		"\t\x03\t\x03\n\x06\nN\n\n\r\n\x0E\nO\x03\v\x06\vS\n\v\r\v\x0E\vT\x03\v" +
		"\x03\v\x04+G\x02\x02\f\x03\x02\x03\x05\x02\x04\x07\x02\x05\t\x02\x06\v" +
		"\x02\x07\r\x02\b\x0F\x02\t\x11\x02\n\x13\x02\v\x15\x02\f\x03\x02\x06\x05" +
		"\x02\f\f\x0F\x0F\u202A\u202B\x03\x022;\x04\x02C\\c|\x05\x02\v\f\x0E\x0F" +
		"\"\"\x02]\x02\x03\x03\x02\x02\x02\x02\x05\x03\x02\x02\x02\x02\x07\x03" +
		"\x02\x02\x02\x02\t\x03\x02\x02\x02\x02\v\x03\x02\x02\x02\x02\r\x03\x02" +
		"\x02\x02\x02\x0F\x03\x02\x02\x02\x02\x11\x03\x02\x02\x02\x02\x13\x03\x02" +
		"\x02\x02\x02\x15\x03\x02\x02\x02\x03\x17\x03\x02\x02\x02\x05\x1D\x03\x02" +
		"\x02\x02\x07!\x03\x02\x02\x02\t#\x03\x02\x02\x02\v%\x03\x02\x02\x02\r" +
		"3\x03\x02\x02\x02\x0F?\x03\x02\x02\x02\x11C\x03\x02\x02\x02\x13M\x03\x02" +
		"\x02\x02\x15R\x03\x02\x02\x02\x17\x18\x07e\x02\x02\x18\x19\x07q\x02\x02" +
		"\x19\x1A\x07p\x02\x02\x1A\x1B\x07u\x02\x02\x1B\x1C\x07v\x02\x02\x1C\x04" +
		"\x03\x02\x02\x02\x1D\x1E\x07n\x02\x02\x1E\x1F\x07g\x02\x02\x1F \x07v\x02" +
		"\x02 \x06\x03\x02\x02\x02!\"\x07?\x02\x02\"\b\x03\x02\x02\x02#$\x07=\x02" +
		"\x02$\n\x03\x02\x02\x02%&\x071\x02\x02&\'\x07,\x02\x02\'+\x03\x02\x02" +
		"\x02(*\v\x02\x02\x02)(\x03\x02\x02\x02*-\x03\x02\x02\x02+,\x03\x02\x02" +
		"\x02+)\x03\x02\x02\x02,.\x03\x02\x02\x02-+\x03\x02\x02\x02./\x07,\x02" +
		"\x02/0\x071\x02\x0201\x03\x02\x02\x0212\b\x06\x02\x022\f\x03\x02\x02\x02" +
		"34\x071\x02\x0245\x071\x02\x0259\x03\x02\x02\x0268\n\x02\x02\x0276\x03" +
		"\x02\x02\x028;\x03\x02\x02\x0297\x03\x02\x02\x029:\x03\x02\x02\x02:<\x03" +
		"\x02\x02\x02;9\x03\x02\x02\x02<=\b\x07\x02\x02=\x0E\x03\x02\x02\x02>@" +
		"\t\x03\x02\x02?>\x03\x02\x02\x02@A\x03\x02\x02\x02A?\x03\x02\x02\x02A" +
		"B\x03\x02\x02\x02B\x10\x03\x02\x02\x02CG\x07)\x02\x02DF\v\x02\x02\x02" +
		"ED\x03\x02\x02\x02FI\x03\x02\x02\x02GH\x03\x02\x02\x02GE\x03\x02\x02\x02" +
		"HJ\x03\x02\x02\x02IG\x03\x02\x02\x02JK\x07)\x02\x02K\x12\x03\x02\x02\x02" +
		"LN\t\x04\x02\x02ML\x03\x02\x02\x02NO\x03\x02\x02\x02OM\x03\x02\x02\x02" +
		"OP\x03\x02\x02\x02P\x14\x03\x02\x02\x02QS\t\x05\x02\x02RQ\x03\x02\x02" +
		"\x02ST\x03\x02\x02\x02TR\x03\x02\x02\x02TU\x03\x02\x02\x02UV\x03\x02\x02" +
		"\x02VW\b\v\x03\x02W\x16\x03\x02\x02\x02\t\x02+9AGOT\x04\x02\x03\x02\b" +
		"\x02\x02";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!ZephyrLexer.__ATN) {
			ZephyrLexer.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(ZephyrLexer._serializedATN));
		}

		return ZephyrLexer.__ATN;
	}

}

