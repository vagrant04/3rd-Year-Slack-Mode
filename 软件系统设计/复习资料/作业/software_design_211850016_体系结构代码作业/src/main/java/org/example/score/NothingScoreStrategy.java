package org.example.score;

import org.example.pojo.answer.Answer;
import org.example.pojo.answer.SelectAnswer;
import org.example.pojo.question.MultiSelectQuestion;
import org.example.pojo.question.Question;
import org.example.pojo.question.SingleSelectQuestion;

import java.util.Arrays;

public class NothingScoreStrategy extends ScoreStrategy {

  @Override
  public Long cal(Question question, Answer answer) {
    if (question instanceof MultiSelectQuestion)
      return cal((MultiSelectQuestion) question,
          new SelectAnswer(answer.getQuestionId(), answer.getAnswers()));
    else if (question instanceof SingleSelectQuestion)
      return cal((SingleSelectQuestion) question,
          new SelectAnswer(answer.getQuestionId(), answer.getAnswers()));
    throw new IllegalArgumentException(
        "NothingScoreStrategy only supports SingleSelectQuestion and MultiSelectQuestion");
  }

  private Long cal(MultiSelectQuestion question, SelectAnswer answer) {
    Long[] actualAnswer = answer.getOptions();
    Long[] expectedAnswer = question.getAnswer();
    if (actualAnswer.length != expectedAnswer.length)
      return 0L;
    for (Long option : actualAnswer) {
      if (!Arrays.asList(question.getAnswer()).contains(option))
        return 0L;
    }
    return question.getPoints();
  }

  private Long cal(SingleSelectQuestion question, SelectAnswer answer) {
    Long[] actualAnswer = answer.getOptions();
    Long expectedAnswer = question.getAnswer();
    if (actualAnswer.length != 1)
      return 0L;
    if (actualAnswer[0] != expectedAnswer)
      return 0L;
    return question.getPoints();
  }
}