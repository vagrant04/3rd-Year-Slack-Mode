package org.example.factory.question;

import org.example._enum.MultiSelectScoreMode;
import org.example.pojo.question.MultiSelectQuestion;
import org.example.pojo.question.Question;
import org.jdom2.Element;
import org.json.JSONObject;

import java.util.Optional;

public class MultiSelectQuestionFactory extends QuestionFactory {

  @Override
  public Question create(JSONObject question) {
    return new MultiSelectQuestion(
        question.getLong("id"),
        question.getString("question"),
        question.getLong("points"),
        MultiSelectScoreMode.getScoreStrategy(question.getString("scoreMode")),
        question.getJSONArray("options").toList().stream().map(Object::toString).toArray(String[]::new),
        question.getJSONArray("answer").toList().stream().map(o -> ((Number) o).longValue()).toArray(Long[]::new),
        question.optLong("fixScore", 0),
        Optional.ofNullable(question.optJSONArray("partialScores"))
            .map(j -> j.toList().stream().map(o -> ((Number) o).longValue()).toArray(Long[]::new))
            .orElse(new Long[0]));
  }

  @Override
  public Question create(Element question) {
    return new MultiSelectQuestion(
        Long.parseLong(question.getChildText("id")),
        question.getChildText("question"),
        Long.parseLong(question.getChildText("points")),
        MultiSelectScoreMode.getScoreStrategy(question.getChildText("scoreMode")),
        question.getChild("options").getChildren("option").stream().map(Element::getText).toArray(String[]::new),
        question.getChild("answers").getChildren().stream().map(Element::getText).map(Long::parseLong)
            .toArray(Long[]::new),
        Long.parseLong(Optional.ofNullable(question.getChildText("fixScore")).orElse("0")),
        Optional.ofNullable(question.getChild("partialScores")).orElse(new Element("partialScores")).getChildren()
            .stream().map(Element::getText).map(Long::parseLong).toArray(Long[]::new));
  }

}
