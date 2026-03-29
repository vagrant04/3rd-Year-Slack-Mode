package org.example.factory.parser;

import org.example.pojo.Exam;
import org.example.pojo.Submission;

public abstract class ParserFactory {
  public abstract Exam parseExam(String path);

  public abstract Submission parseSubmission(String path);
}