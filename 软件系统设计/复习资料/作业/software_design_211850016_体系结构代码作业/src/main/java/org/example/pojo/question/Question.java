package org.example.pojo.question;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example._enum.QuestionType;
import org.example.pojo.answer.Answer;
import org.example.score.ScoreStrategy;

@Getter
@AllArgsConstructor
public class Question {

  Long id;

  QuestionType type;

  String question;

  Long points;

  ScoreStrategy scoreStrategy;

  public Long cal(Answer answer) {
    if (answer == null) {
      return scoreStrategy.calWithNoSubmission(this);
    }
    return scoreStrategy.cal(this, answer);
  }

  public void log() {
    System.out.println("QuestionId: " + id);
    System.out.println("Type: " + type);
    System.out.println("Question: " + question);
    System.out.println("Points: " + points);
  }
}
