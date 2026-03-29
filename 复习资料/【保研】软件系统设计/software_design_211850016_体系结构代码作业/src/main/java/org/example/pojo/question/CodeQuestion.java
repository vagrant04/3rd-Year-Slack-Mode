package org.example.pojo.question;

import lombok.Getter;
import org.example._enum.QuestionType;
import org.example.score.CodeScoreStrategy;

@Getter
public class CodeQuestion extends Question {

  CodeSample[] samples;

  Long timeLimit;

  public CodeQuestion(Long id, String question, Long points, CodeSample[] samples, Long timeLimit) {
    super(id, QuestionType.CODE, question, points, new CodeScoreStrategy());
    this.samples = samples;
    this.timeLimit = timeLimit;
  }

  @Override
  public void log() {
    super.log();
    System.out.println("Time Limit: " + timeLimit);
    System.out.println("Samples: ");
    for (CodeSample s : samples) {
      System.out.println("Input: " + String.join(" ", s.getInput()));
      System.out.println("Output: " + s.getOutput());
    }
  }

}
