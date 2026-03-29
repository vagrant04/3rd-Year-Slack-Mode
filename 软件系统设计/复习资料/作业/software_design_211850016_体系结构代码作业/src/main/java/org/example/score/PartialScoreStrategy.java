package org.example.score;

import org.example.pojo.answer.Answer;
import org.example.pojo.answer.SelectAnswer;
import org.example.pojo.question.MultiSelectQuestion;
import org.example.pojo.question.Question;

import java.util.Arrays;

public class PartialScoreStrategy extends ScoreStrategy {

  @Override
  public Long cal(Question question, Answer answer) {
    if (question instanceof MultiSelectQuestion)
      return cal((MultiSelectQuestion) question,
          new SelectAnswer(answer.getQuestionId(), answer.getAnswers()));
    throw new IllegalArgumentException("PartialScoreStrategy only supports MultiSelectQuestion");
  }

  private Long cal(MultiSelectQuestion question, SelectAnswer answer) {
    Long[] actualAnswer = answer.getOptions();
    Long[] expectedAnswer = question.getAnswer();
    if (actualAnswer.length > expectedAnswer.length || actualAnswer.length == 0)
      return 0L;
    Long score = 0L;
    for (Long option : actualAnswer) {
      if (!Arrays.asList(question.getAnswer()).contains(option))
        return 0L;
      for (int j = 0; j < expectedAnswer.length; j++)
        if (expectedAnswer[j] == option)
          score += question.getPartialScores()[j];
    }
    return score;
  }
}