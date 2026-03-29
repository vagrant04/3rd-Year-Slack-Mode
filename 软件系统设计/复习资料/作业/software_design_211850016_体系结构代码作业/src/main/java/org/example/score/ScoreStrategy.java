package org.example.score;

import org.example.pojo.answer.Answer;
import org.example.pojo.question.Question;

public abstract class ScoreStrategy {

  public abstract Long cal(Question question, Answer answer);

  public Long calWithNoSubmission(Question question) {
    return 0L;
  }
}