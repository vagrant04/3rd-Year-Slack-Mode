package org.example.code.analyst;

import com.github.javaparser.JavaParser;
import com.github.javaparser.ParseProblemException;
import com.github.javaparser.ParseResult;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.expr.*;
import com.github.javaparser.ast.expr.BinaryExpr.Operator;
import com.github.javaparser.ast.stmt.*;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.nio.file.Path;

public class JavaCCAnalyst extends CCAnalyst {

  public JavaCCAnalyst(Path path) {
    super(path);
  }

  @Override
  public Long call() throws Exception {
    try {
      FileInputStream fis = new FileInputStream(path.toString());
      JavaParser parser = new JavaParser();
      ParseResult<CompilationUnit> result = parser.parse(fis);
      if (!result.isSuccessful()) {
        throw new ParseProblemException(result.getProblems());
      }
      CompilationUnit cu = result.getResult().orElse(null);
      if (cu == null) {
        return -1L;
      }
      return cu.findAll(MethodDeclaration.class).stream()
          .mapToLong(method -> 1L + method.findAll(IfStmt.class).size()
              + method.findAll(DoStmt.class).size()
              + method.findAll(WhileStmt.class).size()
              + method.findAll(ForStmt.class).size()
              + method.findAll(ConditionalExpr.class).size()
              + method.findAll(BinaryExpr.class,
                  n -> n.getOperator() == Operator.AND)
              .size()
              + method.findAll(BinaryExpr.class,
                  n -> n.getOperator() == Operator.OR)
              .size())
          .sum();
    } catch (FileNotFoundException e) {
      System.out.println("File not found: " + path.toString());
      return -1L;
    } catch (ParseProblemException e) {
      System.out.println(path.toString() + ": " + e.getMessage());
      return -1L;
    }
  }
}
