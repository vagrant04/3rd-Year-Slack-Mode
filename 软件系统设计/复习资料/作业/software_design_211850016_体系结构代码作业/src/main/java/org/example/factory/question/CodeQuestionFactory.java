package org.example.factory.question;

import org.example.pojo.question.CodeQuestion;
import org.example.pojo.question.CodeSample;
import org.example.pojo.question.Question;
import org.jdom2.Element;
import org.json.JSONObject;

import java.util.Map;

public class CodeQuestionFactory extends QuestionFactory {
  @Override
  public Question create(JSONObject question) {
    return new CodeQuestion(
        question.getLong("id"),
        question.getString("question"),
        question.getLong("points"), question.optJSONArray("samples").toList().stream().map(o -> {
          @SuppressWarnings("unchecked")
          Map<String, Object> map = (Map<String, Object>) o;
          return new CodeSample((String) map.get("input"), (String) map.get("output"));
        }).toArray(CodeSample[]::new),
        question.getLong("timeLimit"));
  }

  @Override
  public Question create(Element question) {
    return new CodeQuestion(
        Long.parseLong(question.getChildText("id")),
        question.getChildText("question"),
        Long.parseLong(question.getChildText("points")),
        question.getChild("samples").getChildren("sample").stream()
            .map(e -> new CodeSample(e.getChildText("input"), e.getChildText("output"))).toArray(CodeSample[]::new),
        Long.parseLong(question.getChildText("timeLimit")));
  }
}
