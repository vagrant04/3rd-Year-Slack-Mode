package org.example.pojo.question;

import lombok.Getter;
import org.example._enum.QuestionType;
import org.example.score.NothingScoreStrategy;

@Getter
public class SingleSelectQuestion extends SelectQuestion {
  Long answer;

  public SingleSelectQuestion(Long id, String question, Long points, String[] options, Long answer) {
    super(id, QuestionType.SINGLE_SELECT, question, points, new NothingScoreStrategy(), options);
    this.answer = answer;
  }

  @Override
  public void log() {
    super.log();
    System.out.println("Answer: " + answer);
  }

}
