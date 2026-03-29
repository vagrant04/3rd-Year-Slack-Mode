package org.example.factory.question;

import org.example.pojo.question.Question;
import org.example.pojo.question.SingleSelectQuestion;
import org.jdom2.Element;
import org.json.JSONObject;

public class SingleSelectQuestionFactory extends QuestionFactory {

  @Override
  public Question create(JSONObject question) {
    return new SingleSelectQuestion(
        question.getLong("id"),
        question.getString("question"),
        question.getLong("points"),
        question.getJSONArray("options").toList().stream().map(Object::toString).toArray(String[]::new),
        question.getLong("answer"));
  }

  @Override
  public Question create(Element question) {
    return new SingleSelectQuestion(
        Long.parseLong(question.getChildText("id")),
        question.getChildText("question"),
        Long.parseLong(question.getChildText("points")),
        question.getChild("options").getChildren("option").stream().map(Element::getText).toArray(String[]::new),
        Long.parseLong(question.getChildText("answer")));
  }

}
