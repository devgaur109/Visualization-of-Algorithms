%{



#include "y.tab.h"

#include <stdio.h>

int lineno=1;

%}





%%



\n                          { ++lineno; }



[ \t]+                      { /* Skip whitespace. */ }



"//".*                      { /* Skip single-line comments. */ }



[pP][rR][oO][gG][rR][aA][mM]                  {  return PROGRAM; }

[vV][aA][rR]                                   {  return VAR; }

[iI][nN][tT][eE][gG][eE][rR]|[rR][eE][aA][lL]|[bB][oO][oO][lL][eE][aA][nN]|[cC][hH][aA][rR] { char*temp=malloc(sizeof(char)*128);strcpy(temp,yytext);yylval.str=temp; return TYPE; }

[bB][eE][gG][iI][nN]                           {  return START_BLOCK; }

[eE][nN][dD]                                   {  return END; }

[iI][fF]                                       {  return IF; }

[tT][hH][eE][nN]                               {  return THEN; }

[eE][lL][sS][eE]                               {  return ELSE; }

[wW][hH][iI][lL][eE]                           {  return WHILE; }

[fF][oO][rR]                                   {  return FOR; }

[tT][oO]                                       {  return TO; }

[dD][oO][wW][nN][tT][oO]                       {  return DOWNTO; }

[dD][oO]                                       {  return DO; }

[rR][eE][aA][dD]|[rR][eE][aA][dD][lL][nN]                              {  return READ; }

[wW][rR][iI][tT][eE]|[wW][rR][iI][tT][eE][lL][nN]                           {  return WRITE; }

[aA][rR][rR][aA][yY]                           {  return ARRAY; }

[aA][nN][dD]                                   {  return AND; }

[oO][rR]                                       {  return OR; }

[nN][oO][tT]                                   {  return NOT; }

[oO][fF]                                       {  return OF; }



[a-zA-Z][a-zA-Z0-9_]*                          { char*temp=malloc(sizeof(char)*128);strcpy(temp,yytext);yylval.str=temp; return IDENTIFIER; }

[0-9]+                                         { char*temp=malloc(sizeof(char)*128);strcpy(temp,yytext);yylval.str=temp; return INTEGER; }

[0-9]+"."[0-9]+                                {char*temp=malloc(sizeof(char)*128);strcpy(temp,yytext);yylval.str=temp;  return REAL; }



"+"                                            {  return PLUS; }

"-"                                            {  return MINUS; }

"*"                                            {  return MULT; }

"/"                                            {  return DIV; }

"%"                                            {  return MOD; }

":="                                           {  return ASSIGN; }

"="                                            {  return EQ; }

"<>"                                           {  return NEQ; }

"<"                                            {  return LT; }

">"                                            {  return GT; }

"<="                                           {  return LTE; }

">="                                           {  return GTE; }



";"                                            {  return SEMICOLON; }

":"                                            {  return COLON; }

","                                            {  return COMMA; }

"."                                            {  return DOT; }

"("                                            {  return LPAREN; }

")"                                            {  return RPAREN; }

"["                                            { char*temp=malloc(sizeof(char)*128);strcpy(temp,yytext);yylval.str=temp;  return LSQB; }

"]"                                            { char*temp=malloc(sizeof(char)*128);strcpy(temp,yytext);yylval.str=temp; return RSQB; }

\"([^"\\]|\\.)*\" {

    

    return STRING_LITERAL;

}

%%



int yywrap() {

    return 1;

}