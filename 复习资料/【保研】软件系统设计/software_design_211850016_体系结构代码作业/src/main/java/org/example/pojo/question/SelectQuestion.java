package org.example.pojo.question;

import lombok.Getter;
import org.example._enum.QuestionType;
import org.example.score.ScoreStrategy;

@Getter
public abstract class SelectQuestion extends Question {
  String[] options;

  public SelectQuestion(Long id, QuestionType type, String question, Long points, ScoreStrategy scoreStrategy,
      String[] options) {
    super(id, type, question, points, scoreStrategy);
    this.options = options;
  }

  @Override
  public void log() {
    super.log();
    System.out.println("Options: ");
    for (String o : options) {
      System.out.println(o);
    }
  }

}
