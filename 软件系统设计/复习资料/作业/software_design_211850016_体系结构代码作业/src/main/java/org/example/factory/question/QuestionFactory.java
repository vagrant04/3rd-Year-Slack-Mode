package org.example.factory.question;

import org.example.pojo.question.Question;
import org.jdom2.Element;
import org.json.JSONObject;

public abstract class QuestionFactory {
  public abstract Question create(JSONObject question);

  public abstract Question create(Element question);

}
