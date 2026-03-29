package org.example.pojo.question;

import lombok.Getter;
import org.example._enum.QuestionType;
import org.example.score.ScoreStrategy;

@Getter
public class MultiSelectQuestion extends SelectQuestion {
  Long[] answer;
  Long fixScore;
  Long[] partialScores;

  public MultiSelectQuestion(Long id, String question, Long points, ScoreStrategy scoreStrategy,
      String[] options, Long[] answer, Long fixScore, Long[] partialScores) {
    super(id, QuestionType.MULTIPLE_SELECT, question, points, scoreStrategy, options);
    this.answer = answer;
    this.fixScore = fixScore;
    this.partialScores = partialScores;
  }

  @Override
  public void log() {
    super.log();
    System.out.println("Answer: ");
    for (Long a : answer) {
      System.out.print(a + " ");
    }
    System.out.println();
    System.out.println("Fixed Score: " + fixScore);
    System.out.println("Partial Scores: ");
    for (Long p : partialScores) {
      System.out.print(p + " ");
    }
    System.out.println();
  }

}
