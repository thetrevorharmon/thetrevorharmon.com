// Generated from grammar/ZephyrParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { ProgramContext } from "./ZephyrParser";
import { StatementContext } from "./ZephyrParser";
import { ExpressionContext } from "./ZephyrParser";
import { KeywordContext } from "./ZephyrParser";
import { IdentifierContext } from "./ZephyrParser";
import { AssignContext } from "./ZephyrParser";
import { TerminatorContext } from "./ZephyrParser";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `ZephyrParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface ZephyrParserVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `ZephyrParser.program`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProgram?: (ctx: ProgramContext) => Result;

	/**
	 * Visit a parse tree produced by `ZephyrParser.statement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStatement?: (ctx: StatementContext) => Result;

	/**
	 * Visit a parse tree produced by `ZephyrParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpression?: (ctx: ExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `ZephyrParser.keyword`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitKeyword?: (ctx: KeywordContext) => Result;

	/**
	 * Visit a parse tree produced by `ZephyrParser.identifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdentifier?: (ctx: IdentifierContext) => Result;

	/**
	 * Visit a parse tree produced by `ZephyrParser.assign`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAssign?: (ctx: AssignContext) => Result;

	/**
	 * Visit a parse tree produced by `ZephyrParser.terminator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTerminator?: (ctx: TerminatorContext) => Result;
}

