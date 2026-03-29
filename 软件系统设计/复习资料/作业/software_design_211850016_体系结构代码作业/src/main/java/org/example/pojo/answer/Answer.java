package org.example.pojo.answer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.json.JSONObject;

@Getter
@AllArgsConstructor
public class Answer {

  Long questionId;

  @Setter
  String answers;

  public Answer(JSONObject json) {
    this.questionId = json.getLong("id");
    this.answers = json.getString("answer");
  }

  public void log() {
    System.out.println("QuestionId: " + questionId);
    System.out.println("Answer: " + answers);
  }
}